import { useState, useMemo } from "react";

const BLOCK_TYPES = [
  { id:"preview", label:"예습",       emoji:"📖", color:"#6ee7b7", dark:"#059669" },
  { id:"review",  label:"복습(평소)", emoji:"🔄", color:"#93c5fd", dark:"#2563eb" },
  { id:"week3",   label:"시험 3주전", emoji:"📅", color:"#fde68a", dark:"#d97706" },
  { id:"week2",   label:"시험 2주전", emoji:"⚡", color:"#fca5a5", dark:"#dc2626" },
  { id:"week1",   label:"시험 1주전", emoji:"🔥", color:"#f9a8d4", dark:"#db2777" },
];
const SUBJECTS_DEFAULT = ["수학","영어","국어","과학","사회","역사","물리","화학","생물","지구과학"];
const WEEKDAYS   = ["일","월","화","수","목","금","토"];
const MONTH_NAMES= ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const ACCENTS    = ["#2563eb","#059669","#d97706","#dc2626","#7c3aed"];
const BGS        = ["#eff6ff","#f0fdf4","#fefce8","#fff1f2","#faf5ff"];

function getDays(y,m){ return new Date(y,m+1,0).getDate(); }
function getFirst(y,m){ return new Date(y,m,1).getDay(); }
function toStr(y,m,d){ return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }

const PACKS = [
  { id:"starter", name:"스타터팩", emoji:"🌱", desc:"처음 계획을 세우는 학생을 위한 기본 루틴", tag:"입문 추천", tagColor:"#059669", cover:"#f0fdf4", difficulty:"쉬움", uses:1243,
    blocks:{ preview:["교과서 목차 훑어보기","핵심 용어 3개 찾기","학습 목표 적기"], review:["오늘 배운 내용 노트 정리","교과서 핵심 문장 밑줄","오답 노트 작성"], week3:["단원별 개념 정리 시작","기출 유형 파악","약점 단원 체크"], week2:["취약 단원 집중 복습","기출 1회분 풀기","오답 원인 분석"], week1:["기출 2회분 풀기","오답 반복 학습","마무리 개념 점검"] } },
  { id:"veteran", name:"마스터팩", emoji:"🏆", desc:"효율적 학습 전략이 필요한 고급 학습자를 위한 루틴", tag:"고급 전략", tagColor:"#db2777", cover:"#fff1f2", difficulty:"어려움", uses:876,
    blocks:{ preview:["선행 개념 지도 그리기","예상 출제 포인트 예측","관련 개념 연결망 작성"], review:["코넬 노트 기법으로 정리","5분 자기 설명 (Feynman)","고난도 문제 1~2개 도전"], week3:["출제 경향 분석","핵심 공식 압축 카드 제작","모의 문제 출제 연습"], week2:["실전 모의고사 시간 측정","취약 유형 집중 드릴","메타인지 점검"], week1:["암기 사항 최종 점검","자주 틀리는 포인트 리스트","멘탈 & 컨디션 정리"] } },
  { id:"cram", name:"벼락치기팩", emoji:"⚡", desc:"시험 3일 전! 핵심만 빠르게 쓸어담는 단기 집중 전략", tag:"긴급 대응", tagColor:"#dc2626", cover:"#fef2f2", difficulty:"중급", uses:2104,
    blocks:{ preview:["출제범위 목차 30초 스캔","작년 기출 유형 파악 (10분)","선생님 강조 포인트 체크"], review:["수업 필기 핵심만 압축 정리","중요 공식 A4 1장으로","친구한테 설명해보기"], week3:["단원별 핵심 개념 마인드맵","교과서 굵은 글씨 전부 암기","예상 문제 10개 직접 만들기"], week2:["오답률 높은 문제만 집중","시험 범위 개념 총복습","취약 파트 문제집 1단원"], week1:["모의 시험지 2회 실전 풀기","오답 원인 1줄씩 정리","전날 밤 암기 파이널 체크"] } },
  { id:"vacation", name:"방학팩", emoji:"🌴", desc:"방학을 알차게! 선행과 복습을 균형 있게 잡는 루틴", tag:"방학용", tagColor:"#d97706", cover:"#fefce8", difficulty:"쉬움", uses:934,
    blocks:{ preview:["다음 학기 교과서 목차 파악","선행 강의 1강 시청","모르는 개념 리스트업"], review:["지난 학기 오답노트 복습","핵심 공식 플래시카드 제작","취약 단원 문제집 1회독"], week3:["선행 3단원 개념 완성 목표","매일 30분 독서 병행","영단어 30개 암기"], week2:["선행 범위 모의 문제 풀기","방학 과제 절반 완성 체크","다음 학기 예상 범위 파악"], week1:["방학 학습 총정리 노트","새 학기 준비물 & 계획 세우기","컨디션 & 수면 패턴 정상화"] } },
  { id:"concept", name:"개념완성팩", emoji:"🧩", desc:"기초부터 탄탄하게! 개념을 완전히 이해하는 심화 루틴", tag:"기초 탄탄", tagColor:"#7c3aed", cover:"#faf5ff", difficulty:"중급", uses:567,
    blocks:{ preview:["개념 정의 3번 소리내어 읽기","관련 기초 개념 확인","실생활 예시 연결하기"], review:["개념을 내 말로 써보기","개념 적용 기본 문제 5개","이해 안 된 부분 질문 리스트"], week3:["개념 연결망(마인드맵) 완성","유형별 풀이법 정리","개념 응용 중급 문제"], week2:["서술형 개념 설명 연습","개념 혼합 문제 도전","오개념 최종 점검"], week1:["개념 총정리 한 장 요약","빈칸 채우기 셀프 테스트","약한 개념 집중 반복"] } },
  { id:"suneung", name:"수능대비팩", emoji:"🎯", desc:"수능까지 긴 호흡으로! 장기 로드맵 학습 전략", tag:"수능 대비", tagColor:"#2563eb", cover:"#eff6ff", difficulty:"어려움", uses:1502,
    blocks:{ preview:["수능 기출 분석 (최근 3년)","EBS 연계 개념 파악","취약 영역 진단 테스트"], review:["오늘 학습 개념 3줄 요약","수능 기출 유사 문제 3개","등급컷 기준 자기 평가"], week3:["수능 모의고사 1회 시간 재고 풀기","틀린 문제 유형 분류","고난도 문제 풀이법 연구"], week2:["실전 모의고사 2회 연속","OMR 마킹 실수 제로 훈련","D-14 최종 암기 리스트"], week1:["실전과 동일한 시간에 모의고사","수면·식사 컨디션 관리","시험장 루틴 리허설"] } },
];

