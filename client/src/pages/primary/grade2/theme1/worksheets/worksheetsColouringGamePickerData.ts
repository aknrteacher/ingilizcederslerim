import topic2_1 from "@/assets/2.1game.png";
import topic2_2 from "@/assets/2.2game.png";
import topic2_3 from "@/assets/2.3game.png";
import topic2_4 from "@/assets/2.4game.png";
import topic2_5 from "@/assets/2.5game.png";
import topic2_6 from "@/assets/2.6game.png";
import topic3_1 from "@/assets/3.1game.png";
import topic3_2 from "@/assets/3.2game.png";
import topic3_3 from "@/assets/3.3game.png";
import topic3_4 from "@/assets/3.4game.png";
import topic3_5 from "@/assets/3.5game.png";
import topic3_6 from "@/assets/3.6game.png";
import topic3_7 from "@/assets/3.7game.png";
import topic3_8 from "@/assets/3.8game.png";
import topic3_9 from "@/assets/3.9game.png";
/** Unit 10 uses same asset as in grade-3 unit-10 games menu */
const topic3_10 = topic3_9;
import topic4_6 from "@/assets/4.6game.png";
import topic4_7 from "@/assets/4.7game.png";
import topic4_8 from "@/assets/4.8game.png";
import topic4_9 from "@/assets/4.9game.png";

export type GradeId = "2" | "3" | "4";

export interface TopicOption {
  /** Theme or unit number within the selected grade */
  id: number;
  topicValue: string;
  label: string;
  basePath: string;
  /** Lower half of CombinedGameButton (topic strip) */
  topicImage: string;
}

const GRADE_2_TOPICS: TopicOption[] = [
  {
    id: 1,
    topicValue: "2.1",
    label: "Theme 1: School Life",
    basePath: "/primary-school/grade-2/theme-1",
    topicImage: topic2_1,
  },
  {
    id: 2,
    topicValue: "2.2",
    label: "Theme 2: Classroom Life",
    basePath: "/primary-school/grade-2/theme-2",
    topicImage: topic2_2,
  },
  {
    id: 3,
    topicValue: "2.3",
    label: "Theme 3: Personal Life",
    basePath: "/primary-school/grade-2/theme-3",
    topicImage: topic2_3,
  },
  {
    id: 4,
    topicValue: "2.4",
    label: "Theme 4: Family Life",
    basePath: "/primary-school/grade-2/theme-4",
    topicImage: topic2_4,
  },
  {
    id: 5,
    topicValue: "2.5",
    label: "Theme 5: Homes, Houses, Neighbourhoods",
    basePath: "/primary-school/grade-2/theme-5",
    topicImage: topic2_5,
  },
  {
    id: 6,
    topicValue: "2.6",
    label: "Theme 6: Life in the City and the World",
    basePath: "/primary-school/grade-2/theme-6",
    topicImage: topic2_6,
  },
];

const GRADE_3_TOPICS: TopicOption[] = [
  {
    id: 1,
    topicValue: "3.1",
    label: "Unit 1",
    basePath: "/primary-school/grade-3/unit-1",
    topicImage: topic3_1,
  },
  {
    id: 2,
    topicValue: "3.2",
    label: "Unit 2: My Family",
    basePath: "/primary-school/grade-3/unit-2",
    topicImage: topic3_2,
  },
  {
    id: 3,
    topicValue: "3.3",
    label: "Unit 3: People I Love",
    basePath: "/primary-school/grade-3/unit-3",
    topicImage: topic3_3,
  },
  {
    id: 4,
    topicValue: "3.4",
    label: "Unit 4: Feelings",
    basePath: "/primary-school/grade-3/unit-4",
    topicImage: topic3_4,
  },
  {
    id: 5,
    topicValue: "3.5",
    label: "Unit 5: Toys and Games",
    basePath: "/primary-school/grade-3/unit-5",
    topicImage: topic3_5,
  },
  {
    id: 6,
    topicValue: "3.6",
    label: "Unit 6: My House",
    basePath: "/primary-school/grade-3/unit-6",
    topicImage: topic3_6,
  },
  {
    id: 7,
    topicValue: "3.7",
    label: "Unit 7: In My City",
    basePath: "/primary-school/grade-3/unit-7",
    topicImage: topic3_7,
  },
  {
    id: 8,
    topicValue: "3.8",
    label: "Unit 8: Transportation",
    basePath: "/primary-school/grade-3/unit-8",
    topicImage: topic3_8,
  },
  {
    id: 9,
    topicValue: "3.9",
    label: "Unit 9: Weather",
    basePath: "/primary-school/grade-3/unit-9",
    topicImage: topic3_9,
  },
  {
    id: 10,
    topicValue: "3.10",
    label: "Unit 10: Nature",
    basePath: "/primary-school/grade-3/unit-10",
    topicImage: topic3_10,
  },
];

const GRADE_4_TOPICS: TopicOption[] = [
  {
    id: 6,
    topicValue: "4.6",
    label: "Unit 6: Fun with Science",
    basePath: "/primary-school/grade-4/unit-6",
    topicImage: topic4_6,
  },
  {
    id: 7,
    topicValue: "4.7",
    label: "Unit 7: Jobs",
    basePath: "/primary-school/grade-4/unit-7",
    topicImage: topic4_7,
  },
  {
    id: 8,
    topicValue: "4.8",
    label: "Unit 8: My Clothes",
    basePath: "/primary-school/grade-4/unit-8",
    topicImage: topic4_8,
  },
  {
    id: 9,
    topicValue: "4.9",
    label: "Unit 9: My Friends",
    basePath: "/primary-school/grade-4/unit-9",
    topicImage: topic4_9,
  },
];

export function getTopicsForGrade(grade: GradeId): TopicOption[] {
  if (grade === "2") return GRADE_2_TOPICS;
  if (grade === "3") return GRADE_3_TOPICS;
  return GRADE_4_TOPICS;
}

export function getDefaultTopicId(grade: GradeId): number {
  if (grade === "2") return 1;
  if (grade === "3") return 1;
  return 6;
}

/** Colour This (color-sound) game for the selected theme/unit */
export function colourThisGameHref(topic: TopicOption): string {
  return `${topic.basePath}/color-sound`;
}
