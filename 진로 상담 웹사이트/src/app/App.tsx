import { useState } from 'react';
import { CareerConsultingForm } from './components/CareerConsultingForm';
import { ConsultingResult } from './components/ConsultingResult';
import { ConsultingHistory } from './components/ConsultingHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { BookOpen } from 'lucide-react';

export interface ConsultingData {
  id: string;
  career: string;
  subjects: string[];
  concerns: string;
  advice: string;
  timestamp: Date;
}

export default function App() {
  const [consultingHistory, setConsultingHistory] = useState<ConsultingData[]>([]);
  const [currentResult, setCurrentResult] = useState<ConsultingData | null>(null);

  const handleConsultingComplete = (data: ConsultingData) => {
    setCurrentResult(data);
    setConsultingHistory(prev => [data, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BookOpen className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">진로 상담 AI</h1>
          </div>
          <p className="text-gray-600">당신의 진로와 관심사에 맞는 맞춤형 상담을 받아보세요</p>
        </header>

        <Tabs defaultValue="consult" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="consult">상담 받기</TabsTrigger>
            <TabsTrigger value="history">상담 기록</TabsTrigger>
          </TabsList>

          <TabsContent value="consult" className="space-y-6">
            <CareerConsultingForm onComplete={handleConsultingComplete} />
            {currentResult && (
              <ConsultingResult data={currentResult} />
            )}
          </TabsContent>

          <TabsContent value="history">
            <ConsultingHistory history={consultingHistory} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