export default function App() {
  const [page, setPage]         = useState("dashboard");
  const [packages, setPackages] = useState([]);
  const [editPkg, setEditPkg]   = useState(null);
  const [calEvents, setCalEvents] = useState({});
  const [done, setDone]         = useState({});
  const [shared, setShared]     = useState([
    { id:"demo1", subject:"수학(예시)", sharedBy:"박지민", sharedAt:"2026-05-20", blocks:{ preview:["개념 확인","예제 1개"], review:["오답정리"], week3:["기출풀기"], week2:["모의고사"], week1:["파이널"] } },
    { id:"demo2", subject:"영어(예시)", sharedBy:"김도현", sharedAt:"2026-05-22", blocks:{ preview:["단어암기","본문읽기"], review:["문법정리"], week3:["독해연습"], week2:["듣기훈련"], week1:["실전모의"] } },
  ]);
  const [toast, setToast]       = useState(null);
  const [tmplModal, setTmplModal] = useState(null);
  const today = new Date();
  const [calYear, setCalYear]   = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selDate, setSelDate]   = useState(null);
  const [dragData, setDragData] = useState(null);

  function showToast(msg, color="#1e293b") { setToast({msg,color}); setTimeout(()=>setToast(null),2400); }
  function savePkg(pkg) { if(pkg.id) setPackages(p=>p.map(x=>x.id===pkg.id?pkg:x)); else setPackages(p=>[...p,{...pkg,id:Date.now().toString()}]); showToast("저장 완료!","#059669"); setPage("dashboard"); }
  function delPkg(id) { setPackages(p=>p.filter(x=>x.id!==id)); showToast("삭제됐습니다"); }
  function addEv(date,pkgId,blockId) { setCalEvents(p=>({...p,[date]:[...(p[date]||[]),{pkgId,blockId,id:Date.now().toString()}]})); showToast("추가!","#2563eb"); }
  function removeEv(date,evId) { setCalEvents(p=>({...p,[date]:(p[date]||[]).filter(e=>e.id!==evId)})); setDone(p=>{const n={...p};Object.keys(n).filter(k=>k.startsWith(evId)).forEach(k=>delete n[k]);return n;}); }
  function moveEv(from,to,evId) { if(from===to)return; const ev=(calEvents[from]||[]).find(e=>e.id===evId); if(!ev)return; setCalEvents(p=>({...p,[from]:(p[from]||[]).filter(e=>e.id!==evId),[to]:[...(p[to]||[]),ev]})); setSelDate(to); showToast("이동 완료!","#059669"); }
  function toggleDone(key) { setDone(p=>({...p,[key]:!p[key]})); }
  function sharePkg(pkg) { if(shared.find(s=>s.id===pkg.id+"_s")){showToast("이미 공유됨","#f59e0b");return;} setShared(p=>[...p,{...pkg,id:pkg.id+"_s",sharedBy:"나",sharedAt:today.toISOString().slice(0,10)}]); showToast("공유됐어요!","#7c3aed"); }
  function importShared(sPkg) { setPackages(p=>[...p,{...sPkg,id:Date.now().toString(),subject:sPkg.subject+" (가져옴)"}]); showToast("내 패키지로 추가!","#059669"); }

  return (
    <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'Apple SD Gothic Neo','Malgun Gothic',sans-serif"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        button{cursor:pointer;font-family:inherit}
        input,select,textarea{font-family:inherit}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tin{from{opacity:0;transform:translateX(-50%) translateY(-8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        .hlift{transition:all .18s}.hlift:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(0,0,0,.1)}
        .pcard:hover .pov{opacity:1!important}
      `}</style>
      {toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:9999,background:toast.color,color:"white",padding:"10px 24px",borderRadius:12,fontWeight:700,fontSize:14,boxShadow:"0 4px 20px rgba(0,0,0,.2)",animation:"tin .2s ease",whiteSpace:"nowrap"}}>{toast.msg}</div>}
      {tmplModal&&<TmplModal bid={tmplModal.bid} onSelect={items=>{tmplModal.apply(items);setTmplModal(null);}} onClose={()=>setTmplModal(null)}/>}
      <Nav page={page} setPage={setPage}/>
      {page==="dashboard"&&<Dashboard packages={packages} onNew={()=>{setEditPkg(null);setPage("editor");}} onEdit={pkg=>{setEditPkg(pkg);setPage("editor");}} onDelete={delPkg} onShare={sharePkg} setPage={setPage}/>}
      {page==="editor"&&<PkgEditor pkg={editPkg} onSave={savePkg} onCancel={()=>setPage("dashboard")} openTmpl={(bid,apply)=>setTmplModal({bid,apply})}/>}
      {page==="calendar"&&<CalPage packages={packages} calEvents={calEvents} done={done} onToggle={toggleDone} calYear={calYear} setCalYear={setCalYear} calMonth={calMonth} setCalMonth={setCalMonth} selDate={selDate} setSelDate={setSelDate} onAdd={addEv} onRemove={removeEv} onMove={moveEv} dragData={dragData} setDragData={setDragData}/>}
      {page==="template"&&<TmplPage packages={packages} shared={shared} onImport={importShared} onShare={sharePkg}/>}
      {page==="analytics"&&<AnalyticsPage packages={packages} calEvents={calEvents} done={done}/>}
    </div>
  );
}

function Nav({page,setPage}){
  const items=[{id:"dashboard",label:"📦 내 패키지"},{id:"calendar",label:"🗓 캘린더"},{id:"analytics",label:"📊 학습 분석"},{id:"template",label:"✨ 템플릿"}];
  return(
    <nav style={{background:"white",borderBottom:"1.5px solid #e2e8f0",display:"flex",alignItems:"center",padding:"0 24px",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}>
      <div style={{fontWeight:900,fontSize:18,color:"#0f172a",marginRight:32,padding:"16px 0"}}>📚 StudyPack</div>
      {items.map(it=><button key={it.id} onClick={()=>setPage(it.id)} style={{background:"none",border:"none",padding:"18px 14px",fontWeight:page===it.id?700:500,fontSize:14,color:page===it.id?"#2563eb":"#64748b",borderBottom:page===it.id?"2.5px solid #2563eb":"2.5px solid transparent",transition:"all .15s"}}>{it.label}</button>)}
    </nav>
  );
}

function Dashboard({packages,onNew,onEdit,onDelete,onShare,setPage}){
  return(
    <div style={{padding:"36px 32px",maxWidth:1100,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32}}>
        <div><h1 style={{fontSize:28,fontWeight:900,color:"#0f172a",letterSpacing:-1}}>내 공부 패키지</h1><p style={{color:"#64748b",fontSize:14,marginTop:6}}>과목별 공부 루틴을 패키지로 만들어 관리하세요</p></div>
        <button onClick={onNew} style={{background:"#2563eb",color:"white",border:"none",borderRadius:12,padding:"12px 24px",fontWeight:700,fontSize:14,boxShadow:"0 4px 14px rgba(37,99,235,.35)"}}>+ 새 패키지 만들기</button>
      </div>
      {packages.length===0?(
        <div style={{textAlign:"center",padding:"80px 20px",background:"white",borderRadius:20,border:"2px dashed #e2e8f0"}}>
          <div style={{fontSize:56,marginBottom:16}}>📦</div>
          <h2 style={{fontSize:20,fontWeight:800,color:"#1e293b",marginBottom:8}}>아직 패키지가 없어요</h2>
          <p style={{color:"#64748b",fontSize:14,marginBottom:28,lineHeight:1.7}}>직접 만들거나, 템플릿에서 시작해보세요.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center"}}>
            <button onClick={onNew} style={{background:"#2563eb",color:"white",border:"none",borderRadius:10,padding:"11px 24px",fontWeight:700}}>+ 직접 만들기</button>
            <button onClick={()=>setPage("template")} style={{background:"white",color:"#2563eb",border:"1.5px solid #2563eb",borderRadius:10,padding:"11px 24px",fontWeight:700}}>✨ 템플릿 보기</button>
          </div>
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:20}}>
          {packages.map((pkg,i)=>(
            <div key={pkg.id} className="hlift" style={{background:"white",borderRadius:16,border:"1.5px solid #e2e8f0",overflow:"hidden",animation:`fadeUp .3s ease ${i*.05}s both`}}>
              <div style={{background:BGS[i%BGS.length],padding:"16px 20px 12px",borderBottom:"1.5px solid #e2e8f0"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><span style={{display:"inline-block",background:ACCENTS[i%ACCENTS.length]+"22",color:ACCENTS[i%ACCENTS.length],fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99,marginBottom:4}}>과목</span><h3 style={{fontSize:19,fontWeight:900,color:"#0f172a"}}>{pkg.subject}</h3></div>
                  <div style={{display:"flex",gap:5}}>
                    <button onClick={()=>onShare(pkg)} style={{background:"white",border:"1.5px solid #e2e8f0",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:600,color:"#7c3aed"}}>공유</button>
                    <button onClick={()=>onEdit(pkg)} style={{background:"white",border:"1.5px solid #e2e8f0",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:600,color:"#374151"}}>편집</button>
                    <button onClick={()=>onDelete(pkg.id)} style={{background:"#fff1f2",border:"none",borderRadius:8,padding:"5px 9px",fontSize:12,color:"#dc2626"}}>🗑</button>
                  </div>
                </div>
              </div>
              <div style={{padding:"12px 20px"}}>
                {BLOCK_TYPES.map(bt=>{const items=pkg.blocks?.[bt.id]||[];return(
                  <div key={bt.id} style={{marginBottom:7}}>
                    <span style={{background:bt.color+"88",color:bt.dark,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99}}>{bt.emoji} {bt.label}</span>
                    <span style={{fontSize:11,color:"#64748b",marginLeft:6}}>{items.length===0?"—":items.slice(0,2).join(", ")+(items.length>2?` 외 ${items.length-2}개`:"")}</span>
                  </div>
                );})}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PkgEditor({pkg,onSave,onCancel,openTmpl}){
  const [subj,setSubj]=useState(pkg?.subject||"");
  const [custom,setCustom]=useState(!SUBJECTS_DEFAULT.includes(pkg?.subject||"")?pkg?.subject||"":"");
  const [blocks,setBlocks]=useState(pkg?.blocks||{preview:[],review:[],week3:[],week2:[],week1:[]});
  const [ni,setNi]=useState({});
  const final=subj==="직접입력"?custom:subj;
  function add(bid){const v=(ni[bid]||"").trim();if(!v)return;setBlocks(p=>({...p,[bid]:[...(p[bid]||[]),v]}));setNi(p=>({...p,[bid]:""}));}
  function rem(bid,i){setBlocks(p=>({...p,[bid]:p[bid].filter((_,j)=>j!==i)}));}
  function applyTmpl(bid,items){setBlocks(p=>({...p,[bid]:[...new Set([...(p[bid]||[]),...items])]}));}
  return(
    <div style={{padding:"32px",maxWidth:900,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
        <button onClick={onCancel} style={{background:"white",border:"1.5px solid #e2e8f0",borderRadius:8,padding:"8px 14px",fontWeight:600,fontSize:13,color:"#374151"}}>← 뒤로</button>
        <h2 style={{fontSize:22,fontWeight:900,color:"#0f172a"}}>{pkg?"패키지 편집":"새 패키지 만들기"}</h2>
      </div>
      <div style={{background:"white",borderRadius:16,border:"1.5px solid #e2e8f0",padding:"20px 24px",marginBottom:18}}>
        <label style={{fontWeight:700,fontSize:14,color:"#1e293b",display:"block",marginBottom:10}}>📚 과목 선택</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:subj==="직접입력"?12:0}}>
          {[...SUBJECTS_DEFAULT,"직접입력"].map(s=><button key={s} onClick={()=>setSubj(s)} style={{background:subj===s?"#2563eb":"#f1f5f9",color:subj===s?"white":"#374151",border:"none",borderRadius:8,padding:"7px 14px",fontSize:13,fontWeight:600}}>{s}</button>)}
        </div>
        {subj==="직접입력"&&<input value={custom} onChange={e=>setCustom(e.target.value)} placeholder="과목명 직접 입력" style={{width:"100%",padding:"10px 14px",border:"1.5px solid #cbd5e1",borderRadius:9,fontSize:14,marginTop:4}}/>}
      </div>
      {BLOCK_TYPES.map(bt=>(
        <div key={bt.id} style={{background:"white",borderRadius:16,border:"1.5px solid #e2e8f0",padding:"18px 22px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <span style={{background:bt.color+"99",color:bt.dark,fontWeight:800,fontSize:13,padding:"4px 12px",borderRadius:99}}>{bt.emoji} {bt.label}</span>
            <button onClick={()=>openTmpl(bt.id,items=>applyTmpl(bt.id,items))} style={{background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:600,color:"#7c3aed"}}>✨ 템플릿에서 가져오기</button>
          </div>
          {(blocks[bt.id]||[]).length===0&&<p style={{color:"#94a3b8",fontSize:12,marginBottom:10}}>아직 항목이 없어요</p>}
          {(blocks[bt.id]||[]).map((item,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:bt.color+"44",borderRadius:8,padding:"7px 11px",marginBottom:5}}>
              <span style={{fontSize:13,color:"#1e293b"}}>• {item}</span>
              <button onClick={()=>rem(bt.id,i)} style={{background:"none",border:"none",color:"#94a3b8",fontSize:13,fontWeight:700}}>✕</button>
            </div>
          ))}
          <div style={{display:"flex",gap:8}}>
            <input value={ni[bt.id]||""} onChange={e=>setNi(p=>({...p,[bt.id]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&add(bt.id)} placeholder="공부 활동 추가 (Enter)" style={{flex:1,padding:"8px 12px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:13,background:"#f8fafc"}}/>
            <button onClick={()=>add(bt.id)} style={{background:bt.dark,color:"white",border:"none",borderRadius:8,padding:"8px 16px",fontWeight:700,fontSize:13}}>+ 추가</button>
          </div>
        </div>
      ))}
      <div style={{display:"flex",gap:12,justifyContent:"flex-end",marginTop:20}}>
        <button onClick={onCancel} style={{background:"white",border:"1.5px solid #e2e8f0",borderRadius:10,padding:"11px 22px",fontWeight:600,color:"#374151"}}>취소</button>
        <button onClick={()=>{if(!final.trim()){alert("과목명을 입력해주세요");return;} onSave({...pkg,subject:final,blocks});}} style={{background:"#2563eb",color:"white",border:"none",borderRadius:10,padding:"11px 26px",fontWeight:700,fontSize:14,boxShadow:"0 4px 14px rgba(37,99,235,.3)"}}>저장하기</button>
      </div>
    </div>
  );
}

function TmplModal({bid,onSelect,onClose}){
  const [sel,setSel]=useState(null);
  const [items,setItems]=useState([]);
  const bt=BLOCK_TYPES.find(b=>b.id===bid);
  const pack=sel?PACKS.find(p=>p.id===sel):null;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{background:"white",borderRadius:20,padding:26,maxWidth:540,width:"100%",maxHeight:"78vh",overflowY:"auto",animation:"fadeUp .2s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{fontSize:17,fontWeight:900,color:"#0f172a"}}>✨ 템플릿에서 가져오기 {bt&&<span style={{background:bt.color+"99",color:bt.dark,fontSize:11,padding:"2px 9px",borderRadius:99,fontWeight:700,marginLeft:8}}>{bt.emoji} {bt.label}</span>}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:19,color:"#64748b"}}>✕</button>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
          {PACKS.map(p=><button key={p.id} onClick={()=>{setSel(p.id);setItems([]);}} style={{padding:"5px 13px",borderRadius:20,border:`1.5px solid ${sel===p.id?p.tagColor:"#e2e8f0"}`,background:sel===p.id?p.cover:"white",fontSize:12,fontWeight:600,color:sel===p.id?p.tagColor:"#374151"}}>{p.emoji} {p.name}</button>)}
        </div>
        {pack&&bid&&<>
          <p style={{fontSize:13,color:"#64748b",marginBottom:9}}>가져올 항목을 선택하세요</p>
          {(pack.blocks[bid]||[]).map((item,i)=>{
            const isSel=items.includes(item);
            return <div key={i} onClick={()=>setItems(p=>isSel?p.filter(x=>x!==item):[...p,item])} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 13px",borderRadius:9,marginBottom:5,background:isSel?"#eff6ff":"#f8fafc",border:`1.5px solid ${isSel?"#2563eb":"#e2e8f0"}`,cursor:"pointer"}}>
              <span style={{width:16,height:16,borderRadius:4,background:isSel?"#2563eb":"white",border:`2px solid ${isSel?"#2563eb":"#cbd5e1"}`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:10,flexShrink:0}}>{isSel&&"✓"}</span>
              <span style={{fontSize:13,color:"#1e293b"}}>{item}</span>
            </div>;
          })}
          <button onClick={()=>items.length&&onSelect(items)} disabled={!items.length} style={{width:"100%",marginTop:12,padding:"11px 0",background:items.length?"#2563eb":"#e2e8f0",color:items.length?"white":"#94a3b8",border:"none",borderRadius:10,fontWeight:700,fontSize:14}}>선택한 {items.length}개 가져오기</button>
        </>}
      </div>
    </div>
  );
}

function TmplPage({packages,shared,onImport,onShare}){
  const [tab,setTab]=useState("official");
  const [detail,setDetail]=useState(null);
  const [search,setSearch]=useState("");
  const filtered=PACKS.filter(p=>p.name.includes(search)||p.tag.includes(search)||p.desc.includes(search));
  const filteredShared=shared.filter(p=>(p.subject||"").includes(search)||(p.sharedBy||"").includes(search));
  return(
    <div style={{padding:"32px",maxWidth:1100,margin:"0 auto"}}>
      {detail&&<PackDetail pack={detail} onClose={()=>setDetail(null)}/>}
      <div style={{marginBottom:26}}>
        <h1 style={{fontSize:26,fontWeight:900,color:"#0f172a",marginBottom:4}}>✨ 템플릿 라이브러리</h1>
        <p style={{color:"#64748b",fontSize:14}}>검증된 공부 루틴을 골라 내 패키지에 바로 적용해보세요</p>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",background:"#f1f5f9",borderRadius:10,padding:3}}>
          {[{id:"official",label:"📋 공식 템플릿"},{id:"community",label:`👥 커뮤니티 (${shared.length})`}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 18px",borderRadius:8,border:"none",background:tab===t.id?"white":"transparent",fontWeight:tab===t.id?700:500,fontSize:13,color:tab===t.id?"#1e293b":"#64748b",boxShadow:tab===t.id?"0 1px 4px rgba(0,0,0,.08)":"none",transition:"all .15s"}}>{t.label}</button>
          ))}
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 검색..." style={{padding:"8px 16px",border:"1.5px solid #e2e8f0",borderRadius:10,fontSize:13,width:200,background:"white"}}/>
      </div>
      {tab==="official"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))",gap:16}}>
          {filtered.map((pack,i)=>(
            <div key={pack.id} className="pcard hlift" style={{background:"white",borderRadius:14,border:"1.5px solid #e2e8f0",overflow:"hidden",cursor:"pointer",animation:`fadeUp .22s ease ${i*.04}s both`}} onClick={()=>setDetail(pack)}>
              <div style={{background:pack.cover,height:70,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,position:"relative"}}>
                {pack.emoji}
                <div className="pov" style={{position:"absolute",inset:0,background:"rgba(0,0,0,.05)",opacity:0,transition:"opacity .18s",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{background:"white",borderRadius:7,padding:"4px 11px",fontSize:12,fontWeight:700,color:"#1e293b",boxShadow:"0 2px 8px rgba(0,0,0,.1)"}}>미리보기</span>
                </div>
              </div>
              <div style={{padding:"12px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                  <h3 style={{fontSize:14,fontWeight:800,color:"#0f172a"}}>{pack.name}</h3>
                  <span style={{fontSize:10,padding:"2px 7px",borderRadius:99,background:pack.tagColor+"22",color:pack.tagColor,fontWeight:700,whiteSpace:"nowrap",marginLeft:6}}>{pack.tag}</span>
                </div>
                <p style={{fontSize:12,color:"#64748b",lineHeight:1.5,marginBottom:9}}>{pack.desc}</p>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",gap:3}}>{BLOCK_TYPES.map(bt=><span key={bt.id} title={bt.label} style={{width:19,height:19,borderRadius:5,background:bt.color+"99",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9}}>{bt.emoji}</span>)}</div>
                  <span style={{fontSize:11,color:"#94a3b8"}}>👍 {pack.uses.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==="community"&&(
        <div>
          <div style={{background:"#eff6ff",borderRadius:11,padding:"11px 16px",marginBottom:18,fontSize:13,color:"#2563eb",display:"flex",gap:8}}>
            <span>💡</span><span>친구들이 공유한 패키지예요. 내 패키지에서 <b>공유</b> 버튼을 누르면 여기에 등록돼요.</span>
          </div>
          {filteredShared.length===0?(
            <div style={{textAlign:"center",padding:"56px",background:"white",borderRadius:16,border:"2px dashed #e2e8f0"}}>
              <div style={{fontSize:42,marginBottom:12}}>👥</div>
              <p style={{color:"#64748b",fontSize:14}}>아직 공유된 패키지가 없어요<br/>내 패키지를 공유해보세요!</p>
            </div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))",gap:14}}>
              {filteredShared.map((pkg,i)=>(
                <div key={pkg.id} className="hlift" style={{background:"white",borderRadius:13,border:"1.5px solid #e2e8f0",overflow:"hidden",animation:`fadeUp .22s ease ${i*.04}s both`}}>
                  <div style={{background:"#f8fafc",padding:"13px 15px",borderBottom:"1.5px solid #f1f5f9"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <h3 style={{fontSize:14,fontWeight:800,color:"#0f172a"}}>{pkg.subject}</h3>
                      <button onClick={()=>onImport(pkg)} style={{background:"#2563eb",color:"white",border:"none",borderRadius:7,padding:"4px 11px",fontSize:11,fontWeight:700}}>가져오기</button>
                    </div>
                    <div style={{fontSize:11,color:"#94a3b8",marginTop:3}}>{pkg.sharedBy} · {pkg.sharedAt}</div>
                  </div>
                  <div style={{padding:"10px 15px",display:"flex",flexWrap:"wrap",gap:4}}>
                    {BLOCK_TYPES.map(bt=>{const cnt=(pkg.blocks?.[bt.id]||[]).length; return cnt>0&&<span key={bt.id} style={{fontSize:9,padding:"2px 7px",borderRadius:99,background:bt.color+"88",color:bt.dark,fontWeight:600}}>{bt.emoji} {cnt}개</span>;})}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PackDetail({pack,onClose}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{background:"white",borderRadius:20,maxWidth:520,width:"100%",maxHeight:"82vh",overflowY:"auto",animation:"fadeUp .2s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{background:pack.cover,padding:"22px 22px 16px",borderBottom:"1.5px solid #e2e8f0"}}>
          <div style={{fontSize:42,marginBottom:7}}>{pack.emoji}</div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
            <span style={{background:pack.tagColor+"22",color:pack.tagColor,fontSize:11,fontWeight:700,padding:"2px 9px",borderRadius:99}}>{pack.tag}</span>
            <span style={{fontSize:11,color:"#64748b"}}>난이도: {pack.difficulty} · 👍 {pack.uses.toLocaleString()}</span>
          </div>
          <h2 style={{fontSize:20,fontWeight:900,color:"#0f172a"}}>{pack.name}</h2>
          <p style={{fontSize:13,color:"#64748b",marginTop:3}}>{pack.desc}</p>
        </div>
        <div style={{padding:"16px 22px"}}>
          {BLOCK_TYPES.map(bt=>(
            <div key={bt.id} style={{marginBottom:13}}>
              <span style={{display:"inline-block",background:bt.color+"99",color:bt.dark,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99,marginBottom:7}}>{bt.emoji} {bt.label}</span>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {(pack.blocks[bt.id]||[]).map((item,i)=><span key={i} style={{background:bt.color+"44",color:bt.dark,fontSize:12,padding:"4px 10px",borderRadius:7}}>{item}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:"0 22px 20px"}}><button onClick={onClose} style={{width:"100%",padding:"11px 0",background:"#f1f5f9",border:"none",borderRadius:10,fontWeight:700,fontSize:14,color:"#374151"}}>닫기</button></div>
      </div>
    </div>
  );
}

function CalPage({packages,calEvents,done,onToggle,calYear,setCalYear,calMonth,setCalMonth,selDate,setSelDate,onAdd,onRemove,onMove,dragData,setDragData}){
  const [activePkg,setActivePkg]=useState("");
  const [activeBlk,setActiveBlk]=useState("");
  const [marked,setMarked]=useState([]);
  const [manageOpen,setManageOpen]=useState(false);
  const [dragOver,setDragOver]=useState(null);

  const daysInMonth=getDays(calYear,calMonth), firstDay=getFirst(calYear,calMonth);
  const today=new Date(), todayStr=toStr(today.getFullYear(),today.getMonth(),today.getDate());
  const aPkg=packages.find(p=>p.id===activePkg), aBt=BLOCK_TYPES.find(b=>b.id===activeBlk);
  const isReady=activePkg&&activeBlk;
  const selEvs=selDate?(calEvents[selDate]||[]):[];

  function pmth(){if(calMonth===0){setCalYear(y=>y-1);setCalMonth(11);}else setCalMonth(m=>m-1);}
  function nmth(){if(calMonth===11){setCalYear(y=>y+1);setCalMonth(0);}else setCalMonth(m=>m+1);}
  function dayClick(ds){if(isReady) setMarked(p=>p.includes(ds)?p.filter(d=>d!==ds):[...p,ds]); else setSelDate(ds);}
  function apply(){if(!isReady||!marked.length)return; marked.forEach(ds=>onAdd(ds,activePkg,activeBlk)); setMarked([]);}

  const groups=useMemo(()=>{
    const map={};
    Object.entries(calEvents).forEach(([date,evs])=>evs.forEach(ev=>{
      const k=`${ev.pkgId}__${ev.blockId}`;
      if(!map[k]) map[k]={pkgId:ev.pkgId,blockId:ev.blockId,entries:[]};
      map[k].entries.push({date,evId:ev.id});
    }));
    return Object.values(map);
  },[calEvents]);

  const cells=[];
  for(let i=0;i<firstDay;i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++) cells.push(d);

  return(
    <div style={{padding:"22px 26px",maxWidth:1200,margin:"0 auto"}}>
      {manageOpen&&<ManageModal groups={groups} packages={packages} onRemove={onRemove} onClose={()=>setManageOpen(false)}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:16}}>
        <div><h1 style={{fontSize:23,fontWeight:900,color:"#0f172a",marginBottom:2}}>🗓 학습 캘린더</h1><p style={{color:"#64748b",fontSize:13}}>패키지·블럭 선택 후 날짜 복수 선택으로 한번에 적용 · 할 일 카드를 드래그해 날짜 이동 가능</p></div>
        <button onClick={()=>setManageOpen(true)} style={{background:"white",border:"1.5px solid #e2e8f0",borderRadius:9,padding:"8px 16px",fontWeight:700,fontSize:13,color:"#374151"}}>⚙️ 전체 일정 관리</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 310px",gap:16,alignItems:"start"}}>
        <div style={{background:"white",borderRadius:17,border:"1.5px solid #e2e8f0",padding:20}}>
          {isReady&&(
            <div style={{background:aBt.color+"55",border:`1.5px solid ${aBt.dark}33`,borderRadius:9,padding:"8px 14px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <span>{aBt.emoji}</span>
                <span style={{fontWeight:700,fontSize:13,color:aBt.dark}}>{aPkg?.subject} · {aBt.label}</span>
                <span style={{fontSize:12,color:"#64748b"}}>{marked.length===0?"날짜를 클릭해 선택하세요":`${marked.length}개 선택됨`}</span>
              </div>
              <div style={{display:"flex",gap:7}}>
                {marked.length>0&&<button onClick={apply} style={{background:"#2563eb",color:"white",border:"none",borderRadius:7,padding:"5px 13px",fontWeight:700,fontSize:12}}>✅ {marked.length}개 적용</button>}
                <button onClick={()=>{setActivePkg("");setActiveBlk("");setMarked([]);}} style={{background:"white",border:"1.5px solid #e2e8f0",borderRadius:7,padding:"5px 9px",fontSize:12,color:"#64748b"}}>취소</button>
              </div>
            </div>
          )}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <button onClick={pmth} style={{background:"#f1f5f9",border:"none",borderRadius:7,padding:"6px 14px",fontWeight:700,fontSize:14}}>◀</button>
            <span style={{fontWeight:900,fontSize:17,color:"#0f172a"}}>{calYear}년 {MONTH_NAMES[calMonth]}</span>
            <button onClick={nmth} style={{background:"#f1f5f9",border:"none",borderRadius:7,padding:"6px 14px",fontWeight:700,fontSize:14}}>▶</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:5}}>
            {WEEKDAYS.map((d,i)=><div key={d} style={{textAlign:"center",fontWeight:700,fontSize:11,color:i===0?"#ef4444":"#64748b",padding:"3px 0"}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
            {cells.map((day,idx)=>{
              if(!day) return <div key={`e${idx}`}/>;
              const ds=toStr(calYear,calMonth,day);
              const evs=calEvents[ds]||[];
              const isToday=ds===todayStr, isMark=marked.includes(ds), isView=ds===selDate&&!isReady;
              const isDO=dragOver===ds&&dragData;
              let bg=isDO?"#dbeafe":isMark?(aBt?aBt.color+"55":"#dbeafe"):isView?"#eff6ff":isToday?"#fef9c3":"white";
              let bc=isDO?"#2563eb":isMark?(aBt?.dark||"#2563eb"):isView?"#2563eb":isToday?"#f59e0b":"#f1f5f9";
              return(
                <div key={ds} onClick={()=>dayClick(ds)}
                  onDragOver={e=>{e.preventDefault();setDragOver(ds);}}
                  onDrop={e=>{e.preventDefault();if(dragData){onMove(dragData.from,ds,dragData.evId);}setDragData(null);setDragOver(null);}}
                  onDragLeave={()=>setDragOver(null)}
                  style={{borderRadius:9,padding:"5px 4px",minHeight:72,cursor:"pointer",background:bg,border:`2px solid ${bc}`,transition:"all .12s",position:"relative"}}>
                  {isMark&&<span style={{position:"absolute",top:3,right:3,width:14,height:14,borderRadius:"50%",background:aBt?.dark||"#2563eb",color:"white",fontSize:8,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>✓</span>}
                  {isDO&&<span style={{position:"absolute",top:3,right:3,fontSize:12}}>📌</span>}
                  <div style={{fontWeight:isToday?800:600,fontSize:11,color:isToday?"#2563eb":isMark?(aBt?.dark||"#2563eb"):"#374151",paddingRight:isMark||isDO?18:0}}>{day}</div>
                  {evs.slice(0,3).map((ev,i)=>{
                    const p=packages.find(p=>p.id===ev.pkgId), bt=BLOCK_TYPES.find(b=>b.id===ev.blockId);
                    if(!p||!bt) return null;
                    return <div key={i} style={{fontSize:9,borderRadius:3,padding:"1px 4px",marginTop:2,background:bt.color+"99",color:bt.dark,fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{bt.emoji} {p.subject}</div>;
                  })}
                  {evs.length>3&&<div style={{fontSize:8,color:"#94a3b8"}}>+{evs.length-3}</div>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14,position:"sticky",top:74}}>
          <div style={{background:"white",borderRadius:17,border:"1.5px solid #e2e8f0",padding:16,maxHeight:400,overflowY:"auto"}}>
            {!selDate?(
              <div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:30,marginBottom:7}}>📅</div><p style={{color:"#94a3b8",fontSize:13}}>날짜를 클릭하면<br/>할 일이 표시돼요<br/><span style={{fontSize:11,color:"#cbd5e1",marginTop:4,display:"block"}}>카드를 드래그해 날짜 이동 가능</span></p></div>
            ):(
              <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
                  <h3 style={{fontWeight:800,fontSize:14,color:"#0f172a"}}>📅 {selDate.slice(5).replace("-","/")} 할 일</h3>
                  <button onClick={()=>setSelDate(null)} style={{background:"none",border:"none",color:"#94a3b8",fontSize:15}}>✕</button>
                </div>
                {selEvs.length===0?<p style={{color:"#94a3b8",fontSize:13}}>등록된 할 일이 없어요</p>:selEvs.map(ev=>{
                  const p=packages.find(p=>p.id===ev.pkgId), bt=BLOCK_TYPES.find(b=>b.id===ev.blockId);
                  if(!p||!bt) return null;
                  const items=p.blocks?.[bt.id]||[];
                  const doneC=items.filter((_,i)=>done[`${ev.id}__${i}`]).length;
                  const isDragging=dragData?.evId===ev.id;
                  return(
                    <div key={ev.id} draggable onDragStart={()=>setDragData({evId:ev.id,from:selDate})} onDragEnd={()=>setDragData(null)}
                      style={{border:"1.5px solid #e2e8f0",borderRadius:9,marginBottom:8,overflow:"hidden",cursor:"grab",opacity:isDragging?.6:1,transition:"opacity .15s"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:bt.color+"88",padding:"6px 10px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          <span style={{color:"#94a3b8",fontSize:11,cursor:"grab"}}>⠿</span>
                          <span style={{fontWeight:700,fontSize:11,color:bt.dark}}>{bt.emoji} {p.subject} · {bt.label}</span>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          <span style={{fontSize:10,color:bt.dark,fontWeight:600}}>{doneC}/{items.length}</span>
                          <button onClick={()=>onRemove(selDate,ev.id)} style={{background:"none",border:"none",color:"#ef4444",fontSize:12,fontWeight:700}}>✕</button>
                        </div>
                      </div>
                      <div style={{padding:"7px 9px"}}>
                        {items.length===0?<p style={{fontSize:11,color:"#94a3b8"}}>항목 없음</p>:items.map((item,i)=>{
                          const ck=`${ev.id}__${i}`, isDone=!!done[ck];
                          return(
                            <div key={i} onClick={()=>onToggle(ck)} style={{display:"flex",alignItems:"center",gap:7,padding:"4px 0",borderBottom:i<items.length-1?"1px solid #f8fafc":"none",cursor:"pointer"}}>
                              <span style={{width:15,height:15,borderRadius:4,border:`2px solid ${isDone?"#10b981":"#cbd5e1"}`,background:isDone?"#10b981":"white",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:9,flexShrink:0,transition:"all .15s"}}>{isDone&&"✓"}</span>
                              <span style={{fontSize:12,color:isDone?"#94a3b8":"#374151",textDecoration:isDone?"line-through":"none"}}>{item}</span>
                            </div>
                          );
                        })}
                      </div>
                      {items.length>0&&doneC===items.length&&<div style={{background:"#f0fdf4",padding:"3px 9px",fontSize:11,color:"#059669",fontWeight:700,textAlign:"center"}}>🎉 완료!</div>}
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <div style={{background:"white",borderRadius:17,border:"1.5px solid #e2e8f0",padding:16,maxHeight:440,overflowY:"auto"}}>
            <p style={{fontSize:10,fontWeight:800,color:"#94a3b8",letterSpacing:1,marginBottom:10}}>STEP 1 · 패키지 선택</p>
            {packages.length===0?<p style={{fontSize:12,color:"#94a3b8"}}>패키지를 먼저 만들어주세요</p>:packages.map(p=>{
              const isA=p.id===activePkg;
              return <button key={p.id} onClick={()=>{setActivePkg(p.id);setActiveBlk("");setMarked([]);}} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 11px",marginBottom:5,borderRadius:9,border:`1.5px solid ${isA?"#2563eb":"#e2e8f0"}`,background:isA?"#eff6ff":"#f8fafc",cursor:"pointer"}}>
                <div style={{fontWeight:700,fontSize:13,color:isA?"#2563eb":"#1e293b"}}>{p.subject}</div>
                <div style={{display:"flex",gap:3,marginTop:3,flexWrap:"wrap"}}>{BLOCK_TYPES.map(bt=><span key={bt.id} style={{fontSize:9,padding:"1px 5px",borderRadius:99,background:bt.color+"88",color:bt.dark,fontWeight:600}}>{bt.emoji} {(p.blocks?.[bt.id]||[]).length}</span>)}</div>
              </button>;
            })}
            {activePkg&&<>
              <div style={{height:1,background:"#f1f5f9",margin:"10px 0"}}/>
              <p style={{fontSize:10,fontWeight:800,color:"#94a3b8",letterSpacing:1,marginBottom:9}}>STEP 2 · 블럭 선택</p>
              {BLOCK_TYPES.map(bt=>{
                const isA=bt.id===activeBlk, items=aPkg?.blocks?.[bt.id]||[];
                return <button key={bt.id} onClick={()=>{setActiveBlk(bt.id);setMarked([]);}} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 11px",marginBottom:4,borderRadius:9,border:`1.5px solid ${isA?bt.dark:"#e2e8f0"}`,background:isA?bt.color+"55":"#f8fafc",cursor:"pointer"}}>
                  <div style={{fontWeight:700,fontSize:12,color:isA?bt.dark:"#374151"}}>{bt.emoji} {bt.label}</div>
                  {items.length>0&&<div style={{fontSize:10,color:"#64748b",marginTop:2}}>{items.slice(0,2).map((x,i)=><span key={i} style={{display:"block"}}>· {x}</span>)}{items.length>2&&<span style={{color:"#94a3b8"}}>+{items.length-2}개 더</span>}</div>}
                </button>;
              })}
            </>}
            {isReady&&marked.length>0&&<>
              <div style={{height:1,background:"#f1f5f9",margin:"10px 0"}}/>
              <div style={{background:"#eff6ff",borderRadius:8,padding:"7px 10px",marginBottom:7,fontSize:12,color:"#374151"}}>
                <span style={{fontWeight:700,color:"#2563eb"}}>{marked.length}개</span> 날짜 선택됨 <span style={{fontSize:10,color:"#94a3b8",marginLeft:4}}>{[...marked].sort().slice(0,3).map(d=>d.slice(5)).join(", ")}{marked.length>3&&` 외 ${marked.length-3}개`}</span>
              </div>
              <button onClick={apply} style={{width:"100%",padding:"10px 0",background:"#2563eb",color:"white",border:"none",borderRadius:9,fontWeight:700,fontSize:13,boxShadow:"0 3px 10px rgba(37,99,235,.25)"}}>✅ {marked.length}개 날짜에 적용</button>
              <button onClick={()=>setMarked([])} style={{width:"100%",padding:"5px 0",marginTop:4,background:"none",color:"#94a3b8",border:"none",fontSize:12}}>선택 초기화</button>
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ManageModal({groups,packages,onRemove,onClose}){
  const [exp,setExp]=useState({});
  const total=groups.reduce((a,g)=>a+g.entries.length,0);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{background:"white",borderRadius:19,width:"100%",maxWidth:540,maxHeight:"78vh",display:"flex",flexDirection:"column",animation:"fadeUp .2s ease",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"18px 22px 14px",borderBottom:"1.5px solid #f1f5f9",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><h2 style={{fontSize:17,fontWeight:900,color:"#0f172a"}}>⚙️ 전체 일정 관리</h2><p style={{fontSize:12,color:"#64748b",marginTop:2}}>총 {total}건 · 패키지·블럭 단위로 한번에 삭제</p></div>
            <button onClick={onClose} style={{background:"none",border:"none",fontSize:19,color:"#94a3b8"}}>✕</button>
          </div>
        </div>
        <div style={{overflowY:"auto",padding:"10px 22px 18px"}}>
          {groups.length===0?<div style={{textAlign:"center",padding:"36px 0",color:"#94a3b8",fontSize:14}}>등록된 일정이 없어요</div>:groups.map(g=>{
            const k=`${g.pkgId}__${g.blockId}`, p=packages.find(x=>x.id===g.pkgId), bt=BLOCK_TYPES.find(b=>b.id===g.blockId);
            if(!p||!bt) return null;
            const isOpen=exp[k];
            return(
              <div key={k} style={{border:"1.5px solid #e2e8f0",borderRadius:11,marginBottom:9,overflow:"hidden"}}>
                <div style={{display:"flex",alignItems:"center",background:bt.color+"55",padding:"9px 13px",gap:9}}>
                  <div style={{flex:1,cursor:"pointer"}} onClick={()=>setExp(prev=>({...prev,[k]:!prev[k]}))}>
                    <span style={{fontWeight:700,fontSize:13,color:bt.dark}}>{bt.emoji} {bt.label}</span>
                    <span style={{fontSize:13,color:"#1e293b",fontWeight:700,marginLeft:7}}>— {p.subject}</span>
                    <span style={{fontSize:11,color:"#64748b",marginLeft:5}}>{g.entries.length}개 {isOpen?"▲":"▼"}</span>
                  </div>
                  <button onClick={()=>g.entries.forEach(e=>onRemove(e.date,e.evId))} style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:6,padding:"3px 11px",fontSize:11,color:"#dc2626",fontWeight:700}}>전체 삭제</button>
                </div>
                {isOpen&&(
                  <div style={{padding:"9px 13px",display:"flex",flexWrap:"wrap",gap:5}}>
                    {[...g.entries].sort((a,b)=>a.date.localeCompare(b.date)).map(e=>(
                      <div key={e.evId} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:7,background:"#f8fafc",border:"1.5px solid #e2e8f0"}}>
                        <span style={{fontSize:12,color:"#374151"}}>{e.date.slice(5).replace("-","/")}</span>
                        <button onClick={()=>onRemove(e.date,e.evId)} style={{background:"none",border:"none",color:"#ef4444",fontSize:12,fontWeight:700,lineHeight:1}}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AnalyticsPage({packages,calEvents,done}){
  const today=new Date(), todayStr=toStr(today.getFullYear(),today.getMonth(),today.getDate());
  const stats=useMemo(()=>{
    let total=0, doneC=0;
    const bySub={}, byBlk={}, byDate={};
    Object.entries(calEvents).forEach(([date,evs])=>evs.forEach(ev=>{
      const p=packages.find(p=>p.id===ev.pkgId), bt=BLOCK_TYPES.find(b=>b.id===ev.blockId);
      if(!p||!bt) return;
      const items=p.blocks?.[ev.blockId]||[], subj=p.subject;
      if(!bySub[subj]) bySub[subj]={total:0,done:0};
      if(!byBlk[ev.blockId]) byBlk[ev.blockId]={total:0,done:0,label:bt.label,emoji:bt.emoji,color:bt.color,dark:bt.dark};
      if(!byDate[date]) byDate[date]={total:0,done:0};
      items.forEach((_,i)=>{
        total++; bySub[subj].total++; byBlk[ev.blockId].total++; byDate[date].total++;
        if(done[`${ev.id}__${i}`]){ doneC++; bySub[subj].done++; byBlk[ev.blockId].done++; byDate[date].done++; }
      });
    }));
    return {total,done:doneC,bySub,byBlk,byDate};
  },[calEvents,done,packages]);

  const pct=(d,t)=>t===0?0:Math.round(d/t*100);
  const last7=Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-6+i);
    const ds=toStr(d.getFullYear(),d.getMonth(),d.getDate());
    const s=stats.byDate[ds]||{total:0,done:0};
    return {ds,done:s.done,total:s.total,label:`${d.getMonth()+1}/${d.getDate()}`};
  });
  const maxD=Math.max(...last7.map(d=>d.done),1);

  return(
    <div style={{padding:"36px 32px",maxWidth:1000,margin:"0 auto"}}>
      <h1 style={{fontSize:25,fontWeight:900,color:"#0f172a",marginBottom:4}}>📊 학습 분석</h1>
      <p style={{color:"#64748b",fontSize:14,marginBottom:30}}>체크한 할 일을 바탕으로 나의 학습 현황을 분석해줘요</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
        {[{label:"전체 할 일",val:stats.total,sub:"등록된 항목 수",color:"#2563eb",bg:"#eff6ff"},{label:"완료한 할 일",val:stats.done,sub:`완료율 ${pct(stats.done,stats.total)}%`,color:"#059669",bg:"#f0fdf4"},{label:"오늘 완료",val:(stats.byDate[todayStr]?.done||0),sub:`/ ${stats.byDate[todayStr]?.total||0}개 중`,color:"#d97706",bg:"#fefce8"}].map((s,i)=>(
          <div key={i} style={{background:s.bg,borderRadius:15,padding:"20px 22px",border:`1.5px solid ${s.color}22`}}>
            <div style={{fontSize:13,color:"#64748b",marginBottom:5}}>{s.label}</div>
            <div style={{fontSize:34,fontWeight:900,color:s.color,lineHeight:1}}>{s.val}</div>
            <div style={{fontSize:12,color:"#64748b",marginTop:5}}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:20}}>
        <div style={{background:"white",borderRadius:15,border:"1.5px solid #e2e8f0",padding:"18px 22px"}}>
          <h3 style={{fontSize:14,fontWeight:800,color:"#0f172a",marginBottom:14}}>📈 최근 7일 완료 현황</h3>
          {last7.every(d=>d.done===0)?<p style={{color:"#94a3b8",fontSize:13,textAlign:"center",padding:"18px 0"}}>아직 완료된 항목이 없어요</p>:(
            <div style={{display:"flex",alignItems:"flex-end",gap:7,height:110}}>
              {last7.map((d,i)=>{
                const h=d.done===0?4:Math.max(8,d.done/maxD*100);
                const isT=d.ds===todayStr;
                return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <span style={{fontSize:10,color:"#64748b",fontWeight:600}}>{d.done||""}</span>
                  <div style={{width:"100%",borderRadius:5,background:isT?"#2563eb":"#93c5fd",height:h,transition:"height .4s",minHeight:4}}/>
                  <span style={{fontSize:9,color:isT?"#2563eb":"#64748b",fontWeight:isT?700:400}}>{d.label}</span>
                </div>;
              })}
            </div>
          )}
        </div>
        <div style={{background:"white",borderRadius:15,border:"1.5px solid #e2e8f0",padding:"18px 22px"}}>
          <h3 style={{fontSize:14,fontWeight:800,color:"#0f172a",marginBottom:14}}>📦 블럭 타입별 완료율</h3>
          {Object.keys(stats.byBlk).length===0?<p style={{color:"#94a3b8",fontSize:13,textAlign:"center",padding:"18px 0"}}>데이터가 없어요</p>:Object.entries(stats.byBlk).map(([bid,s])=>(
            <div key={bid} style={{marginBottom:11}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:600,color:"#1e293b"}}>{s.emoji} {s.label}</span>
                <span style={{fontSize:11,color:"#64748b"}}>{s.done}/{s.total} ({pct(s.done,s.total)}%)</span>
              </div>
              <div style={{background:"#e5e7eb",borderRadius:99,height:7,overflow:"hidden"}}>
                <div style={{width:`${pct(s.done,s.total)}%`,height:"100%",background:s.dark,borderRadius:99,transition:"width .5s",minWidth:s.done>0?4:0}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:"white",borderRadius:15,border:"1.5px solid #e2e8f0",padding:"18px 22px"}}>
        <h3 style={{fontSize:14,fontWeight:800,color:"#0f172a",marginBottom:14}}>📚 과목별 완료율</h3>
        {Object.keys(stats.bySub).length===0?<p style={{color:"#94a3b8",fontSize:13,textAlign:"center",padding:"18px 0"}}>캘린더에서 패키지를 적용하고 체크해보세요!</p>:(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:11}}>
            {Object.entries(stats.bySub).map(([subj,s],i)=>{
              const p2=pct(s.done,s.total), ac=ACCENTS[i%ACCENTS.length];
              return <div key={subj} style={{background:BGS[i%BGS.length],borderRadius:11,padding:"13px 15px",border:`1.5px solid ${ac}22`}}>
                <div style={{fontWeight:800,fontSize:13,color:"#0f172a",marginBottom:7}}>{subj}</div>
                <div style={{background:"#e5e7eb",borderRadius:99,height:8,overflow:"hidden",marginBottom:5}}>
                  <div style={{width:`${p2}%`,height:"100%",background:ac,borderRadius:99,transition:"width .5s",minWidth:s.done>0?4:0}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#64748b"}}>
                  <span>{s.done}/{s.total}개 완료</span>
                  <span style={{fontWeight:700,color:ac}}>{p2}%</span>
                </div>
              </div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
