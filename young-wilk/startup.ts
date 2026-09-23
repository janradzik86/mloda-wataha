export interface YoungWolfStartupPrompt {
  id: string;
  text: string;
  primaryAction: "ask_anything";
  secondaryActions: Array<"school_help" | "review" | "build_game">;
}

/**
 * Start nie narzuca tematu szkoły.
 * Dziecko ma móc od razu powiedzieć lub zapytać o cokolwiek.
 * Check-in szkolny pojawia się dopiero po odpowiedzi na bieżący temat.
 */
export function createStartupPrompt(childName?: string): YoungWolfStartupPrompt {
  const hello = childName ? `Cześć, ${childName}! ` : "Cześć! ";
  return {
    id: "open-conversation",
    text: hello + "Jestem. Możesz mnie zapytać o coś, opowiedzieć mi, co się dzieje, albo poprosić o pomoc.",
    primaryAction: "ask_anything",
    secondaryActions: ["school_help", "review", "build_game"]
  };
}
