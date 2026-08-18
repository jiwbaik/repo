# 🌟 너온편 - 너에게 온 편지

코딩 초보자를 위한 **단계별 설치 및 이해 가이드**

---

## 📁 폴더 구조

```
neoenpyeon/
├── frontend/
│   └── index.html          ← 웹사이트 (화면)
├── backend/
│   ├── app.js              ← 서버 프로그램 (핵심!)
│   ├── teachers.json       ← 선생님 인터뷰 데이터
│   ├── package.json        ← npm 설정
│   └── .env                ← API 키 저장
└── README.md               ← 이 파일
```

---

## 🎯 각 파일이 하는 일

### 📱 **frontend/index.html** (프론트엔드 = 화면)
- 사용자가 보는 **웹사이트**
- "편지 작성", "받은 편지" 등의 버튼과 입력창
- 백엔드로 데이터를 보냄

### 🔧 **backend/app.js** (백엔드 = 서버)
- 프론트엔드에서 받은 데이터를 처리
- 선생님 인터뷰 데이터를 찾음
- **Claude API**를 사용해 AI 답장 생성

### 📚 **backend/teachers.json** (선생님 인터뷰 데이터)
- 선생님들의 말씀이 저장된 파일
- 과목별, 키워드별로 정렬

---

## 🚀 설치 및 실행 방법

### **1단계: Node.js 설치**

프로그램을 실행하려면 **Node.js**라는 프로그램이 필요합니다.

1. https://nodejs.org 방문
2. "LTS 버전" 다운로드 & 설치 (기본값으로 설치)
3. 설치 확인: 터미널에서 다음 입력
```bash
node --version
npm --version
```

---

### **2단계: Claude API 키 발급**

선생님 답장을 생성하려면 **Claude API 키**가 필요합니다.

1. https://console.anthropic.com 방문 (계정 로그인)
2. 좌측 "API keys" 클릭
3. "Create Key" 클릭
4. 키 복사

---

### **3단계: 백엔드 설정**

**Step 1) 백엔드 폴더에서 터미널 열기**
```
backend 폴더를 우클릭 → "터미널에서 열기" (또는 "Open in Terminal")
```

**Step 2) npm 패키지 설치**
```bash
npm install
```
이 명령어는 `package.json`에 있는 프로그램들을 설치합니다.

**Step 3) .env 파일에 API 키 입력**

`.env` 파일을 텍스트 에디터로 열고:
```
CLAUDE_API_KEY=sk-ant-v0-YOUR_API_KEY_HERE
```

여기서 `sk-ant-v0-YOUR_API_KEY_HERE` 부분을 위에서 복사한 키로 바꿉니다.

예시:
```
CLAUDE_API_KEY=sk-ant-v0-abc123def456...
```

---

### **4단계: 백엔드 서버 실행**

`backend` 폴더의 터미널에서:
```bash
npm start
```

다음 화면이 나오면 성공!
```
🚀 너온편 백엔드 서버 시작!
📍 http://localhost:3000
```

---

### **5단계: 프론트엔드 열기**

새로운 브라우저 탭에서:
```
frontend/index.html 을 끌어서 브라우저에 드롭
또는
마우스 우클릭 → "열기" → Chrome/Edge
```

---

## 💡 프론트엔드와 백엔드는 어떻게 통신하나?

### **구조**

```
브라우저 (프론트엔드)           컴퓨터 (백엔드)
━━━━━━━━━━━━━━━━           ━━━━━━━━━━━━━━
  index.html  ─────POST────→  app.js
     (UI)                      (서버)
              ←───JSON────  (선생님 답장)
```

### **실제 흐름**

1. **사용자가 편지 작성**
   - "편지 보내기" 버튼 클릭

2. **프론트엔드가 데이터 전송** (HTTP POST)
   ```javascript
   // frontend/index.html에서 이런 코드가 실행됨
   await fetch('http://localhost:3000/api/reply', {
     method: 'POST',
     body: JSON.stringify({
       studentGrade: "1학년",
       studentNickname: "별이",
       studentSubject: "수학",
       studentKeyword: "학습법",
       studentLetter: "수학이 너무 어려워요..."
     })
   });
   ```

3. **백엔드가 데이터 받음**
   ```javascript
   // backend/app.js에서
   app.post('/api/reply', async (req, res) => {
     const { studentGrade, studentNickname, ... } = req.body;
     // 데이터를 처리합니다
   });
   ```

4. **백엔드가 선생님 인터뷰 찾기**
   ```javascript
   // teachers.json에서 "수학" + "학습법" 찾기
   const interview = teachersData["수학"]["학습법"];
   // "수학은 개념이 제일 중요합니다..."
   ```

5. **Claude API에 요청**
   ```javascript
   // app.js에서 Claude API에게 요청
   await axios.post('https://api.anthropic.com/v1/messages', {
     model: 'claude-3-5-sonnet-20241022',
     messages: [{
       role: 'user',
       content: "별이 학생이 보낸 편지와 선생님 인터뷰를 바탕으로 답장해주세요..."
     }]
   });
   ```

6. **Claude API가 답변**
   - Claude가 학생 편지 + 선생님 인터뷰를 바탕으로 답장 생성

