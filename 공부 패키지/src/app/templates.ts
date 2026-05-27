import { Package } from './types';

export const STARTER_PACK: Package = {
  id: 'starter-pack',
  subject: '스타터팩',
  color: '#3B82F6',
  blocks: [
    {
      type: 'preview',
      title: '예습',
      tasks: [
        '교과서 해당 단원 읽기',
        '모르는 용어 정리하기',
        '예습 노트 작성하기',
      ],
    },
    {
      type: 'review',
      title: '복습(평소)',
      tasks: [
        '수업 내용 노트 정리',
        '기본 문제 풀기',
        '이해 안 되는 부분 표시하기',
      ],
    },
    {
      type: 'exam-3week',
      title: '시험 3주전',
      tasks: [
        '전체 범위 파악하기',
        '단원별 개념 정리 시작',
        '기출문제 유형 파악',
      ],
    },
    {
      type: 'exam-2week',
      title: '시험 2주전',
      tasks: [
        '개념 정리 완성',
        '문제집 1회독',
        '오답노트 작성 시작',
      ],
    },
    {
      type: 'exam-1week',
      title: '시험 1주전',
      tasks: [
        '오답노트 복습',
        '문제집 2회독',
        '모의고사 풀이',
        '최종 점검',
      ],
    },
  ],
};

export const VETERAN_PACK: Package = {
  id: 'veteran-pack',
  subject: '베테랑팩',
  color: '#8B5CF6',
  blocks: [
    {
      type: 'preview',
      title: '예습',
      tasks: [
        '교과서 + 참고서 비교 읽기',
        '핵심 개념 마인드맵 작성',
        '예상 문제 직접 만들어보기',
        '심화 내용 미리 찾아보기',
      ],
    },
    {
      type: 'review',
      title: '복습(평소)',
      tasks: [
        '수업 내용 즉시 복습 (당일)',
        '심화 문제 도전',
        '개념 설명 연습 (친구에게 가르치기)',
        '관련 개념 연결하기',
      ],
    },
    {
      type: 'exam-3week',
      title: '시험 3주전',
      tasks: [
        '출제 범위 완벽 분석',
        '단원별 핵심 개념 체계화',
        '기출 3개년 분석',
        '약점 파악 및 보완 계획 수립',
      ],
    },
    {
      type: 'exam-2week',
      title: '시험 2주전',
      tasks: [
        '개념 완벽 암기 + 이해',
        '문제집 2회독',
        '고난도 문제 집중 공략',
        '오답 유형 분석',
      ],
    },
    {
      type: 'exam-1week',
      title: '시험 1주전',
      tasks: [
        '오답노트 완벽 정리',
        '실전 모의고사 (시간 측정)',
        '취약점 집중 보완',
        '개념 최종 점검',
        '시험 시간표에 맞춰 연습',
      ],
    },
  ],
};

export const DEFAULT_TEMPLATES = [STARTER_PACK, VETERAN_PACK];
