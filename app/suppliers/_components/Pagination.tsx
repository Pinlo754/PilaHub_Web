import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = () => {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button className="p-1 hover:bg-orange-100 rounded transition-colors">
        <ChevronLeft size={20} className="text-orange-600" />
      </button>
      <span className="text-gray-600 text-sm">1 / 2</span>
      <button className="p-1 hover:bg-orange-100 rounded transition-colors">
        <ChevronRight size={20} className="text-orange-600" />
      </button>
    </div>
  );
};

export default Pagination;
