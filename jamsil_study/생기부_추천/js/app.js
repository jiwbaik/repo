// ── 생기부 데이터
const BOOKS = {
  "과학/공학": [
    {title:"부분과 전체",author:"베르너 하이젠베르크",desc:"양자역학 · 불확정성 원리 · 물리학자의 회고 · 과학과 철학"},
    {title:"엔트로피",author:"제레미 리프킨",desc:"열역학 제2법칙 · 에너지 위기 · 환경 파괴 · 지속가능성"},
    {title:"침묵의 봄",author:"레이첼 카슨",desc:"환경운동 원조 · DDT 고발 · 생태계 파괴 · 화학 살충제의 위험"},
    {title:"이기적 유전자",author:"리처드 도킨스",desc:"진화생물학 · 유전자 중심 진화론 · 이타성의 생물학적 기원"},
    {title:"공학이란 무엇인가",author:"유키 히로시",desc:"공학 입문 · 설계 사고 · 기술과 사회 · 엔지니어의 역할"},
    {title:"페르마의 마지막 정리",author:"사이먼 싱",desc:"수학사 · 정수론 · 350년 미스터리 · 수학적 증명의 드라마"},
    {title:"코스모스",author:"칼 세이건",desc:"우주론 · 빅뱅 · 생명의 기원 · 천문학 · 우리는 별의 먼지"},
    {title:"과학혁명의 구조",author:"토마스 쿤",desc:"패러다임 전환 · 과학철학 · 정상과학 · 혁명적 발전"},
    {title:"83 - 어느 방사능 피폭환자 치료의 기록",author:"로버트 피터 게일",desc:"체르노빌 · 방사능 피폭 · 의학적 치료 · 핵 위험성"},
    {title:"AI는 인문학을 먹고산다",author:"한국경제신문",desc:"인공지능 · 인문학적 사고 · 알고리즘 · 기술과 인간"},
    {title:"건축학개론 기억의 공간",author:"승효상 외",desc:"건축 철학 · 공간 설계 · 도시와 삶 · 건축의 사회적 역할"},
    {title:"기술 중독사회",author:"리처드 왓슨",desc:"디지털 중독 · 스마트폰 · 주의력 결핍 · 기술과 인간성"},
    {title:"반도체의 미래",author:"이종호",desc:"반도체 산업 · 첨단소자 · 기술 패권 · 한국 반도체"},
    {title:"세계사를 바꾼 12가지 신소재",author:"사토 겐타로",desc:"소재공학 · 철·유리·플라스틱 · 신소재 혁명 · 문명사"},
    {title:"왜 로봇의 도덕인가",author:"웬델 월러치",desc:"로봇 윤리 · 자율주행 · AI 도덕성 · 기계의 판단"},
    {title:"자원위기와 차세대 에너지",author:"이필렬",desc:"에너지 전환 · 화석연료 고갈 · 재생에너지 · 지속가능 발전"},
    {title:"뉴턴의 무정한 세계",author:"김홍재",desc:"고전역학 · 결정론 · 과학과 신 · 물리학적 세계관"},
    {title:"문명과 수학",author:"피터 벤틀리",desc:"수학의 역사 · 문명 발전 · 암호·통계·위상수학 · 수학의 힘"},
    {title:"발견하는 즐거움",author:"리처드 파인만",desc:"과학적 호기심 · 물리학자의 삶 · 창의적 사고 · 과학의 즐거움"},
    {title:"수학이 즐거운 순간",author:"에드워드 프렌켈",desc:"수학의 아름다움 · 추상대수 · 수학과 삶 · 수학자의 고백"},
    {title:"틀리지 않는 법",author:"조던 엘렌버그",desc:"수학적 사고 · 통계 오류 · 논리적 추론 · 일상 속 수학"},
    {title:"살아있는 정리",author:"세드릭 빌라니",desc:"필즈상 수학자 · 수학 연구 과정 · 정리 증명 · 수학자의 일상"},
    {title:"화학혁명과 폴링",author:"찰스 칼",desc:"라이너스 폴링 · 화학결합 · 노벨상 · 분자생물학 혁명"},
    {title:"총, 균, 쇠",author:"재레드 다이아몬드",desc:"문명 발전 · 지리적 결정론 · 대륙의 축 방향"}
  ],
  "인문/사회": [
    {title:"정의란 무엇인가",author:"마이클 샌델",desc:"정치철학 · 공리주의 · 자유지상주의 · 전차 딜레마 · 롤스 정의론"},
    {title:"공정하다는 착각",author:"마이클 샌델",desc:"능력주의 비판 · 교육 불평등 · 성공의 도덕성 · 공동선"},
    {title:"왜 세계의 절반은 굶주리는가",author:"장 지글러",desc:"세계 기아 · 식량 불평등 · 국제 원조 · 식량 주권"},
    {title:"1984",author:"조지 오웰",desc:"디스토피아 · 빅브라더 · 전체주의 · 감시 사회 · 이중사고"},
    {title:"데미안",author:"헤르만 헤세",desc:"자아 탐색 · 성장소설 · 선과 악 · 내면의 신 아브락사스"},
    {title:"사피엔스",author:"유발 하라리",desc:"인류사 · 인지혁명 · 농업혁명 · 과학혁명 · 허구를 믿는 능력"},
    {title:"나쁜 사마리아인들",author:"장하준",desc:"신자유주의 비판 · 보호무역 · 개발도상국 · 경제 발전 전략"},
    {title:"넛지",author:"리처드 탈러",desc:"행동경제학 · 선택 설계 · 자유주의적 개입 · 정책 적용"},
    {title:"선량한 차별주의자",author:"김지혜",desc:"무의식적 편견 · 일상 속 차별 · 혐오 · 소수자 인권"},
    {title:"죽은 경제학자의 살아있는 아이디어",author:"토드 부크홀츠",desc:"경제사상사 · 스미스·마르크스·케인즈 · 경제학 입문"},
    {title:"경제학 콘서트",author:"팀 하포드",desc:"일상 속 경제학 · 희소성 · 가격차별 · 게임이론 · 경제학 입문"},
    {title:"감정은 어떻게 만들어지는가",author:"리사 펠드먼 배럿",desc:"감정의 과학 · 뇌과학 · 구성주의 감정이론 · 인간 감정의 본질"},
    {title:"강대국 국제정치의 비극",author:"존 미어샤이머",desc:"공격적 현실주의 · 패권 경쟁 · 미중 갈등 · 국제관계론"},
    {title:"개소리는 어떻게 세상을 정복했는가",author:"해리 프랭크퍼트",desc:"진실과 거짓 · 언어철학 · 포퓰리즘 · 미디어 비판"},
    {title:"굿라이프",author:"로버트 왈딩거",desc:"하버드 행복 연구 · 관계의 힘 · 삶의 질 · 좋은 인생의 조건"},
    {title:"지리의 힘",author:"팀 마샬",desc:"지정학 · 지형과 국제관계 · 강대국 전략 · 지리적 결정론"},
    {title:"냉정한 이타주의자",author:"윌리엄 맥어스킬",desc:"효율적 이타주의 · 기부 · 사회적 임팩트 · 선의의 방향"},
    {title:"갈등과 소통",author:"김호",desc:"갈등 해결 · 협상 · 의사소통 · 조직 내 관계"},
    {title:"혐오사회",author:"카롤린 엠케",desc:"혐오의 구조 · 소수자 차별 · 민주주의 위기 · 혐오 발언"},
    {title:"티핑포인트",author:"말콤 글래드웰",desc:"사회적 전염 · 변화의 임계점 · 입소문 · 작은 변화의 큰 효과"},
    {title:"문명의 충돌",author:"새뮤얼 헌팅턴",desc:"탈냉전 · 문명권 충돌 · 세계 질서 재편"},
    {title:"군주론",author:"마키아벨리",desc:"현실주의 정치철학 · 권력 획득 · 목적과 수단"},
    {title:"국가론",author:"플라톤",desc:"이상 국가 · 철인왕 · 동굴의 비유"}
  ],
  "의학": [
    {title:"숨결이 바람 될 때",author:"폴 칼라니티",desc:"죽음과 삶의 의미 · 신경외과 의사의 투병기 · 의료윤리 · 인간의 존엄"},
    {title:"의사와 수의사가 만나다",author:"바버라 내터슨-호로위츠",desc:"인수공통의학 · 동물과 인간의 질병 · 비교의학 · 의학의 미래"},
    {title:"인수공통 모든 전염병의 열쇠",author:"데이비드 콰먼",desc:"바이러스 · 인수공통감염병 · 에볼라·사스 · 생태계 파괴"},
    {title:"아픔이 길이 되려면",author:"김승섭",desc:"사회역학 · 차별과 건강 · 공동체 · 의료 불평등 · 몸의 기억"},
    {title:"아내를 모자로 착각한 남자",author:"올리버 색스",desc:"신경과학 · 뇌와 정체성 · 희귀 신경질환 · 인간 인식의 신비"},
    {title:"동물 해방",author:"피터 싱어",desc:"동물권 · 공리주의 · 종차별주의 · 동물실험 윤리 · 채식주의"},
    {title:"동물 안의 인간",author:"프란스 드 발",desc:"동물 행동학 · 공감 능력 · 영장류 사회 · 인간 본성의 기원"},
    {title:"우리 시대의 동물 해방",author:"피터 싱어",desc:"동물 복지 · 공장식 축산 · 종차별주의 · 생명 윤리"},
    {title:"육식의 종말",author:"제레미 리프킨",desc:"채식주의 · 공장식 축산 · 환경 파괴 · 식량 위기 · 축산업 비판"},
    {title:"개미와 공작",author:"헬레나 크로닌",desc:"진화론 · 자연선택 · 성선택 · 이타적 행동의 진화 · 사회생물학"},
    {title:"다정한 것이 살아남는다",author:"브라이언 헤어",desc:"친화력 진화 · 자기가축화 · 협력과 공감 · 인류의 성공 비결"},
    {title:"생명이란 무엇인가",author:"에르빈 슈뢰딩거",desc:"분자생물학 기초 · DNA 예언 · 물리학과 생물학 · 생명의 질서"},
    {title:"바이러스 폭풍의 시대",author:"네이선 울프",desc:"신종 바이러스 · 팬데믹 예방 · 바이러스 사냥꾼 · 감염병 추적"},
    {title:"슈퍼버그",author:"맷 매카시",desc:"항생제 내성 · 슈퍼박테리아 · 신약 개발 · 감염내과 현장"},
    {title:"인간은 왜 병에 걸리는가",author:"랜돌프 네스·조지 윌리엄스",desc:"진화의학 · 질병의 진화적 이유 · 자연선택과 건강 · 적응과 병"},
    {title:"죽음이란 무엇인가",author:"셸리 케이건",desc:"죽음의 철학 · 영혼의 존재 · 삶의 가치 · 죽음에 대한 두려움"}
  ],
  "경영/경제": [
    {title:"국부론",author:"애덤 스미스",desc:"보이지 않는 손 · 시장 메커니즘 · 분업 · 자본주의 토대"},
    {title:"생각에 관한 생각",author:"대니얼 카너먼",desc:"이중 체계 · 확증편향 · 앵커링 · 인지 편향"},
    {title:"21세기 자본",author:"토마 피케티",desc:"r>g · 불평등 심화 · 부의 세습 · 자본세"},
    {title:"자본론",author:"카를 마르크스",desc:"노동가치설 · 잉여가치론 · 사회주의"}
  ],
  "예체능": [
    {title:"미학 오디세이",author:"진중권",desc:"서양미학사 · 이데아 · 숭고미 · 예술철학 · 미의 본질"},
    {title:"서양미술사",author:"곰브리치",desc:"동굴벽화→현대미술 · 역사적 맥락 · 회화 발전 · 미술사 교양"},
    {title:"예술의 위로",author:"알랭 드 보통",desc:"예술의 치유 · 인생의 7가지 문제 · 고흐·베토벤 · 실용적 가치"},
    {title:"나의 문화유산답사기",author:"유홍준",desc:"한국 문화재 · 사찰·석탑·불상 · 아는 만큼 보인다 · 답사 여행"}
  ]
};
const STRATS = [
  { icon: "💪", title: "도전적인 과목 선택", desc: "성적 부담이 있어도 언어와 매체와 화법과 작문을 모두 선택", ex: "성적만 고려하지 않고 도전" },
  { icon: "🔍", title: "교과에서 생긴 의문 탐구", desc: "학교 문법과 학술 문법의 차이를 발견하고 추가 탐구", ex: "수업 중 궁금증을 그냥 넘기지 않음" },
  { icon: "🔗", title: "관심 분야 연결", desc: "윤리·정치·세계사를 \"인간\"이라는 하나의 주제로 연결", ex: "과목 간 연결성과 흐름" },
  { icon: "🔬", title: "융합 학습", desc: "철학 + 수학 + 물리학 + 천문학을 연결해 탐구", ex: "서로 다른 분야를 자신의 관심사로 연결" },
  { icon: "🎯", title: "진로에 맞는 과목 선택", desc: "정치외교 관심을 바탕으로 인공지능 기초를 선택하고 데이터 분석을 탐구에 활용", ex: "진로와 학습을 연결" },
  { icon: "🐻", title: "과목 선택의 용기", desc: "소수 선택 과목이나 어려운 과목도 관심이 있다면 선택", ex: "선택자 수나 성적만 보고 결정하지 않음" }
];
const ACTS = [{ cat: "🔬 이공계열", items: [{ title: "교내 과학 탐구 보고서", imp: "h", detail: "특정 현상에 의문 제기 → 가설 설정 → 실험 → 결론 도출 과정 상세 기록" }, { title: "수학/과학 교과 심화 탐구", imp: "h", detail: "수업 중 배운 개념을 확장해 자기주도적으로 탐구한 내용 서술" }, { title: "STEM 관련 대회 참가", imp: "m", detail: "수상 여부보다 준비 과정과 배운 점에 집중" }] }, { cat: "📖 인문/사회계열", items: [{ title: "사회 현상 탐구 보고서", imp: "h", detail: "시사 이슈를 인문학적 시각으로 분석, 자신의 견해 제시" }, { title: "토론 대회 / 모의재판", imp: "h", detail: "논리적 사고력과 표현력을 동시에 보여줄 수 있는 활동" }, { title: "봉사활동 + 사회 문제 연계", imp: "m", detail: "봉사 경험을 통해 사회 구조적 문제를 인식한 과정 서술" }] }, { cat: "💼 경영/경제계열", items: [{ title: "경제 현상 분석 보고서", imp: "h", detail: "금리, 환율, 주가 등 실제 경제 데이터를 활용한 분석" }, { title: "창업 아이디어 기획서", imp: "h", detail: "시장 조사 → 문제 정의 → 솔루션 → 기대효과 순서로 작성" }, { title: "모의 주식 투자 활동", imp: "m", detail: "투자 결정 근거와 결과 분석을 보고서 형태로 정리" }] }, { cat: "🎨 예체능계열", items: [{ title: "작품 제작 과정 기록", imp: "h", detail: "완성작보다 기획-제작-수정-완성의 과정이 중요" }, { title: "예술 작품 비평 보고서", imp: "h", detail: "감상에서 그치지 않고 미학적 관점으로 분석" }, { title: "지역 문화 행사 참여", imp: "m", detail: "관람이 아닌 기획·운영 참여 시 더욱 효과적" }] }];
const TIPS = [
  { n: "01", t: "탐구를 하기 위해서 독서를 많이 해야합니다." },
  { n: "02", t: "자신이 무엇에 대해 탐구하는지도 모르고 발표를 하는 친구들도 있는데, 이런 태도는 좋지 않고, 자신이 탐구하는 내용을 정확하게 알고 해야합니다." },
  { n: "03", t: "생기부의 연계성을 위해서는 2, 3학년 때에는 1학년 때 했었던 범위가 넓었던 주제를 세분화해서 조사하고, 더 수준높은 책을 읽어보는 것을 추천합니다." }
];

