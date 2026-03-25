import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center animate-pulse">
          <span className="text-white font-black text-lg">A</span>
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-red-500" />
      </div>
    </div>
  );
}