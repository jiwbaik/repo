"""
생기부 치트키 - 파이썬 표준 라이브러리 전용 (외부 패키지 불필요)
실행: python saenggibu.py
접속: http://localhost:8000
"""

import json
import webbrowser
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

# ── 데이터 ──────────────────────────────────────────────────────────────────

BOOKS = {
    "과학/공학": [
        {"title": "이기적 유전자",   "author": "리처드 도킨스",     "desc": "진화생물학 · 유전자 중심 진화론 · 이타성의 생물학적 기원"},
        {"title": "코스모스",        "author": "칼 세이건",         "desc": "우주론 · 빅뱅 · 생명의 기원 · 천문학 · 우리는 별의 먼지"},
        {"title": "엔트로피",        "author": "제레미 리프킨",     "desc": "열역학 제2법칙 · 에너지 위기 · 환경 파괴 · 지속가능성"},
        {"title": "침묵의 봄",       "author": "레이첼 카슨",       "desc": "환경운동 원조 · DDT 고발 · 생태계 파괴 · 화학 살충제의 위험"},
        {"title": "과학혁명의 구조", "author": "토마스 쿤",         "desc": "패러다임 전환 · 과학철학 · 정상과학 · 혁명적 발전"},
        {"title": "총, 균, 쇠",      "author": "재레드 다이아몬드", "desc": "문명 발전 · 지리적 결정론 · 가축화 · 대륙의 축 방향"},
    ],
    "인문/사회": [
        {"title": "정의란 무엇인가", "author": "마이클 샌델",   "desc": "정치철학 · 공리주의 · 자유지상주의 · 전차 딜레마 · 롤스 정의론"},
        {"title": "사피엔스",        "author": "유발 하라리",   "desc": "인류사 · 인지혁명 · 농업혁명 · 과학혁명 · 허구를 믿는 능력"},
        {"title": "문명의 충돌",     "author": "새뮤얼 헌팅턴", "desc": "탈냉전 · 문명권 충돌 · 서구 vs 이슬람 · 세계 질서 재편"},
        {"title": "군주론",          "author": "마키아벨리",    "desc": "현실주의 정치철학 · 권력 획득 · 목적과 수단 · 마키아벨리즘"},
        {"title": "국가론",          "author": "플라톤",        "desc": "이상 국가 · 철인왕 · 동굴의 비유 · 이데아론 · 정의의 본질"},
        {"title": "1984",            "author": "조지 오웰",     "desc": "디스토피아 · 빅브라더 · 전체주의 · 감시 사회 · 이중사고"},
    ],
    "경영/경제": [
        {"title": "국부론",           "author": "애덤 스미스",   "desc": "보이지 않는 손 · 시장 메커니즘 · 분업 · 자유무역 · 자본주의 토대"},
        {"title": "자본론",           "author": "카를 마르크스", "desc": "노동가치설 · 잉여가치론 · 자본축적 · 착취 구조 · 사회주의 혁명"},
        {"title": "넛지",             "author": "리처드 탈러",   "desc": "행동경제학 · 선택 설계 · 자유주의적 개입 · 정책 적용"},
        {"title": "생각에 관한 생각", "author": "대니얼 카너먼", "desc": "이중 체계 · 시스템1/2 · 확증편향 · 앵커링 · 인지 편향"},
        {"title": "21세기 자본",      "author": "토마 피케티",   "desc": "r > g · 불평등 심화 · 부의 세습 · 자본세 · 200년 데이터"},
        {"title": "경제학 콘서트",    "author": "팀 하포드",     "desc": "일상 속 경제학 · 희소성 · 가격차별 · 게임이론 · 경제학 입문"},
    ],
    "예체능": [
        {"title": "미학 오디세이",       "author": "진중권",       "desc": "서양미학사 · 이데아 · 숭고미 · 예술철학 · 미의 본질"},
        {"title": "서양미술사",          "author": "곰브리치",     "desc": "동굴벽화→현대미술 · 역사적 맥락 · 회화 발전 · 미술사 교양"},
        {"title": "예술의 위로",         "author": "알랭 드 보통", "desc": "예술의 치유 · 인생의 7가지 문제 · 고흐·베토벤 · 실용적 가치"},
        {"title": "나의 문화유산답사기", "author": "유홍준",       "desc": "한국 문화재 · 사찰·석탑·불상 · 아는 만큼 보인다 · 답사 여행"},
    ],
}

