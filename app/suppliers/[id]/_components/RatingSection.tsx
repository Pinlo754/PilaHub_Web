import { Star } from "lucide-react";

const RatingSection = () => {
  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 p-6">
      <h3 className="text-lg font-semibold text-orange-700 mb-4">Đánh giá</h3>
      <div className="flex justify-center gap-1 mb-3">
        {[...Array(4)].map((_, i) => (
          <Star key={i} size={32} className="text-yellow-400 fill-yellow-400" />
        ))}
        <Star size={32} className="text-gray-300" />
      </div>
      <p className="text-center text-2xl font-bold text-gray-700">4/5</p>
    </div>
  );
};

export default RatingSection;
