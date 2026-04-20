import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
};

const Pagination = ({ onNext, onPrev, page, totalPages }: Props) => {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={onPrev}
        disabled={page === 0}
        className="p-1 hover:bg-orange-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} className="text-orange-600" />
      </button>
      <span className="text-gray-600 text-sm">
        {page + 1} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page + 1 >= totalPages}
        className="p-1 hover:bg-orange-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} className="text-orange-600" />
      </button>
    </div>
  );
};

export default Pagination;
