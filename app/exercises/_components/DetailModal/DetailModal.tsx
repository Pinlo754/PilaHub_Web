"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExerciseType } from "@/utils/ExerciseType";
import { ExerciseEquipmentType } from "@/utils/ExerciseEquipmentType";
import { TutorialService } from "@/hooks/tutorial.service";
import { ExerciseEquipmentService } from "@/hooks/exerciseEquipment.service";
import {
  BookOpen,
  LoaderCircle,
  BadgeCheck,
  XCircle,
  FileText,
  Dumbbell,
} from "lucide-react";
import TabButton from "./TabButton";
import ExerciseTab from "./ExerciseTab";
import EquipmentTab from "./EquipmentTab";
import TutorialTab from "./TutorialTab";
import { TutorialType } from "@/utils/TutorialType";

type TabKey = "info" | "equipment" | "tutorial";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: ExerciseType;
};

const DetailModal = ({ open, onOpenChange, exercise }: Props) => {
  const [activeTab, setActiveTab] = useState<TabKey>("info");

  // Tutorial
  const [tutorial, setTutorial] = useState<TutorialType | null>(null);
  const [isTutorialLoading, setIsTutorialLoading] = useState(false);

  // Equipment
  const [equipments, setEquipments] = useState<ExerciseEquipmentType[]>([]);
  const [isEquipmentLoading, setIsEquipmentLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setTutorial(null);
      setEquipments([]);
      setActiveTab("info");
      return;
    }

    // Fetch tutorial
    const fetchTutorial = async () => {
      setIsTutorialLoading(true);
      try {
        const res = await TutorialService.getById(exercise.exerciseId);
        setTutorial(res);
      } catch {
        setTutorial(null);
      } finally {
        setIsTutorialLoading(false);
      }
    };

    // Fetch equipments
    const fetchEquipments = async () => {
      setIsEquipmentLoading(true);
      try {
        const res = await ExerciseEquipmentService.getById(exercise.exerciseId);
        setEquipments(res);
      } catch {
        setEquipments([]);
      } finally {
        setIsEquipmentLoading(false);
      }
    };

    fetchTutorial();
    fetchEquipments();
  }, [open, exercise.exerciseId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl rounded-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Chi tiết bài tập
          </DialogTitle>
        </DialogHeader>

        {/* TABS */}
        <div className="flex gap-1 border-b border-orange-100 -mt-1 shrink-0">
          <TabButton
            active={activeTab === "info"}
            onClick={() => setActiveTab("info")}
            icon={<FileText size={14} />}
            label="Thông tin"
          />
          <TabButton
            active={activeTab === "equipment"}
            onClick={() => setActiveTab("equipment")}
            icon={<Dumbbell size={14} />}
            label="Thiết bị"
            badge={
              isEquipmentLoading ? (
                <LoaderCircle
                  size={11}
                  className="animate-spin text-orange-400 ml-1"
                />
              ) : equipments.length > 0 ? (
                <span className="ml-1.5 px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold leading-none">
                  {equipments.length}
                </span>
              ) : (
                <XCircle size={13} className="text-gray-300 ml-1" />
              )
            }
          />
          <TabButton
            active={activeTab === "tutorial"}
            onClick={() => setActiveTab("tutorial")}
            icon={<BookOpen size={14} />}
            label="Hướng dẫn"
            badge={
              isTutorialLoading ? (
                <LoaderCircle
                  size={11}
                  className="animate-spin text-orange-400 ml-1"
                />
              ) : tutorial ? (
                <BadgeCheck size={13} className="text-green-500 ml-1" />
              ) : (
                <XCircle size={13} className="text-gray-300 ml-1" />
              )
            }
          />
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto flex-1 pb-2">
          {activeTab === "info" && <ExerciseTab exercise={exercise} />}
          {activeTab === "equipment" && (
            <EquipmentTab
              equipments={equipments}
              isLoading={isEquipmentLoading}
            />
          )}
          {activeTab === "tutorial" && (
            <div className="pt-3">
              <TutorialTab tutorial={tutorial} isLoading={isTutorialLoading} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
