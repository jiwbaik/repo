import { useState } from 'react';
import { Package, Block, BlockType, BLOCK_TYPE_LABELS } from '../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface PackageEditorProps {
  package?: Package;
  onSave: (pkg: Package) => void;
  onClose: () => void;
  onCopyFromTemplate: (blockType: BlockType) => void;
}

const SUBJECT_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
];

export function PackageEditor({ package: pkg, onSave, onClose, onCopyFromTemplate }: PackageEditorProps) {
  const [subject, setSubject] = useState(pkg?.subject || '');
  const [color, setColor] = useState(pkg?.color || SUBJECT_COLORS[0]);
  const [blocks, setBlocks] = useState<Block[]>(
    pkg?.blocks || [
      { type: 'preview', title: '예습', tasks: [''] },
      { type: 'review', title: '복습(평소)', tasks: [''] },
      { type: 'exam-3week', title: '시험 3주전', tasks: [''] },
      { type: 'exam-2week', title: '시험 2주전', tasks: [''] },
      { type: 'exam-1week', title: '시험 1주전', tasks: [''] },
    ]
  );

  const updateBlockTask = (blockIndex: number, taskIndex: number, value: string) => {
    const newBlocks = [...blocks];
    newBlocks[blockIndex].tasks[taskIndex] = value;
    setBlocks(newBlocks);
  };

  const addTask = (blockIndex: number) => {
    const newBlocks = [...blocks];
    newBlocks[blockIndex].tasks.push('');
    setBlocks(newBlocks);
  };

  const removeTask = (blockIndex: number, taskIndex: number) => {
    const newBlocks = [...blocks];
    newBlocks[blockIndex].tasks.splice(taskIndex, 1);
    setBlocks(newBlocks);
  };

  const handleSave = () => {
    if (!subject.trim()) {
      alert('과목명을 입력해주세요.');
      return;
    }

    const filteredBlocks = blocks.map(block => ({
      ...block,
      tasks: block.tasks.filter(task => task.trim() !== ''),
    }));

    onSave({
      id: pkg?.id || Date.now().toString(),
      subject: subject.trim(),
      color,
      blocks: filteredBlocks,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {pkg ? '패키지 수정' : '새 패키지 만들기'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 과목명 입력 */}
          <div>
            <label className="block text-sm font-semibold mb-2">과목명</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="예: 수학, 영어, 국어..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* 색상 선택 */}
          <div>
            <label className="block text-sm font-semibold mb-2">패키지 색상</label>
            <div className="flex gap-2">
              {SUBJECT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-lg transition-transform ${
                    color === c ? 'ring-4 ring-offset-2 ring-gray-400 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* 블록 편집 */}
          <div className="space-y-4">
            {blocks.map((block, blockIndex) => (
              <div key={block.type} className="border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">{BLOCK_TYPE_LABELS[block.type]}</h3>
                  <button
                    onClick={() => onCopyFromTemplate(block.type)}
                    className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    템플릿에서 가져오기
                  </button>
                </div>

                <div className="space-y-2">
                  {block.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={task}
                        onChange={(e) => updateBlockTask(blockIndex, taskIndex, e.target.value)}
                        placeholder="할 일 입력..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        onClick={() => removeTask(blockIndex, taskIndex)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addTask(blockIndex)}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    <span>할 일 추가</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
