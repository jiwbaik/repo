import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ConsultingData } from '../App';
import { Calendar, Briefcase, BookOpen, MessageSquare } from 'lucide-react';

interface ConsultingResultProps {
  data: ConsultingData;
}

export function ConsultingResult({ data }: ConsultingResultProps) {
  return (
    <Card className="max-w-3xl mx-auto border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          AI 상담 결과
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4" />
          {data.timestamp.toLocaleString('ko-KR')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">선택한 진로</h3>
          </div>
          <Badge variant="default" className="text-base px-4 py-1">
            {data.career}
          </Badge>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">관심 과목</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.subjects.map(subject => (
              <Badge key={subject} variant="secondary" className="px-3 py-1">
                {subject}
              </Badge>
            ))}
          </div>
        </div>

        {data.concerns && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">작성한 고민</h3>
            </div>
            <p className="text-gray-700 bg-white rounded-lg p-4 border border-gray-200">
              {data.concerns}
            </p>
          </div>
        )}

        <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
          <h3 className="font-semibold text-indigo-900 mb-3 text-lg">
            💡 AI 맞춤 조언
          </h3>
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
            {data.advice}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
