import { DEFAULT_TEMPLATES } from '../templates';
import { BLOCK_TYPE_LABELS, BLOCK_TYPE_COLORS } from '../types';
import { BookOpen } from 'lucide-react';

export function TemplateLibrary() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen size={28} />
        <h2 className="text-2xl font-bold">템플릿 라이브러리</h2>
      </div>
      <p className="text-gray-600 mb-6">
        스타터팩과 베테랑팩을 참고하여 나만의 패키지를 만들어보세요.
        패키지 편집 시 "템플릿에서 가져오기" 버튼을 눌러 아래 블록들을 가져올 수 있습니다.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {DEFAULT_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-md p-6 border-2"
            style={{ borderColor: template.color }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: template.color }}>
              {template.subject}
            </h3>

            <div className="space-y-3">
              {template.blocks.map((block) => (
                <div
                  key={block.type}
                  className={`p-3 rounded-lg border-2 ${BLOCK_TYPE_COLORS[block.type]}`}
                >
                  <h4 className="font-semibold mb-2">{BLOCK_TYPE_LABELS[block.type]}</h4>
                  <ul className="text-sm space-y-1">
                    {block.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
