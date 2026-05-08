export const BODY_PART = {
  Head: "Head",
  Neck: "Neck",
  CervicalSpine: "Cervical Spine",
  ThoracicSpine: "Thoracic Spine",
  LumbarSpine: "Lumbar Spine",
  Core: "Core",
  Shoulders: "Shoulders",
  UpperBack: "Upper Back",
  LowerBack: "Lower Back",
  Chest: "Chest",
  UpperArms: "Upper Arms",
  Elbows: "Elbows",
  Forearms: "Forearms",
  Wrists: "Wrists",
  Hands: "Hands",
  Hips: "Hips",
  Glutes: "Glutes",
  Thighs: "Thighs",
  Knees: "Knees",
  Calves: "Calves",
  Ankles: "Ankles",
  Feet: "Feet",
} as const;

export type BodyPartNameType = (typeof BODY_PART)[keyof typeof BODY_PART];

export type BodyPartType = {
  bodyPartId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateBodyPartReq = Pick<BodyPartType, "name" | "description">;

export type UpdateBodyPartReq = Partial<CreateBodyPartReq>;
