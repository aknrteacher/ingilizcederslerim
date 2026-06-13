import type { ColourThisVocabItem } from "@/data/colour-this-vocab";

export type TestPrimaryVocabItem = {
  word: string;
  speakWord: string;
  image: string;
  turkish: string;
  /**
   * Optional explicit target zones if you later hand-curate SVG ids
   * (e.g. ["zone-shirt", "zone-hair"]).
   */
  targetZones?: string[];
};

export const TEST_PRIMARY_VOCAB: TestPrimaryVocabItem[] = [
  { word: "Week", speakWord: "week", image: "week.svg", turkish: "hafta" },
  { word: "Classroom", speakWord: "classroom", image: "classroom.svg", turkish: "sınıf" },
  { word: "Monday", speakWord: "monday", image: "monday.svg", turkish: "pazartesi" },
  { word: "Calendar", speakWord: "calendar", image: "calendar.svg", turkish: "takvim" },
  { word: "Day", speakWord: "day", image: "day.svg", turkish: "gün" },
  { word: "Board", speakWord: "board", image: "board.svg", turkish: "tahta" },
  { word: "English", speakWord: "english", image: "english.svg", turkish: "ingilizce" },
  { word: "Teacher", speakWord: "teacher", image: "teacher.svg", turkish: "öğretmen" },
  { word: "Class", speakWord: "class", image: "class.svg", turkish: "sınıf" },
  { word: "Students", speakWord: "students", image: "students.svg", turkish: "öğrenciler" },
  { word: "Apricot", speakWord: "apricot", image: "apricot.svg", turkish: "kayısı" },
];

export const TEST_PRIMARY_COLOUR_THIS_VOCAB: ColourThisVocabItem[] = TEST_PRIMARY_VOCAB.map((item) => ({
  word: item.word,
  speakWord: item.speakWord,
  file: item.image,
}));

