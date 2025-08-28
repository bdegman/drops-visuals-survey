interface ProgressProps {
  currentIndex: number;
  total: number;
}

export default function Progress({ currentIndex, total }: ProgressProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-90 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-white font-medium">
            {currentIndex + 1} / {total}
          </div>
          <div className="w-32 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
