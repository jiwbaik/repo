# ============================================================
# 잠실고 선택과목 상담 챗봇 (VS Code용)
# ============================================================
# 
# [ 실행 전 준비 ]
# 1. 터미널에서 패키지 설치:
#    pip install langchain langchain-core langchain-openai langchain-community langchain-text-splitters faiss-cpu tiktoken python-dotenv
#
# 2. 이 파일과 같은 폴더에 .env 파일 생성 후 아래 내용 입력:
#    OPENAI_API_KEY=sk-proj-여기에본인키입력
#
# 3. VS Code 터미널에서 실행:
#    python subject_chatbot_vscode.py
# ============================================================

import os
from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage

# ── API 키 로드 ───────────────────────────────────────────────
load_dotenv()
if not os.getenv("OPENAI_API_KEY"):
    print("[ERROR] .env 파일에 OPENAI_API_KEY가 없습니다.")
    print("  .env 파일을 만들고 OPENAI_API_KEY=sk-proj-... 를 입력하세요.")
    exit()
else:
    print("✅ API 키 확인 완료")

# ── 과목 데이터 ──────────────────────────────────────────────
hwp_text = """
[잠실고등학교 2027학년도 선택 과목 안내]

신청 기간: 2026년 6월 1일(월) ~ 6월 5일(금)
신청 방법: 리로스쿨 → 교육과정 → 수강신청 → 각 학기 블록 선택 후 과목 선택 및 저장
※ 1학기와 2학기에 동일 과목을 수강할 수 없음
※ 신청 학생 수가 적정 인원에 미달되면 과목이 개설되지 않을 수 있음
※ 학기별로 4과목 선택

[2학년 선택 과목 목록]

교과(군): 국어
  - 1학기 (융합): 독서토론과 글쓰기
  - 2학기 (진로): 문학과 영상

교과(군): 수학
  - 1학기 (진로): 기하
  - 2학기 (융합): 수학과제탐구

교과(군): 영어
  - 1학기 (진로): 영미문학 읽기
  - 2학기 (진로): 영어발표와 토론

교과(군): 사회
  - 세계사 (일반, 1학기)
  - 동아시아 역사기행 (진로, 1학기)
  - 사회와 문화 (일반, 2학기)
  - 법과 사회 (진로, 2학기)
  - 정치 (진로, 2학기)
  - 경제 (진로, 2학기)
  - 세계시민과 지리 (일반, 2학기)
  - 기후변화와 지속가능한 세계 (융합, 2학기)
  - 현대사회와 윤리 (일반, 2학기)
  - 윤리문제 탐구 (융합, 2학기)

교과(군): 과학
  - 물리학 (일반, 1학기)
  - 지구과학 (일반, 1학기)
  - 역학과 에너지 (진로, 1학기)
  - 화학 (일반, 1학기)
  - 물질과 에너지 (진로, 1학기)
  - 생명과학 (일반, 1학기)
  - 세포와 물질대사 (진로, 1학기)

교과(군): 기술·가정/정보
  - 정보 (일반)
  - 데이터 과학 (진로)
"""

