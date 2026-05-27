import { useState, useEffect } from "react";

// ── 데이터 ──────────────────────────────────────────────────────────────────

const BOOKS = {
  "과학/공학": [
    { title: "이기적 유전자",   author: "리처드 도킨스",     desc: "진화생물학 · 유전자 중심 진화론 · 이타성의 생물학적 기원" },
    { title: "코스모스",        author: "칼 세이건",         desc: "우주론 · 빅뱅 · 생명의 기원 · 천문학 · 우리는 별의 먼지" },
    { title: "엔트로피",        author: "제레미 리프킨",     desc: "열역학 제2법칙 · 에너지 위기 · 환경 파괴 · 지속가능성" },
    { title: "침묵의 봄",       author: "레이첼 카슨",       desc: "환경운동 원조 · DDT 고발 · 생태계 파괴 · 화학 살충제의 위험" },
    { title: "과학혁명의 구조", author: "토마스 쿤",         desc: "패러다임 전환 · 과학철학 · 정상과학 · 혁명적 발전" },
    { title: "총, 균, 쇠",      author: "재레드 다이아몬드", desc: "문명 발전 · 지리적 결정론 · 가축화 · 대륙의 축 방향" },
  ],
  "인문/사회": [
    { title: "정의란 무엇인가", author: "마이클 샌델",   desc: "정치철학 · 공리주의 · 자유지상주의 · 전차 딜레마 · 롤스 정의론" },
    { title: "사피엔스",        author: "유발 하라리",   desc: "인류사 · 인지혁명 · 농업혁명 · 과학혁명 · 허구를 믿는 능력" },
    { title: "문명의 충돌",     author: "새뮤얼 헌팅턴", desc: "탈냉전 · 문명권 충돌 · 서구 vs 이슬람 · 세계 질서 재편" },
    { title: "군주론",          author: "마키아벨리",    desc: "현실주의 정치철학 · 권력 획득 · 목적과 수단 · 마키아벨리즘" },
    { title: "국가론",          author: "플라톤",        desc: "이상 국가 · 철인왕 · 동굴의 비유 · 이데아론 · 정의의 본질" },
    { title: "1984",            author: "조지 오웰",     desc: "디스토피아 · 빅브라더 · 전체주의 · 감시 사회 · 이중사고" },
  ],
  "경영/경제": [
    { title: "국부론",           author: "애덤 스미스",   desc: "보이지 않는 손 · 시장 메커니즘 · 분업 · 자유무역 · 자본주의 토대" },
    { title: "자본론",           author: "카를 마르크스", desc: "노동가치설 · 잉여가치론 · 자본축적 · 착취 구조 · 사회주의 혁명" },
    { title: "넛지",             author: "리처드 탈러",   desc: "행동경제학 · 선택 설계 · 자유주의적 개입 · 정책 적용" },
    { title: "생각에 관한 생각", author: "대니얼 카너먼", desc: "이중 체계 · 시스템1/2 · 확증편향 · 앵커링 · 인지 편향" },
    { title: "21세기 자본",      author: "토마 피케티",   desc: "r > g · 불평등 심화 · 부의 세습 · 자본세 · 200년 데이터" },
    { title: "경제학 콘서트",    author: "팀 하포드",     desc: "일상 속 경제학 · 희소성 · 가격차별 · 게임이론 · 경제학 입문" },
  ],
  "예체능": [
    { title: "미학 오디세이",       author: "진중권",       desc: "서양미학사 · 이데아 · 숭고미 · 예술철학 · 미의 본질" },
    { title: "서양미술사",          author: "곰브리치",     desc: "동굴벽화→현대미술 · 역사적 맥락 · 회화 발전 · 미술사 교양" },
    { title: "예술의 위로",         author: "알랭 드 보통", desc: "예술의 치유 · 인생의 7가지 문제 · 고흐·베토벤 · 실용적 가치" },
    { title: "나의 문화유산답사기", author: "유홍준",       desc: "한국 문화재 · 사찰·석탑·불상 · 아는 만큼 보인다 · 답사 여행" },
  ],
};

const STRATEGIES = [
  {
    icon: "🎯", title: "구체적인 활동 기록",
    desc: '단순 참여가 아닌 "무엇을 배웠고, 어떻게 성장했는지" 서술',
    example: "× 봉사활동 참여\n✓ 노인복지관 봉사를 통해 고령화 사회 문제를 인식하고\n   사회복지학 진로 확정",
  },
  {
    icon: "📈", title: "성장의 스토리라인",
    desc: "1학년 → 2학년 → 3학년 동안의 발전 과정을 연결",
    example: "1학년: 관심 발견\n2학년: 심화 탐구\n3학년: 실질적 프로젝트",
  },
  {
    icon: "🔗", title: "활동 간 연계성",
    desc: "독서-탐구-동아리-봉사를 하나의 관심사로 엮기",
    example: "환경 독서 → 환경동아리\n지역 환경조사 → 캠페인 기획",
  },
  {
    icon: "💡", title: "전공적합성 강조",
    desc: "희망 전공과 활동의 연결고리 명확히",
    example: "의대 지망:\n생명과학 실험 → 의료봉사 → 의학 도서 탐독",
  },
];

