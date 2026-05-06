import { Button } from './components/ui/button';

export default function App() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="grid grid-cols-2 gap-4">
        <Button className="w-40 h-40">버튼 1</Button>
        <Button className="w-40 h-40">버튼 2</Button>
        <Button className="w-40 h-40">버튼 3</Button>
        <Button className="w-40 h-40">버튼 4</Button>
      </div>
    </div>
  );
}
