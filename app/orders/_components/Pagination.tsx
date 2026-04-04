import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="p-1 hover:bg-orange-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} className="text-orange-600" />
      </button>
      <span className="text-gray-600 text-sm">
        {currentPage + 1} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage + 1 >= totalPages}
        className="p-1 hover:bg-orange-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} className="text-orange-600" />
      </button>
    </div>
  );
};

export default Pagination;
