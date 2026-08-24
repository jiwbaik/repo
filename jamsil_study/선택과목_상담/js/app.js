// ══════════════════════════════════════
// 선택과목 상담 - 데이터
// ══════════════════════════════════════

// 1학년(→2학년) 과목 데이터 (이름, 유형, 학기, 설명)
const SUBJECTS_G1 = {
  "1학기": {
    "📚 국어": [
      { name:"독서토론과 글쓰기", type:"융합", desc:"듣기·말하기, 읽기, 쓰기 영역을 심화·확장한 과목으로, 다양한 분야의 책이나 자료를 읽고 토론하며 글을 쓰는 능력을 기르는 과목입니다." }
    ],
    "📐 수학": [
      { name:"기하", type:"진로", desc:"평면도형과 공간도형의 성질을 좌표와 벡터를 이용하여 탐구하고, 논리적 추론 능력과 공간 감각을 기르는 과목입니다." }
    ],
    "🇬🇧 영어": [
      { name:"영미문학 읽기", type:"진로", desc:"시, 희곡, 소설 등 영어로 쓰인 다양한 장르의 문학 작품 감상을 통해 영어 능력을 확장하고 작품에 대한 생각과 느낌을 비판적·창의적으로 표현하는 능력을 기르는 과목입니다." }
    ],
    "🌏 사회": [
      { name:"세계사", type:"일반", desc:"오늘날의 세계가 만들어지기까지 각 지역의 발전 과정 및 고유한 역사적 특성과 문화를 파악하는 과목입니다." },
      { name:"사회와 문화", type:"일반", desc:"사회·문화 현상을 탐구하는 다양한 관점과 연구 방법을 익히고, 사회 구조와 변동, 문화, 일탈 등의 주제를 다루는 과목입니다." },
      { name:"정치", type:"진로", desc:"서로 다른 생각을 가진 사람들이 대화와 타협을 통해 공동의 문제를 해결해 나가는 과정을 배우는 과목입니다." },
      { name:"세계시민과 지리", type:"일반", desc:"지구촌의 다양한 자연환경과 인간 생활의 모습을 공간적 관점에서 탐구하는 과목입니다." },
      { name:"현대사회와 윤리", type:"일반", desc:"현대 사회의 다양한 윤리 문제를 탐구하고, 올바른 가치관과 도덕적 판단력을 기르는 과목입니다." }
    ],
    "🔬 과학": [
      { name:"물리학", type:"일반", desc:"자연의 근본 법칙 탐구에서 얻는 지적 즐거움을 바탕으로, 물리학 이론 및 첨단 기술을 이해하고 과학적 문제를 해결하는 과목입니다." },
      { name:"화학", type:"일반", desc:"일상생활이나 자연 현상에 적용되는 물질 세계의 기본 법칙을 다루고, 개인과 사회의 문제를 해결할 때 필요한 화학적 소양을 기르는 과목입니다." },
      { name:"생명과학", type:"일반", desc:"우리 몸의 작동 원리와 생명의 다양성을 이해하고, 세포부터 생태계까지 생명의 원리를 자연과 일상 속에서 탐구하는 과목입니다." }
    ],
    "💻 기술·가정·정보": [
      { name:"정보", type:"일반", desc:"소프트웨어의 원리와 가치를 이해하고, 컴퓨팅 사고력을 바탕으로 문제를 해결하며 정보 사회에서 필요한 역량을 기르는 과목입니다." }
    ],
    "🌐 제2외국어/한문": [
      { name:"일본어Ⅰ", type:"일반", desc:"일본어의 기초 의사소통 능력을 기르고, 일본의 언어와 문화에 대한 기본적인 이해를 높이는 과목입니다." },
      { name:"중국어Ⅰ", type:"일반", desc:"중국어의 기초 의사소통 능력을 기르고, 중국의 언어와 문화에 대한 기본적인 이해를 높이는 과목입니다." }
    ],
    "🎨 예술 (학기별 1개 필수)": [
      { name:"음악 연주와 창작", type:"진로", desc:"가창, 연주, 창작 활동을 통해 내 생각과 느낌을 음악으로 표현하는 방법을 배우는 과목입니다." },
      { name:"미술 창작", type:"진로", desc:"당연하게 보던 세상을 나만의 특별한 시선으로 다시 발견하고 표현하는 과목입니다." }
    ]
  },
  "2학기": {
    "📚 국어": [
      { name:"문학과 영상", type:"진로", desc:"문학 영역과 매체 영역 관련 내용을 통합적으로 심화·확장한 과목으로, 교육, 연구, 창작 문화 산업 등 관련 분야의 역량을 키우는 과목입니다." }
    ],
    "📐 수학": [
      { name:"수학과제탐구", type:"융합", desc:"수학적 탐구 방법으로 주변의 다양한 현상 속에서 수학적 문제를 발견하고 해결하는 경험을 통해 수학적 사고력과 문제해결력을 기르는 과목입니다." }
    ],
    "🇬🇧 영어": [
      { name:"영어발표와 토론", type:"진로", desc:"영어 듣기와 말하기 기능의 심화 과목으로, 기본적인 영어 구사 능력을 바탕으로 다양한 상황에서 적절한 의사소통을 할 수 있는 능력을 기르는 과목입니다." }
    ],
    "🌏 사회": [
      { name:"동아시아 역사기행", type:"진로", desc:"한국과 동아시아 각국의 역사적 관계와 상호 교류를 탐구하고, 역사적 장소와 유적을 통해 동아시아의 역사를 이해하는 과목입니다." },
      { name:"법과 사회", type:"진로", desc:"우리 사회의 다양한 법 현상을 이해하고, 법적 사고력과 민주 시민으로서의 권리 의식을 기르는 과목입니다." },
      { name:"경제", type:"진로", desc:"내가 가진 돈을 가장 똑똑하게 쓰는 방법을 배우고, 우리 주변의 물건값이나 은행 이자가 변하는 이유를 이해하는 과목입니다." },
      { name:"기후변화와 지속가능한 세계", type:"융합", desc:"기후 변화와 지속가능한 발전을 주제로 환경·사회·경제적 측면을 융합적으로 탐구하는 과목입니다." },
      { name:"윤리문제 탐구", type:"융합", desc:"인공지능부터 기후 위기까지, 우리 사회의 생생한 윤리적 이슈에 대해 주체적으로 탐구하고 판단하는 과목입니다." }
    ],
    "🔬 과학": [
      { name:"지구과학", type:"일반", desc:"지구와 우주의 다양한 현상을 탐구하고, 지구 시스템의 구성 요소와 상호작용을 이해하는 과목입니다." },
      { name:"역학과 에너지", type:"진로", desc:"인공위성의 운동을 예측하는 것부터 블랙홀의 시공간 왜곡까지, 거시 세계를 움직이는 힘과 에너지의 원리를 탐구하는 과목입니다. (물리학 선행 필요)" },
      { name:"물질과 에너지", type:"진로", desc:"물질 변화와 에너지의 관계를 중심으로 화학 개념과 법칙을 탐구하며 과학적 소양과 진로 탐색 역량을 함양하는 과목입니다. (화학 선행 필요)" },
      { name:"세포와 물질대사", type:"진로", desc:"생명의 기본 단위인 세포의 구조와 기능을 이해하고, 생명체가 광합성과 세포호흡을 통해 에너지를 만들고 사용하는 원리를 배우는 과목입니다. (생명과학 선행 필요)" }
    ],
    "💻 기술·가정·정보": [
      { name:"데이터 과학", type:"진로", desc:"데이터를 수집·분석·시각화하는 방법을 배우고, 데이터 기반의 문제 해결 능력과 컴퓨팅 사고력을 기르는 과목입니다." }
    ],
    "🌐 제2외국어/한문": [
      { name:"일본어 회화", type:"진로", desc:"일본어로 일상적인 의사소통을 할 수 있는 능력을 기르고, 일본 문화에 대한 이해를 심화하는 과목입니다. (일본어Ⅰ 선행 필요)" },
      { name:"중국어 회화", type:"진로", desc:"중국어로 일상적인 의사소통을 할 수 있는 능력을 기르고, 중국 문화에 대한 이해를 심화하는 과목입니다. (중국어Ⅰ 선행 필요)" }
    ],
    "🎨 예술 (학기별 1개 필수)": [
      { name:"음악과 미디어", type:"융합", desc:"다양한 미디어 환경에서 음악을 감상하고 창작하며, 음악과 기술의 융합을 이해하는 과목입니다." },
      { name:"미술과 매체", type:"융합", desc:"다양한 매체를 활용하여 미술 작품을 창작하고, 미술과 미디어의 관계를 탐구하는 과목입니다." }
    ]
  }
};

