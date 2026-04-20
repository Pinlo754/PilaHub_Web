const TabButton = ({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
      active
        ? "border-orange-500 text-orange-700"
        : "border-transparent text-gray-500 hover:text-gray-700"
    }`}
  >
    {icon}
    {label}
    {badge}
  </button>
);

export default TabButton;
