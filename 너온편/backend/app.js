// ═══════════════════════════════════════════════════════════════
// 🔧 너온편 백엔드 서버
// 
// 이 파일은 프론트엔드에서 보내온 편지를 받아서:
// 1. 선생님 인터뷰 데이터에서 관련 내용을 찾고
// 2. Claude AI API를 사용해 선생님 답장을 생성합니다
// ═══════════════════════════════════════════════════════════════

// ─── Step 1: 필요한 라이브러리 import ───
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // .env 파일에서 환경 변수 읽기

// ─── Step 2: 서버 설정 ───
const app = express();
const PORT = 3000;

// 프론트엔드에서 보낸 JSON 데이터를 받을 수 있도록 설정
app.use(express.json());

// CORS 설정 (프론트엔드와 백엔드가 다른 포트에 있어서 필요)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ─── Step 3: 선생님 인터뷰 데이터 로드 ───
// teachers.json에서 데이터를 읽어옵니다
let teachersData = {};
try {
  const teachersPath = path.join(__dirname, 'teachers.json');
  const rawData = fs.readFileSync(teachersPath, 'utf8');
  teachersData = JSON.parse(rawData);
  console.log('✅ 선생님 인터뷰 데이터 로드 완료');
} catch (error) {
  console.error('❌ teachers.json 파일을 찾을 수 없습니다:', error.message);
  teachersData = {}; // 빈 객체로 기본값 설정
}

// ═══════════════════════════════════════════════════════════════
// 🎯 핵심 API 엔드포인트: /api/reply
// 프론트엔드에서 POST 요청으로 여기로 편지 데이터를 보냅니다
// ═══════════════════════════════════════════════════════════════

app.post('/api/reply', async (req, res) => {
  try {
    // 프론트엔드에서 받은 데이터
    const {
      studentGrade,      // 예: "1학년"
      studentNickname,   // 예: "별이"
      studentSubject,    // 예: "수학"
      studentKeyword,    // 예: "학습법"
      studentLetter      // 예: "수학이 너무 어려워요..."
    } = req.body;

    console.log(`\n📨 새 편지 도착!`);
    console.log(`   학생: ${studentNickname} (${studentGrade})`);
    console.log(`   과목: ${studentSubject}, 키워드: ${studentKeyword}`);

    // ─── ⭐ STEP A: 선생님 인터뷰 찾기 ───
    // teachers.json에서 해당 과목과 키워드의 인터뷰를 찾습니다
    let teacherInterview = '';
    
    if (teachersData[studentSubject] && teachersData[studentSubject][studentKeyword]) {
      teacherInterview = teachersData[studentSubject][studentKeyword];
      console.log(`   ✅ 선생님 인터뷰 찾음: "${teacherInterview.substring(0, 30)}..."`);
    } else {
      console.log(`   ⚠️  선생님 인터뷰를 찾을 수 없습니다`);
      teacherInterview = `${studentSubject} 선생님이 여기 있을 것 같은데... 조금 더 기다려주세요!`;
    }

    // ─── ⭐ STEP B: Claude API를 통해 선생님 답장 생성 ───
    // Claude AI에게 학생 편지와 선생님 인터뷰를 바탕으로 답장을 만들어달라고 요청합니다
    
    const claudeResponse = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        
        // 시스템 프롬프트: Claude에게 역할을 설정합니다
        system: `당신은 잠실고등학교 ${studentSubject} 선생님입니다.
        
학생의 고민에 따뜻하고 진심 어린 답장을 해주세요.
다음 선생님의 인터뷰를 자연스럽게 활용해주세요:
"${teacherInterview}"

답장 형식:
- 학생의 고민을 이해하고 공감해주세요
- 위의 인터뷰 내용을 활용해 조언해주세요
- 격려와 응원으로 마무리해주세요
- 선생님답고 따뜻한 말투 사용`,
        
        // 사용자 메시지: 학생의 편지
        messages: [
          {
            role: 'user',
            content: `${studentNickname} 학생이 보낸 편지:\n\n"${studentLetter}"\n\n따뜻한 답장을 부탁드립니다.`
          }
        ]
      },
      {
        headers: {
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    // Claude의 답변 추출
    const teacherReply = claudeResponse.data.content[0].text;
    console.log(`   ✅ Claude API로부터 답장 생성 완료`);

    // 프론트엔드로 답장 전송
    res.json({
      success: true,
      reply: teacherReply,
      message: `${studentSubject} 선생님이 답장하셨어요!`
    });

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    
    // 에러 종류별 처리
    if (error.message.includes('401')) {
      res.status(401).json({
        success: false,
        error: 'API 키가 없거나 잘못되었습니다. .env 파일을 확인해주세요.'
      });
    } else if (error.message.includes('Network')) {
      res.status(503).json({
        success: false,
        error: '네트워크 오류입니다. 인터넷 연결을 확인해주세요.'
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
});

// ─── 테스트 엔드포인트 ───
app.get('/', (req, res) => {
  res.json({
    message: '✅ 너온편 백엔드 서버 실행 중',
    api: 'POST /api/reply'
  });
});

// ─── 서버 시작 ───
app.listen(PORT, () => {
  console.log(`\n🚀 너온편 백엔드 서버 시작!`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`\n다음 주소로 프론트엔드 열어주세요:`);
  console.log(`🌐 frontend/index.html을 브라우저에서 열기\n`);
});