// 2학년(→3학년) 과목 데이터
const SUBJECTS_G2 = {
  "1학기": {
    "📚 국어": [
      { name:"주제 탐구 독서", type:"진로", desc:"읽기 영역을 심화·확장한 과목으로, 주제를 깊이 탐구하는 독서 경험을 통해 자신만의 관점과 견해를 만들고, 스스로 학업과 진로에 필요한 읽기·쓰기 역량을 함양하는 과목입니다." }
    ],
    "📐 수학": [
      { name:"확률과 통계", type:"일반", desc:"확률과 통계의 기본 개념을 이해하고, 자료를 수집·분석·해석하여 합리적인 의사결정을 할 수 있는 능력을 기르는 과목입니다." },
      { name:"미적분Ⅱ", type:"진로", desc:"미적분Ⅰ에서 다루던 단순한 곡선을 넘어, 훨씬 다채롭고 복잡한 모양의 그래프를 직접 그려내고 분석하는 과목입니다." }
    ],
    "🇬🇧 영어": [
      { name:"영어 독해와 작문", type:"일반", desc:"영어 읽기와 쓰기를 중점적으로 학습하여 일상생활이나 사회생활에서 필요로 하는 영어 능력을 기르는 과목입니다." },
      { name:"세계 문화와 영어", type:"융합", desc:"세계 영어를 통해 나타나는 다양한 문화 현상과 문화적 산물을 이해하고 자신의 문화적 정체성을 확립하는 과목입니다." }
    ],
    "🌏 사회": [
      { name:"역사로 탐구하는 현대 세계", type:"융합", desc:"현대 세계의 주요 사건과 쟁점을 역사적 관점에서 탐구하고, 비판적 사고력과 역사적 상상력을 기르는 과목입니다." },
      { name:"법과 사회", type:"진로", desc:"우리 사회의 다양한 법 현상을 이해하고, 법적 사고력과 민주 시민으로서의 권리 의식을 기르는 과목입니다." },
      { name:"사회문제 탐구", type:"융합", desc:"우리 주변에서 관찰할 수 있는 다양한 사회 문제의 원인과 해결책을 찾아보는 과목입니다." },
      { name:"도시의 미래 탐구", type:"진로", desc:"도시에 대한 지리적 이해를 바탕으로 세계 여러 도시의 역동적인 변화를 탐구하는 과목입니다." },
      { name:"윤리와 사상", type:"진로", desc:"동서양의 다양한 윤리 사상을 탐구하고, 현대 사회의 윤리 문제를 해결하기 위한 철학적 사고력을 기르는 과목입니다. (세계시민과 윤리 선행 필요)" }
    ],
    "🔬 과학": [
      { name:"전자기와 양자", type:"진로", desc:"스마트폰 속 반도체부터 양자 컴퓨터까지, 보이지 않는 미시 세계의 기묘한 법칙으로 현대 문명의 미래를 탐구하는 과목입니다. (물리학 선행 필요)" },
      { name:"물질과 에너지", type:"진로", desc:"물질 변화와 에너지의 관계를 중심으로 화학 개념과 법칙을 탐구하는 과목입니다. (화학 선행 필요)" },
      { name:"화학 반응의 세계", type:"진로", desc:"화학 반응의 원리와 법칙을 탐구하고, 이를 실생활과 산업에 적용하는 과목입니다. (화학 선행 필요)" },
      { name:"생물의 유전", type:"진로", desc:"생명의 설계도인 유전물질부터 유전자 발현의 원리, 그리고 생명공학기술과 생명윤리를 배우며 생명현상을 탐구하는 과목입니다. (생명과학 선행 필요)" },
      { name:"행성우주과학", type:"진로", desc:"태양계와 우주의 구조를 탐구하고, 천문학적 현상을 과학적으로 이해하는 과목입니다. (지구과학 선행 필요)" }
    ],
    "💻 기술·가정·정보": [
      { name:"인공지능 기초", type:"진로", desc:"인공지능이 데이터를 바탕으로 어떻게 학습하고 판단하는지 이해하고, 인공지능 기술을 활용하여 문제를 해결하는 과목입니다." }
    ],
    "🌐 제2외국어/한문": [
      { name:"심화 일본어", type:"진로", desc:"일본어의 심화된 의사소통 능력을 기르고, 일본 사회와 문화에 대한 깊은 이해를 추구하는 과목입니다. (일본어Ⅰ 선행 필요)" }
    ],
    "🎨 예술 (예체능 계열만)": [
      { name:"음악 감상과 비평(1학기)", type:"진로", desc:"영화, 드라마, 공연, 대중음악 등 다양한 음악을 듣고 그 음악의 특징을 분석하고 비평하는 과목입니다." },
      { name:"미술 감상과 비평(1학기)", type:"진로", desc:"미술 작품 속에 숨겨진 의미와 이야기를 발견하고, 나만의 관점으로 해석하는 과목입니다." }
    ],
    "🧠 교양 (학기별 1개 필수)": [
      { name:"진로와 직업", type:"일반", desc:"자신의 진로를 탐색하고, 직업 세계의 변화를 이해하며 자신에게 맞는 진로를 설계하는 과목입니다." },
      { name:"논리와 사고", type:"진로", desc:"논리적 사고의 원리를 이해하고, 이를 바탕으로 비판적·창의적으로 사고하는 능력을 기르는 과목입니다." }
    ]
  },
  "2학기": {
    "📐 수학": [
      { name:"경제 수학", type:"진로", desc:"경제 현상을 수학적으로 분석하고 해석하는 능력을 기르며, 수학과 경제의 융합적 사고력을 키우는 과목입니다." },
      { name:"수학과 문화", type:"융합", desc:"수학이라는 도구로 인류 문명의 발자취를 따라가며, 우리 삶 곳곳에 스며든 수학의 지혜와 이야기를 즐겁게 풀어가는 과목입니다." }
    ],
    "🇬🇧 영어": [
      { name:"심화 영어", type:"진로", desc:"일상생활에 필요한 의사소통 능력을 심화하고 기초 학문 분야를 포함한 다양한 주제와 관련된 영어 능력을 기르는 과목입니다." },
      { name:"미디어 영어", type:"융합", desc:"다양한 미디어를 활용하여 영어 의사소통 능력을 기르고, 미디어 리터러시를 함양하는 과목입니다." }
    ],
    "🌏 사회": [
      { name:"세계 역사와 문화", type:"진로", desc:"세계 여러 지역의 역사와 문화를 탐구하고, 글로벌 시대에 필요한 문화적 소양을 기르는 과목입니다." },
      { name:"금융과 경제생활", type:"융합", desc:"금융과 경제의 기본 개념을 이해하고, 합리적인 경제 생활을 영위하는 능력을 기르는 과목입니다." },
      { name:"여행지리", type:"융합", desc:"세계 여러 지역에서 나타나는 다양한 자연경관과 인문경관에 대한 이해를 바탕으로 지리적 상상력을 기르는 과목입니다." },
      { name:"인문학과 윤리", type:"진로", desc:"동서양 고전을 통해 나를 깊이 있게 이해하고, 우정과 사랑, 정의 등 우리 삶의 근본적인 가치를 탐구하는 과목입니다." }
    ],
    "🔬 과학": [
      { name:"기후변화와 환경생태", type:"융합", desc:"기후 변화와 생태계의 관계를 탐구하고, 지속가능한 미래를 위한 환경 보전의 중요성을 이해하는 과목입니다." },
      { name:"과학의 역사와 문화", type:"융합", desc:"인류 문명을 바꾼 결정적 과학 현장을 탐구하고, 미래 기술 사회 속 과학의 역할과 가치를 발견하는 과목입니다." }
    ],
    "💻 기술·가정·정보": [
      { name:"소프트웨어와 생활", type:"융합", desc:"소프트웨어를 활용해 생활 속 문제를 해결하고, 창작·분석·시뮬레이션·개발 활동을 통해 디지털 소양을 기르는 과목입니다." }
    ],
    "🌐 제2외국어/한문": [
      { name:"일본 문화", type:"융합", desc:"일본의 역사, 사회, 문화를 탐구하고, 일본어로 문화적 소통을 할 수 있는 능력을 기르는 과목입니다. (일본어Ⅰ 선행 필요)" }
    ],
    "🎨 예술 (예체능 계열만)": [
      { name:"음악 감상과 비평(1학기)", type:"진로", desc:"영화, 드라마, 공연, 대중음악 등 다양한 음악을 듣고 그 음악의 특징을 분석하고 비평하는 과목입니다." },
      { name:"미술 감상과 비평(1학기)", type:"진로", desc:"미술 작품 속에 숨겨진 의미와 이야기를 발견하고, 나만의 관점으로 해석하는 과목입니다." }
    ],
    "🧠 교양 (학기별 1개 필수)": [
      { name:"논술", type:"융합", desc:"다양한 주제에 대해 자신의 생각을 논리적으로 서술하고, 창의적인 사고력과 표현력을 기르는 과목입니다." },
      { name:"인간과 경제활동", type:"융합", desc:"경제 활동의 기본 원리를 인간의 삶과 연결하여 이해하고, 합리적인 경제적 의사결정 능력을 기르는 과목입니다." }
    ]
  }
};

