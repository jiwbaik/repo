import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { Package, CalendarEvent, BlockType, BLOCK_TYPE_LABELS } from '../types';
import { X, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  packages: Package[];
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
}

export function CalendarView({ packages, events, onAddEvent, onDeleteEvent }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [selectedBlockType, setSelectedBlockType] = useState<BlockType>('preview');

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const selectedDateStr = selectedDate ? formatDate(selectedDate) : '';
  const dayEvents = events.filter((e) => e.date === selectedDateStr);

  const handleAddEvent = () => {
    if (!selectedDate || !selectedPackageId) return;

    onAddEvent({
      date: formatDate(selectedDate),
      packageId: selectedPackageId,
      blockType: selectedBlockType,
    });

    setShowEventForm(false);
    setSelectedPackageId('');
  };

  const getEventTasks = (event: CalendarEvent) => {
    const pkg = packages.find((p) => p.id === event.packageId);
    if (!pkg) return [];

    const block = pkg.blocks.find((b) => b.type === event.blockType);
    return block?.tasks || [];
  };

  const getEventPackage = (event: CalendarEvent) => {
    return packages.find((p) => p.id === event.packageId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* 캘린더 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <CalendarIcon size={24} />
          캘린더
        </h2>
        <div className="flex justify-center">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="border-2 border-gray-200 rounded-lg p-4"
          />
        </div>
      </div>

      {/* 선택된 날짜의 To Do */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {selectedDate
              ? `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 할 일`
              : '날짜를 선택하세요'}
          </h2>
          {selectedDate && (
            <button
              onClick={() => setShowEventForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
            >
              + 추가
            </button>
          )}
        </div>

        {!selectedDate && (
          <p className="text-gray-500 text-center py-8">
            캘린더에서 날짜를 선택해주세요
          </p>
        )}

        {selectedDate && dayEvents.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            이 날짜에 등록된 일정이 없습니다
          </p>
        )}

        <div className="space-y-4">
          {dayEvents.map((event) => {
            const pkg = getEventPackage(event);
            const tasks = getEventTasks(event);

            if (!pkg) return null;

            return (
              <div
                key={event.id}
                className="border-2 rounded-lg p-4"
                style={{ borderColor: pkg.color }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold" style={{ color: pkg.color }}>
                      {pkg.subject}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {BLOCK_TYPE_LABELS[event.blockType]}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <ul className="text-sm space-y-1 mt-3">
                  {tasks.map((task, idx) => (
                    <li key={idx} className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-2" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* 일정 추가 모달 */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">일정 추가</h3>
                <button
                  onClick={() => setShowEventForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">패키지 선택</label>
                  <select
                    value={selectedPackageId}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">패키지를 선택하세요</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">블록 타입</label>
                  <select
                    value={selectedBlockType}
                    onChange={(e) => setSelectedBlockType(e.target.value as BlockType)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="preview">예습</option>
                    <option value="review">복습(평소)</option>
                    <option value="exam-3week">시험 3주전</option>
                    <option value="exam-2week">시험 2주전</option>
                    <option value="exam-1week">시험 1주전</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEventForm(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleAddEvent}
                  disabled={!selectedPackageId}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