7. **백엔드가 답변 반환**
   ```javascript
   res.json({
     reply: "너의 고민을 잘 이해했어..." // ← Claude의 답장
   });
   ```

8. **프론트엔드가 화면에 표시**
   ```javascript
   // 받은 편지함에서 답장 표시
   document.getElementById('viewBody').textContent = reply;
   ```

---

## 🎓 선생님 인터뷰 추가하기

### **선생님 인터뷰가 뭐예요?**

학생이 편지를 보낼 때 Claude AI에게 "이 선생님은 이런 말씀을 하는 사람입니다"라고 알려주는 것입니다.

### **추가 방법**

`backend/teachers.json` 파일을 열어서 원하는 위치에 추가합니다.

**현재 구조:**
```json
{
  "국어": {
    "학습법": "국어는 읽고...",
    "성적": "국어 성적이 안 나도...",
    "선택과목": "확대와 축소..."
  },
  "수학": {
    // ...
  }
}
```

**새로운 선생님 추가 예시:**

기존 선생님들의 인터뷰가 부족하면 더 추가할 수 있습니다.

```json
{
  "국어": {
    "학습법": "기존 내용...",
    "성적": "기존 내용...",
    "선택과목": "기존 내용...",
    "새로운키워드": "여기에 새 인터뷰 내용 작성"
  }
}
```

**편집 방법:**
1. `teachers.json` 우클릭
2. "연결 프로그램" → "메모장" 또는 VS Code
3. 원하는 부분 수정
4. Ctrl+S (저장)
5. 백엔드 서버 재시작 (`npm start`)

---

## 🤖 Claude API 이해하기

### **Claude API란?**
- **Claude = AI 채봇** (Anthropic 회사에서 만듦)
- **API = 프로그램이 Claude와 대화하는 방법**

### **작동 원리**

```javascript
// app.js에서
const claudeResponse = await axios.post(
  'https://api.anthropic.com/v1/messages',  // ← Claude의 주소
  {
    model: 'claude-3-5-sonnet-20241022',    // ← 사용할 Claude 버전
    max_tokens: 500,                         // ← 답변 최대 길이
    system: `당신은 ${subject} 선생님입니다...`,  // ← 역할 설정
    messages: [
      {
        role: 'user',
        content: `${studentLetter}...`       // ← 물어볼 내용
      }
    ]
  },
  {
    headers: {
      'x-api-key': process.env.CLAUDE_API_KEY  // ← 인증 키
    }
  }
);
```

### **주요 파라미터 설명**

| 파라미터 | 의미 | 예시 |
|---------|------|------|
| **model** | 사용할 Claude 버전 | `claude-3-5-sonnet-20241022` (최신 버전) |
| **max_tokens** | 답변 길이 제한 (토큰 = 단어 단위) | `500` = 약 150-200단어 |
| **system** | Claude의 역할/성격 설정 | "당신은 수학 선생님입니다" |
| **messages** | Claude에게 할 질문 | "학생의 편지 + 선생님 인터뷰" |
| **x-api-key** | API 인증 | `.env`의 키 |

---

## 🐛 문제 해결

### ❌ "Cannot find module 'express'"
```bash
# 해결방법
npm install
```

### ❌ "CLAUDE_API_KEY is undefined"
- `.env` 파일 확인
- API 키가 정확히 입력되었는지 확인
- 파일 저장했는지 확인
- 백엔드 재시작

### ❌ "CORS error" 또는 "연결할 수 없음"
- 백엔드 서버가 실행 중인지 확인
- 터미널에서 `npm start` 명령어 실행
- 오류 메시지 읽고 복사해서 검색

### ❌ "编辑 port 3000 is already in use"
```bash
# 현재 실행 중인 프로세스 종료
# Windows: Ctrl+C
# Mac/Linux: Control+C
```

---

## 📌 초보자가 꼭 알아야 할 것

### **API란?**
- "프로그램끼리 대화하는 방법"
- 예: 카톡 앱 ↔ 카톡 서버

### **JSON이란?**
- "데이터를 정렬해서 저장하는 형식"
- 예:
```json
{
  "이름": "별이",
  "학년": "1학년",
  "과목": "수학"
}
```

### **npm이란?**
- "프로그램 설치 도구"
- `npm install express` = Express 설치

### **.env가 뭐예요?**
- "비밀번호/키 같은 민감한 정보를 따로 저장하는 파일"
- 깃허브에 올릴 때 `.env`는 올리지 않음 (보안)

---

## ✅ 성공 확인

프론트엔드를 열었을 때 다음이 작동하면 성공!

```
✅ 홈 화면 보임
✅ "편지 작성" 클릭 → 정보 입력 팝업 뜸
✅ 편지 작성 → "편지 보내기" 클릭
✅ "편지가 보내졌습니다!" 메시지
✅ 받은 편지함에서 선생님 답장 보임 (AI 생성)
```

---

## 📚 더 배우기

- **Node.js 강의**: https://nomadcoders.co/
- **Express 공식 문서**: https://expressjs.com/
- **Claude API 문서**: https://docs.anthropic.com/
- **JSON 배우기**: https://www.json.org/

---

**질문 있으면 언제든지 물어봐요!** 😊