// 선택과목 규칙
const SUBJECT_RULES = `📋 수강 신청 시 유의사항

1. 국어, 수학, 영어 교과의 이수 학점 총합은 3년간 81학점 이하여야 합니다. (학교지정 52학점)
   - 교과 이수 학점이 174학점을 초과하는 경우(공동교육과정 이수 등)에는 초과 이수 학점의 50%를 넘지 않도록 해야 합니다.

2. 선택 과목 중 내용 상의 위계가 있는 과목은 2학년에서 수강하는 일반선택과목에 따라 관련 진로선택, 융합선택 과목을 선택하시기 바랍니다.
   예시) (일반선택) 물리학 >> (진로선택) 역학과 에너지, 전자기와 양자
         (일반선택) 화학 >> (진로선택) 물질과 에너지, 화학반응의 세계

3. 필수이수학점 충족을 위해 2, 3학년에서 기술·가정/정보/제2외국어/한문/교양 최소 16학점(6~7과목) 이상, 예술 교과 2과목(4학점) 이상을 선택해야 합니다.

4. 대학별 입학처의 학과별 권장 이수 과목을 확인하시기 바랍니다.

5. 각 선택 과목의 평가 방식을 반드시 확인하시기 바랍니다.`;

const TRACKS_DATA = {
  stem: { label: '이과', majors: [
    { id:'s1', name:'의학계열', detail:'의학, 약학, 간호학, 치의학 등\n관련직업: 의사, 약사, 간호사, 치과의사' },
    { id:'s2', name:'공학계열', detail:'컴퓨터공학, 전기전자, 기계공학 등\n관련직업: 개발자, 엔지니어, 연구원' },
    { id:'s3', name:'자연계열', detail:'물리학, 화학, 생명과학, 지구과학 등\n관련직업: 연구원, 과학자, 데이터분석가' },
    { id:'s4', name:'교육계열(이과)', detail:'수학교육, 과학교육, 물리교육 등\n관련직업: 교사, 교수, 교육연구원' },
    { id:'s5', name:'아직 모르겠다', detail:'이과 계열 탐색 중\n적성 파악 후 방향 설정 추천' }
  ]},
  hum: { label: '문과', majors: [
    { id:'h1', name:'상경계열', detail:'경영학, 경제학, 무역학, 회계학 등\n관련직업: 경영인, 금융인, 회계사, 컨설턴트' },
    { id:'h2', name:'사회과학계열', detail:'사회학, 심리학, 정치학, 법학 등\n관련직업: 공무원, 법조인, 사회복지사' },
    { id:'h3', name:'인문계열', detail:'국어국문, 영어영문, 사학, 철학 등\n관련직업: 작가, 번역가, 연구원' },
    { id:'h4', name:'교육계열(문과)', detail:'국어교육, 영어교육, 역사교육 등\n관련직업: 교사, 교육행정가' },
    { id:'h5', name:'아직 모르겠다', detail:'문과 계열 탐색 중\n적성 파악 후 방향 설정 추천' }
  ]},
  art: { label: '예체능', majors: [
    { id:'a1', name:'음악', detail:'음악, 실용음악, 음악교육 등\n관련직업: 음악가, 작곡가, 음악 교사' },
    { id:'a2', name:'미술', detail:'미술, 디자인, 미술교육 등\n관련직업: 예술가, 디자이너, 미술 교사' },
    { id:'a3', name:'체육', detail:'체육, 스포츠과학, 체육교육 등\n관련직업: 운동선수, 코치, 체육 교사' }
  ]}
};

