import { BlockType, BLOCK_TYPE_LABELS } from '../types';
import { DEFAULT_TEMPLATES } from '../templates';
import { X } from 'lucide-react';

interface TemplateSelectorProps {
  blockType: BlockType;
  onSelect: (tasks: string[]) => void;
  onClose: () => void;
}

export function TemplateSelector({ blockType, onSelect, onClose }: TemplateSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {BLOCK_TYPE_LABELS[blockType]} - 템플릿 선택
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {DEFAULT_TEMPLATES.map((template) => {
            const block = template.blocks.find((b) => b.type === blockType);
            if (!block) return null;

            return (
              <div
                key={template.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => {
                  onSelect(block.tasks);
                  onClose();
                }}
              >
                <h3 className="font-bold text-lg mb-3" style={{ color: template.color }}>
                  {template.subject}
                </h3>
                <ul className="space-y-1 text-sm">
                  {block.tasks.map((task, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="border-t px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
