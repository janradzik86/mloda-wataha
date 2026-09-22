export const SUBJECTS = [
  { id: "math", namePl: "Matematyka", blurb: "Liczby, ułamki, zagadki." },
  { id: "polish", namePl: "Język polski", blurb: "Zdania, opowieści, ortografia." },
  { id: "english", namePl: "Angielski", blurb: "Słówka i krótkie rozmowy." },
  { id: "science", namePl: "Przyroda", blurb: "Las, zwierzęta, pory roku." },
  { id: "biology", namePl: "Biologia", blurb: "Ciało, rośliny, życie." },
  { id: "geography", namePl: "Geografia", blurb: "Mapy, rzeki, kraje." },
  { id: "history", namePl: "Historia", blurb: "Dawne historie Polski." },
  { id: "physics", namePl: "Fizyka", blurb: "Siły, światło, ruch." },
  { id: "chemistry", namePl: "Chemia", blurb: "Substancje i mieszanki." },
  { id: "computer_science", namePl: "Informatyka", blurb: "Komputery i logiczne układanki." },
] as const;

export type SubjectId = (typeof SUBJECTS)[number]["id"];