// 선행과목 체크 목록 (2학년용)
const PREREQ_LIST = [
  { id:'pre-phys', name:'물리학', unlocks:['전자기와 양자'] },
  { id:'pre-chem', name:'화학', unlocks:['물질과 에너지', '화학 반응의 세계'] },
  { id:'pre-bio', name:'생명과학', unlocks:['생물의 유전'] },
  { id:'pre-earth', name:'지구과학', unlocks:['행성우주과학'] },
  { id:'pre-eth', name:'세계시민과 윤리', unlocks:['윤리와 사상'] },
  { id:'pre-jpn', name:'일본어Ⅰ', unlocks:['심화 일본어', '일본 문화'] }
];

// ══════════════════════════════════════
// 선택과목 상담 - 상태
// ══════════════════════════════════════
let csGrade = null;      // 1 or 2
let csTrack = null;      // 'stem' | 'hum' | 'art'
let csMajorId = null;    // major id
let csMajorName = null;
let prereqChecked = {};  // { 'pre-phys': true, ... }
let chatHist = [];
let isLoading = false;

// ══════════════════════════════════════
// 설정 화면 함수
// ══════════════════════════════════════
function selectGrade(g) {
  csGrade = g;
  document.querySelectorAll('[id^="grade-"]').forEach(b => b.classList.remove('selected'));
  document.getElementById(`grade-${g}`).classList.add('selected');
  document.getElementById('trackSection').style.display = 'block';
  // 계열/세부계열 초기화
  csTrack = null; csMajorId = null; csMajorName = null;
  document.querySelectorAll('[id^="track-"]').forEach(b => b.classList.remove('selected'));
  document.getElementById('majorSection').style.display = 'none';
  document.getElementById('startBtnWrap').style.display = 'none';
}

function selectTrack(t) {
  csTrack = t; csMajorId = null; csMajorName = null;
  document.querySelectorAll('[id^="track-"]').forEach(b => b.classList.remove('selected'));
  document.getElementById(`track-${t}`).classList.add('selected');
  const sec = document.getElementById('majorSection');
  const majors = TRACKS_DATA[t].majors;
  document.getElementById('majorLabel').textContent = t === 'art'
    ? '③ 세부 분야를 선택해주세요'
    : '③ 희망 계열을 선택해주세요';
  document.getElementById('majorBtns').innerHTML = majors.map(m =>
    `<button class="major-btn" id="major-${m.id}" onclick="selectMajor('${m.id}','${m.name}',\`${m.detail}\`)">${m.name}</button>`
  ).join('');
  document.getElementById('majorDetail').style.display = 'none';
  sec.style.display = 'block';
  document.getElementById('startBtnWrap').style.display = 'none';
}

function selectMajor(id, name, detail) {
  csMajorId = id; csMajorName = name;
  document.querySelectorAll('[id^="major-"]').forEach(b => b.classList.remove('selected'));
  document.getElementById(`major-${id}`).classList.add('selected');
  const det = document.getElementById('majorDetail');
  det.innerHTML = detail.replace(/\\n/g,'<br>');
  det.style.display = 'block';
  document.getElementById('startBtnWrap').style.display = 'block';
}

function startConsult() {
  if (!csGrade || !csTrack || !csMajorId) {
    alert('학년, 계열, 세부 계열을 모두 선택해주세요.');
    return;
  }
  // 2학년이면 선행과목 체크 먼저
  if (csGrade === 2) {
    openPrereq();
    return;
  }
  launchChat();
}

function launchChat() {
  document.getElementById('consultSetup').style.display = 'none';
  document.getElementById('consultChat').style.display = 'flex';

  // 요약 표시
  const trackLabel = TRACKS_DATA[csTrack].label;
  document.getElementById('setupSummary').innerHTML =
    `<b>학년:</b> ${csGrade}학년<br><b>계열:</b> ${trackLabel}<br><b>세부:</b> ${csMajorName}`;
  document.getElementById('track-disp').textContent =
    `${csGrade}학년 · ${trackLabel} · ${csMajorName}`;

  // 2학년 선행과목 사이드바 표시
  if (csGrade === 2) {
    const checked = PREREQ_LIST.filter(p => prereqChecked[p.id]);
    document.getElementById('prereqCheck').innerHTML = checked.length
      ? checked.map(p => `✅ ${p.name}`).join('<br>')
      : '선택된 선행과목 없음';
  }

  // 초기 메시지
  chatHist = [];
  const area = document.getElementById('chatArea');
  area.innerHTML = '';
  addMsg('ai', `안녕하세요, 저는 잠실고등학교 학생들의 과목선택을 도와드리는 챗봇 잠시리입니다! 🎓

${csGrade}학년 ${TRACKS_DATA[csTrack].label} ${csMajorName} 학생이시군요!
${csGrade === 1 ? '2학년' : '3학년'} 선택과목을 함께 고민해드릴게요.

궁금한 점이 있으시면 질문을 하거나 아래 버튼을 클릭해주세요.`);
}

function resetConsult() {
  document.getElementById('consultSetup').style.display = 'flex';
  document.getElementById('consultChat').style.display = 'none';
  chatHist = [];
}

// ══════════════════════════════════════
// 선행과목 체크 모달 (2학년용)
// ══════════════════════════════════════
function openPrereq() {
  const list = document.getElementById('prereqList');
  list.innerHTML = PREREQ_LIST.map(p => `
    <label style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--cream-mid);border-radius:8px;cursor:pointer;font-size:13px;">
      <input type="checkbox" id="${p.id}" ${prereqChecked[p.id]?'checked':''} style="accent-color:var(--navy);width:16px;height:16px;">
      <span><b>${p.name}</b> 수강함 → <span style="color:var(--muted);font-size:11px;">${p.unlocks.join(', ')} 선택 가능</span></span>
    </label>`).join('');
  document.getElementById('prereqModal').classList.add('open');
}

function closePrereq() {
  document.getElementById('prereqModal').classList.remove('open');
}

function confirmPrereq() {
  PREREQ_LIST.forEach(p => {
    prereqChecked[p.id] = document.getElementById(p.id)?.checked || false;
  });
  closePrereq();
  launchChat();
}

// ══════════════════════════════════════
// 챗봇 메시지 함수
// ══════════════════════════════════════
function addMsg(role, text) {
  const a = document.getElementById('chatArea');
  const d = document.createElement('div');
  d.className = `msg ${role}`;
  d.innerHTML = '<div class="msg-av">'+(role==='ai'?'🤖':'👤')+'</div><div class="msg-bbl">'+text.replace(/\n/g,'<br>')+'</div>';
  a.appendChild(d);
  a.scrollTop = a.scrollHeight;
  return d;
}
function addTyping() {
  const a = document.getElementById('chatArea');
  const d = document.createElement('div');
  d.className='msg ai'; d.id='tyInd';
  d.innerHTML=`<div class="msg-av">🤖</div><div class="msg-bbl"><div class="typing-wrap"><span class="ty-dot"></span><span class="ty-dot"></span><span class="ty-dot"></span></div></div>`;
  a.appendChild(d); a.scrollTop=a.scrollHeight;
}
function remTyping() { const e=document.getElementById('tyInd'); if(e)e.remove(); }