STRATEGIES = [
    {
        "icon": "🎯", "title": "구체적인 활동 기록",
        "desc": "단순 참여가 아닌 \"무엇을 배웠고, 어떻게 성장했는지\" 서술",
        "example": "× 봉사활동 참여\n✓ 노인복지관 봉사를 통해 고령화 사회 문제를 인식하고 사회복지학 진로 확정",
    },
    {
        "icon": "📈", "title": "성장의 스토리라인",
        "desc": "1학년 → 2학년 → 3학년 동안의 발전 과정을 연결",
        "example": "1학년: 관심 발견 → 2학년: 심화 탐구 → 3학년: 실질적 프로젝트",
    },
    {
        "icon": "🔗", "title": "활동 간 연계성",
        "desc": "독서-탐구-동아리-봉사를 하나의 관심사로 엮기",
        "example": "환경 독서 → 환경동아리 → 지역 환경조사 → 캠페인 기획",
    },
    {
        "icon": "💡", "title": "전공적합성 강조",
        "desc": "희망 전공과 활동의 연결고리 명확히",
        "example": "의대 지망: 생명과학 실험 → 의료봉사 → 의학 도서 탐독",
    },
]

ACTIVITIES = {
    "과학": [
        {"activity": "R&E(Research & Education) 프로그램 참여", "impact": "높음"},
        {"activity": "과학실험 동아리 + 탐구보고서 작성",       "impact": "높음"},
    ],
    "인문": [
        {"activity": "토론동아리 & 인문학 독서 세미나",         "impact": "높음"},
        {"activity": "역사/철학 에세이 대회 참가",              "impact": "중간"},
    ],
    "사회": [
        {"activity": "모의유엔(MUN) 또는 경제동아리",           "impact": "높음"},
        {"activity": "사회문제 해결 프로젝트 기획 및 실행",     "impact": "높음"},
    ],
    "봉사": [
        {"activity": "지속적이고 의미있는 봉사 (1회성 지양)",       "impact": "중간"},
        {"activity": "진로 연계 봉사활동 (교육봉사, 의료봉사 등)", "impact": "높음"},
    ],
    "자율": [
        {"activity": "진로 관련 프로젝트형 활동",   "impact": "높음"},
        {"activity": "학술제/전시회 기획 및 발표",  "impact": "중간"},
    ],
    "독서": [
        {"activity": "전공 연계 독서 + 심화 독후감", "impact": "중간"},
        {"activity": "독서토론회 주도 및 서평 작성", "impact": "중간"},
    ],
}

TIPS = [
    "양보다 질! 3년간 일관된 관심사를 깊게 파는 것이 유리",
    "선생님께 구체적인 활동 내용 전달 → 세특 퀄리티 상승",
    "학년별 성장 곡선을 만들어라 (1학년 기초 → 3학년 심화)",
    "활동 후 반드시 보고서/포트폴리오 정리 (면접 대비)",
]

# ── HTML 생성 ────────────────────────────────────────────────────────────────

def build_strategy_cards():
    cards = ""
    for s in STRATEGIES:
        example = s["example"].replace("\n", "&#10;")
        cards += f"""
        <div class="card">
          <div class="strat">
            <span class="strat-icon">{s['icon']}</span>
            <div class="strat-body">
              <h3>{s['title']}</h3>
              <p>{s['desc']}</p>
              <div class="example">{example}</div>
            </div>
          </div>
        </div>"""
    return cards


def build_activity_cards():
    cards = ""
    for cat, items in ACTIVITIES.items():
        rows = ""
        for item in items:
            cls = "imp-high" if item["impact"] == "높음" else "imp-mid"
            rows += f"""
            <div class="act-item">
              <p>{item['activity']}</p>
              <span class="{cls}">임팩트: {item['impact']}</span>
            </div>"""
        cards += f"""
        <div class="act-card">
          <div class="act-head"><h3>{cat}</h3></div>
          <div class="act-body">{rows}</div>
        </div>"""
    return cards


