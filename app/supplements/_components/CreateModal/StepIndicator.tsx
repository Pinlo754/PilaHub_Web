type Props = {
  currentStep: "info" | "ingredients" | "purposes";
};

const STEPS = [
  { key: "info", label: "Thông tin" },
  { key: "ingredients", label: "Nguyên liệu" },
  { key: "purposes", label: "Mục đích" },
];

export const StepIndicator = ({ currentStep }: Props) => {
  const stepIdx = STEPS.findIndex((s) => s.key === currentStep);
  return (
    <div className="flex items-center gap-2 pt-2">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-semibold ${i <= stepIdx ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"}`}
          >
            {i + 1}
          </div>
          <span
            className={`text-xs ${i === stepIdx ? "text-orange-700 font-medium" : "text-gray-400"}`}
          >
            {s.label}
          </span>
          {i < STEPS.length - 1 && (
            <div
              className={`h-px w-6 ${i < stepIdx ? "bg-orange-400" : "bg-gray-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