let actFilter = '과학/공학';
var showAllBooks = false;
var BOOKS_LIMIT = 6;

function renderSaenggibu() {
  document.getElementById('sg').innerHTML = STRATS.map((s, i) => `<div class="s-card" style="animation-delay:${i * .1}s"><div class="s-icon">${s.icon}</div><div class="s-body"><h3>${s.title}</h3><p>${s.desc}</p><div class="s-ex">› ${s.ex}</div></div></div>`).join('') +
    '<div style="grid-column:1/-1;text-align:center;margin-top:12px;"><a href="https://snuarori.snu.ac.kr/highschool-life/freshman-life" target="_blank" style="display:inline-flex;align-items:center;gap:8px;padding:11px 26px;background:var(--navy);color:var(--cream);border-radius:999px;font-family:Noto Sans KR,sans-serif;font-size:13px;font-weight:700;text-decoration:none;box-shadow:var(--shadow);">📄 서울대 신입생 사례 자세히 보기 →</a></div>';
  document.getElementById('fr').innerHTML = Object.keys(BOOKS).map(c => `<button class="f-btn${c === actFilter ? ' active' : ''}" onclick="setFilter('${c}')">${c}</button>`).join('');
  renderBooks();
  document.getElementById('ag').innerHTML = ACTS.map(a => `<div class="act-card"><div class="act-head">${a.cat}</div><div class="act-body">${a.items.map(it => `<div class="act-item"><div class="act-item-top"><span class="act-name">${it.title}</span><span class="${it.imp === 'h' ? 'imp-h' : 'imp-m'}">${it.imp === 'h' ? '★ 중요' : '추천'}</span></div><div class="act-detail">${it.detail}</div></div>`).join('')}</div></div>`).join('');
  document.getElementById('tl').innerHTML = TIPS.map(t => `<li><span class="tip-num">${t.n}</span><span>${t.t}</span></li>`).join('');
}

