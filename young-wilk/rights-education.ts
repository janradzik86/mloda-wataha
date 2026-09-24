export type RightsTopic =
  | "dignity"
  | "equality"
  | "child_protection"
  | "being_heard"
  | "privacy"
  | "education"
  | "freedom_of_expression"
  | "freedom_of_conscience"
  | "protection_from_violence"
  | "public_authorities";

export interface RightsLesson {
  id: string;
  title: string;
  plainLanguage: string;
  sourceRefs: string[];
  scenario: string;
  question: string;
}

export const RIGHTS_LESSONS: RightsLesson[] = [
  {
    id: "rights.dignity",
    title: "Godność",
    plainLanguage: "Każdy człowiek ma godność. To z niej wynikają podstawowe wolności i prawa. Władze publiczne mają obowiązek ją szanować i chronić.",
    sourceRefs: ["Konstytucja RP art. 30"],
    scenario: "Ktoś w urzędzie mówi do dziecka poniżająco i traktuje je jak kogoś, kogo zdanie nie ma znaczenia.",
    question: "Jak można spokojnie powiedzieć, że chce się być potraktowanym z szacunkiem?"
  },
  {
    id: "rights.equality",
    title: "Równe traktowanie",
    plainLanguage: "Prawa nie zależą od tego, czy ktoś jest bogaty, biedny, popularny, skąd pochodzi albo jakie ma poglądy.",
    sourceRefs: ["Konstytucja RP art. 32", "Konwencja o prawach dziecka"],
    scenario: "Dwie osoby w podobnej sytuacji są traktowane inaczej tylko dlatego, że jedna pochodzi z innej rodziny lub kraju.",
    question: "Co jest tu nie w porządku i jak można to opisać bez obrażania kogokolwiek?"
  },
  {
    id: "rights.child-protection",
    title: "Ochrona praw dziecka",
    plainLanguage: "Państwo ma obowiązek chronić prawa dziecka, w tym przed przemocą, okrucieństwem, wyzyskiem i demoralizacją.",
    sourceRefs: ["Konstytucja RP art. 72"],
    scenario: "Dziecko widzi, że ktoś je straszy albo krzywdzi i nie wie, czy może poprosić urząd lub inną instytucję o pomoc.",
    question: "Do kogo zaufanego można zwrócić się po pomoc?"
  },
  {
    id: "rights.being-heard",
    title: "Prawo do bycia wysłuchanym",
    plainLanguage: "W sprawach dotyczących dziecka jego zdanie powinno zostać wysłuchane odpowiednio do wieku i dojrzałości.",
    sourceRefs: ["Konstytucja RP art. 72 ust. 3", "Konwencja o prawach dziecka"],
    scenario: "Dorośli podejmują decyzję dotyczącą dziecka, ale nikt nie pyta go, co o tym myśli.",
    question: "Jak dziecko może spokojnie poprosić o możliwość przedstawienia swojego zdania?"
  },
  {
    id: "rights.privacy",
    title: "Prywatność",
    plainLanguage: "Dziecko ma prawo do ochrony życia prywatnego, rodzinnego i korespondencji.",
    sourceRefs: ["Konwencja o prawach dziecka"],
    scenario: "Ktoś bez wyraźnego powodu próbuje publikować prywatne informacje albo czytać prywatną korespondencję.",
    question: "Jak odróżnić uzasadnioną ochronę bezpieczeństwa od zwykłego naruszania prywatności?"
  },
  {
    id: "rights.education",
    title: "Prawo do nauki",
    plainLanguage: "Dziecko ma prawo do nauki. Nauka ma pomagać w rozwoju wiedzy, umiejętności i samodzielnego myślenia.",
    sourceRefs: ["Konstytucja RP art. 70", "Konwencja o prawach dziecka"],
    scenario: "Uczeń nie rozumie materiału i boi się poprosić o wyjaśnienie.",
    question: "Jak można poprosić o pomoc albo inne wyjaśnienie bez wstydu?"
  }
];

export function rightsLessonById(id: string) {
  return RIGHTS_LESSONS.find(x => x.id === id);
}

export function rightsLearningRules() {
  return [
    "Uczymy praw razem z odpowiedzialnością za szacunek wobec praw innych osób.",
    "Nie przedstawiamy każdego sporu jako naruszenia prawa.",
    "Młody WILK odróżnia: prawo, procedurę, opinię i przypuszczenie.",
    "W sprawach indywidualnych zachęca do rozmowy z rodzicem, opiekunem albo właściwą instytucją.",
    "Nie udaje prawnika i nie gwarantuje wyniku sprawy."
  ];
}
