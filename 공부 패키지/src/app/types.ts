export type BlockType = 'preview' | 'review' | 'exam-1week' | 'exam-2week' | 'exam-3week';

export interface Block {
  type: BlockType;
  title: string;
  tasks: string[];
}

export interface Package {
  id: string;
  subject: string;
  blocks: Block[];
  color: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  packageId: string;
  blockType: BlockType;
}

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  'preview': '예습',
  'review': '복습(평소)',
  'exam-1week': '시험 1주전',
  'exam-2week': '시험 2주전',
  'exam-3week': '시험 3주전',
};

export const BLOCK_TYPE_COLORS: Record<BlockType, string> = {
  'preview': 'bg-blue-100 border-blue-300',
  'review': 'bg-green-100 border-green-300',
  'exam-1week': 'bg-red-100 border-red-300',
  'exam-2week': 'bg-orange-100 border-orange-300',
  'exam-3week': 'bg-yellow-100 border-yellow-300',
};
