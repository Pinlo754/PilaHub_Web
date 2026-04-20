const COLOR_MAP = {
  green: {
    bg: "bg-green-50",
    border: "border-green-100",
    label: "text-green-700",
    text: "text-green-800",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    label: "text-blue-700",
    text: "text-blue-800",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-100",
    label: "text-red-700",
    text: "text-red-800",
  },
};

export type TextBlockColor = keyof typeof COLOR_MAP;

const TextBlock = ({
  icon,
  label,
  content,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  content: string;
  color: TextBlockColor;
}) => {
  const c = COLOR_MAP[color];
  return (
    <div className={`rounded-xl p-4 border ${c.bg} ${c.border}`}>
      <div
        className={`flex items-center gap-1.5 text-xs font-semibold mb-2 ${c.label}`}
      >
        {icon}
        {label}
      </div>
      <p className={`text-sm leading-relaxed whitespace-pre-line ${c.text}`}>
        {content}
      </p>
    </div>
  );
};

export default TextBlock;
