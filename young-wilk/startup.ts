export interface YoungWolfStartupPrompt {
  id: string;
  text: string;
  primaryAction: "school_help";
  secondaryActions: Array<"ask_anything" | "review" | "build_game">;
}

export function createStartupPrompt(childName?: string): YoungWolfStartupPrompt {
  const hello = childName ? `Cześć, ${childName}! ` : "Cześć! ";
  return {
    id: "school-check-in",
    text: hello + "Czy było dziś w szkole coś, czego nie zrozumiałeś albo co chcesz ze mną przeanalizować? Możemy rozłożyć to na proste kroki.",
    primaryAction: "school_help",
    secondaryActions: ["ask_anything", "review", "build_game"]
  };
}