def build_filter_buttons():
    categories = ["전체"] + list(BOOKS.keys())
    btns = ""
    for cat in categories:
        active = ' class="active"' if cat == "전체" else ""
        btns += f'<button{active} onclick="filterBooks(\'{cat}\')" data-cat="{cat}">{cat}</button>'
    return btns


def build_tips():
    return "".join(f"<li>▸ {tip}</li>" for tip in TIPS)


def render_html():
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>생기부 치트키</title>
  <style>
    *,*::before,*::after{{box-sizing:border-box;margin:0;padding:0;}}
    body{{font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;
          background:linear-gradient(135deg,#eff6ff 0%,#faf5ff 50%,#fdf2f8 100%);
          min-height:100vh;color:#111827;}}
    .wrap{{max-width:1100px;margin:0 auto;padding:40px 20px 60px;}}
    header{{text-align:center;margin-bottom:48px;}}
    header h1{{font-size:32px;font-weight:800;margin-bottom:10px;line-height:1.3;}}
    header p{{font-size:16px;color:#6B7280;}}
    section{{margin-bottom:52px;}}
    .sec-title{{display:flex;align-items:center;gap:10px;margin-bottom:20px;}}
    .sec-title h2{{font-size:22px;font-weight:800;}}
    .hero{{background:linear-gradient(135deg,#2563EB,#7C3AED);border-radius:20px;
           padding:30px 34px;color:#fff;margin-bottom:24px;}}
    .hero h2{{font-size:24px;font-weight:800;margin-bottom:10px;}}
    .hero p{{font-size:17px;}} .hero u{{font-weight:800;}}
    .grid-2{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px;}}
    .grid-3{{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;}}
    .card{{background:#fff;border-radius:16px;padding:22px;
           box-shadow:0 2px 12px rgba(0,0,0,.07);border:1px solid #E5E7EB;}}
    .strat{{display:flex;gap:14px;align-items:flex-start;}}
    .strat-icon{{font-size:34px;line-height:1;}}
    .strat-body h3{{font-size:16px;font-weight:700;margin-bottom:6px;}}
    .strat-body p{{font-size:13px;color:#374151;margin-bottom:10px;}}
    .example{{background:#F9FAFB;border-radius:10px;padding:10px 12px;
              font-size:12px;color:#1F2937;white-space:pre-line;
              font-family:monospace;line-height:1.6;}}
    .filters{{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px;}}
    .filters button{{padding:7px 18px;border-radius:999px;font-weight:600;font-size:13px;
                     border:1px solid #D1D5DB;background:#fff;color:#374151;cursor:pointer;transition:all .2s;}}
    .filters button.active{{background:linear-gradient(135deg,#7C3AED,#2563EB);
                             color:#fff;border:none;box-shadow:0 4px 12px rgba(124,58,237,.3);}}
    .book-header{{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}}
    .badge{{font-size:11px;font-weight:700;padding:3px 10px;background:#EDE9FE;color:#6D28D9;border-radius:999px;}}
    .book-title{{font-size:17px;font-weight:800;margin-bottom:3px;}}
    .book-author{{font-size:12px;color:#9CA3AF;margin-bottom:8px;}}
    .book-desc{{font-size:12px;color:#4B5563;line-height:1.6;}}
    .act-card{{background:#fff;border-radius:16px;overflow:hidden;
               box-shadow:0 2px 10px rgba(0,0,0,.07);border:1px solid #E5E7EB;}}
    .act-head{{background:linear-gradient(135deg,#2563EB,#7C3AED);padding:13px 20px;}}
    .act-head h3{{color:#fff;font-weight:800;font-size:16px;}}
    .act-body{{padding:16px 20px;}}
    .act-item{{padding-bottom:12px;margin-bottom:12px;border-bottom:1px solid #F3F4F6;}}
    .act-item:last-child{{border-bottom:none;padding-bottom:0;margin-bottom:0;}}
    .act-item p{{font-size:13px;font-weight:600;margin-bottom:6px;}}
    .imp-high{{font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;background:#FEE2E2;color:#B91C1C;}}
    .imp-mid{{font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;background:#FEF3C7;color:#92400E;}}
    .tip-banner{{background:linear-gradient(135deg,#10B981,#0D9488);border-radius:20px;padding:30px 34px;color:#fff;}}
    .tip-banner h2{{font-size:20px;font-weight:800;margin-bottom:18px;}}
    .tip-list{{list-style:none;display:flex;flex-direction:column;gap:12px;}}
    .tip-list li{{display:flex;align-items:flex-start;gap:8px;font-size:15px;}}
    #loading{{text-align:center;color:#7C3AED;font-size:14px;padding:20px 0;display:none;}}
  </style>
</head>
<body>
<div class="wrap">

  <header>
    <h1>🏫 우리 학교 생기부 치트키</h1>
    <p>합격으로 가는 생활기록부 작성 완벽 가이드</p>
  </header>

  <!-- 필승 전략 -->
  <section>
    <div class="hero">
      <h2>🎯 생기부 필승 전략</h2>
      <p>"단순 나열이 아니라 <u>'성장 과정'</u>을 보여주세요!"</p>
    </div>
    <div class="grid-2">{build_strategy_cards()}</div>
  </section>

  <!-- 추천 도서 -->
  <section>
    <div class="sec-title">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
      <h2>계열별 추천 도서</h2>
    </div>
    <div class="filters">{build_filter_buttons()}</div>
    <div id="loading">불러오는 중…</div>
    <div class="grid-3" id="books-grid"></div>
  </section>

  <!-- 추천 활동 -->
  <section>
    <div class="sec-title">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
      <h2>임팩트 있는 활동 추천</h2>
    </div>
    <div class="grid-2">{build_activity_cards()}</div>
  </section>

  <!-- 핵심 꿀팁 -->
  <section>
    <div class="tip-banner">
      <h2>💡 핵심 꿀팁</h2>
      <ul class="tip-list">{build_tips()}</ul>
    </div>
  </section>

</div>
<script>
  const BOOKS = {json.dumps(BOOKS, ensure_ascii=False)};

  function renderBooks(books) {{
    const grid = document.getElementById('books-grid');
    if (!books.length) {{ grid.innerHTML = '<p style="color:#9CA3AF">도서가 없습니다.</p>'; return; }}
    grid.innerHTML = books.map(b => `
      <div class="card">
        <div class="book-header">
          <span class="badge">${{b.category}}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <div class="book-title">${{b.title}}</div>
        <div class="book-author">${{b.author}}</div>
        <div class="book-desc">${{b.desc}}</div>
      </div>`).join('');
  }}

  function filterBooks(category) {{
    document.querySelectorAll('.filters button').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.cat === category));

    let list;
    if (category === '전체') {{
      list = Object.entries(BOOKS).flatMap(([cat, items]) =>
        items.map(i => ({{...i, category: cat}})));
    }} else {{
      list = (BOOKS[category] || []).map(i => ({{...i, category}}));
    }}
    renderBooks(list);
  }}

  filterBooks('전체');
</script>
</body>
</html>"""


# ── HTTP 핸들러 ──────────────────────────────────────────────────────────────

class Handler(BaseHTTPRequestHandler):

    def log_message(self, fmt, *args):
        print(f"  {self.address_string()} - {fmt % args}")

    def send(self, code, content_type, body):
        data = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        parsed = urlparse(self.path)
        path   = parsed.path
        params = parse_qs(parsed.query)

        # 메인 페이지
        if path == "/":
            self.send(200, "text/html", render_html())

        # 도서 API
        elif path == "/api/books":
            category = params.get("category", ["전체"])[0]
            if category == "전체":
                result = [
                    {**book, "category": cat}
                    for cat, items in BOOKS.items()
                    for book in items
                ]
            elif category in BOOKS:
                result = [{**book, "category": category} for book in BOOKS[category]]
            else:
                self.send(404, "application/json", json.dumps({"error": "없는 계열"}, ensure_ascii=False))
                return
            self.send(200, "application/json", json.dumps(result, ensure_ascii=False))

        else:
            self.send(404, "text/plain", "Not Found")


# ── 진입점 ───────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    HOST, PORT = "localhost", 8000
    server = HTTPServer((HOST, PORT), Handler)
    url = f"http://{HOST}:{PORT}"
    print("=" * 50)
    print("  🏫 생기부 치트키 서버 시작!")
    print(f"  접속 주소: {url}")
    print("  종료: Ctrl+C")
    print("=" * 50)
    webbrowser.open(url)   # 브라우저 자동 열기
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n서버를 종료합니다.")
        server.shutdown()
