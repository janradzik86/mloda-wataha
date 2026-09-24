export type CivicLessonKind = "right" | "duty" | "remedy" | "crisis";

export interface CivicLesson {
  id: string;
  title: string;
  kind: CivicLessonKind;
  plainLanguage: string;
  sourceRefs: string[];
  importantLimit?: string;
  scenario: string;
  question: string;
}

export const CIVIC_RIGHTS_AND_DUTIES: CivicLesson[] = [
  {
    id: "civic.rights.dignity",
    title: "Godność i szacunek",
    kind: "right",
    plainLanguage: "Godność człowieka jest źródłem wolności i praw. Władze publiczne mają obowiązek ją szanować i chronić.",
    sourceRefs: ["Konstytucja RP art. 30"],
    scenario: "Urzędnik albo inna osoba traktuje kogoś poniżająco.",
    question: "Jak spokojnie powiedzieć, że oczekujesz szacunku i wyjaśnienia podstawy działania?"
  },
  {
    id: "civic.rights.equal-treatment",
    title: "Równe traktowanie",
    kind: "right",
    plainLanguage: "Wszyscy są równi wobec prawa i mają prawo do równego traktowania przez władze publiczne.",
    sourceRefs: ["Konstytucja RP art. 32"],
    scenario: "Dwie osoby w podobnej sytuacji są traktowane inaczej bez jasnego powodu.",
    question: "Jakie fakty trzeba zebrać, żeby sprawdzić, czy doszło do nierównego traktowania?"
  },
  {
    id: "civic.remedy.compensation-public-authority",
    title: "Gdy szkodzi działanie władzy publicznej",
    kind: "remedy",
    plainLanguage: "Jeżeli niezgodne z prawem działanie organu władzy publicznej wyrządziło szkodę, Konstytucja przewiduje prawo do wynagrodzenia szkody.",
    sourceRefs: ["Konstytucja RP art. 77 ust. 1"],
    importantLimit: "Nie każda szkoda podczas powodzi oznacza automatyczne prawo do odbudowy domu przez państwo. Trzeba odróżnić pomoc po klęsce, odszkodowanie na podstawie ustaw i odpowiedzialność za niezgodne z prawem działanie władzy.",
    scenario: "Po powodzi rodzina uważa, że szkoda powstała także przez bezprawne działanie lub zaniechanie organu publicznego.",
    question: "Jakie dokumenty i fakty trzeba zebrać, aby oddzielić sam skutek powodzi od ewentualnej odpowiedzialności organu?"
  },
  {
    id: "civic.crisis.housing",
    title: "Mieszkanie po kryzysie",
    kind: "crisis",
    plainLanguage: "Władze publiczne mają prowadzić politykę sprzyjającą zaspokajaniu potrzeb mieszkaniowych obywateli i przeciwdziałać bezdomności.",
    sourceRefs: ["Konstytucja RP art. 75"],
    importantLimit: "Art. 75 nie daje każdemu automatycznego, bezpośredniego roszczenia o odbudowanie konkretnego domu. Konkretna pomoc zależy od ustaw i programów.",
    scenario: "Rodzina po powodzi nie może bezpiecznie mieszkać w swoim domu.",
    question: "Jakiej pomocy można szukać i gdzie sprawdzić ustawową podstawę tej pomocy?"
  },
  {
    id: "civic.crisis.health",
    title: "Zdrowie i bezpieczeństwo",
    kind: "crisis",
    plainLanguage: "Każdy ma prawo do ochrony zdrowia, a władze publiczne mają obowiązki dotyczące dostępu do opieki zdrowotnej.",
    sourceRefs: ["Konstytucja RP art. 68"],
    scenario: "Po katastrofie ktoś potrzebuje pomocy medycznej.",
    question: "Które potrzeby są pilne i do jakich służb lub dorosłych należy się zwrócić?"
  },
  {
    id: "civic.remedy.appeal",
    title: "Prawo do odwołania",
    kind: "remedy",
    plainLanguage: "Co do zasady strona ma prawo zaskarżyć orzeczenie lub decyzję wydaną w pierwszej instancji.",
    sourceRefs: ["Konstytucja RP art. 78"],
    importantLimit: "Szczegóły i wyjątki określają ustawy.",
    scenario: "Urząd wydaje decyzję, z którą rodzina się nie zgadza.",
    question: "Gdzie w decyzji szukać pouczenia o terminie i sposobie odwołania?"
  },
  {
    id: "civic.remedy.rpo",
    title: "Pomoc Rzecznika Praw Obywatelskich",
    kind: "remedy",
    plainLanguage: "Każdy może, na zasadach określonych w ustawie, zwrócić się do Rzecznika Praw Obywatelskich o pomoc w ochronie wolności lub praw naruszonych przez organy władzy publicznej.",
    sourceRefs: ["Konstytucja RP art. 80"],
    scenario: "Ktoś uważa, że urząd naruszył jego prawa i nie wie, co zrobić dalej.",
    question: "Jak opisać sprawę rzeczowo: co się stało, kiedy, jaki organ działał i jakie dokumenty istnieją?"
  },
  {
    id: "civic.duty.common-good",
    title: "Troska o dobro wspólne",
    kind: "duty",
    plainLanguage: "Obywatel polski ma obowiązek wierności Rzeczypospolitej Polskiej i troski o dobro wspólne.",
    sourceRefs: ["Konstytucja RP art. 82"],
    scenario: "Wspólna przestrzeń po kryzysie wymaga porządku i współpracy.",
    question: "Jak pomóc wspólnocie bez narażania siebie i innych?"
  },
  {
    id: "civic.duty.law",
    title: "Przestrzeganie prawa",
    kind: "duty",
    plainLanguage: "Każdy ma obowiązek przestrzegania prawa Rzeczypospolitej Polskiej.",
    sourceRefs: ["Konstytucja RP art. 83"],
    scenario: "Ktoś twierdzi, że skoro jego cel jest dobry, może zignorować każde prawo.",
    question: "Dlaczego dobry cel nie zawsze usprawiedliwia dowolny sposób działania?"
  },
  {
    id: "civic.duty.public-burdens",
    title: "Podatki i świadczenia publiczne",
    kind: "duty",
    plainLanguage: "Każdy jest obowiązany do ponoszenia ciężarów i świadczeń publicznych, w tym podatków, określonych w ustawie.",
    sourceRefs: ["Konstytucja RP art. 84"],
    scenario: "Dorosły obywatel zarabia i rozlicza się z państwem.",
    question: "Dlaczego podatki muszą mieć podstawę w prawie?"
  },
  {
    id: "civic.duty.defence",
    title: "Obrona Ojczyzny",
    kind: "duty",
    plainLanguage: "Obrona Ojczyzny jest obowiązkiem obywatela polskiego, a zakres obowiązków określają ustawy.",
    sourceRefs: ["Konstytucja RP art. 85"],
    importantLimit: "Dziecko nie wykonuje obowiązków wojskowych. Ten temat służy przygotowaniu do rozumienia praw i obowiązków w dorosłym życiu.",
    scenario: "Uczeń pyta, jakie obowiązki obywatelskie mogą dotyczyć go po osiągnięciu dorosłości.",
    question: "Które obowiązki dotyczą każdego, a które zależą od wieku i ustaw?"
  },
  {
    id: "civic.duty.environment",
    title: "Dbanie o środowisko",
    kind: "duty",
    plainLanguage: "Każdy ma obowiązek dbać o stan środowiska i może odpowiadać za jego pogorszenie.",
    sourceRefs: ["Konstytucja RP art. 86"],
    scenario: "Po powodzi trzeba uprzątnąć odpady i zanieczyszczenia.",
    question: "Jak zrobić to bezpiecznie i zgodnie z zasadami ochrony środowiska?"
  }
];

export function civicLessonById(id: string) {
  return CIVIC_RIGHTS_AND_DUTIES.find(x => x.id === id);
}

export function civicLearningPrinciples() {
  return [
    "Uczymy praw człowieka, praw dziecka, praw obywatelskich i obowiązków obywatela.",
    "Pokazujemy, które prawa dotyczą każdego, które obywatela, a które szczególnie dziecka.",
    "Rozróżniamy prawo konstytucyjne, roszczenie ustawowe, pomoc publiczną i procedurę odwoławczą.",
    "Przy kryzysach używamy scenariuszy praktycznych: mieszkanie, zdrowie, dokumenty, decyzje urzędu, odszkodowanie i odwołanie.",
    "Nie obiecujemy wyniku sprawy i nie przedstawiamy pomocy publicznej jako automatycznego prawa do konkretnej kwoty lub odbudowy.",
    "Dziecko ma uczyć się także przyszłych obowiązków dorosłego obywatela."
  ];
}