// ══════════════════════════════════════
// 버튼 기능 함수
// ══════════════════════════════════════
function showSubjectList() {
  var subjects = csGrade === 1 ? SUBJECTS_G1 : SUBJECTS_G2;
  var grade2 = csGrade === 1 ? '2' : '3';
  var area = document.getElementById('chatArea');

  // AI 말풍선으로 표 출력
  var d = document.createElement('div');
  d.className = 'msg ai';
  d.style.animation = 'fadeUp .3s ease';

  var typeColor = {'일반':'#2563eb','진로':'#059669','융합':'#d97706'};

  var html = '<div class="msg-av">🤖</div><div class="msg-bbl" style="max-width:90%;padding:16px;">';
  html += '<div style="font-weight:700;font-size:14px;margin-bottom:14px;">📋 ' + csGrade + '학년 → ' + grade2 + '학년 선택과목 목록</div>';

  ['1학기','2학기'].forEach(function(sem) {
    if (!subjects[sem]) return;
    html += '<div style="font-family:Noto Serif KR,serif;font-size:13px;font-weight:700;color:var(--navy);margin:12px 0 8px;padding:6px 10px;background:var(--cream-dark);border-radius:6px;">📅 ' + sem + '</div>';
    Object.entries(subjects[sem]).forEach(function(entry) {
      var cat = entry[0]; var list = entry[1];
      html += '<div style="font-size:11px;font-weight:700;color:var(--gold);margin:8px 0 4px;">' + cat + '</div>';
      list.forEach(function(sub) {
        var tc = typeColor[sub.type] || '#6b7280';
        html += '<div style="margin-bottom:5px;">';
        html += '<button onclick="showSubjectDesc(this)" data-desc="' + sub.desc.replace(/"/g,'&quot;') + '" data-name="' + sub.name + '" style="background:var(--white);border:1px solid var(--border);border-radius:8px;padding:5px 12px;font-family:Noto Sans KR,sans-serif;font-size:12px;font-weight:600;color:var(--text);cursor:pointer;transition:all .15s;text-align:left;">';
        html += '<span style="color:' + tc + ';font-size:10px;font-weight:700;border:1px solid ' + tc + ';border-radius:4px;padding:1px 5px;margin-right:6px;">' + sub.type + '</span>';
        html += sub.name + ' <span style="color:var(--muted);font-size:10px;">ℹ️</span>';
        html += '</button>';
        html += '</div>';
      });
    });
  });
  html += '</div>';
  d.innerHTML = html;
  area.appendChild(d);
  area.scrollTop = area.scrollHeight;
}

function showSubjectDescFull(btn) {
  var name = btn.getAttribute('data-name');
  var desc = btn.getAttribute('data-desc');
  var reason = btn.getAttribute('data-reason');
  var area = document.getElementById('chatArea');
  var d = document.createElement('div');
  d.className = 'msg ai';
  d.style.animation = 'fadeUp .3s ease';

  var html = '<div class="msg-av">🤖</div><div class="msg-bbl" style="max-width:85%;">';
  html += '<div style="font-family:Noto Serif KR,serif;font-size:14px;font-weight:700;margin-bottom:10px;">📖 ' + name + '</div>';

  if (reason) {
    html += '<div style="margin-bottom:10px;padding:10px 12px;background:rgba(26,39,68,0.06);border-left:3px solid var(--navy);border-radius:0 8px 8px 0;font-size:13px;line-height:1.7;color:var(--text);">';
    html += '<span style="font-weight:700;color:var(--navy);font-size:12px;">💬 추천 이유</span><br>' + reason;
    html += '</div>';
  }

  if (desc) {
    html += '<div style="margin-bottom:10px;font-size:13px;color:var(--text);line-height:1.7;">' + desc + '</div>';
    html += '<div style="padding:8px 12px;background:rgba(184,151,58,0.1);border:1px solid rgba(184,151,58,0.3);border-radius:8px;font-size:11px;color:var(--gold);font-weight:700;">';
    html += '📚 출처: 서울특별시교육청 서울 진로진학센터 · 2026학년도 입학생을 위한 2022 개정 교육과정 선택 과목 안내서';
    html += '</div>';
  } else {
    html += '<div style="font-size:13px;color:var(--muted);">과목 안내서에 수록된 설명이 없습니다.</div>';
  }

  html += '</div>';
  d.innerHTML = html;
  area.appendChild(d);
  area.scrollTop = area.scrollHeight;
}

function showSubjectDesc(btn) {
  var name = btn.getAttribute('data-name');
  var desc = btn.getAttribute('data-desc');
  var area = document.getElementById('chatArea');
  var d = document.createElement('div');
  d.className = 'msg ai';
  d.style.animation = 'fadeUp .3s ease';
  d.innerHTML = '<div class="msg-av">🤖</div><div class="msg-bbl"><b>📖 ' + name + '</b><br><br>' + desc + '</div>';
  area.appendChild(d);
  area.scrollTop = area.scrollHeight;
}

function showSubjectRules() {
  addMsg('ai', SUBJECT_RULES);
}

function showMustSubjects() {
  const trackLabel = TRACKS_DATA[csTrack].label;
  let prompt = '나는 ' + csGrade + '학년 ' + trackLabel + ' ' + csMajorName + ' 학생입니다. 내가 꼭 들어야 할 필수 과목 5개를 추천해주세요. 이유도 간단히 설명해주세요.';
  if (csGrade === 2) {
    const checked = PREREQ_LIST.filter(function(p){ return prereqChecked[p.id]; }).map(function(p){ return p.name; });
    if (checked.length) prompt += ' 내가 2학년에 수강한 과목: ' + checked.join(', ');
  }
  document.getElementById('chatInput').value = prompt;
  sendMsg();
}

function showScheduleBuilder() {
  var trackLabel = TRACKS_DATA[csTrack].label;
  var checked = PREREQ_LIST.filter(function(p){ return prereqChecked[p.id]; }).map(function(p){ return p.name; });
  var prompt;

  if (csGrade === 2) {
    var prereqLine = checked.length ? ('수강 완료한 선행과목: ' + checked.join(', ')) : '수강 완료한 선행과목: 없음';
    var blocked = [];
    if (!prereqChecked['pre-phys']) blocked.push('전자기와 양자');
    if (!prereqChecked['pre-chem']) { blocked.push('물질과 에너지'); blocked.push('화학 반응의 세계'); }
    if (!prereqChecked['pre-bio']) blocked.push('생물의 유전');
    if (!prereqChecked['pre-earth']) blocked.push('행성우주과학');
    if (!prereqChecked['pre-eth']) blocked.push('윤리와 사상');
    if (!prereqChecked['pre-jpn']) { blocked.push('심화 일본어'); blocked.push('일본 문화'); }
    var blockedLine = blocked.length ? ('\n⛔ 절대 선택 불가 과목(선행 미수강): ' + blocked.join(', ')) : '';
    var artLine = (csTrack === 'art') ? '\n- 예술: 1학기 1개, 2학기 1개 반드시 포함' : '\n- 예술 과목은 포함하지 않는다';
    var stemNote = trackLabel === '이과'
      ? '\n- 이과 과목 위주로 편성. 3학년 2학기에는 수능 대비 사회 과목 1개 반드시 포함'
      : '\n- 문과 과목 위주로 편성. 3학년 2학기에는 수능 대비 과학 과목 1개 반드시 포함';

    prompt = '[잠실고 2학년 → 3학년 과목 선택표 요청]' +
      '\n학생 정보: ' + trackLabel + ' ' + csMajorName +
      '\n' + prereqLine +
      blockedLine +
      '\n\n★★★ 절대 지켜야 할 규칙 (어기면 오답) ★★★' +
      '\n' +
      '\n[과목 수 규칙 - 가장 중요]' +
      '\n- 1학기: 반드시 정확히 8과목 출력 (많아도 적어도 안 됨)' +
      '\n- 2학기: 반드시 정확히 8과목 출력 (많아도 적어도 안 됨)' +
      '\n- 1학기 + 2학기 합산 총 16과목이어야 함' +
      '\n' +
      '\n[교양 규칙]' +
      '\n- 1학기에 교양 1개 반드시 포함 (진로와 직업 또는 논리와 사고)' +
      '\n- 2학기에 교양 1개 반드시 포함 (논술 또는 인간과 경제활동)' +
      artLine +
      '\n' +
      '\n[선행과목 규칙]' +
      '\n- 위에서 "절대 선택 불가 과목"으로 명시된 과목은 절대 포함하지 않는다' +
      stemNote +
      '\n' +
      '\n[학기 고정 규칙 - 반드시 준수]' +
      '\n- 1학기 고정 과목: 주제 탐구 독서, 확률과 통계, 미적분Ⅱ, 영어 독해와 작문, 세계 문화와 영어, 역사로 탐구하는 현대 세계, 법과 사회, 사회문제 탐구, 도시의 미래 탐구, 윤리와 사상, 전자기와 양자, 물질과 에너지, 화학 반응의 세계, 생물의 유전, 행성우주과학, 인공지능 기초, 심화 일본어, 음악 감상과 비평(1학기), 미술 감상과 비평(1학기), 진로와 직업, 논리와 사고' +
      '\n- 2학기 고정 과목: 경제 수학, 수학과 문화, 심화 영어, 미디어 영어, 세계 역사와 문화, 금융과 경제생활, 여행지리, 인문학과 윤리, 기후변화와 환경생태, 과학의 역사와 문화, 소프트웨어와 생활, 일본 문화, 음악 감상과 비평(2학기), 미술 감상과 비평(2학기), 논술, 인간과 경제활동' +
      '\n- 위 학기 외에 해당 과목을 선택하면 절대 안 됨' +
      '\n' +
      '\n[JSON 출력 규칙]' +
      '\n- 다른 텍스트 없이 JSON만 출력' +
      '\n- 1학기 8개, 2학기 8개인지 반드시 자체 검증 후 출력' +
      '\n- 형식: {"schedule":[{"sem":"1학기","name":"과목명","subject":"교과","type":"유형","reason":"추천 이유 1~2문장"}],"comment":"전체 코멘트 2~3문장"}';

  } else {
    // 1학년
    var scienceNote = trackLabel === '이과'
      ? '\n- 이과: 물리학·화학·생명과학·지구과학 중 2개 이상 반드시 포함 (1학기에 있는 과목들)' +
        '\n- 이과: 기하(수학)는 포함 추천' +
        '\n- 이과: 기술·가정/정보에서 1과목 포함 추천'
      : '\n- 문과: 기하는 가급적 추천하지 않는다 (학생이 원하면 포함 가능)' +
        '\n- 문과: 수학은 수학과제탐구(2학기)만 선택 가능. 수학과제탐구도 문과에게는 필수가 아님' +
        '\n- 문과: 사회 과목(세계사·사회와 문화·정치·세계시민과 지리·현대사회와 윤리 등) 위주로 편성';
    var artNote = trackLabel === '예체능'
      ? '\n- 예체능: 예술 과목 외에도 본인 전공과 연계된 과목 포함'
      : '';

    prompt = '[잠실고 1학년 → 2학년 과목 선택표 요청]' +
      '\n학생 정보: ' + trackLabel + ' ' + csMajorName +
      '\n\n★★★ 절대 지켜야 할 규칙 (어기면 오답) ★★★' +
      '\n' +
      '\n[과목 수 규칙 - 가장 중요]' +
      '\n- 1학기: 반드시 정확히 5과목 출력 (많아도 적어도 안 됨)' +
      '\n- 2학기: 반드시 정확히 5과목 출력 (많아도 적어도 안 됨)' +
      '\n- 1학기 + 2학기 합산 총 10과목이어야 함' +
      '\n' +
      '\n[예술 규칙]' +
      '\n- 1학기: 음악 연주와 창작 또는 미술 창작 중 1개 반드시 포함' +
      '\n- 2학기: 음악과 미디어 또는 미술과 매체 중 1개 반드시 포함' +
      '\n- 예술 1개 포함 후 나머지 4과목 선택' +
      '\n' +
      '\n[위계 과목 규칙]' +
      '\n- 역학과 에너지 → 물리학 선행 필요' +
      '\n- 물질과 에너지 → 화학 선행 필요' +
      '\n- 세포와 물질대사 → 생명과학 선행 필요' +
      '\n- 일본어 회화 → 일본어Ⅰ 선행 필요' +
      '\n- 중국어 회화 → 중국어Ⅰ 선행 필요' +
      '\n- 선행과목을 같은 선택표에 포함하거나 이미 이수한 경우에만 위계과목 선택 가능' +
      '\n' +
      '\n[계열별 추가 규칙]' +
      scienceNote +
      artNote +
      '\n' +
      '\n[학기 고정 규칙 - 반드시 준수]' +
      '\n- 1학기 고정 과목: 독서토론과 글쓰기, 기하, 영미문학 읽기, 세계사, 사회와 문화, 정치, 세계시민과 지리, 현대사회와 윤리, 물리학, 화학, 생명과학, 정보, 일본어Ⅰ, 중국어Ⅰ, 음악 연주와 창작, 미술 창작' +
      '\n- 2학기 고정 과목: 문학과 영상, 수학과제탐구, 영어발표와 토론, 동아시아 역사기행, 법과 사회, 경제, 기후변화와 지속가능한 세계, 윤리문제 탐구, 지구과학, 역학과 에너지, 물질과 에너지, 세포와 물질대사, 데이터 과학, 일본어 회화, 중국어 회화, 음악과 미디어, 미술과 매체' +
      '\n- 위 학기 외에 해당 과목을 선택하면 절대 안 됨 (예: 생명과학을 2학기에 배치 불가)' +
      '\n' +
      '\n[JSON 출력 규칙]' +
      '\n- 다른 텍스트 없이 JSON만 출력' +
      '\n- 1학기 5개, 2학기 5개인지 반드시 자체 검증 후 출력' +
      '\n- 형식: {"schedule":[{"sem":"1학기","name":"과목명","subject":"교과","type":"유형","reason":"추천 이유 1~2문장"}],"comment":"전체 코멘트 2~3문장"}';
  }

  document.getElementById('chatInput').value = prompt;
  sendMsg();
}
// ══════════════════════════════════════
// AI 호출
// ══════════════════════════════════════
function getSystemPrompt() {
  var trackLabel = TRACKS_DATA[csTrack] ? TRACKS_DATA[csTrack].label : '';
  var grade2 = csGrade === 1 ? '2' : '3';
  var subjects = csGrade === 1 ? SUBJECTS_G1 : SUBJECTS_G2;

  // 선행과목 미수강 → 위계 과목 차단
  var blocked = [];
  if (csGrade === 2) {
    if (!prereqChecked['pre-phys']) blocked.push('전자기와 양자');
    if (!prereqChecked['pre-chem']) { blocked.push('물질과 에너지'); blocked.push('화학 반응의 세계'); }
    if (!prereqChecked['pre-bio']) blocked.push('생물의 유전');
    if (!prereqChecked['pre-earth']) blocked.push('행성우주과학');
    if (!prereqChecked['pre-eth']) blocked.push('윤리와 사상');
    if (!prereqChecked['pre-jpn']) { blocked.push('심화 일본어'); blocked.push('일본 문화'); }
  } else {
    // 1학년: 선행과목 없이는 위계과목 불가
    if (!prereqChecked['pre-phys']) blocked.push('역학과 에너지');
    if (!prereqChecked['pre-chem']) blocked.push('물질과 에너지');
    if (!prereqChecked['pre-bio']) blocked.push('세포와 물질대사');
    if (!prereqChecked['pre-jpn']) blocked.push('일본어 회화');
  }

  // 학기별 과목 목록 (각 과목에 [1학기] [2학기] 태그 붙임)
  var s1lines = [], s2lines = [];
  if (subjects['1학기']) {
    Object.values(subjects['1학기']).forEach(function(list) {
      list.forEach(function(s) {
        if (blocked.indexOf(s.name) === -1)
          s1lines.push('[1학기전용]' + s.name + '(' + s.type + ')');
      });
    });
  }
  if (subjects['2학기']) {
    Object.values(subjects['2학기']).forEach(function(list) {
      list.forEach(function(s) {
        if (blocked.indexOf(s.name) === -1)
          s2lines.push('[2학기전용]' + s.name + '(' + s.type + ')');
      });
    });
  }

  var checkedNames = PREREQ_LIST.filter(function(p){ return prereqChecked[p.id]; }).map(function(p){ return p.name; });
  var prereqTxt = checkedNames.length ? ('선행수강완료: ' + checkedNames.join(',') + '. ') : '';
  var blockedTxt = blocked.length ? ('선택불가(선행미수강): ' + blocked.join(',') + '. ') : '';

  var countRule = csGrade === 1
    ? '필수과목수: 1학기정확히5개,2학기정확히5개(합계10개). '
    : '필수과목수: 1학기정확히8개,2학기정확히8개(합계16개). ';

  var artRule = csGrade === 1
    ? '예술필수: 1학기에[1학기전용]음악 연주와 창작또는[1학기전용]미술 창작중1개, 2학기에[2학기전용]음악과 미디어또는[2학기전용]미술과 매체중1개. '
    : (csTrack === 'art' ? '예술: 1학기1개,2학기1개. ' : '예술과목포함금지. ');

  var yangRule = csGrade === 2
    ? '교양필수: 1학기에[1학기전용]진로와 직업또는[1학기전용]논리와 사고중1개, 2학기에[2학기전용]논술또는[2학기전용]인간과 경제활동중1개. '
    : '';

  var stemRule = '';
  if (csGrade === 1 && trackLabel === '이과') stemRule = '이과필수: 1학기목록에서물리학/화학/생명과학중2개이상반드시포함. ';
  if (csGrade === 1 && trackLabel === '문과') stemRule = '문과주의: 기하는사회과목우선후선택. ';

  var semRule = csGrade === 2
    ? (trackLabel === '이과' ? '이과: 2학기에수능대비사회과목1개포함. ' : '문과: 2학기에수능대비과학과목1개포함. ')
    : '';

  var countCheck = csGrade === 1
    ? '출력전자가검증: 1학기항목수=5개인지확인,2학기항목수=5개인지확인,틀리면수정후출력. '
    : '출력전자가검증: 1학기항목수=8개인지확인,2학기항목수=8개인지확인,틀리면수정후출력. ';

  var prompt =
    '너는잠실고' + csGrade + '학년' + trackLabel + ' ' + csMajorName + '학생의' + grade2 + '학년과목상담AI잠시리다. ' +
    prereqTxt + blockedTxt +
    '1학기전용과목목록: ' + s1lines.join(', ') + '. ' +
    '2학기전용과목목록: ' + s2lines.join(', ') + '. ' +
    '위에[1학기전용]표시된과목은반드시sem=1학기로만,  [2학기전용]표시된과목은반드시sem=2학기로만배치. ' +
    countRule + artRule + yangRule + stemRule + semRule + countCheck +
    '음악 감상과 비평(1학기)와 음악 감상과 비평(2학기)는 같은과목이므로 1,2학기에 둘다선택불가 하나만선택. 미술 감상과 비평도동일. 선택표요청시JSON만출력(다른텍스트금지): {"schedule":[{"sem":"1학기","name":"과목명","subject":"교과","type":"유형","reason":"이유"},{"sem":"2학기","name":"과목명","subject":"교과","type":"유형","reason":"이유"}],"comment":"코멘트"}. ' +
    '일반질문은한국어로친절히답변.';

  return prompt;
}

// ⚠️ 보안 주의: 아래 API 키는 브라우저에서 그대로 노출되는 클라이언트 키입니다.
// 원본 파일(jamsili (4).html)에 있던 값을 그대로 옮겼을 뿐이며, 반드시 즉시
// 폐기(rotate)하고 서버(백엔드)를 통해 호출하도록 구조를 바꾸는 것을 권장합니다.
const KP = ['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'];
const gk = () => KP.join('');

async function sendMsg() {
  const inp = document.getElementById('chatInput');
  const txt = inp.value.trim();
  if (!txt || isLoading) return;
  inp.value = ''; inp.style.height = 'auto';
  addMsg('user', txt);
  chatHist.push({ role: 'user', content: txt });
  isLoading = true;
  document.getElementById('sendBtn').disabled = true;
  addTyping();
  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${gk()}` },
      body: (function() {
        try {
          var sysPrompt = getSystemPrompt().replace(/[\x00-\x1F\x7F]/g, ' ');
          var msgs = [{ role: 'system', content: sysPrompt }].concat(
            chatHist.map(function(m) {
              return { role: m.role, content: (m.content || '').replace(/[\x00-\x1F\x7F]/g, ' ') };
            })
          );
          return JSON.stringify({ model: 'gpt-4.1-mini', max_tokens: 1000, messages: msgs });
        } catch(e) {
          console.error('JSON 직렬화 오류:', e);
          return JSON.stringify({ model: 'gpt-4.1-mini', max_tokens: 1000, messages: [{ role: 'user', content: '안녕하세요' }] });
        }
      })()
    });
    const data = await r.json();
    console.log('API 응답:', JSON.stringify(data).slice(0, 200));
    if (!r.ok) {
      remTyping();
      var errMsg = data.error ? data.error.message : ('HTTP ' + r.status);
      addMsg('ai', 'API 오류: ' + errMsg);
      isLoading = false;
      document.getElementById('sendBtn').disabled = false;
      return;
    }
    const rawReply = data.choices?.[0]?.message?.content || '죄송합니다, 응답을 받지 못했습니다.';
    remTyping();

    // JSON 선택표인지 확인
    var cleanReply = rawReply.trim();
    var jsonMatch = cleanReply.match(/\{[\s\S]*"schedule"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        var parsed = JSON.parse(jsonMatch[0]);
        if (parsed.schedule && Array.isArray(parsed.schedule)) {
          renderScheduleUI(parsed);
          chatHist.push({ role: 'assistant', content: rawReply });
          isLoading = false;
          document.getElementById('sendBtn').disabled = false;
          return;
        }
      } catch(e) {}
    }

    addMsg('ai', rawReply);
    chatHist.push({ role: 'assistant', content: rawReply });
  } catch(e) {
    remTyping();
    console.error('API 오류:', e);
    addMsg('ai', '오류가 발생했습니다. 잠시 후 다시 시도해주세요. (오류: ' + e.message + ')');
  }
  isLoading = false;
  document.getElementById('sendBtn').disabled = false;
}

function copyChat() {
  const ms = document.querySelectorAll('#chatArea .msg-bbl');
  const txt = Array.from(ms).map(m => `[${m.closest('.msg').classList.contains('user')?'학생':'잠시리'}] ${m.innerText}`).join('\n\n');
  navigator.clipboard.writeText(txt).then(() => alert('복사되었습니다!'));
}
function saveChat() {
  const ms = document.querySelectorAll('#chatArea .msg-bbl');
  const txt = Array.from(ms).map(m => `[${m.closest('.msg').classList.contains('user')?'학생':'잠시리'}] ${m.innerText}`).join('\n\n');
  const b = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(b);
  a.download = '선택과목상담_잠시리.txt'; a.click();
}
function renderScheduleUI(schedule) {
  var area = document.getElementById('chatArea');
  var d = document.createElement('div');
  d.className = 'msg ai';
  d.style.animation = 'fadeUp .3s ease';

  var subjects = csGrade === 1 ? SUBJECTS_G1 : SUBJECTS_G2;
  var typeColor = {'일반':'#2563eb','진로':'#059669','융합':'#d97706'};
  var catColor = {'📚 국어':'#7c3aed','📐 수학':'#0891b2','🇬🇧 영어':'#0d9488','🌏 사회':'#ca8a04','🔬 과학':'#16a34a','💻 기술·가정·정보':'#6366f1','🌐 제2외국어/한문':'#d97706','🎨 예술 (학기별 1개 필수)':'#ec4899','🎨 예술 (예체능 계열만)':'#ec4899','🧠 교양 (학기별 1개 필수)':'#64748b'};

  // 과목 설명 찾기
  function findDesc(name) {
    var allSems = subjects;
    for (var sem in allSems) {
      for (var cat in allSems[sem]) {
        var list = allSems[sem][cat];
        for (var i = 0; i < list.length; i++) {
          if (list[i].name === name || name.includes(list[i].name) || list[i].name.includes(name)) {
            return list[i].desc;
          }
        }
      }
    }
    return null;
  }

  var grade2 = csGrade === 1 ? '2' : '3';
  var comment = schedule.comment || null;
  var scheduleArr = Array.isArray(schedule) ? schedule : (schedule.schedule || []);
  schedule = scheduleArr;

  var html = '<div class="msg-av">🤖</div><div class="msg-bbl" style="max-width:92%;padding:16px;">';
  html += '<div style="font-family:Noto Serif KR,serif;font-size:15px;font-weight:700;margin-bottom:16px;">📅 ' + csGrade + '학년 → ' + grade2 + '학년 과목 선택표</div>';

  ['1학기','2학기'].forEach(function(sem) {
    var semItems = schedule.filter(function(s){ return s.sem === sem; });
    if (!semItems.length) return;

    html += '<div style="margin-bottom:16px;">';
    html += '<div style="font-size:12px;font-weight:700;color:var(--navy);background:var(--cream-dark);padding:6px 12px;border-radius:8px;margin-bottom:8px;">📅 ' + sem + ' (' + semItems.length + '과목)</div>';

    semItems.forEach(function(item) {
      var tc = typeColor[item.type] || '#6b7280';
      var desc = findDesc(item.name);
      var descAttr = desc ? ' data-desc="' + desc.replace(/"/g,'&quot;') + '"' : '';
      var reasonAttr = item.reason ? ' data-reason="' + item.reason.replace(/"/g,'&quot;') + '"' : '';

      html += '<div style="margin-bottom:8px;">';
      html += '<button onclick="showSubjectDescFull(this)" data-name="' + item.name + '"' + descAttr + reasonAttr;
      html += ' style="display:flex;align-items:center;gap:8px;width:100%;background:var(--white);border:1px solid var(--border);border-radius:10px;padding:9px 14px;font-family:Noto Sans KR,sans-serif;cursor:pointer;transition:all .15s;text-align:left;">';
      html += '<span style="color:' + tc + ';font-size:10px;font-weight:700;border:1px solid ' + tc + ';border-radius:4px;padding:1px 6px;flex-shrink:0;">' + (item.type||'') + '</span>';
      html += '<div style="flex:1;">';
      html += '<div style="font-size:13px;font-weight:600;color:var(--text);">' + item.name + '</div>';
      if (item.reason) {
        html += '<div style="font-size:11px;color:var(--muted);margin-top:2px;">💬 ' + item.reason + '</div>';
      }
      html += '</div>';
      html += '<span style="font-size:11px;color:var(--muted);flex-shrink:0;">' + (item.subject||'') + (desc ? ' ℹ️' : '') + '</span>';
      html += '</button>';
      html += '</div>';
    });
    html += '</div>';
  });

  if (comment) {
    html += '<div style="margin-top:14px;padding:12px 14px;background:rgba(26,39,68,0.06);border-left:3px solid var(--navy);border-radius:0 8px 8px 0;font-size:13px;color:var(--text);line-height:1.7;">';
    html += '<span style="font-weight:700;color:var(--navy);">📝 선택 코멘트</span><br>' + comment;
    html += '</div>';
  }
  html += '<div style="font-size:11px;color:var(--muted);margin-top:10px;">💡 과목 버튼을 클릭하면 상세 설명을 볼 수 있어요</div>';
  html += '</div>';
  d.innerHTML = html;
  area.appendChild(d);
  area.scrollTop = area.scrollHeight;
}

function clearChat() {
  if (!confirm('대화를 초기화하시겠습니까?')) return;
  chatHist = [];
  document.getElementById('chatArea').innerHTML = '';
  addMsg('ai', `안녕하세요, 저는 잠실고등학교 학생들의 과목선택을 도와드리는 챗봇 잠시리입니다! 🎓\n\n궁금한 점이 있으시면 질문을 하거나 아래 버튼을 클릭해주세요.`);
}