# ── 과목 선택 규칙 ────────────────────────────────────────────
rules_text = """
[과목 선택 유의사항 및 규칙]

1. 학점 제한
   - 국어, 수학, 영어 교과의 이수 학점 총합은 81학점을 초과하지 않도록 한다.
   - 학교지정 62학점 외에 최대 19학점(6과목)까지 선택 가능
   - 교과 이수 학점이 174학점을 초과하는 경우(공동교육과정 이수 등)에는 초과 이수 학점의 50%를 넘지 않도록 한다.

2. 필수 선택 (매우 중요!)
   - 2학년 또는 3학년에서 반드시 기술·가정/정보/제2외국어/한문/교양 최소 4과목 이상을 선택해야 한다.

3. 과목 선택 우선순위
   - 일반선택과목을 우선 이수하고 관련 진로선택과목, 융합선택과목을 선택한다.
   - 대학별 입학처의 입학전형 시행계획과 전공연계과목 가이드를 참고하여 권장이수 과목 확인.

4. 한문 과목 안내
   - '한문'은 온라인학교 개설과목으로 수강인원이 제한될 수 있음.
   - 인원 제한 시 학생의 진로 연계성이 우선 고려 대상임.

5. 성적 산출 방식
   - 선택과목: 성취도(A-B-C-D-E), 석차등급(1~5등급) 산출
   - 과학/사회 융합선택과목, 공동교육과정 및 온라인학교 개설과목: 성취도만 평가
   - 체육, 음악, 미술: 성취도(A-B-C)으로만 평가
   - 교양교과(군): 성적 산출 없음, 이수/미이수만 기재

6. 과목 유형 설명
   - 일반선택과목: 내신 석차등급 산출 → 내신 관리에 유리
   - 진로선택과목: 성취도(A-B-C-D-E)만 산출 → 전공 역량 어필에 유리
   - 융합선택과목: 성취도만 산출

7. 진로별 추천 과목
   - 의대/약대/생명과학: 생명과학, 세포와 물질대사, 화학, 물질과 에너지
   - 공대/이공계: 물리학, 역학과 에너지, 화학, 기하, 정보, 데이터 과학
   - 사회과학/법학/경제: 경제, 법과 사회, 정치, 사회와 문화
   - 인문/어문: 독서토론과 글쓰기, 문학과 영상, 영미문학 읽기, 영어발표와 토론
   - 지구과학/환경: 지구과학, 기후변화와 지속가능한 세계
"""

# ── 벡터 저장소 생성 ──────────────────────────────────────────
print("📚 벡터 저장소 생성 중...")
docs = [
    Document(page_content=hwp_text, metadata={"source": "과목안내"}),
    Document(page_content=rules_text, metadata={"source": "선택규칙"}),
]
splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=80)
splits = splitter.split_documents(docs)
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(splits, embeddings)
print("✅ 벡터 저장소 생성 완료!\n")

# ── 챗봇 설정 ─────────────────────────────────────────────────
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7, max_tokens=700)

prompt = ChatPromptTemplate.from_messages([
    ("system", """당신은 잠실고등학교 1학년 학생의 2학년 선택과목 결정을 도와주는 친절한 상담사입니다.

아래의 [참고자료]를 바탕으로 정확하게 답변하세요.
반드시 과목 선택 규칙(학점 제한, 필수 선택 과목 등)을 지켜서 추천하세요.
학생의 진로와 흥미를 먼저 파악한 뒤 맞춤형 추천을 해주세요.
모르는 내용은 모른다고 솔직하게 말하세요.

[참고자료]
{context}
"""),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

chain = prompt | llm | StrOutputParser()
history = []

def chat(user_input):
    related_docs = vectorstore.similarity_search(user_input, k=4)
    context = "\n\n".join([d.page_content for d in related_docs])
    response = chain.invoke({
        "input": user_input,
        "history": history,
        "context": context
    })
    history.append(HumanMessage(content=user_input))
    history.append(AIMessage(content=response))
    return response

# ── 대화 시작 ─────────────────────────────────────────────────
print("=" * 50)
print("  잠실고 선택과목 상담 챗봇")
print("  종료하려면 '종료' 또는 'quit' 입력")
print("=" * 50)
print("안녕하세요! 2027학년도 선택과목 상담을 도와드리겠습니다.")
print("진로나 관심 분야를 알려주시면 맞춤 과목을 추천해드려요!\n")

while True:
    try:
        user_input = input("학생: ").strip()
    except KeyboardInterrupt:
        print("\n상담을 종료합니다. 좋은 선택 하세요!")
        break

    if not user_input:
        continue
    if user_input.lower() in ["종료", "quit", "exit", "q"]:
        print("상담을 종료합니다. 좋은 선택 하세요!")
        break

    response = chat(user_input)
    print(f"\n상담사: {response}\n")
    print("-" * 50)