const ACTIVITIES = {
  "과학": [
    { activity: "R&E(Research & Education) 프로그램 참여", impact: "높음" },
    { activity: "과학실험 동아리 + 탐구보고서 작성",       impact: "높음" },
  ],
  "인문": [
    { activity: "토론동아리 & 인문학 독서 세미나",         impact: "높음" },
    { activity: "역사/철학 에세이 대회 참가",              impact: "중간" },
  ],
  "사회": [
    { activity: "모의유엔(MUN) 또는 경제동아리",           impact: "높음" },
    { activity: "사회문제 해결 프로젝트 기획 및 실행",     impact: "높음" },
  ],
  "봉사": [
    { activity: "지속적이고 의미있는 봉사 (1회성 지양)",       impact: "중간" },
    { activity: "진로 연계 봉사활동 (교육봉사, 의료봉사 등)", impact: "높음" },
  ],
  "자율": [
    { activity: "진로 관련 프로젝트형 활동",  impact: "높음" },
    { activity: "학술제/전시회 기획 및 발표", impact: "중간" },
  ],
  "독서": [
    { activity: "전공 연계 독서 + 심화 독후감", impact: "중간" },
    { activity: "독서토론회 주도 및 서평 작성", impact: "중간" },
  ],
};

const TIPS = [
  "양보다 질! 3년간 일관된 관심사를 깊게 파는 것이 유리",
  "선생님께 구체적인 활동 내용 전달 → 세특 퀄리티 상승",
  "학년별 성장 곡선을 만들어라 (1학년 기초 → 3학년 심화)",
  "활동 후 반드시 보고서/포트폴리오 정리 (면접 대비)",
];

const CATEGORIES = ["전체", ...Object.keys(BOOKS)];

// ── 서브 컴포넌트 ────────────────────────────────────────────────────────────

function StrategyCard({ icon, title, desc, example, index }) {
  return (
    <div
      className="strategy-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="strategy-icon">{icon}</div>
      <div className="strategy-body">
        <h3>{title}</h3>
        <p>{desc}</p>
        <pre className="example-box">{example}</pre>
      </div>
    </div>
  );
}

function BookCard({ title, author, desc, category, index }) {
  return (
    <div className="book-card" style={{ animationDelay: `${index * 40}ms` }}>
      <div className="book-top">
        <span className="cat-badge">{category}</span>
        <span className="star">★</span>
      </div>
      <div className="book-title">{title}</div>
      <div className="book-author">{author}</div>
      <div className="book-desc">{desc}</div>
    </div>
  );
}

