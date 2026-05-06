import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ConsultingData } from '../App';
import { FileText, Calendar } from 'lucide-react';

interface ConsultingHistoryProps {
  history: ConsultingData[];
}

export function ConsultingHistory({ history }: ConsultingHistoryProps) {
  if (history.length === 0) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="py-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">아직 상담 기록이 없습니다</p>
          <p className="text-gray-400 text-sm mt-2">상담 받기 탭에서 첫 상담을 시작해보세요!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>상담 기록</CardTitle>
        <CardDescription>
          총 {history.length}개의 상담 기록
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {history.map((record, index) => (
            <AccordionItem key={record.id} value={record.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <div className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{record.career}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      {record.timestamp.toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4 pl-11">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">관심 과목</h4>
                    <div className="flex flex-wrap gap-2">
                      {record.subjects.map(subject => (
                        <Badge key={subject} variant="secondary" className="text-sm">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {record.concerns && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">작성한 고민</h4>
                      <p className="text-gray-600 text-sm bg-gray-50 rounded p-3">
                        {record.concerns}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">AI 조언</h4>
                    <p className="text-gray-700 text-sm bg-indigo-50 rounded p-3 border border-indigo-100 whitespace-pre-line">
                      {record.advice}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
