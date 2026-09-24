import type { SchoolHelpRequest, SchoolHelpReply, SchoolSubject } from "./types";
import { LESSONS } from "./knowledge";
import type { YoungWolfTutor } from "./core";

const SUBJECT_WORDS: Array<[SchoolSubject, string[]]> = [
  ["math", ["matematyka", "matma", "ułamki", "ulamki", "równania", "rownania", "procenty", "geometria"]],
  ["polish", ["polski", "język polski", "jezyk polski", "lektura", "gramatyka", "ortografia"]],
  ["english", ["angielski", "english", "słówka", "slowka", "czasowniki"]],
  ["science", ["przyroda"]],
  ["history", ["historia"]],
  ["geography", ["geografia"]],
  ["physics", ["fizyka"]],
  ["chemistry", ["chemia"]],
  ["biology", ["biologia"]],
  ["computer_science", ["informatyka", "komputer"]]
];

const TOPIC_HINTS: Array<[string, string[]]> = [
  ["math.fractions.basic", ["ułamek", "ulamki", "ułamki", "licznik", "mianownik", "połowa", "polowa", "ćwierć", "cwierc"]],
  ["digital.safety.basics", ["bezpieczeństwo w sieci", "bezpieczenstwo w sieci", "internet", "hasło", "haslo", "phishing"]],
  ["crisis.basic", ["bezpieczeństwo", "bezpieczenstwo", "112", "pożar", "pozar", "zgubiłem", "zgubilam"]]
];

function norm(s: string) {
  return s.toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l")
    .trim();
}

export function parseSchoolHelp(rawText: string): SchoolHelpRequest {
  const q = norm(rawText);
  const subject = SUBJECT_WORDS.find(([, words]) => words.some(w => q.includes(norm(w))))?.[0];
  const topic = TOPIC_HINTS.find(([, words]) => words.some(w => q.includes(norm(w))))?.[0];
  const saidDidNotUnderstand = [
    "nie rozumiem",
    "nie zrozumialem",
    "nie zrozumialam",
    "nie kumam",
    "bylo dla mnie trudne",
    "byla dla mnie trudna",
    "nie ogarnalem",
    "nie ogarnelam",
    "mozesz mi wytlumaczyc",
    "wytlumacz mi"
  ].some(p => q.includes(p));

  return {
    rawText,
    subject,
    topicHint: topic,
    saidDidNotUnderstand
  };
}

export function handleSchoolHelp(tutor: YoungWolfTutor, rawText: string): SchoolHelpReply {
  const parsed = parseSchoolHelp(rawText);

  if (parsed.topicHint) {
    const style = tutor.chooseTeachingStyle(parsed.topicHint, rawText);
    return {
      understoodRequest: true,
      matchedTopicId: parsed.topicHint,
      subject: parsed.subject,
      reply: tutor.explain(parsed.topicHint, style, rawText),
      needsClarification: false
    };
  }

  const subjectName = parsed.subject ? subjectLabel(parsed.subject) : "tej lekcji";
  const clarificationPrompt = parsed.saidDidNotUnderstand
    ? `Jasne. Napisz mi proszę, czego dokładnie dotyczył temat z ${subjectName}. Możesz podać nazwę z tablicy, jedno zadanie albo zdanie, którego nie rozumiesz.`
    : "Powiedz mi, jaki temat był dziś w szkole i co dokładnie było niejasne.";

  return {
    understoodRequest: parsed.saidDidNotUnderstand || Boolean(parsed.subject),
    subject: parsed.subject,
    reply: {
      text: clarificationPrompt,
      style: "simple",
      ageBand: tutor.getAgeBand(),
      suggestedNext: "practice"
    },
    needsClarification: true,
    clarificationPrompt
  };
}

export function suggestKnownSchoolTopics(subject?: SchoolSubject): string[] {
  if (subject === "math") return LESSONS.filter(x => x.topicId.startsWith("math.")).map(x => x.title);
  if (subject === "computer_science") return LESSONS.filter(x => x.topicId.startsWith("digital.")).map(x => x.title);
  return LESSONS.map(x => x.title);
}

function subjectLabel(subject: SchoolSubject) {
  const labels: Record<SchoolSubject, string> = {
    math: "matematyki",
    polish: "języka polskiego",
    english: "angielskiego",
    science: "przyrody",
    history: "historii",
    geography: "geografii",
    physics: "fizyki",
    chemistry: "chemii",
    biology: "biologii",
    computer_science: "informatyki",
    other: "lekcji"
  };
  return labels[subject];
}
