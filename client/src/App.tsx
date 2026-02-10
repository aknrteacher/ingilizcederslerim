import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import MainLandingPage from "@/pages/landing-main";
import PreschoolLandingPage from "@/pages/landing-preschool";
import PreschoolTeachersGuide from "@/pages/preschool-teachers-guide";
import PrimarySchoolLandingPage from "@/pages/landing-primary-school";
import SecondarySchoolLandingPage from "@/pages/landing-secondary-school";
import HighSchoolLandingPage from "@/pages/landing-high-school";
import UniversityLandingPage from "@/pages/landing-university";
import BusinessEnglishLandingPage from "@/pages/landing-business-english";
import VocabularyCards from "@/pages/primary/grade2/theme1/vocab/2.1.voc";
import VocabularyCards2_2 from "@/pages/primary/grade2/theme2/vocab/2.2.voc";
import VocabularyCards2_3 from "@/pages/primary/grade2/theme3/vocab/2.3.voc";
import VocabularyCards2_4 from "@/pages/primary/grade2/theme4/vocab/2.4.voc";
import VocabularyCards2_5 from "@/pages/primary/grade2/theme5/vocab/2.5.voc";
import VocabularyCards2_6 from "@/pages/primary/grade2/theme6/vocab/2.6.voc";
import VocabularyCards3_1 from "@/pages/primary/grade3/unit1/vocab/3.1.voc";
import VocabularyCards3_2 from "@/pages/primary/grade3/unit2/vocab/3.2.voc";
import VocabularyCards3_3 from "@/pages/primary/grade3/unit3/vocab/3.3.voc";
import VocabularyCards3_4 from "@/pages/primary/grade3/unit4/vocab/3.4.voc";
import VocabularyCards3_5 from "@/pages/primary/grade3/unit5/vocab/3.5.voc";
import VocabularyCards3_6 from "@/pages/primary/grade3/unit6/vocab/3.6.voc";
import VocabularyCards4_6 from "@/pages/primary/grade4/unit6/vocab/4.6.voc";
import ColorsVocabulary from "@/pages/preschool/vocab/0.2-colours/0.1.voc";
import NumbersVocabulary from "@/pages/preschool/vocab/0.1-numbers/0.1-numbers.voc";
import AlphabetVocabulary from "@/pages/preschool/vocab/0.0-alphabet/0.1-alphabet.voc";
import GreetingsVocabulary from "@/pages/preschool/vocab/0.3-greetings/0.3-greetings.voc";
import ActionsVocabulary from "@/pages/preschool/vocab/0.4-actions/0.4-actions.voc";
import OurBodyVocabulary from "@/pages/preschool/vocab/0.5-ourbody/0.5-ourbody.voc";
import OurClassroomVocabulary from "@/pages/preschool/vocab/0.6-ourclassroom/0.6-ourclassroom.voc";
import ThingsVocabulary from "@/pages/preschool/vocab/0.7-things/0.7-things.voc";
import PeopleVocabulary from "@/pages/preschool/vocab/0.8-people/0.8-people.voc";
import AnimalsVocabulary from "@/pages/preschool/vocab/0.9-animals/0.9-animals.voc";
import AroundUsVocabulary from "@/pages/preschool/vocab/0.10-aroundus/0.10-aroundus.voc";
import FoodVocabulary from "@/pages/preschool/vocab/0.11-food/0.11-food.voc";
import PreSchoolVocabMenu from "@/pages/preschool/vocab/0.2-colours/pre-school-vocab-menu";
import PreSchoolGamesMenu from "@/pages/pre-school-games-menu";
import PrimarySchoolGrade2Theme1GamesMenu from "@/pages/primary-school-grade2-theme1-games-menu";
import PrimarySchoolGrade2Theme2GamesMenu from "@/pages/primary-school-grade2-theme2-games-menu";
import PrimarySchoolGrade2Theme3GamesMenu from "@/pages/primary-school-grade2-theme3-games-menu";
import PrimarySchoolGrade2Theme4GamesMenu from "@/pages/primary-school-grade2-theme4-games-menu";
import PrimarySchoolGrade2Theme5GamesMenu from "@/pages/primary-school-grade2-theme5-games-menu";
import PrimarySchoolGrade2Theme6GamesMenu from "@/pages/primary-school-grade2-theme6-games-menu";
import PrimarySchoolGrade3Unit1GamesMenu from "@/pages/primary-school-grade3-unit1-games-menu";
import PrimarySchoolGrade3Unit2GamesMenu from "@/pages/primary-school-grade3-unit2-games-menu";
import PrimarySchoolGrade3Unit3GamesMenu from "@/pages/primary-school-grade3-unit3-games-menu";
import PrimarySchoolGrade3Unit4GamesMenu from "@/pages/primary-school-grade3-unit4-games-menu";
import PrimarySchoolGrade3Unit5GamesMenu from "@/pages/primary-school-grade3-unit5-games-menu";
import PrimarySchoolGrade3Unit6GamesMenu from "@/pages/primary-school-grade3-unit6-games-menu";
import PrimarySchoolGrade4Unit6GamesMenu from "@/pages/primary-school-grade4-unit6-games-menu";
import MatchingGame from "@/pages/primary/grade2/theme1/games/2.1.matching-game";
import MatchingGame2_2 from "@/pages/primary/grade2/theme2/games/2.2.matching-game";
import MatchingGame2_3 from "@/pages/primary/grade2/theme3/games/2.3.matching-game";
import MatchingGame2_4 from "@/pages/primary/grade2/theme4/games/2.4.matching-game";
import MatchingGame2_5 from "@/pages/primary/grade2/theme5/games/2.5.matching-game";
import MatchingGame2_6 from "@/pages/primary/grade2/theme6/games/2.6.matching-game";
import ColorsMatchingGame from "@/pages/preschool/games/0.2-colours/0.1.matching-game";
import ColorsCrosswordGame from "@/pages/preschool/games/0.2-colours/0.1.crossword";
import ColorsSpellQuestGame from "@/pages/preschool/games/0.2-colours/0.1.spell-quest";
import ColorsWordPopGame from "@/pages/preschool/games/0.2-colours/0.1.word-pop";
import ColorsCatchGame from "@/pages/preschool/games/0.2-colours/0.1.catch-that";
import ISpyGame from "@/pages/preschool/games/0.2-colours/0.1.i-spy";
import NumbersMatchingGame from "@/pages/preschool/games/0.1-numbers/0.1-numbers.matching-game";
import NumbersCrosswordGame from "@/pages/preschool/games/0.1-numbers/0.1-numbers.crossword";
import NumbersSpellQuestGame from "@/pages/preschool/games/0.1-numbers/0.1-numbers.spell-quest";
import NumbersWordPopGame from "@/pages/preschool/games/0.1-numbers/0.1-numbers.word-pop";
import NumbersCatchGame from "@/pages/preschool/games/0.1-numbers/0.1-numbers.catch-that";
import GreetingsMatchingGame from "@/pages/preschool/games/0.3-greetings/0.3-greetings.matching-game";
import GreetingsCrosswordGame from "@/pages/preschool/games/0.3-greetings/0.3-greetings.crossword";
import GreetingsSpellQuestGame from "@/pages/preschool/games/0.3-greetings/0.3-greetings.spell-quest";
import GreetingsWordPopGame from "@/pages/preschool/games/0.3-greetings/0.3-greetings.word-pop";
import GreetingsCatchGame from "@/pages/preschool/games/0.3-greetings/0.3-greetings.catch-that";
import ActionsMatchingGame from "@/pages/preschool/games/0.4-actions/0.4-actions.matching-game";
import ActionsCrosswordGame from "@/pages/preschool/games/0.4-actions/0.4-actions.crossword";
import ActionsSpellQuestGame from "@/pages/preschool/games/0.4-actions/0.4-actions.spell-quest";
import ActionsWordPopGame from "@/pages/preschool/games/0.4-actions/0.4-actions.word-pop";
import ActionsCatchGame from "@/pages/preschool/games/0.4-actions/0.4-actions.catch-that";
// 0.5-ourbody games
import OurBodyMatchingGame from "@/pages/preschool/games/0.5-ourbody/0.5-ourbody.matching-game";
import OurBodyCrosswordGame from "@/pages/preschool/games/0.5-ourbody/0.5-ourbody.crossword";
import OurBodySpellQuestGame from "@/pages/preschool/games/0.5-ourbody/0.5-ourbody.spell-quest";
import OurBodyWordPopGame from "@/pages/preschool/games/0.5-ourbody/0.5-ourbody.word-pop";
import OurBodyCatchGame from "@/pages/preschool/games/0.5-ourbody/0.5-ourbody.catch-that";
// 0.6-ourclassroom games
import OurClassroomMatchingGame from "@/pages/preschool/games/0.6-ourclassroom/0.6-ourclassroom.matching-game";
import OurClassroomCrosswordGame from "@/pages/preschool/games/0.6-ourclassroom/0.6-ourclassroom.crossword";
import OurClassroomSpellQuestGame from "@/pages/preschool/games/0.6-ourclassroom/0.6-ourclassroom.spell-quest";
import OurClassroomWordPopGame from "@/pages/preschool/games/0.6-ourclassroom/0.6-ourclassroom.word-pop";
import OurClassroomCatchGame from "@/pages/preschool/games/0.6-ourclassroom/0.6-ourclassroom.catch-that";
// 0.7-things games
import ThingsMatchingGame from "@/pages/preschool/games/0.7-things/0.7-things.matching-game";
import ThingsCrosswordGame from "@/pages/preschool/games/0.7-things/0.7-things.crossword";
import ThingsSpellQuestGame from "@/pages/preschool/games/0.7-things/0.7-things.spell-quest";
import ThingsWordPopGame from "@/pages/preschool/games/0.7-things/0.7-things.word-pop";
import ThingsCatchGame from "@/pages/preschool/games/0.7-things/0.7-things.catch-that";
// 0.8-people games
import PeopleMatchingGame from "@/pages/preschool/games/0.8-people/0.8-people.matching-game";
import PeopleCrosswordGame from "@/pages/preschool/games/0.8-people/0.8-people.crossword";
import PeopleSpellQuestGame from "@/pages/preschool/games/0.8-people/0.8-people.spell-quest";
import PeopleWordPopGame from "@/pages/preschool/games/0.8-people/0.8-people.word-pop";
import PeopleCatchGame from "@/pages/preschool/games/0.8-people/0.8-people.catch-that";
// 0.9-animals games
import AnimalsMatchingGame from "@/pages/preschool/games/0.9-animals/0.9-animals.matching-game";
import AnimalsCrosswordGame from "@/pages/preschool/games/0.9-animals/0.9-animals.crossword";
import AnimalsSpellQuestGame from "@/pages/preschool/games/0.9-animals/0.9-animals.spell-quest";
import AnimalsWordPopGame from "@/pages/preschool/games/0.9-animals/0.9-animals.word-pop";
import AnimalsCatchGame from "@/pages/preschool/games/0.9-animals/0.9-animals.catch-that";
// 0.11-food games
import FoodMatchingGame from "@/pages/preschool/games/0.11-food/0.11-food.matching-game";
import FoodCrosswordGame from "@/pages/preschool/games/0.11-food/0.11-food.crossword";
import FoodSpellQuestGame from "@/pages/preschool/games/0.11-food/0.11-food.spell-quest";
import FoodWordPopGame from "@/pages/preschool/games/0.11-food/0.11-food.word-pop";
import FoodCatchGame from "@/pages/preschool/games/0.11-food/0.11-food.catch-that";
// 0.10-aroundus games
import AroundUsMatchingGame from "@/pages/preschool/games/0.10-aroundus/0.10-aroundus.matching-game";
import AroundUsCrosswordGame from "@/pages/preschool/games/0.10-aroundus/0.10-aroundus.crossword";
import AroundUsSpellQuestGame from "@/pages/preschool/games/0.10-aroundus/0.10-aroundus.spell-quest";
import AroundUsWordPopGame from "@/pages/preschool/games/0.10-aroundus/0.10-aroundus.word-pop";
import AroundUsCatchGame from "@/pages/preschool/games/0.10-aroundus/0.10-aroundus.catch-that";
import CrosswordGame from "@/pages/primary/grade2/theme1/games/2.1.crossword";
import CrosswordGame2_2 from "@/pages/primary/grade2/theme2/games/2.2.crossword";
import CrosswordGame2_3 from "@/pages/primary/grade2/theme3/games/2.3.crossword";
import CrosswordGame2_4 from "@/pages/primary/grade2/theme4/games/2.4.crossword";
import CrosswordGame2_5 from "@/pages/primary/grade2/theme5/games/2.5.crossword";
import CrosswordGame2_6 from "@/pages/primary/grade2/theme6/games/2.6.crossword";
import SpellQuestGame from "@/pages/primary/grade2/theme1/games/2.1.spell-quest";
import SpellQuestGame2_2 from "@/pages/primary/grade2/theme2/games/2.2.spell-quest";
import SpellQuestGame2_3 from "@/pages/primary/grade2/theme3/games/2.3.spell-quest";
import SpellQuestGame2_4 from "@/pages/primary/grade2/theme4/games/2.4.spell-quest";
import SpellQuestGame2_5 from "@/pages/primary/grade2/theme5/games/2.5.spell-quest";
import SpellQuestGame2_6 from "@/pages/primary/grade2/theme6/games/2.6.spell-quest";
import WordPopGame from "@/pages/primary/grade2/theme1/games/2.1.word-pop";
import WordPopGame2_2 from "@/pages/primary/grade2/theme2/games/2.2.word-pop";
import WordPopGame2_3 from "@/pages/primary/grade2/theme3/games/2.3.word-pop";
import WordPopGame2_4 from "@/pages/primary/grade2/theme4/games/2.4.word-pop";
import WordPopGame2_5 from "@/pages/primary/grade2/theme5/games/2.5.word-pop";
import WordPopGame2_6 from "@/pages/primary/grade2/theme6/games/2.6.word-pop";
import CatchThatGame from "@/pages/primary/grade2/theme1/games/2.1.catch-that";
import CatchThatGame2_2 from "@/pages/primary/grade2/theme2/games/2.2.catch-that";
import CatchThatGame2_3 from "@/pages/primary/grade2/theme3/games/2.3.catch-that";
import CatchThatGame2_4 from "@/pages/primary/grade2/theme4/games/2.4.catch-that";
import CatchThatGame2_5 from "@/pages/primary/grade2/theme5/games/2.5.catch-that";
import CatchThatGame2_6 from "@/pages/primary/grade2/theme6/games/2.6.catch-that";
// New Theme 1 Games
import SayWhatGame from "@/pages/primary/grade2/theme1/games/2.1.say-what";
import MemoryFlipGame from "@/pages/primary/grade2/theme1/games/2.1.memory-flip";
import WordRaceGame from "@/pages/primary/grade2/theme1/games/2.1.word-race";
import WordSnakeGame from "@/pages/primary/grade2/theme1/games/2.1.word-snake";
// New Theme 2 Games
import SayWhatGame2_2 from "@/pages/primary/grade2/theme2/games/2.2.say-what";
import MemoryFlipGame2_2 from "@/pages/primary/grade2/theme2/games/2.2.memory-flip";
import WordRaceGame2_2 from "@/pages/primary/grade2/theme2/games/2.2.word-race";
import WordSnakeGame2_2 from "@/pages/primary/grade2/theme2/games/2.2.word-snake";
// New Theme 3 Games
import SayWhatGame2_3 from "@/pages/primary/grade2/theme3/games/2.3.say-what";
import MemoryFlipGame2_3 from "@/pages/primary/grade2/theme3/games/2.3.memory-flip";
import WordRaceGame2_3 from "@/pages/primary/grade2/theme3/games/2.3.word-race";
import WordSnakeGame2_3 from "@/pages/primary/grade2/theme3/games/2.3.word-snake";
// New Theme 4 Games
import SayWhatGame2_4 from "@/pages/primary/grade2/theme4/games/2.4.say-what";
import MemoryFlipGame2_4 from "@/pages/primary/grade2/theme4/games/2.4.memory-flip";
import WordRaceGame2_4 from "@/pages/primary/grade2/theme4/games/2.4.word-race";
import WordSnakeGame2_4 from "@/pages/primary/grade2/theme4/games/2.4.word-snake";
// New Theme 5 Games
import SayWhatGame2_5 from "@/pages/primary/grade2/theme5/games/2.5.say-what";
import MemoryFlipGame2_5 from "@/pages/primary/grade2/theme5/games/2.5.memory-flip";
import WordRaceGame2_5 from "@/pages/primary/grade2/theme5/games/2.5.word-race";
import WordSnakeGame2_5 from "@/pages/primary/grade2/theme5/games/2.5.word-snake";
// New Theme 6 Games
import SayWhatGame2_6 from "@/pages/primary/grade2/theme6/games/2.6.say-what";
import MemoryFlipGame2_6 from "@/pages/primary/grade2/theme6/games/2.6.memory-flip";
import WordRaceGame2_6 from "@/pages/primary/grade2/theme6/games/2.6.word-race";
import WordSnakeGame2_6 from "@/pages/primary/grade2/theme6/games/2.6.word-snake";
// Grade 3 Unit 1 Games
import MatchingGame3_1 from "@/pages/primary/grade3/unit1/games/3.1.matching-game";
import CrosswordGame3_1 from "@/pages/primary/grade3/unit1/games/3.1.crossword";
import SpellQuestGame3_1 from "@/pages/primary/grade3/unit1/games/3.1.spell-quest";
// Grade 4 Unit 6 Games
import MatchingGame4_6 from "@/pages/primary/grade4/unit6/games/4.6.matching-game";
import CrosswordGame4_6 from "@/pages/primary/grade4/unit6/games/4.6.crossword";
import SpellQuestGame4_6 from "@/pages/primary/grade4/unit6/games/4.6.spell-quest";
import WordPopGame4_6 from "@/pages/primary/grade4/unit6/games/4.6.word-pop";
import CatchThatGame4_6 from "@/pages/primary/grade4/unit6/games/4.6.catch-that";
import SayWhatGame4_6 from "@/pages/primary/grade4/unit6/games/4.6.say-what";
import MemoryFlipGame4_6 from "@/pages/primary/grade4/unit6/games/4.6.memory-flip";
import WordRaceGame4_6 from "@/pages/primary/grade4/unit6/games/4.6.word-race";
import WordSnakeGame4_6 from "@/pages/primary/grade4/unit6/games/4.6.word-snake";
import WordPopGame3_1 from "@/pages/primary/grade3/unit1/games/3.1.word-pop";
import CatchThatGame3_1 from "@/pages/primary/grade3/unit1/games/3.1.catch-that";
import SayWhatGame3_1 from "@/pages/primary/grade3/unit1/games/3.1.say-what";
import MemoryFlipGame3_1 from "@/pages/primary/grade3/unit1/games/3.1.memory-flip";
import WordRaceGame3_1 from "@/pages/primary/grade3/unit1/games/3.1.word-race";
import WordSnakeGame3_1 from "@/pages/primary/grade3/unit1/games/3.1.word-snake";
// Unit 2 games
import MatchingGame3_2 from "@/pages/primary/grade3/unit2/games/3.2.matching-game";
import CrosswordGame3_2 from "@/pages/primary/grade3/unit2/games/3.2.crossword";
import SpellQuestGame3_2 from "@/pages/primary/grade3/unit2/games/3.2.spell-quest";
import WordPopGame3_2 from "@/pages/primary/grade3/unit2/games/3.2.word-pop";
import CatchThatGame3_2 from "@/pages/primary/grade3/unit2/games/3.2.catch-that";
import SayWhatGame3_2 from "@/pages/primary/grade3/unit2/games/3.2.say-what";
import MemoryFlipGame3_2 from "@/pages/primary/grade3/unit2/games/3.2.memory-flip";
import WordRaceGame3_2 from "@/pages/primary/grade3/unit2/games/3.2.word-race";
import WordSnakeGame3_2 from "@/pages/primary/grade3/unit2/games/3.2.word-snake";
// Unit 3 games
import MatchingGame3_3 from "@/pages/primary/grade3/unit3/games/3.3.matching-game";
import CrosswordGame3_3 from "@/pages/primary/grade3/unit3/games/3.3.crossword";
import SpellQuestGame3_3 from "@/pages/primary/grade3/unit3/games/3.3.spell-quest";
import WordPopGame3_3 from "@/pages/primary/grade3/unit3/games/3.3.word-pop";
import CatchThatGame3_3 from "@/pages/primary/grade3/unit3/games/3.3.catch-that";
import SayWhatGame3_3 from "@/pages/primary/grade3/unit3/games/3.3.say-what";
import MemoryFlipGame3_3 from "@/pages/primary/grade3/unit3/games/3.3.memory-flip";
import WordRaceGame3_3 from "@/pages/primary/grade3/unit3/games/3.3.word-race";
import WordSnakeGame3_3 from "@/pages/primary/grade3/unit3/games/3.3.word-snake";
// Unit 4 games
import MatchingGame3_4 from "@/pages/primary/grade3/unit4/games/3.4.matching-game";
import CrosswordGame3_4 from "@/pages/primary/grade3/unit4/games/3.4.crossword";
import SpellQuestGame3_4 from "@/pages/primary/grade3/unit4/games/3.4.spell-quest";
import WordPopGame3_4 from "@/pages/primary/grade3/unit4/games/3.4.word-pop";
import CatchThatGame3_4 from "@/pages/primary/grade3/unit4/games/3.4.catch-that";
import SayWhatGame3_4 from "@/pages/primary/grade3/unit4/games/3.4.say-what";
import MemoryFlipGame3_4 from "@/pages/primary/grade3/unit4/games/3.4.memory-flip";
import WordRaceGame3_4 from "@/pages/primary/grade3/unit4/games/3.4.word-race";
import WordSnakeGame3_4 from "@/pages/primary/grade3/unit4/games/3.4.word-snake";
// Unit 5 games
import MatchingGame3_5 from "@/pages/primary/grade3/unit5/games/3.5.matching-game";
import CrosswordGame3_5 from "@/pages/primary/grade3/unit5/games/3.5.crossword";
import SpellQuestGame3_5 from "@/pages/primary/grade3/unit5/games/3.5.spell-quest";
import WordPopGame3_5 from "@/pages/primary/grade3/unit5/games/3.5.word-pop";
import CatchThatGame3_5 from "@/pages/primary/grade3/unit5/games/3.5.catch-that";
import SayWhatGame3_5 from "@/pages/primary/grade3/unit5/games/3.5.say-what";
import MemoryFlipGame3_5 from "@/pages/primary/grade3/unit5/games/3.5.memory-flip";
import WordRaceGame3_5 from "@/pages/primary/grade3/unit5/games/3.5.word-race";
import WordSnakeGame3_5 from "@/pages/primary/grade3/unit5/games/3.5.word-snake";
// Unit 6 games
import MatchingGame3_6 from "@/pages/primary/grade3/unit6/games/3.6.matching-game";
import CrosswordGame3_6 from "@/pages/primary/grade3/unit6/games/3.6.crossword";
import SpellQuestGame3_6 from "@/pages/primary/grade3/unit6/games/3.6.spell-quest";
import WordPopGame3_6 from "@/pages/primary/grade3/unit6/games/3.6.word-pop";
import CatchThatGame3_6 from "@/pages/primary/grade3/unit6/games/3.6.catch-that";
import SayWhatGame3_6 from "@/pages/primary/grade3/unit6/games/3.6.say-what";
import MemoryFlipGame3_6 from "@/pages/primary/grade3/unit6/games/3.6.memory-flip";
import WordRaceGame3_6 from "@/pages/primary/grade3/unit6/games/3.6.word-race";
import WordSnakeGame3_6 from "@/pages/primary/grade3/unit6/games/3.6.word-snake";
import StoriesMenu from "@/pages/primary/stories/stories-menu";
import StoryReaderPage from "@/pages/primary/stories/story-reader";
// Admin imports
import { AdminGate } from "@/components/AdminGate";
import AdminDashboard from "@/pages/admin/dashboard";
import WordMapPage from "@/pages/admin/word-map";
import WorkflowPage from "@/pages/admin/workflow";
import ClassroomMonitoring from "@/pages/classroom-monitoring";
import InClass from "@/pages/inclass";
import ClassMonitor from "@/pages/class-monitor";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainLandingPage} />
      <Route path="/pre-school" component={PreschoolLandingPage} />
      <Route path="/pre-school/teachers-guide" component={PreschoolTeachersGuide} />
      <Route path="/primary-school" component={PrimarySchoolLandingPage} />
      <Route path="/secondary-school" component={SecondarySchoolLandingPage} />
      <Route path="/high-school" component={HighSchoolLandingPage} />
      <Route path="/university" component={UniversityLandingPage} />
      <Route path="/business-english" component={BusinessEnglishLandingPage} />
      <Route path="/home" component={Home} />
      <Route path="/oyunlar/okul-oncesi" component={PreSchoolGamesMenu} />
      <Route path="/pre-school/games" component={PreSchoolGamesMenu} />
      <Route path="/primary-school/grade-2/theme-1/games" component={PrimarySchoolGrade2Theme1GamesMenu} />
      <Route path="/primary-school/grade-2/theme-2/games" component={PrimarySchoolGrade2Theme2GamesMenu} />
      <Route path="/primary-school/grade-2/theme-3/games" component={PrimarySchoolGrade2Theme3GamesMenu} />
      <Route path="/primary-school/grade-2/theme-4/games" component={PrimarySchoolGrade2Theme4GamesMenu} />
      <Route path="/primary-school/grade-2/theme-5/games" component={PrimarySchoolGrade2Theme5GamesMenu} />
      <Route path="/primary-school/grade-2/theme-6/games" component={PrimarySchoolGrade2Theme6GamesMenu} />
      <Route path="/primary-school/grade-3/unit-1/games" component={PrimarySchoolGrade3Unit1GamesMenu} />
      <Route path="/primary-school/grade-3/unit-2/games" component={PrimarySchoolGrade3Unit2GamesMenu} />
      <Route path="/primary-school/grade-3/unit-3/games" component={PrimarySchoolGrade3Unit3GamesMenu} />
      <Route path="/primary-school/grade-3/unit-4/games" component={PrimarySchoolGrade3Unit4GamesMenu} />
      <Route path="/primary-school/grade-3/unit-5/games" component={PrimarySchoolGrade3Unit5GamesMenu} />
      <Route path="/primary-school/grade-3/unit-6/games" component={PrimarySchoolGrade3Unit6GamesMenu} />
      <Route path="/primary-school/grade-4/unit-6/games" component={PrimarySchoolGrade4Unit6GamesMenu} />
      <Route path="/primary-school/grade-2/theme-1/2.1-vocab" component={VocabularyCards} />
      <Route path="/primary-school/grade-2/theme-2/2.2-vocab" component={VocabularyCards2_2} />
      <Route path="/primary-school/grade-2/theme-3/2.3-vocab" component={VocabularyCards2_3} />
      <Route path="/primary-school/grade-2/theme-4/2.4-vocab" component={VocabularyCards2_4} />
      <Route path="/primary-school/grade-2/theme-5/2.5-vocab" component={VocabularyCards2_5} />
      <Route path="/primary-school/grade-2/theme-6/2.6-vocab" component={VocabularyCards2_6} />
      <Route path="/primary-school/grade-3/unit-1/3.1-vocab" component={VocabularyCards3_1} />
      <Route path="/primary-school/grade-3/unit-2/3.2-vocab" component={VocabularyCards3_2} />
      <Route path="/primary-school/grade-3/unit-3/3.3-vocab" component={VocabularyCards3_3} />
      <Route path="/primary-school/grade-3/unit-4/3.4-vocab" component={VocabularyCards3_4} />
      <Route path="/primary-school/grade-3/unit-5/3.5-vocab" component={VocabularyCards3_5} />
      <Route path="/primary-school/grade-3/unit-6/3.6-vocab" component={VocabularyCards3_6} />
      <Route path="/primary-school/grade-4/unit-6/4.6-vocab" component={VocabularyCards4_6} />
      <Route path="/primary-school/grade-4/unit-6/4.6-matching-game" component={MatchingGame4_6} />
      <Route path="/primary-school/grade-4/unit-6/crossword" component={CrosswordGame4_6} />
      <Route path="/primary-school/grade-4/unit-6/spell-quest" component={SpellQuestGame4_6} />
      <Route path="/primary-school/grade-4/unit-6/word-pop" component={WordPopGame4_6} />
      <Route path="/primary-school/grade-4/unit-6/catch-that" component={CatchThatGame4_6} />
      <Route path="/primary-school/grade-4/unit-6/say-what" component={SayWhatGame4_6} />
      <Route path="/primary-school/grade-4/unit-6/memory-flip" component={MemoryFlipGame4_6} />
      <Route path="/primary-school/grade-4/unit-6/word-race" component={WordRaceGame4_6} />
      <Route path="/primary-school/grade-4/unit-6/word-snake" component={WordSnakeGame4_6} />
      <Route path="/primary-school/grade-3/unit-1/3.1-matching-game" component={MatchingGame3_1} />
      <Route path="/primary-school/grade-3/unit-1/crossword" component={CrosswordGame3_1} />
      <Route path="/primary-school/grade-3/unit-1/spell-quest" component={SpellQuestGame3_1} />
      <Route path="/primary-school/grade-3/unit-1/word-pop" component={WordPopGame3_1} />
      {/* Unit 2 games */}
      <Route path="/primary-school/grade-3/unit-2/3.2-matching-game" component={MatchingGame3_2} />
      <Route path="/primary-school/grade-3/unit-2/crossword" component={CrosswordGame3_2} />
      <Route path="/primary-school/grade-3/unit-2/spell-quest" component={SpellQuestGame3_2} />
      <Route path="/primary-school/grade-3/unit-2/word-pop" component={WordPopGame3_2} />
      <Route path="/primary-school/grade-3/unit-2/catch-that" component={CatchThatGame3_2} />
      <Route path="/primary-school/grade-3/unit-2/say-what" component={SayWhatGame3_2} />
      <Route path="/primary-school/grade-3/unit-2/memory-flip" component={MemoryFlipGame3_2} />
      <Route path="/primary-school/grade-3/unit-2/word-race" component={WordRaceGame3_2} />
      <Route path="/primary-school/grade-3/unit-2/word-snake" component={WordSnakeGame3_2} />
      {/* Unit 3 games */}
      <Route path="/primary-school/grade-3/unit-3/3.3-matching-game" component={MatchingGame3_3} />
      <Route path="/primary-school/grade-3/unit-3/crossword" component={CrosswordGame3_3} />
      <Route path="/primary-school/grade-3/unit-3/spell-quest" component={SpellQuestGame3_3} />
      <Route path="/primary-school/grade-3/unit-3/word-pop" component={WordPopGame3_3} />
      <Route path="/primary-school/grade-3/unit-3/catch-that" component={CatchThatGame3_3} />
      <Route path="/primary-school/grade-3/unit-3/say-what" component={SayWhatGame3_3} />
      <Route path="/primary-school/grade-3/unit-3/memory-flip" component={MemoryFlipGame3_3} />
      <Route path="/primary-school/grade-3/unit-3/word-race" component={WordRaceGame3_3} />
      <Route path="/primary-school/grade-3/unit-3/word-snake" component={WordSnakeGame3_3} />
      {/* Unit 4 games */}
      <Route path="/primary-school/grade-3/unit-4/3.4-matching-game" component={MatchingGame3_4} />
      <Route path="/primary-school/grade-3/unit-4/crossword" component={CrosswordGame3_4} />
      <Route path="/primary-school/grade-3/unit-4/spell-quest" component={SpellQuestGame3_4} />
      <Route path="/primary-school/grade-3/unit-4/word-pop" component={WordPopGame3_4} />
      <Route path="/primary-school/grade-3/unit-4/catch-that" component={CatchThatGame3_4} />
      <Route path="/primary-school/grade-3/unit-4/say-what" component={SayWhatGame3_4} />
      <Route path="/primary-school/grade-3/unit-4/memory-flip" component={MemoryFlipGame3_4} />
      <Route path="/primary-school/grade-3/unit-4/word-race" component={WordRaceGame3_4} />
      <Route path="/primary-school/grade-3/unit-4/word-snake" component={WordSnakeGame3_4} />
      {/* Unit 5 games */}
      <Route path="/primary-school/grade-3/unit-5/3.5-matching-game" component={MatchingGame3_5} />
      <Route path="/primary-school/grade-3/unit-5/crossword" component={CrosswordGame3_5} />
      <Route path="/primary-school/grade-3/unit-5/spell-quest" component={SpellQuestGame3_5} />
      <Route path="/primary-school/grade-3/unit-5/word-pop" component={WordPopGame3_5} />
      <Route path="/primary-school/grade-3/unit-5/catch-that" component={CatchThatGame3_5} />
      <Route path="/primary-school/grade-3/unit-5/say-what" component={SayWhatGame3_5} />
      <Route path="/primary-school/grade-3/unit-5/memory-flip" component={MemoryFlipGame3_5} />
      <Route path="/primary-school/grade-3/unit-5/word-race" component={WordRaceGame3_5} />
      <Route path="/primary-school/grade-3/unit-5/word-snake" component={WordSnakeGame3_5} />
      <Route path="/primary-school/grade-3/unit-1/catch-that" component={CatchThatGame3_1} />
      <Route path="/primary-school/grade-3/unit-1/say-what" component={SayWhatGame3_1} />
      <Route path="/primary-school/grade-3/unit-1/memory-flip" component={MemoryFlipGame3_1} />
      <Route path="/primary-school/grade-3/unit-1/word-race" component={WordRaceGame3_1} />
      <Route path="/primary-school/grade-3/unit-1/word-snake" component={WordSnakeGame3_1} />
      {/* Unit 6 games */}
      <Route path="/primary-school/grade-3/unit-6/3.6-matching-game" component={MatchingGame3_6} />
      <Route path="/primary-school/grade-3/unit-6/crossword" component={CrosswordGame3_6} />
      <Route path="/primary-school/grade-3/unit-6/spell-quest" component={SpellQuestGame3_6} />
      <Route path="/primary-school/grade-3/unit-6/word-pop" component={WordPopGame3_6} />
      <Route path="/primary-school/grade-3/unit-6/catch-that" component={CatchThatGame3_6} />
      <Route path="/primary-school/grade-3/unit-6/say-what" component={SayWhatGame3_6} />
      <Route path="/primary-school/grade-3/unit-6/memory-flip" component={MemoryFlipGame3_6} />
      <Route path="/primary-school/grade-3/unit-6/word-race" component={WordRaceGame3_6} />
      <Route path="/primary-school/grade-3/unit-6/word-snake" component={WordSnakeGame3_6} />
      <Route path="/primary-school/grade-2/theme-1/2.1-matching-game" component={MatchingGame} />
      <Route path="/primary-school/grade-2/theme-2/2.2-matching-game" component={MatchingGame2_2} />
      <Route path="/primary-school/grade-2/theme-3/2.3-matching-game" component={MatchingGame2_3} />
      <Route path="/primary-school/grade-2/theme-4/2.4-matching-game" component={MatchingGame2_4} />
      <Route path="/primary-school/grade-2/theme-5/2.5-matching-game" component={MatchingGame2_5} />
      <Route path="/primary-school/grade-2/theme-6/2.6-matching-game" component={MatchingGame2_6} />
      <Route path="/primary-school/grade-2/theme-1/crossword" component={CrosswordGame} />
      <Route path="/primary-school/grade-2/theme-2/crossword" component={CrosswordGame2_2} />
      <Route path="/primary-school/grade-2/theme-3/crossword" component={CrosswordGame2_3} />
      <Route path="/primary-school/grade-2/theme-4/crossword" component={CrosswordGame2_4} />
      <Route path="/primary-school/grade-2/theme-5/crossword" component={CrosswordGame2_5} />
      <Route path="/primary-school/grade-2/theme-6/crossword" component={CrosswordGame2_6} />
      <Route path="/primary-school/grade-2/theme-1/spell-quest" component={SpellQuestGame} />
      <Route path="/primary-school/grade-2/theme-2/spell-quest" component={SpellQuestGame2_2} />
      <Route path="/primary-school/grade-2/theme-3/spell-quest" component={SpellQuestGame2_3} />
      <Route path="/primary-school/grade-2/theme-4/spell-quest" component={SpellQuestGame2_4} />
      <Route path="/primary-school/grade-2/theme-5/spell-quest" component={SpellQuestGame2_5} />
      <Route path="/primary-school/grade-2/theme-6/spell-quest" component={SpellQuestGame2_6} />
      <Route path="/primary-school/grade-2/theme-1/word-pop" component={WordPopGame} />
      <Route path="/primary-school/grade-2/theme-2/word-pop" component={WordPopGame2_2} />
      <Route path="/primary-school/grade-2/theme-3/word-pop" component={WordPopGame2_3} />
      <Route path="/primary-school/grade-2/theme-4/word-pop" component={WordPopGame2_4} />
      <Route path="/primary-school/grade-2/theme-5/word-pop" component={WordPopGame2_5} />
      <Route path="/primary-school/grade-2/theme-6/word-pop" component={WordPopGame2_6} />
      <Route path="/primary-school/grade-2/theme-1/catch-that" component={CatchThatGame} />
      <Route path="/primary-school/grade-2/theme-1/sound-match" component={SayWhatGame} />
      <Route path="/primary-school/grade-2/theme-1/say-what" component={SayWhatGame} />
      <Route path="/primary-school/grade-2/theme-1/memory-flip" component={MemoryFlipGame} />
      <Route path="/primary-school/grade-2/theme-1/word-race" component={WordRaceGame} />
      <Route path="/primary-school/grade-2/theme-1/word-snake" component={WordSnakeGame} />
      <Route path="/primary-school/grade-2/theme-2/catch-that" component={CatchThatGame2_2} />
      <Route path="/primary-school/grade-2/theme-3/catch-that" component={CatchThatGame2_3} />
      <Route path="/primary-school/grade-2/theme-4/catch-that" component={CatchThatGame2_4} />
      <Route path="/primary-school/grade-2/theme-5/catch-that" component={CatchThatGame2_5} />
      <Route path="/primary-school/grade-2/theme-6/catch-that" component={CatchThatGame2_6} />
      {/* Theme 2 new games */}
      <Route path="/primary-school/grade-2/theme-2/say-what" component={SayWhatGame2_2} />
      <Route path="/primary-school/grade-2/theme-2/memory-flip" component={MemoryFlipGame2_2} />
      <Route path="/primary-school/grade-2/theme-2/word-race" component={WordRaceGame2_2} />
      <Route path="/primary-school/grade-2/theme-2/word-snake" component={WordSnakeGame2_2} />
      {/* Theme 3 new games */}
      <Route path="/primary-school/grade-2/theme-3/say-what" component={SayWhatGame2_3} />
      <Route path="/primary-school/grade-2/theme-3/memory-flip" component={MemoryFlipGame2_3} />
      <Route path="/primary-school/grade-2/theme-3/word-race" component={WordRaceGame2_3} />
      <Route path="/primary-school/grade-2/theme-3/word-snake" component={WordSnakeGame2_3} />
      {/* Theme 4 new games */}
      <Route path="/primary-school/grade-2/theme-4/say-what" component={SayWhatGame2_4} />
      <Route path="/primary-school/grade-2/theme-4/memory-flip" component={MemoryFlipGame2_4} />
      <Route path="/primary-school/grade-2/theme-4/word-race" component={WordRaceGame2_4} />
      <Route path="/primary-school/grade-2/theme-4/word-snake" component={WordSnakeGame2_4} />
      {/* Theme 5 new games */}
      <Route path="/primary-school/grade-2/theme-5/say-what" component={SayWhatGame2_5} />
      <Route path="/primary-school/grade-2/theme-5/memory-flip" component={MemoryFlipGame2_5} />
      <Route path="/primary-school/grade-2/theme-5/word-race" component={WordRaceGame2_5} />
      <Route path="/primary-school/grade-2/theme-5/word-snake" component={WordSnakeGame2_5} />
      {/* Theme 6 new games */}
      <Route path="/primary-school/grade-2/theme-6/say-what" component={SayWhatGame2_6} />
      <Route path="/primary-school/grade-2/theme-6/memory-flip" component={MemoryFlipGame2_6} />
      <Route path="/primary-school/grade-2/theme-6/word-race" component={WordRaceGame2_6} />
      <Route path="/primary-school/grade-2/theme-6/word-snake" component={WordSnakeGame2_6} />
      <Route path="/pre-school/kelime-kartlari" component={PreSchoolVocabMenu} />
      <Route path="/pre-school/kelime-kartlari/0.0-alphabet" component={AlphabetVocabulary} />
      <Route path="/pre-school/kelime-kartlari/0.1-numbers" component={NumbersVocabulary} />
      <Route path="/pre-school/kelime-kartlari/0.2-colours" component={ColorsVocabulary} />
      <Route path="/pre-school/kelime-kartlari/0.3-greetings" component={GreetingsVocabulary} />
      <Route path="/pre-school/kelime-kartlari/0.4-actions" component={ActionsVocabulary} />
      <Route path="/pre-school/kelime-kartlari/0.5-ourbody" component={OurBodyVocabulary} />
      <Route path="/pre-school/kelime-kartlari/0.6-ourclassroom" component={OurClassroomVocabulary} />
      <Route path="/pre-school/kelime-kartlari/0.7-things" component={ThingsVocabulary} />
      <Route path="/pre-school/kelime-kartlari/0.8-people" component={PeopleVocabulary} />
      <Route path="/pre-school/kelime-kartlari/0.9-animals" component={AnimalsVocabulary} />
      <Route path="/pre-school/kelime-kartlari/0.10-aroundus" component={AroundUsVocabulary} />
      <Route path="/pre-school/kelime-kartlari/0.11-food" component={FoodVocabulary} />
      <Route path="/pre-school/0.2-colours-matching-game" component={ColorsMatchingGame} />
      <Route path="/pre-school/0.2-colours-crossword" component={ColorsCrosswordGame} />
      <Route path="/pre-school/0.2-colours-spell-quest" component={ColorsSpellQuestGame} />
      <Route path="/pre-school/0.2-colours-word-pop" component={ColorsWordPopGame} />
      <Route path="/pre-school/0.2-colours-catch-that" component={ColorsCatchGame} />
      <Route path="/pre-school/0.2-colours-i-spy" component={ISpyGame} />
      <Route path="/pre-school/0.1-numbers-matching-game" component={NumbersMatchingGame} />
      <Route path="/pre-school/0.1-numbers-crossword" component={NumbersCrosswordGame} />
      <Route path="/pre-school/0.1-numbers-spell-quest" component={NumbersSpellQuestGame} />
      <Route path="/pre-school/0.1-numbers-word-pop" component={NumbersWordPopGame} />
      <Route path="/pre-school/0.1-numbers-catch-that" component={NumbersCatchGame} />
      <Route path="/pre-school/0.3-greetings-matching-game" component={GreetingsMatchingGame} />
      <Route path="/pre-school/0.3-greetings-crossword" component={GreetingsCrosswordGame} />
      <Route path="/pre-school/0.3-greetings-spell-quest" component={GreetingsSpellQuestGame} />
      <Route path="/pre-school/0.3-greetings-word-pop" component={GreetingsWordPopGame} />
      <Route path="/pre-school/0.3-greetings-catch-that" component={GreetingsCatchGame} />
      <Route path="/pre-school/0.4-actions-matching-game" component={ActionsMatchingGame} />
      <Route path="/pre-school/0.4-actions-crossword" component={ActionsCrosswordGame} />
      <Route path="/pre-school/0.4-actions-spell-quest" component={ActionsSpellQuestGame} />
      <Route path="/pre-school/0.4-actions-word-pop" component={ActionsWordPopGame} />
      <Route path="/pre-school/0.4-actions-catch-that" component={ActionsCatchGame} />
      {/* 0.5-ourbody games */}
      <Route path="/pre-school/0.5-ourbody-matching-game" component={OurBodyMatchingGame} />
      <Route path="/pre-school/0.5-ourbody-crossword" component={OurBodyCrosswordGame} />
      <Route path="/pre-school/0.5-ourbody-spell-quest" component={OurBodySpellQuestGame} />
      <Route path="/pre-school/0.5-ourbody-word-pop" component={OurBodyWordPopGame} />
      <Route path="/pre-school/0.5-ourbody-catch-that" component={OurBodyCatchGame} />
      {/* 0.6-ourclassroom games */}
      <Route path="/pre-school/0.6-ourclassroom-matching-game" component={OurClassroomMatchingGame} />
      <Route path="/pre-school/0.6-ourclassroom-crossword" component={OurClassroomCrosswordGame} />
      <Route path="/pre-school/0.6-ourclassroom-spell-quest" component={OurClassroomSpellQuestGame} />
      <Route path="/pre-school/0.6-ourclassroom-word-pop" component={OurClassroomWordPopGame} />
      <Route path="/pre-school/0.6-ourclassroom-catch-that" component={OurClassroomCatchGame} />
      {/* 0.7-things games */}
      <Route path="/pre-school/0.7-things-matching-game" component={ThingsMatchingGame} />
      <Route path="/pre-school/0.7-things-crossword" component={ThingsCrosswordGame} />
      <Route path="/pre-school/0.7-things-spell-quest" component={ThingsSpellQuestGame} />
      <Route path="/pre-school/0.7-things-word-pop" component={ThingsWordPopGame} />
      <Route path="/pre-school/0.7-things-catch-that" component={ThingsCatchGame} />
      {/* 0.8-people games */}
      <Route path="/pre-school/0.8-people-matching-game" component={PeopleMatchingGame} />
      <Route path="/pre-school/0.8-people-crossword" component={PeopleCrosswordGame} />
      <Route path="/pre-school/0.8-people-spell-quest" component={PeopleSpellQuestGame} />
      <Route path="/pre-school/0.8-people-word-pop" component={PeopleWordPopGame} />
      <Route path="/pre-school/0.8-people-catch-that" component={PeopleCatchGame} />
      {/* 0.9-animals games */}
      <Route path="/pre-school/0.9-animals-matching-game" component={AnimalsMatchingGame} />
      <Route path="/pre-school/0.9-animals-crossword" component={AnimalsCrosswordGame} />
      <Route path="/pre-school/0.9-animals-spell-quest" component={AnimalsSpellQuestGame} />
      <Route path="/pre-school/0.9-animals-word-pop" component={AnimalsWordPopGame} />
      <Route path="/pre-school/0.9-animals-catch-that" component={AnimalsCatchGame} />
      {/* 0.11-food games */}
      <Route path="/pre-school/0.11-food-matching-game" component={FoodMatchingGame} />
      <Route path="/pre-school/0.11-food-crossword" component={FoodCrosswordGame} />
      <Route path="/pre-school/0.11-food-spell-quest" component={FoodSpellQuestGame} />
      <Route path="/pre-school/0.11-food-word-pop" component={FoodWordPopGame} />
      <Route path="/pre-school/0.11-food-catch-that" component={FoodCatchGame} />
      {/* 0.10-aroundus games */}
      <Route path="/pre-school/0.10-aroundus-matching-game" component={AroundUsMatchingGame} />
      <Route path="/pre-school/0.10-aroundus-crossword" component={AroundUsCrosswordGame} />
      <Route path="/pre-school/0.10-aroundus-spell-quest" component={AroundUsSpellQuestGame} />
      <Route path="/pre-school/0.10-aroundus-word-pop" component={AroundUsWordPopGame} />
      <Route path="/pre-school/0.10-aroundus-catch-that" component={AroundUsCatchGame} />
      {/* Story routes */}
      <Route path="/primary-school/stories" component={StoriesMenu} />
      <Route path="/primary-school/stories/:storyId" component={StoryReaderPage} />
      
      {/* Admin routes - protected with password */}
      <Route path="/admin">
        {() => (
          <AdminGate>
            <AdminDashboard />
          </AdminGate>
        )}
      </Route>
      <Route path="/admin/dashboard">
        {() => (
          <AdminGate>
            <AdminDashboard />
          </AdminGate>
        )}
      </Route>
      <Route path="/admin/word-map">
        {() => (
          <AdminGate>
            <WordMapPage />
          </AdminGate>
        )}
      </Route>
      <Route path="/admin/workflow">
        {() => (
          <AdminGate>
            <WorkflowPage />
          </AdminGate>
        )}
      </Route>
      <Route path="/admin/classroom">
        {() => (
          <AdminGate>
            <ClassroomMonitoring />
          </AdminGate>
        )}
      </Route>
      <Route path="/admin/inclass">
        {() => (
          <AdminGate>
            <InClass />
          </AdminGate>
        )}
      </Route>
      <Route path="/classroom">
        <ClassroomMonitoring />
      </Route>
      
      {/* Permanent class pages - must be before catch-all */}
      <Route path="/edincik2a">
        {() => <ClassMonitor code="edincik2a" />}
      </Route>
      <Route path="/edincik3a">
        {() => <ClassMonitor code="edincik3a" />}
      </Route>
      <Route path="/edincik4a">
        {() => <ClassMonitor code="edincik4a" />}
      </Route>
      <Route path="/edincik4b">
        {() => <ClassMonitor code="edincik4b" />}
      </Route>
      
      {/* Monitor page route - must be before catch-all, matches class names */}
      <Route path="/:className">
        {(props: any) => {
          console.log('[App] Monitor route matched, props:', props);
          const className = props?.params?.className || props?.className || (props?.params && typeof props.params === 'string' ? props.params : null);
          console.log('[App] Extracted class name:', className);
          // Always render ClassMonitor - let it handle invalid class names
          return <ClassMonitor code={className} />;
        }}
      </Route>
      
      {/* Catch-all for sub-routes to show the layout with placeholder content or redirect to home 
          In a real app, we'd have specific components for these routes.
          For this prototype, we'll route everything to Home to show the persistent layout 
          but ideally we would have a generic page component.
      */}
      <Route path="/:rest*" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
