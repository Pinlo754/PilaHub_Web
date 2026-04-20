import {
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Wind,
  LoaderCircle,
} from "lucide-react";
import { TutorialType } from "@/utils/ExerciseType";
import TextBlock from "./TextBlock";
import VideoBlock from "./VideoBlock";

type Props = {
  tutorial: TutorialType | null;
  isLoading: boolean;
};

const TutorialTab = ({ tutorial, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoaderCircle size={28} className="animate-spin text-orange-400" />
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
        <BookOpen size={36} className="opacity-25" />
        <p className="text-sm">Chưa có hướng dẫn cho bài tập này</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-base text-gray-400">
          {tutorial.tutorialId.slice(0, 8)}...
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            tutorial.published
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {tutorial.published ? "Đã xuất bản" : "Bản nháp"}
        </span>
      </div>

      {/* Videos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VideoBlock label="Video lý thuyết" url={tutorial.theoryVideoUrl} />
        <VideoBlock label="Video thực hành" url={tutorial.practiceVideoUrl} />
      </div>

      {/* Text content */}
      <TextBlock
        icon={<CheckCircle size={14} className="text-green-500" />}
        label="Hướng dẫn thực hiện"
        content={tutorial.guidelines}
        color="green"
      />
      <TextBlock
        icon={<AlertTriangle size={14} className="text-red-500" />}
        label="Lỗi thường gặp"
        content={tutorial.commonMistakes}
        color="red"
      />
      <TextBlock
        icon={<Wind size={14} className="text-blue-500" />}
        label="Kỹ thuật thở"
        content={tutorial.breathingTechnique}
        color="blue"
      />
    </div>
  );
};

export default TutorialTab;