function setFilter(c) {
  actFilter = c;
  showAllBooks = false;
  document.querySelectorAll('.f-btn').forEach(b => b.classList.toggle('active', b.textContent === c));
  renderBooks();
}

function renderBooks() {
  var list = BOOKS[actFilter] || [];
  var shown = showAllBooks ? list : list.slice(0, BOOKS_LIMIT);
  var hasMore = !showAllBooks && list.length > BOOKS_LIMIT;

  document.getElementById('bg').innerHTML = shown.map((b, i) =>
    `<div class="b-card" style="animation-delay:${i * .07}s">
      <div class="b-top"><span class="b-badge">${actFilter}</span><span class="b-star">★</span></div>
      <div class="b-title">${b.title}</div>
      <div class="b-author">${b.author}</div>
      <div class="b-desc">${b.desc}</div>
    </div>`
  ).join('');

  // 더 찾아보기 버튼
  var moreWrap = document.getElementById('booksMoreWrap');
  if (moreWrap) {
    if (hasMore) {
      moreWrap.innerHTML = `
        <div style="text-align:center;margin-top:20px;">
          <button onclick="showMoreBooks()" style="padding:10px 32px;border-radius:999px;border:1.5px solid var(--navy);background:var(--white);color:var(--navy);font-family:'Noto Sans KR',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;">
            📚 더 찾아보기 (${list.length - BOOKS_LIMIT}권 더)
          </button>
        </div>`;
    } else if (showAllBooks && list.length > BOOKS_LIMIT) {
      moreWrap.innerHTML = `
        <div style="text-align:center;margin-top:20px;">
          <button onclick="showLessBooks()" style="padding:10px 32px;border-radius:999px;border:1.5px solid var(--border);background:var(--white);color:var(--muted);font-family:'Noto Sans KR',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;">
            ▲ 접기
          </button>
        </div>`;
    } else {
      moreWrap.innerHTML = '';
    }
  }
}

