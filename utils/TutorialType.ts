export type TutorialType = {
  tutorialId: string;
  exerciseId: string;
  practiceVideoUrl: string;
  theoryVideoUrl: string;
  commonMistakes: string;
  guidelines: string;
  breathingTechnique: string;
  published: boolean;
};

export type CreateTutorialReq = Omit<TutorialType, "tutorialId">;

export type UpdateTutorialReq = Omit<TutorialType, "tutorialId" | "exerciseId">;
