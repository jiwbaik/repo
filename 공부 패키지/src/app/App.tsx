import { useState, useEffect } from 'react';
import { Package, CalendarEvent, BlockType } from './types';
import { PackageCard } from './components/PackageCard';
import { PackageEditor } from './components/PackageEditor';
import { TemplateSelector } from './components/TemplateSelector';
import { CalendarView } from './components/CalendarView';
import { TemplateLibrary } from './components/TemplateLibrary';
import { LayoutGrid, Calendar, BookOpen, Plus } from 'lucide-react';

type View = 'dashboard' | 'templates' | 'calendar';

export default function App() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [templateSelectorState, setTemplateSelectorState] = useState<{
    show: boolean;
    blockType: BlockType;
    blockIndex: number;
  } | null>(null);

  // localStorage에서 데이터 로드
  useEffect(() => {
    const savedPackages = localStorage.getItem('study-packages');
    const savedEvents = localStorage.getItem('study-events');

    if (savedPackages) {
      setPackages(JSON.parse(savedPackages));
    }
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // packages 변경 시 localStorage에 저장
  useEffect(() => {
    if (packages.length > 0) {
      localStorage.setItem('study-packages', JSON.stringify(packages));
    }
  }, [packages]);

  // events 변경 시 localStorage에 저장
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('study-events', JSON.stringify(events));
    }
  }, [events]);

  const handleSavePackage = (pkg: Package) => {
    const existingIndex = packages.findIndex((p) => p.id === pkg.id);
    if (existingIndex >= 0) {
      const newPackages = [...packages];
      newPackages[existingIndex] = pkg;
      setPackages(newPackages);
    } else {
      setPackages([...packages, pkg]);
    }
    setShowEditor(false);
    setEditingPackage(null);
  };

  const handleDeletePackage = (id: string) => {
    if (confirm('이 패키지를 삭제하시겠습니까?')) {
      setPackages(packages.filter((p) => p.id !== id));
      setEvents(events.filter((e) => e.packageId !== id));
    }
  };

  const handleEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setShowEditor(true);
  };

  const handleNewPackage = () => {
    setEditingPackage(null);
    setShowEditor(true);
  };

  const handleCopyFromTemplate = (blockType: BlockType) => {
    const blockIndex = editingPackage?.blocks.findIndex((b) => b.type === blockType) ?? 0;
    setTemplateSelectorState({
      show: true,
      blockType,
      blockIndex,
    });
  };

  const handleSelectTemplate = (tasks: string[]) => {
    if (!editingPackage || !templateSelectorState) return;

    const newBlocks = [...editingPackage.blocks];
    const blockIndex = templateSelectorState.blockIndex;
    newBlocks[blockIndex] = {
      ...newBlocks[blockIndex],
      tasks: [...tasks],
    };

    setEditingPackage({
      ...editingPackage,
      blocks: newBlocks,
    });
  };

  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents([...events, newEvent]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            공부 패키지 매니저
          </h1>
          <p className="text-gray-600 mt-1">나만의 공부 계획을 체계적으로 관리하세요</p>
        </div>
      </header>

      {/* 네비게이션 */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors ${
                currentView === 'dashboard'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid size={20} />
              내 패키지
            </button>
            <button
              onClick={() => setCurrentView('templates')}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors ${
                currentView === 'templates'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen size={20} />
              템플릿
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors ${
                currentView === 'calendar'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar size={20} />
              캘린더
            </button>
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">내 공부 패키지</h2>
              <button
                onClick={handleNewPackage}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
              >
                <Plus size={20} />
                새 패키지 만들기
              </button>
            </div>

            {packages.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 mb-4">아직 생성된 패키지가 없습니다.</p>
                <button
                  onClick={handleNewPackage}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  첫 패키지 만들기
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    package={pkg}
                    onEdit={handleEditPackage}
                    onDelete={handleDeletePackage}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'templates' && <TemplateLibrary />}

        {currentView === 'calendar' && (
          <CalendarView
            packages={packages}
            events={events}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}
      </main>

      {/* 패키지 편집 모달 */}
      {showEditor && (
        <PackageEditor
          package={editingPackage || undefined}
          onSave={handleSavePackage}
          onClose={() => {
            setShowEditor(false);
            setEditingPackage(null);
          }}
          onCopyFromTemplate={handleCopyFromTemplate}
        />
      )}

      {/* 템플릿 선택 모달 */}
      {templateSelectorState?.show && (
        <TemplateSelector
          blockType={templateSelectorState.blockType}
          onSelect={handleSelectTemplate}
          onClose={() => setTemplateSelectorState(null)}
        />
      )}
    </div>
  );
}