function showMoreBooks() {
  showAllBooks = true;
  renderBooks();
}

function showLessBooks() {
  showAllBooks = false;
  renderBooks();
  document.getElementById('bg').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── 후기 남기기 ──
const REVIEW_KEY = 'saenggibu_reviews';

function loadReviews() {
  try {
    const raw = localStorage.getItem(REVIEW_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveReviews(list) {
  try { localStorage.setItem(REVIEW_KEY, JSON.stringify(list)); } catch (e) {}
}

function escapeReviewHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatReviewDate(ts) {
  const d = new Date(ts);
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function renderReviews() {
  const wrap = document.getElementById('reviewList');
  if (!wrap) return;
  const list = loadReviews();

  if (!list.length) {
    wrap.innerHTML = '<p class="review-empty">아직 후기가 없어요. 첫 후기를 남겨보세요!</p>';
    return;
  }

  wrap.innerHTML = list.slice().reverse().map(r => `
    <div class="review-card">
      <div class="review-card-top">
        <span class="review-card-name">${escapeReviewHtml(r.name || '익명')}</span>
        <span class="review-card-date">${formatReviewDate(r.ts)}</span>
      </div>
      <div class="review-card-text">${escapeReviewHtml(r.text)}</div>
    </div>`
  ).join('');
}

function submitReview() {
  const nameInput = document.getElementById('reviewName');
  const textInput = document.getElementById('reviewText');
  const text = textInput.value.trim();
  if (!text) { alert('후기 내용을 입력해주세요.'); return; }

  const list = loadReviews();
  list.push({ name: nameInput.value.trim(), text: text, ts: Date.now() });
  saveReviews(list);

  textInput.value = '';
  nameInput.value = '';
  renderReviews();
}

function scrollToReview() {
  const target = document.getElementById('reviewSection');
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 후기 작성란이 이미 화면에 보이면 바로가기 버튼을 숨김
function setupReviewJumpButton() {
  const btn = document.getElementById('reviewJumpBtn');
  const target = document.getElementById('reviewSection');
  if (!btn || !target) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        btn.classList.toggle('hidden', entry.isIntersecting);
      });
    }, { threshold: 0.15 });
    io.observe(target);
  }
}

// ── 초기화
document.addEventListener('DOMContentLoaded', function () {
  renderSaenggibu();
  renderReviews();
  setupReviewJumpButton();
});
