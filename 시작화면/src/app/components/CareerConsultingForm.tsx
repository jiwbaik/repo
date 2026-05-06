import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Loader2, Sparkles } from 'lucide-react';
import { ConsultingData } from '../App';

interface CareerConsultingFormProps {
  onComplete: (data: ConsultingData) => void;
}

const CAREER_OPTIONS = [
  '의료/보건',
  '교육',
  '공학/기술',
  '예술/디자인',
  '경영/경제',
  '법률',
  '과학/연구',
  '미디어/콘텐츠',
  '사회복지',
  '스포츠'
];

const SUBJECT_OPTIONS = [
  '수학',
  '과학',
  '영어',
  '국어',
  '사회',
  '역사',
  '미술',
  '음악',
  '체육',
  '컴퓨터',
  '생물',
  '화학',
  '물리',
  '경제',
  '지리'
];

export function CareerConsultingForm({ onComplete }: CareerConsultingFormProps) {
  const [selectedCareer, setSelectedCareer] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [concerns, setConcerns] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const generateAdvice = (career: string, subjects: string[], concerns: string): string => {
    const adviceTemplates = {
      '의료/보건': `${subjects.join(', ')}에 관심이 있으시군요! 의료 분야는 과학적 지식과 인간에 대한 이해가 필요합니다. ${subjects.includes('생물') || subjects.includes('과학') ? '생물학적 기초가 탄탄하신 것 같아요.' : '생물학과 화학 공부를 추가로 하면 도움이 될 거예요.'} 의대, 간호대, 보건대학원 등의 진로를 고려해보세요.`,
      '공학/기술': `${subjects.join(', ')}를 좋아하시는군요! 공학은 문제 해결 능력과 논리적 사고가 중요합니다. ${subjects.includes('수학') || subjects.includes('물리') ? '수학/물리 기초가 있어서 유리합니다.' : '수학과 물리 실력을 키우면 좋습니다.'} 컴퓨터공학, 전자공학, 기계공학 등을 탐색해보세요.`,
      '예술/디자인': `창의적인 분야에 관심이 있으시군요! ${subjects.includes('미술') ? '미술 감각이 있으시니' : '예술적 감각을 개발하면서'} 디자인, 시각예술, 영상 등의 분야를 공부해보세요. 포트폴리오 준비도 중요합니다.`,
      '교육': `${subjects.join(', ')}를 가르치는 것에 관심이 있으시군요. 교육자는 전문 지식과 함께 소통 능력이 중요합니다. 사범대학이나 교육대학원 진학을 고려해보세요.`,
      '경영/경제': `비즈니스 분야에 관심이 있으시군요. ${subjects.includes('수학') || subjects.includes('경제') ? '수리적 사고력이 도움이 될 거예요.' : ''} 경영학, 경제학, 회계학 등을 전공으로 고려해보세요.`
    };

    const defaultAdvice = `${career} 분야는 매우 유망한 진로입니다. ${subjects.join(', ')}에 대한 관심을 바탕으로 관련 전공과 자격증을 준비하세요. 실무 경험을 쌓을 수 있는 인턴십이나 프로젝트 활동도 추천합니다.`;

    const baseAdvice = adviceTemplates[career as keyof typeof adviceTemplates] || defaultAdvice;

    const concernAdvice = concerns ? `\n\n고민하신 내용에 대해: ${concerns.length > 20 ? '깊이 생각해보셨네요.' : ''} 이러한 고민은 자연스러운 과정입니다. 멘토를 찾거나 관련 분야 종사자와 대화를 나눠보는 것을 추천합니다. 진로는 한 번에 정해지는 것이 아니라 계속 발전하는 과정임을 기억하세요.` : '';

    return baseAdvice + concernAdvice + '\n\n화이팅입니다! 🌟';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCareer || selectedSubjects.length === 0) {
      alert('진로와 과목을 선택해주세요.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const advice = generateAdvice(selectedCareer, selectedSubjects, concerns);

      const consultingData: ConsultingData = {
        id: Date.now().toString(),
        career: selectedCareer,
        subjects: selectedSubjects,
        concerns,
        advice,
        timestamp: new Date()
      };

      onComplete(consultingData);
      setIsGenerating(false);

      setSelectedCareer('');
      setSelectedSubjects([]);
      setConcerns('');
    }, 2000);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>진로 상담 신청</CardTitle>
        <CardDescription>
          희망 진로와 관심 과목을 선택하고 고민을 작성해주세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>희망 진로 분야</Label>
            <div className="flex flex-wrap gap-2">
              {CAREER_OPTIONS.map(career => (
                <Badge
                  key={career}
                  variant={selectedCareer === career ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => setSelectedCareer(career)}
                >
                  {career}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>좋아하는 과목 (여러 개 선택 가능)</Label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map(subject => (
                <Badge
                  key={subject}
                  variant={selectedSubjects.includes(subject) ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => toggleSubject(subject)}
                >
                  {subject}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="concerns">진로 고민 (선택사항)</Label>
            <Textarea
              id="concerns"
              placeholder="진로에 대한 고민이나 궁금한 점을 자유롭게 작성해주세요..."
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isGenerating || !selectedCareer || selectedSubjects.length === 0}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI 상담 생성 중...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                AI 상담 받기
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
