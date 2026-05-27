import { Package } from '../types';
import { BLOCK_TYPE_LABELS, BLOCK_TYPE_COLORS } from '../types';
import { Edit2, Trash2 } from 'lucide-react';

interface PackageCardProps {
  package: Package;
  onEdit: (pkg: Package) => void;
  onDelete: (id: string) => void;
}

export function PackageCard({ package: pkg, onEdit, onDelete }: PackageCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2" style={{ borderColor: pkg.color }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold" style={{ color: pkg.color }}>
          {pkg.subject}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(pkg)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="수정"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(pkg.id)}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
            aria-label="삭제"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {pkg.blocks.map((block) => (
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
  );
}
