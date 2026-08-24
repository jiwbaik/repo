const PLNR_EXAMS = {
  midterm: { label:'중간고사', color:'#b8973a',
    dates:['2026-10-01','2026-10-02','2026-10-06','2026-10-07','2026-10-08'] },
  final:   { label:'기말고사', color:'#1a2744',
    dates:['2026-12-15','2026-12-16','2026-12-17','2026-12-18','2026-12-21'] }
};

const PLNR_GRADE_SUBJECTS = {
  1: {
    midterm: { fixed:['공통국어','공통영어','공통수학','통합사회','통합과학','한국사'], elective:[] },
    final:   { fixed:['공통국어','공통영어','공통수학','통합사회','통합과학','한국사','지식재산일반'], elective:[] }
  },
  2: {
    midterm: { fixed:['화법과 언어','영어','미적분'],
      elective:['화학','역학과 에너지','세포와 물질대사','데이터과학','경제','윤리문제탐구','문학과 영상','일본어 회화'] },
    final:   { fixed:['화법과 언어','영어','미적분'],
      elective:['화학','역학과 에너지','세포와 물질대사','지구시스템과학','수학과제탐구','경제','영어발표와 토론','문학과 영상','일본어 회화'] }
  }
};

const PLNR_COLORS = ['#1a2744','#b8973a','#2e4070','#d4af60','#6b7280','#4a5a7a','#9c7a2e','#7d8ba3','#c0392b','#27ae60','#8e44ad'];
const PLNR_DAYS   = ['일','월','화','수','목','금','토'];

// 상태
var plnrGrade = null;
var plnrTab   = 'setup';
// subjectState: { midterm:[{name,fixed,included,level(0~100)}], final:[...] }
var plnrSubjectState  = { midterm:[], final:[] };
var plnrScores        = { midterm:[], final:[] }; // 계산된 비율
var plnrStudySessions = [];
var plnrSelectedDate  = null;
var plnrWeekHours = [2,2,2,2,2,4,4]; // 일~토 기본값
var plnrCalDate       = new Date();
var plnrTimerSubject  = '';
var plnrTimerSeconds  = 0;
var plnrTimerRunning  = false;
var plnrTimerStart    = null;
var plnrTimerInterval = null;
var plnrToastTimer    = null;
var plnrActiveExam    = 'midterm'; // 타이머/달력 기준 시험

