const StatCard = ({
  icon,
  label,
  value,
  highlight,
  warn,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
  warn?: boolean;
}) => (
  <div
    className={`rounded-xl p-3 text-center border space-y-1 ${
      highlight
        ? "bg-indigo-50 border-indigo-100"
        : warn
          ? "bg-orange-50 border-orange-100"
          : "bg-gray-50 border-gray-100"
    }`}
  >
    <div
      className={`flex justify-center ${
        highlight
          ? "text-indigo-400"
          : warn
            ? "text-orange-400"
            : "text-gray-400"
      }`}
    >
      {icon}
    </div>
    <p
      className={`text-sm font-semibold ${
        highlight
          ? "text-indigo-700"
          : warn
            ? "text-orange-700"
            : "text-gray-700"
      }`}
    >
      {value}
    </p>
    <p className="text-xs text-gray-400">{label}</p>
  </div>
);

export default StatCard;