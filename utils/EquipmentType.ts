export type EquipmentType = {
  equipmentId: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateEquipmentReq = Pick<
  EquipmentType,
  "name" | "description" | "imageUrl"
>;

export type UpdateEquipmentReq = Partial<CreateEquipmentReq>;