// 유틸
function plnrIsSameDay(a,b){return a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();}
function plnrFmt(d){return d.getFullYear()+'년 '+(d.getMonth()+1)+'월 '+d.getDate()+'일';}
function plnrToVal(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function plnrFmtTimer(s){var h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=s%60,p=function(n){return String(n).padStart(2,'0');};return h>0?p(h)+':'+p(m)+':'+p(ss):p(m)+':'+p(ss);}
function plnrShowToast(msg){var t=document.getElementById('plnrToast');if(!t)return;t.textContent=msg;t.style.display='block';clearTimeout(plnrToastTimer);plnrToastTimer=setTimeout(function(){t.style.display='none';},2400);}
function plnrGetExamByDate(ds){for(var k in PLNR_EXAMS)if(PLNR_EXAMS[k].dates.indexOf(ds)>=0)return Object.assign({key:k},PLNR_EXAMS[k]);return null;}
function plnrLevelLabel(v){return v<=33?'취약':v<=66?'보통':'자신있음';}
function plnrLevelColor(v){return v<=33?'#e74c3c':v<=66?'#f39c12':'#27ae60';}
// level이 낮을수록(취약) 공부 비중 높음 → weight = 100 - level
function plnrLevelWeight(v){return Math.max(5, 100-v);}

// 탭 전환
function plnrSwitchTab(t){
  if(!plnrGrade){plnrShowToast('먼저 학년을 선택해주세요!');return;}
  plnrTab=t;
  ['setup','calendar'].forEach(function(id){
    var b=document.getElementById('plnr-tab-'+id);
    if(b)b.classList.toggle('active',id===t);
  });
  if(t==='setup')plnrRenderSetup();
  else plnrRenderCalendar();
}

// 학년 선택
function plnrSelectGrade(g){
  plnrGrade=g;
  plnrScores={midterm:[],final:[]};
  var data=PLNR_GRADE_SUBJECTS[g];
  plnrSubjectState={midterm:[],final:[]};
  ['midterm','final'].forEach(function(exam){
    data[exam].fixed.forEach(function(n){
      plnrSubjectState[exam].push({name:n,fixed:true,included:true,level:50});
    });
    data[exam].elective.forEach(function(n){
      plnrSubjectState[exam].push({name:n,fixed:false,included:false,level:50});
    });
  });
  plnrTab='setup';
  ['setup','calendar'].forEach(function(id){
    var b=document.getElementById('plnr-tab-'+id);
    if(b)b.classList.toggle('active',id==='setup');
  });
  plnrRenderSetup();
}

// 슬라이더 변경
function plnrSetLevel(exam,name,val){
  var s=plnrSubjectState[exam].find(function(x){return x.name===name;});
  if(s)s.level=parseInt(val);
  // 라벨 즉시 업데이트
  var lbl=document.getElementById('plnr-lbl-'+exam+'-'+name.replace(/\s/g,'_'));
  if(lbl){lbl.textContent=plnrLevelLabel(parseInt(val));lbl.style.color=plnrLevelColor(parseInt(val));}
}

// 선택과목 포함 토글
function plnrToggleInclude(exam,name){
  var s=plnrSubjectState[exam].find(function(x){return x.name===name;});
  if(!s||s.fixed)return;
  s.included=!s.included;
  plnrRenderSetup();
}

// 비율 계산
function plnrCalcScores(){
  ['midterm','final'].forEach(function(exam){
    var subs=plnrSubjectState[exam].filter(function(s){return s.included;});
    var total=subs.reduce(function(a,s){return a+plnrLevelWeight(s.level);},0)||1;
    plnrScores[exam]=subs.map(function(s,i){
      return {name:s.name,weight:plnrLevelWeight(s.level),pct:(plnrLevelWeight(s.level)/total)*100,color:PLNR_COLORS[i%PLNR_COLORS.length]};
    });
  });
  plnrRenderSetup();
}

// 달력 계산
function plnrGetStudyDaysFor(examKey){
  var ex=PLNR_EXAMS[examKey];
  var today=new Date();today.setHours(0,0,0,0);
  var examStart=new Date(ex.dates[0]+'T00:00:00');
  if(examStart<=today)return[];
  // 기말고사는 중간고사 다음날(10/9)부터 시작
  var studyStart=today;
  if(examKey==='final'){
    var midEnd=new Date('2026-10-09T00:00:00');
    if(midEnd>today)studyStart=midEnd;
  }
  var list=[],cur=new Date(studyStart);
  while(cur<examStart){list.push(new Date(cur));cur.setDate(cur.getDate()+1);}
  return list;
}

function plnrComputeDailyPlanFor(examKey){
  var map={};
  var scores=plnrScores[examKey];
  if(!scores||!scores.length)return map;
  var studyDays=plnrGetStudyDaysFor(examKey);
  if(!studyDays.length)return map;
  var loggedMin={};
  plnrStudySessions.filter(function(s){return s.examKey===examKey;}).forEach(function(s){loggedMin[s.subjectName]=(loggedMin[s.subjectName]||0)+s.duration/60;});
  var totalH=studyDays.reduce(function(s,d){return s+(plnrWeekHours[d.getDay()]||0);},0);
  var stats=scores.map(function(s){
    var tgt=(s.pct/100)*totalH;
    var logged=(loggedMin[s.name]||0)/60;
    return Object.assign({},s,{weight:Math.max(0,tgt-logged)});
  });
  var needSum=stats.reduce(function(a,x){return a+x.weight;},0);
  var weights=needSum>0?stats.map(function(s){return Object.assign({},s,{weight:s.weight/needSum});}):stats.map(function(s){return Object.assign({},s,{weight:s.pct/100});});
  var active=weights.filter(function(w){return w.weight>0;});
  if(!active.length)return map;
  var perDay=Math.max(1,Math.ceil(active.length/2));
  var credits={};active.forEach(function(w){credits[w.name]=0;});
  studyDays.forEach(function(day){
    active.forEach(function(w){credits[w.name]+=w.weight;});
    var ranked=active.slice().sort(function(a,b){return credits[b.name]-credits[a.name];});
    var chosen=ranked.slice(0,perDay);
    var wSum=chosen.reduce(function(a,c){return a+c.weight;},0)||1;
    chosen.forEach(function(c){credits[c.name]-=wSum/chosen.length;});
    var dayMin=(plnrWeekHours[day.getDay()]||0)*60;
    map[plnrToVal(day)]=chosen.map(function(c){return {name:c.name,color:c.color,minutes:Math.round(dayMin*(c.weight/wSum))};});
  });
  return map;
}

// 타이머
function plnrStartTimer(){
  if(!plnrTimerSubject||plnrTimerRunning)return;
  plnrTimerRunning=true;
  plnrTimerStart=Date.now()-plnrTimerSeconds*1000;
  plnrTimerInterval=setInterval(function(){
    plnrTimerSeconds=Math.floor((Date.now()-plnrTimerStart)/1000);
    var d=document.getElementById('plnrTimerDisplay');
    if(d)d.textContent=plnrFmtTimer(plnrTimerSeconds);
  },500);
  // 즉시 UI 업데이트 (시작→정지 버튼으로 교체)
  plnrRenderCalendar();
}
function plnrStopTimer(){
  if(!plnrTimerRunning)return;
  plnrCommitSession(plnrTimerSubject,plnrTimerSeconds);
  plnrTimerRunning=false;
  clearInterval(plnrTimerInterval);
  plnrTimerSeconds=0;
  plnrTimerSubject='';
  plnrRenderCalendar();
}
function plnrResetTimer(){
  plnrTimerRunning=false;clearInterval(plnrTimerInterval);
  plnrTimerSeconds=0;plnrTimerSubject='';
  plnrRenderCalendar();
}
function plnrSwitchSubject(name){
  if(name===plnrTimerSubject||!plnrTimerRunning)return;
  plnrCommitSession(plnrTimerSubject,plnrTimerSeconds);
  plnrTimerSeconds=0;plnrTimerSubject=name;plnrTimerStart=Date.now();
}
function plnrCommitSession(name,seconds){
  if(!name||seconds<5)return;
  var sc=(plnrScores[plnrActiveExam]||[]).find(function(s){return s.name===name;});
  var secs=seconds;
  plnrStudySessions.push({id:Date.now().toString(),subjectName:name,duration:secs,date:new Date(),color:sc?sc.color:'#1a2744',examKey:plnrActiveExam});
  var dispMin=Math.floor(secs/60),dispSec=secs%60;
  var dispStr=dispMin>0?dispMin+'분 '+dispSec+'초':dispSec+'초';
  plnrShowToast('✓ '+name+' '+dispStr+' 기록됐어요');
}
function plnrRemoveSession(id){
  plnrStudySessions=plnrStudySessions.filter(function(s){return s.id!==id;});
  plnrRenderCalendar();
}
document.addEventListener('visibilitychange',function(){
  if(document.hidden&&plnrTimerRunning){
    plnrCommitSession(plnrTimerSubject,plnrTimerSeconds);
    plnrTimerRunning=false;clearInterval(plnrTimerInterval);
    plnrTimerSeconds=0;plnrTimerSubject='';
  }
});

// ── 렌더 ──
function plnrRender(){
  if(!plnrGrade){plnrRenderGradeSelect();return;}
  if(plnrTab==='setup')plnrRenderSetup();
  else plnrRenderCalendar();
}

function plnrRenderGradeSelect(){
  var root=document.getElementById('plnrRoot');
  if(!root)return;
  root.innerHTML=
    '<div class="grade-select-wrap">'+
      '<div class="grade-title">학년을 선택해주세요</div>'+
      '<div class="grade-sub">선택한 학년에 맞는 과목이 자동으로 설정됩니다</div>'+
      '<div class="grade-btns">'+
        '<div class="grade-btn'+(plnrGrade===1?' selected':'')+'" onclick="plnrSelectGrade(1)">'+
          '<span class="grade-emoji">📗</span><div class="grade-label">1학년</div>'+
          '<div class="grade-desc">공통국어·영어·수학<br>통합사회·과학·한국사</div></div>'+
        '<div class="grade-btn'+(plnrGrade===2?' selected':'')+'" onclick="plnrSelectGrade(2)">'+
          '<span class="grade-emoji">📘</span><div class="grade-label">2학년</div>'+
          '<div class="grade-desc">화법과 언어·영어·미적분<br>+ 선택과목</div></div>'+
      '</div>'+
    '</div>';
}

function plnrRenderSetup(){
  var root=document.getElementById('plnrRoot');
  if(!root)return;

  var html='<div style="padding:16px 24px;">';
  html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'+
    '<span style="font-family:Noto Serif KR,serif;font-size:16px;font-weight:700;color:var(--navy);">'+plnrGrade+'학년 과목 설정</span>'+
    '<button onclick="plnrGrade=null;plnrRenderGradeSelect()" style="padding:5px 12px;border:1px solid var(--border);border-radius:8px;background:var(--cream-mid);font-size:12px;cursor:pointer;font-family:Noto Sans KR,sans-serif;">← 학년 변경</button>'+
  '</div>';

  // 슬라이더 설명
  html+='<div style="display:flex;gap:10px;align-items:center;background:var(--cream-mid);border-radius:10px;padding:10px 14px;margin-bottom:18px;font-size:12px;color:var(--muted);">'+
    '<span style="color:#e74c3c;font-weight:700;">← 취약</span>'+
    '<div style="flex:1;height:3px;background:linear-gradient(to right,#e74c3c,#f39c12,#27ae60);border-radius:999px;"></div>'+
    '<span style="color:#27ae60;font-weight:700;">자신있음 →</span>'+
    '<span style="margin-left:8px;color:var(--muted);">슬라이더로 실력을 표시하세요</span>'+
  '</div>';

  ['midterm','final'].forEach(function(examKey){
    var ex=PLNR_EXAMS[examKey];
    var subs=plnrSubjectState[examKey];
    var fixed=subs.filter(function(s){return s.fixed;});
    var elective=subs.filter(function(s){return !s.fixed;});

    html+='<div style="margin-bottom:24px;">';
    html+='<div style="font-family:Noto Serif KR,serif;font-size:14px;font-weight:700;color:var(--navy);margin-bottom:12px;padding:9px 13px;border-radius:9px;'+
      (examKey==='midterm'?'background:rgba(184,151,58,.1);border-left:3px solid var(--gold);':'background:rgba(26,39,68,.07);border-left:3px solid var(--navy);')+'">' +
      '📝 '+ex.label+' ('+ex.dates[0].slice(5).replace('-','/')+'~'+ex.dates[ex.dates.length-1].slice(5).replace('-','/')+')'+
    '</div>';

    // 공통과목
    html+='<div style="margin-bottom:14px;">'+
      '<div style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--muted);margin-bottom:9px;">공통과목</div>';
    fixed.forEach(function(s){
      var safeId=examKey+'-'+s.name.replace(/\s/g,'_');
      html+='<div style="margin-bottom:10px;">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">'+
          '<span style="font-size:13px;font-weight:600;color:var(--text);">'+s.name+'</span>'+
          '<span id="plnr-lbl-'+safeId+'" style="font-size:12px;font-weight:700;color:'+plnrLevelColor(s.level)+';">'+plnrLevelLabel(s.level)+'</span>'+
        '</div>'+
        '<input type="range" min="0" max="100" value="'+s.level+'" '+
          'oninput="plnrSetLevel(\''+examKey+'\',\''+s.name+'\',this.value)" '+
          'style="width:100%;accent-color:var(--gold);height:6px;cursor:pointer;">'+
        '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-top:2px;">'+
          '<span>취약</span><span>보통</span><span>자신있음</span>'+
        '</div>'+
      '</div>';
    });
    html+='</div>';

    // 선택과목 (2학년)
    if(elective.length){
      html+='<div style="margin-bottom:14px;">'+
        '<div style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--muted);margin-bottom:9px;">선택과목 (수강 중인 과목 체크)</div>';
      elective.forEach(function(s){
        var safeId=examKey+'-'+s.name.replace(/\s/g,'_');
        html+='<div style="margin-bottom:12px;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:'+(s.included?'var(--white)':'var(--cream-mid)')+';transition:all .2s;">'+
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:'+(s.included?'10px':'0')+';">'+
            '<input type="checkbox" '+(s.included?'checked':'')+' onchange="plnrToggleInclude(\''+examKey+'\',\''+s.name+'\')" style="width:16px;height:16px;accent-color:var(--navy);cursor:pointer;">'+
            '<span style="font-size:13px;font-weight:600;color:'+(s.included?'var(--text)':'var(--muted)')+';">'+s.name+'</span>'+
            (s.included?'<span id="plnr-lbl-'+safeId+'" style="margin-left:auto;font-size:12px;font-weight:700;color:'+plnrLevelColor(s.level)+';">'+plnrLevelLabel(s.level)+'</span>':'')+
          '</div>'+
          (s.included?
            '<input type="range" min="0" max="100" value="'+s.level+'" '+
              'oninput="plnrSetLevel(\''+examKey+'\',\''+s.name+'\',this.value)" '+
              'style="width:100%;accent-color:var(--gold);height:6px;cursor:pointer;">'+
            '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-top:2px;">'+
              '<span>취약</span><span>보통</span><span>자신있음</span>'+
            '</div>'
          :'')+
        '</div>';
      });
      html+='</div>';
    }
    html+='</div>';
  });

  // 요일별 공부 시간 설정
  var plnrDayNames=['일','월','화','수','목','금','토'];
  html+='<div style="background:var(--cream-mid);border-radius:12px;padding:16px;margin-bottom:16px;">'+'<div style="font-size:14px;font-weight:700;color:var(--navy);margin-bottom:12px;">⏰ 요일별 공부 가능 시간</div>'+'<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;">'+plnrDayNames.map(function(d,i){return '<div style="text-align:center;">'+'<div style="font-size:11px;font-weight:700;color:'+(i===0||i===6?'var(--gold)':'var(--muted)')+';margin-bottom:5px;">'+d+'</div>'+'<input type="number" min="0" max="12" step="0.5" value="'+plnrWeekHours[i]+'" onchange="plnrWeekHours['+i+']=parseFloat(this.value)||0" style="width:100%;padding:6px 2px;text-align:center;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:Noto Sans KR,sans-serif;background:var(--white);">'+'<div style="font-size:9px;color:var(--muted);margin-top:3px;">시간</div>'+'</div>';}).join('')+'</div>'+'</div>';
  // 비율 계산 버튼
  html+='<button onclick="plnrCalcScores()" style="width:100%;padding:13px;background:var(--navy);color:var(--cream);border:none;border-radius:12px;font-family:Noto Sans KR,sans-serif;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:16px;">📊 비율 계산하기</button>';

  // 계산 결과
  if(plnrScores.midterm.length||plnrScores.final.length){
    ['midterm','final'].forEach(function(examKey){
      var sc=plnrScores[examKey];
      if(!sc||!sc.length)return;
      var ex=PLNR_EXAMS[examKey];
      html+='<div style="background:var(--white);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:14px;">'+
        '<div style="font-family:Noto Serif KR,serif;font-size:14px;font-weight:700;color:var(--navy);margin-bottom:12px;">'+ex.label+' 공부 비율</div>';
      sc.forEach(function(s){
        html+='<div style="margin-bottom:10px;">'+
          '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">'+
            '<span style="font-weight:600;">'+s.name+'</span>'+
            '<span style="color:var(--muted);">'+s.pct.toFixed(1)+'%</span>'+
          '</div>'+
          '<div style="background:var(--cream-dark);border-radius:999px;height:7px;overflow:hidden;">'+
            '<div style="height:100%;border-radius:999px;background:'+s.color+';width:'+s.pct.toFixed(1)+'%;transition:width .5s;"></div>'+
          '</div>'+
        '</div>';
      });
      // 일일 분 배분
      var totalMin=(plnrWeekHours[1]+plnrWeekHours[2]+plnrWeekHours[3]+plnrWeekHours[4]+plnrWeekHours[5])/5*60;
      html+='<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border);font-size:12px;color:var(--muted);">'+
        '주중 평균 기준: '+
        sc.map(function(s){return '<span style="font-weight:700;color:'+s.color+';">'+s.name+' '+Math.round(totalMin*s.pct/100)+'분</span>';}).join(' · ')+
      '</div>';
      html+='</div>';
    });

    html+='<button onclick="plnrSwitchTab(\'calendar\')" style="width:100%;padding:13px;background:var(--gold);color:var(--navy);border:none;border-radius:12px;font-family:Noto Sans KR,sans-serif;font-size:14px;font-weight:700;cursor:pointer;">📅 학습 달력 보기 →</button>';
  }

  html+='</div>';
  root.innerHTML=html;
}

function plnrRenderCalendar(){
  var root=document.getElementById('plnrRoot');
  if(!root)return;
  var today=new Date();today.setHours(0,0,0,0);

  // 두 시험의 일별 계획 모두 계산
  var dailyMid=plnrComputeDailyPlanFor('midterm');
  var dailyFin=plnrComputeDailyPlanFor('final');

  var todayLogSec=plnrStudySessions.filter(function(s){return plnrIsSameDay(s.date,today);}).reduce(function(a,s){return a+s.duration;},0);
  var activeScores=plnrScores[plnrActiveExam]||[];

  var html='<div style="padding:16px 24px;">';

  // 시험 기준 선택 탭
  html+='<div style="display:flex;gap:8px;margin-bottom:16px;">'+
    '<button onclick="plnrActiveExam=\'midterm\';plnrRenderCalendar()" style="flex:1;padding:9px;border:2px solid '+(plnrActiveExam==='midterm'?'var(--gold)':'var(--border)')+';border-radius:10px;background:'+(plnrActiveExam==='midterm'?'rgba(184,151,58,.1)':'var(--white)')+';font-family:Noto Sans KR,sans-serif;font-size:13px;font-weight:700;color:'+(plnrActiveExam==='midterm'?'#9a7a2a':'var(--muted)')+';cursor:pointer;">📝 중간고사 기준</button>'+
    '<button onclick="plnrActiveExam=\'final\';plnrRenderCalendar()" style="flex:1;padding:9px;border:2px solid '+(plnrActiveExam==='final'?'var(--navy)':'var(--border)')+';border-radius:10px;background:'+(plnrActiveExam==='final'?'rgba(26,39,68,.08)':'var(--white)')+';font-family:Noto Sans KR,sans-serif;font-size:13px;font-weight:700;color:'+(plnrActiveExam==='final'?'var(--navy)':'var(--muted)')+';cursor:pointer;">📝 기말고사 기준</button>'+
  '</div>';

  // D-Day
  var exDates=PLNR_EXAMS[plnrActiveExam].dates;
  var exStart=new Date(exDates[0]+'T00:00:00');
  var ddays=Math.ceil((exStart-today)/86400000);
  if(ddays>0){
    html+='<div style="background:linear-gradient(120deg,var(--navy),var(--navy-light));border-radius:14px;padding:14px 18px;color:var(--cream);display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">'+
      '<div style="display:flex;align-items:baseline;gap:10px;">'+
        '<span style="font-family:Noto Serif KR,serif;font-size:24px;font-weight:700;color:var(--gold-light);">D-'+ddays+'</span>'+
        '<span style="font-size:12px;color:rgba(250,246,239,.75);">'+PLNR_EXAMS[plnrActiveExam].label+' 시작까지</span>'+
      '</div>'+
      '<div style="font-size:12px;color:rgba(250,246,239,.85);text-align:right;">매일 <strong style="color:var(--gold-light);font-size:14px;">'+((plnrWeekHours[1]+plnrWeekHours[2]+plnrWeekHours[3]+plnrWeekHours[4]+plnrWeekHours[5])/5).toFixed(1)+'h</strong>/일(평균)</div>'+
    '</div>';
  }

  // 타이머
  html+='<div class="timer-card" style="margin-bottom:16px;"><div class="timer-inner">'+
    '<div class="timer-title">'+(plnrTimerRunning?'<span class="live-dot"></span>'+plnrTimerSubject+' 공부 중':'학습 타이머')+'</div>'+
    // 과목 선택 (항상 표시, 타이머 중엔 disabled)
    '<select class="timer-sel" id="plnrSubjSel" onchange="plnrTimerSubject=this.value" '+(plnrTimerRunning?'disabled':'')+'>'+
      '<option value="">과목을 선택하세요</option>'+
      activeScores.map(function(s){return '<option value="'+s.name+'"'+(s.name===plnrTimerSubject?' selected':'')+'>'+s.name+'</option>';}).join('')+
    '</select>'+
    '<div id="plnrTimerDisplay" style="font-family:Noto Serif KR,serif;font-size:40px;font-weight:700;color:var(--gold-light);margin:4px 0 14px;">'+plnrFmtTimer(plnrTimerSeconds)+'</div>'+
    '<div style="display:flex;gap:10px;justify-content:center;">'+
      (!plnrTimerRunning?
        '<button id="plnrStartBtn" style="padding:12px 32px;border-radius:999px;border:none;font-weight:700;font-size:14px;cursor:pointer;background:'+(plnrTimerSubject?'var(--gold)':'var(--muted)')+';color:var(--navy);font-family:Noto Sans KR,sans-serif;transition:all .2s;" onclick="plnrStartTimer()" '+((!plnrTimerSubject)?'disabled':'')+'>▶ 시작</button>'
      :
        '<button style="padding:12px 32px;border-radius:999px;border:none;font-weight:700;font-size:14px;cursor:pointer;background:#e74c3c;color:var(--white);font-family:Noto Sans KR,sans-serif;transition:all .2s;" onclick="plnrStopTimer()">⏹ 정지 · 기록</button>'
      )+
    '</div>'+
    (function(){
      var dispMin=Math.floor(todayLogSec/60),dispSec2=todayLogSec%60;
      var dispStr=dispMin>0?dispMin+'분 '+dispSec2+'초':dispSec2+'초';
      // 오늘 목표 시간 (요일별)
      var todayGoalSec=(plnrWeekHours[today.getDay()]||0)*3600;
      var pct=todayGoalSec>0?Math.min(100,Math.round(todayLogSec/todayGoalSec*100)):0;
      var pctColor=pct>=100?'#27ae60':pct>=50?'var(--gold-light)':'rgba(250,246,239,.85)';
      return '<div style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(250,246,239,.15);font-size:12px;color:rgba(250,246,239,.85);">'+
        '오늘 누적 <strong style="color:var(--gold-light);">'+dispStr+'</strong>'+
        (todayGoalSec>0?' · 목표 <strong style="color:'+pctColor+';">'+pct+'%</strong> 달성'+(pct>=100?' 🎉':''):'')+
        '</div>';
    })()+
  '</div></div>';

  // 달력
  var y=plnrCalDate.getFullYear(),m=plnrCalDate.getMonth();
  var first=new Date(y,m,1).getDay(),dim=new Date(y,m+1,0).getDate();

  html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">'+
    '<button class="cal-nav-btn" onclick="plnrCalDate=new Date(plnrCalDate.getFullYear(),plnrCalDate.getMonth()-1,1);plnrRenderCalendar()">←</button>'+
    '<span style="font-family:Noto Serif KR,serif;font-size:16px;font-weight:700;color:var(--navy);">'+y+'년 '+(m+1)+'월</span>'+
    '<button class="cal-nav-btn" onclick="plnrCalDate=new Date(plnrCalDate.getFullYear(),plnrCalDate.getMonth()+1,1);plnrRenderCalendar()">→</button>'+
  '</div>';

  html+='<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:4px;">'+
    PLNR_DAYS.map(function(d){return '<div style="text-align:center;font-size:11px;font-weight:700;color:var(--muted);padding:5px 0;">'+d+'</div>';}).join('')+
  '</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">';

  for(var i=0;i<first;i++)html+='<div style="min-height:72px;background:var(--cream-mid);border-radius:9px;"></div>';

  for(var d=1;d<=dim;d++){
    var day=new Date(y,m,d);
    var ds=plnrToVal(day);
    var sessions=plnrStudySessions.filter(function(s){return plnrIsSameDay(s.date,day);});
    var totH=sessions.reduce(function(a,s){return a+s.duration;},0)/3600;
    var isSel=plnrSelectedDate&&plnrIsSameDay(day,plnrSelectedDate);
    var isTod=plnrIsSameDay(day,today);
    var jamsExam=plnrGetExamByDate(ds);
    // 이 날의 계획 (중간 또는 기말)
    var midPlan=dailyMid[ds]||[];
    var finPlan=dailyFin[ds]||[];
    var hasMidStudy=midPlan.length>0;
    var hasFinStudy=finPlan.length>0;

    var border='1px solid var(--border)';
    var bg='var(--white)';
    if(jamsExam){border='2px solid '+jamsExam.color;bg='var(--white)';}
    else if(isSel){border='2px solid var(--navy)';}
    else if(isTod){border='2px solid var(--gold-light)';}

    html+='<div style="min-height:72px;padding:6px;border:'+border+';border-radius:9px;cursor:pointer;background:'+bg+';transition:all .15s;" onclick="plnrSelectedDate=new Date('+y+','+m+','+d+');plnrRenderCalendar()">'+
      '<div style="font-size:11px;font-weight:600;color:'+(isTod?'var(--gold)':'var(--text)')+';margin-bottom:2px;">'+d+'</div>'+
      (jamsExam?'<div style="font-size:9px;font-weight:700;padding:1px 4px;border-radius:4px;background:'+(jamsExam.key==='midterm'?'rgba(184,151,58,.15)':'rgba(26,39,68,.1)')+';color:'+jamsExam.color+';display:inline-block;margin-bottom:2px;">'+jamsExam.label+'</div>':'')+
      // 중간고사 계획 스트립
      (hasMidStudy?'<div style="display:flex;height:3px;border-radius:999px;overflow:hidden;margin-bottom:2px;">'+midPlan.map(function(e){return '<div style="flex-grow:'+e.minutes+';background:'+e.color+'"></div>';}).join('')+'</div>':'')+
      // 기말고사 계획 스트립
      (hasFinStudy?'<div style="display:flex;height:3px;border-radius:999px;overflow:hidden;margin-bottom:2px;">'+finPlan.map(function(e){return '<div style="flex-grow:'+e.minutes+';background:'+e.color+';opacity:.5"></div>';}).join('')+'</div>':'')+
      sessions.slice(0,2).map(function(s){return '<div style="font-size:9px;padding:1px 4px;border-radius:4px;margin-bottom:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;background:'+s.color+'1f;color:'+s.color+';">'+s.subjectName+'</div>';}).join('')+
      (sessions.length?'<div style="font-size:9px;font-weight:700;color:var(--muted);">⏱'+totH.toFixed(1)+'h</div>':'')+
    '</div>';
  }
  html+='</div>';

  // 범례
  html+='<div style="display:flex;gap:14px;margin-top:8px;font-size:11px;color:var(--muted);">'+
    '<span>▬ 중간고사 계획</span><span style="opacity:.5">▬ 기말고사 계획</span>'+
  '</div>';

  // 선택일 상세
  if(plnrSelectedDate){
    var sday=plnrSelectedDate;
    var sds=plnrToVal(sday);
    var midP=dailyMid[sds]||[];
    var finP=dailyFin[sds]||[];
    var ssessions=plnrStudySessions.filter(function(s){return plnrIsSameDay(s.date,sday);});
    var jei=plnrGetExamByDate(sds);

    html+='<div style="font-family:Noto Serif KR,serif;font-size:15px;font-weight:700;color:var(--navy);margin-bottom:10px;padding-top:16px;border-top:2px solid var(--cream-dark);">'+plnrFmt(sday)+'</div>';

    if(jei){
      html+='<div style="background:rgba(184,151,58,.08);border-left:3px solid '+jei.color+';padding:11px 13px;border-radius:0 10px 10px 0;font-size:13px;margin-bottom:10px;">📝 <strong>'+jei.label+'</strong> 시험일! 가볍게 마무리하세요.</div>';
    } else {
      // 중간고사 추천
      if(midP.length){
        html+='<div style="background:rgba(184,151,58,.07);border-radius:10px;padding:12px;margin-bottom:10px;">'+
          '<div style="font-size:12px;font-weight:700;color:#9a7a2a;margin-bottom:7px;">📝 중간고사 추천 배분 ('+(plnrWeekHours[sday.getDay()]||0)+'h)</div>'+
          midP.map(function(e){return '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px;"><span style="display:flex;align-items:center;gap:5px;"><span style="width:7px;height:7px;border-radius:50%;background:'+e.color+';display:inline-block;"></span>'+e.name+'</span><span style="color:var(--muted);">'+e.minutes+'분</span></div>';}).join('')+
        '</div>';
      }
      // 기말고사 추천
      if(finP.length){
        html+='<div style="background:rgba(26,39,68,.05);border-radius:10px;padding:12px;margin-bottom:10px;">'+
          '<div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:7px;">📝 기말고사 추천 배분 ('+(plnrWeekHours[sday.getDay()]||0)+'h)</div>'+
          finP.map(function(e){return '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px;"><span style="display:flex;align-items:center;gap:5px;"><span style="width:7px;height:7px;border-radius:50%;background:'+e.color+';opacity:.7;display:inline-block;"></span>'+e.name+'</span><span style="color:var(--muted);">'+e.minutes+'분</span></div>';}).join('')+
        '</div>';
      }
      if(!midP.length&&!finP.length){
        html+='<div style="font-size:12px;color:var(--muted);padding:8px 0;">이 날은 시험 이후이거나 계획된 공부 일정이 없어요.</div>';
      }
    }

    ssessions.forEach(function(s){
      html+='<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:10px;margin-bottom:6px;background:'+s.color+'12;">'+
        '<div style="display:flex;align-items:center;gap:8px;"><div style="width:8px;height:8px;border-radius:50%;background:'+s.color+'"></div><span style="font-weight:600;font-size:13px;">'+s.subjectName+'</span><span style="font-size:12px;color:var(--muted);">'+s.duration+'분</span></div>'+
        '<button style="background:none;border:none;cursor:pointer;color:var(--muted);" onclick="plnrRemoveSession(\''+s.id+'\')">✕</button>'+
      '</div>';
    });
  }

  html+='</div>';
  root.innerHTML=html;
}

// ── 초기화
document.addEventListener('DOMContentLoaded', function(){
  plnrRender();
});
