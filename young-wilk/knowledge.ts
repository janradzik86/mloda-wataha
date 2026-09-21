import type { LessonChunk } from "./types";

export const LESSONS: LessonChunk[] = [
  {
    topicId: "math.fractions.basic",
    title: "Ułamki bez strachu",
    concept: "Ułamek pokazuje część całości.",
    examplesByBand: {
      "7-9": ["Pizza podzielona na 4 kawałki: 1 kawałek to 1/4."],
      "10-12": ["3/5 oznacza 3 części z 5 równych części całości."],
      "13-15": ["Ułamki opisują proporcję dwóch liczb i mogą być upraszczane."],
      "16+": ["Ułamek można traktować jako iloraz, proporcję lub zapis liczby wymiernej."]
    },
    practiceByBand: {
      "7-9": ["Masz 8 klocków. Ile to połowa?"],
      "10-12": ["Który ułamek jest większy: 2/3 czy 3/5?"],
      "13-15": ["Uprość 18/24."],
      "16+": ["Rozwiąż: x/12 = 3/4."]
    }
  },
  {
    topicId: "digital.safety.basics",
    title: "Bezpiecznie w sieci",
    concept: "Nie udostępniaj obcym danych, które mogą wskazać kim jesteś lub gdzie dokładnie jesteś.",
    examplesByBand: {
      "7-9": ["Nie wysyłaj obcej osobie adresu domu ani nazwy szkoły."],
      "10-12": ["Nie publikuj numeru telefonu, dokładnej lokalizacji ani haseł."],
      "13-15": ["Sprawdzaj prywatność konta i nie klikaj podejrzanych linków."],
      "16+": ["Traktuj dane kontaktowe, lokalizację i uwierzytelnianie jak informacje wrażliwe."]
    },
    practiceByBand: {
      "7-9": ["Czy wolno wysłać obcej osobie adres domu?"],
      "10-12": ["Których danych nie należy publikować publicznie?"],
      "13-15": ["Co zrobić po otrzymaniu podejrzanego linku od nieznanej osoby?"],
      "16+": ["Jak ograniczyć ryzyko przejęcia konta?"]
    }
  },
  {
    topicId: "crisis.basic",
    title: "Gdy dzieje się coś poważnego",
    concept: "Najpierw własne bezpieczeństwo, potem kontakt z opiekunem lub służbami.",
    examplesByBand: {
      "7-9": ["Oddal się od zagrożenia i zawołaj zaufanego dorosłego."],
      "10-12": ["Przejdź w bezpieczne miejsce i skontaktuj się z opiekunem."],
      "13-15": ["Oceń bezpieczną drogę wyjścia i skontaktuj się z opiekunem lub 112 przy bezpośrednim zagrożeniu."],
      "16+": ["Priorytetem jest bezpieczeństwo, kontakt i wykonanie prostych kroków bez podejmowania zbędnego ryzyka."]
    },
    practiceByBand: {
      "7-9": ["Co robisz najpierw, gdy widzisz pożar?"],
      "10-12": ["Co zrobić, gdy zgubisz się poza domem?"],
      "13-15": ["Kiedy należy zadzwonić pod 112?"],
      "16+": ["Jakie trzy rzeczy są najważniejsze na początku sytuacji kryzysowej?"]
    },
    safetyClass: "crisis"
  }
];

export function lessonById(id: string) {
  return LESSONS.find(x => x.topicId === id);
}
