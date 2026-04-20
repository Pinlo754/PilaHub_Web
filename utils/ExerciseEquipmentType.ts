export type ExerciseEquipmentType = {
  exerciseEquipmentId: string;
  exerciseId: string;
  equipmentId: string;
  equipmentName: string;
  required: boolean;
  alternative: boolean;
  quantity: number;
  usageNotes: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateExerciseEquipmentReq = Pick<
  ExerciseEquipmentType,
  | "exerciseId"
  | "equipmentId"
  | "required"
  | "alternative"
  | "quantity"
  | "usageNotes"
>;

export type UpdateExerciseEquipmentReq = Pick<
  ExerciseEquipmentType,
  "required" | "alternative" | "quantity" | "usageNotes"
>;