function ActivityCard({ category, items }) {
  return (
    <div className="activity-card">
      <div className="activity-header">
        <span className="activity-cat">{category}</span>
      </div>
      <div className="activity-body">
        {items.map((item, i) => (
          <div key={i} className="activity-item">
            <p>{item.activity}</p>
            <span className={item.impact === "높음" ? "imp-high" : "imp-mid"}>
              임팩트 {item.impact}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 메인 앱 ─────────────────────────────────────────────────────────────────

export default function App() {
  const [selected, setSelected] = useState("전체");
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const list =
      selected === "전체"
        ? Object.entries(BOOKS).flatMap(([cat, items]) =>
            items.map((b) => ({ ...b, category: cat }))
          )
        : (BOOKS[selected] || []).map((b) => ({ ...b, category: selected }));
    setBooks(list);
  }, [selected]);

  return (
    <>
      <style>{CSS}</style>
      <div className="root">

        {/* ── 헤더 ── */}
        <header className="site-header">
          <div className="header-inner">
            <div className="header-badge">생기부 가이드 2025</div>
            <h1 className="header-title">
              🏫&nbsp;우리 학교<br />생기부 치트키
            </h1>
            <p className="header-sub">합격으로 가는 생활기록부 작성 완벽 가이드</p>
          </div>
          <div className="header-deco" aria-hidden="true">
            <span>📚</span><span>🏆</span><span>✏️</span><span>🎓</span>
          </div>
        </header>

        <main className="main">

          {/* ── 필승 전략 ── */}
          <section className="section">
            <div className="section-hero">
              <div className="section-hero-text">
                <div className="hero-label">STRATEGY</div>
                <h2 className="section-title-lg">생기부 필승 전략</h2>
                <p className="hero-desc">
                  단순 나열이 아니라 <strong>'성장 과정'</strong>을 보여주세요!
                </p>
              </div>
              <div className="hero-accent">🎯</div>
            </div>
            <div className="grid-2">
              {STRATEGIES.map((s, i) => (
                <StrategyCard key={i} {...s} index={i} />
              ))}
            </div>
          </section>

          {/* ── 추천 도서 ── */}
          <section className="section">
            <div className="section-head">
              <div className="section-label">BOOKS</div>
              <h2 className="section-title-lg">계열별 추천 도서</h2>
            </div>

            {/* 필터 */}
            <div className="filter-row">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn${selected === cat ? " active" : ""}`}
                  onClick={() => setSelected(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 도서 그리드 */}
            <div className="grid-3">
              {books.map((book, i) => (
                <BookCard key={`${book.title}-${i}`} {...book} index={i} />
              ))}
            </div>
          </section>

          {/* ── 추천 활동 ── */}
          <section className="section">
            <div className="section-head">
              <div className="section-label">ACTIVITIES</div>
              <h2 className="section-title-lg">임팩트 있는 활동 추천</h2>
            </div>
            <div className="grid-2">
              {Object.entries(ACTIVITIES).map(([cat, items]) => (
                <ActivityCard key={cat} category={cat} items={items} />
              ))}
            </div>
          </section>

          {/* ── 핵심 꿀팁 ── */}
          <section className="section">
            <div className="tip-banner">
              <div className="tip-header">
                <span className="tip-icon">💡</span>
                <h2>핵심 꿀팁</h2>
              </div>
              <ul className="tip-list">
                {TIPS.map((tip, i) => (
                  <li key={i}>
                    <span className="tip-num">0{i + 1}</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

        </main>

        <footer className="site-footer">
          <p>🏫 생기부 치트키 · 합격을 응원합니다!</p>
        </footer>
      </div>
    </>
  );
}

// ── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Gmarket+Sans:wght@300;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .root {
    font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif;
    background: #f0f4ff;
    min-height: 100vh;
    color: #1a1a2e;
  }

  /* ── 헤더 ── */
  .site-header {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%);
    color: #fff;
    padding: 56px 24px 48px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .site-header::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 50%, rgba(99,102,241,.25) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 20%, rgba(236,72,153,.15) 0%, transparent 50%);
    pointer-events: none;
  }
  .header-inner { position: relative; z-index: 1; }
  .header-badge {
    display: inline-block;
    background: rgba(255,255,255,.12);
    border: 1px solid rgba(255,255,255,.2);
    color: #a5b4fc;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    padding: 5px 14px;
    border-radius: 999px;
    margin-bottom: 20px;
  }
  .header-title {
    font-family: 'Gmarket Sans', 'Noto Sans KR', sans-serif;
    font-size: clamp(28px, 6vw, 48px);
    font-weight: 700;
    line-height: 1.25;
    margin-bottom: 14px;
  }
  .header-sub { font-size: 15px; color: #94a3b8; }
  .header-deco {
    position: absolute; top: 20px; right: 0; left: 0;
    display: flex; justify-content: space-between;
    padding: 0 32px; font-size: 28px; opacity: .08;
    pointer-events: none; z-index: 0;
  }

  /* ── 메인 ── */
  .main { max-width: 1120px; margin: 0 auto; padding: 48px 20px 64px; }

  /* ── 섹션 공통 ── */
  .section { margin-bottom: 64px; }
  .section-head { margin-bottom: 28px; }
  .section-label {
    font-size: 11px; font-weight: 700; letter-spacing: 3px;
    color: #6366f1; margin-bottom: 6px;
  }
  .section-title-lg {
    font-family: 'Gmarket Sans', sans-serif;
    font-size: clamp(20px, 4vw, 30px);
    font-weight: 700; color: #1a1a2e;
  }

  /* ── 히어로 배너 ── */
  .section-hero {
    background: linear-gradient(135deg, #1a1a2e, #312e81);
    border-radius: 20px; padding: 36px 40px;
    display: flex; align-items: center;
    justify-content: space-between; gap: 24px;
    margin-bottom: 28px; overflow: hidden;
    position: relative;
  }
  .section-hero::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 80% 50%, rgba(99,102,241,.3) 0%, transparent 60%);
    pointer-events: none;
  }
  .section-hero-text { position: relative; z-index: 1; }
  .hero-label {
    font-size: 11px; font-weight: 700; letter-spacing: 3px;
    color: #a5b4fc; margin-bottom: 8px;
  }
  .section-hero .section-title-lg { color: #fff; margin-bottom: 10px; }
  .hero-desc { font-size: 15px; color: #c7d2fe; }
  .hero-desc strong { color: #fff; font-weight: 700; }
  .hero-accent { font-size: 64px; opacity: .6; flex-shrink: 0; position: relative; z-index: 1; }

  /* ── 그리드 ── */
  .grid-2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px; }
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }

  /* ── 전략 카드 ── */
  .strategy-card {
    background: #fff; border-radius: 16px; padding: 24px;
    box-shadow: 0 2px 16px rgba(99,102,241,.08);
    border: 1px solid #e8eaff;
    display: flex; gap: 16px; align-items: flex-start;
    animation: fadeUp .5s ease both;
  }
  .strategy-card:hover { box-shadow: 0 8px 32px rgba(99,102,241,.16); transform: translateY(-2px); transition: all .2s; }
  .strategy-icon { font-size: 36px; flex-shrink: 0; line-height: 1; }
  .strategy-body h3 { font-size: 15px; font-weight: 700; color: #1a1a2e; margin-bottom: 6px; }
  .strategy-body p  { font-size: 13px; color: #475569; margin-bottom: 10px; line-height: 1.6; }
  .example-box {
    background: #f8f9ff; border-left: 3px solid #6366f1;
    border-radius: 0 8px 8px 0; padding: 10px 12px;
    font-family: 'Noto Sans KR', monospace; font-size: 12px;
    color: #334155; line-height: 1.7; white-space: pre-wrap;
  }

  /* ── 필터 ── */
  .filter-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
  .filter-btn {
    padding: 8px 20px; border-radius: 999px; font-size: 13px; font-weight: 600;
    border: 1.5px solid #c7d2fe; background: #fff; color: #6366f1;
    cursor: pointer; transition: all .2s;
    font-family: 'Noto Sans KR', sans-serif;
  }
  .filter-btn:hover { background: #eef2ff; }
  .filter-btn.active {
    background: #6366f1; color: #fff; border-color: #6366f1;
    box-shadow: 0 4px 12px rgba(99,102,241,.35);
  }

  /* ── 도서 카드 ── */
  .book-card {
    background: #fff; border-radius: 16px; padding: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,.06); border: 1px solid #e8eaff;
    animation: fadeUp .4s ease both;
    transition: box-shadow .2s, transform .2s;
  }
  .book-card:hover { box-shadow: 0 8px 28px rgba(99,102,241,.15); transform: translateY(-2px); }
  .book-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .cat-badge {
    font-size: 11px; font-weight: 700; padding: 3px 10px;
    background: #eef2ff; color: #6366f1; border-radius: 999px;
  }
  .star { color: #f59e0b; font-size: 18px; }
  .book-title  { font-size: 16px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
  .book-author { font-size: 12px; color: #94a3b8; margin-bottom: 10px; }
  .book-desc   { font-size: 12px; color: #475569; line-height: 1.65; }

  /* ── 활동 카드 ── */
  .activity-card {
    background: #fff; border-radius: 16px; overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,.06); border: 1px solid #e8eaff;
  }
  .activity-header {
    background: linear-gradient(135deg, #312e81, #6366f1);
    padding: 14px 22px;
  }
  .activity-cat { color: #fff; font-size: 15px; font-weight: 700; }
  .activity-body { padding: 18px 22px; display: flex; flex-direction: column; gap: 14px; }
  .activity-item { padding-bottom: 14px; border-bottom: 1px solid #f1f5f9; }
  .activity-item:last-child { border-bottom: none; padding-bottom: 0; }
  .activity-item p { font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 7px; }
  .imp-high {
    font-size: 11px; font-weight: 700; padding: 3px 10px;
    border-radius: 999px; background: #fee2e2; color: #b91c1c;
  }
  .imp-mid {
    font-size: 11px; font-weight: 700; padding: 3px 10px;
    border-radius: 999px; background: #fef3c7; color: #92400e;
  }

  /* ── 꿀팁 ── */
  .tip-banner {
    background: linear-gradient(135deg, #064e3b, #065f46);
    border-radius: 20px; padding: 36px 40px; color: #fff;
  }
  .tip-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
  .tip-icon { font-size: 32px; }
  .tip-header h2 {
    font-family: 'Gmarket Sans', sans-serif;
    font-size: 22px; font-weight: 700;
  }
  .tip-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
  .tip-list li { display: flex; align-items: flex-start; gap: 16px; font-size: 15px; line-height: 1.6; }
  .tip-num {
    font-size: 11px; font-weight: 700; letter-spacing: 1px;
    color: #6ee7b7; background: rgba(255,255,255,.1);
    border-radius: 6px; padding: 3px 8px; flex-shrink: 0; margin-top: 1px;
  }

  /* ── 푸터 ── */
  .site-footer {
    text-align: center; padding: 28px;
    font-size: 13px; color: #94a3b8;
    border-top: 1px solid #e2e8f0;
    background: #fff;
  }

  /* ── 애니메이션 ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 640px) {
    .section-hero { flex-direction: column; padding: 28px 24px; }
    .hero-accent { display: none; }
    .main { padding: 32px 16px 48px; }
    .tip-banner { padding: 28px 24px; }
  }
`;
