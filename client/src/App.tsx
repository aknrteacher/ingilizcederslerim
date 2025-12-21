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
import PrimarySchoolLandingPage from "@/pages/landing-primary-school";
import SecondarySchoolLandingPage from "@/pages/landing-secondary-school";
import HighSchoolLandingPage from "@/pages/landing-high-school";
import UniversityLandingPage from "@/pages/landing-university";
import BusinessEnglishLandingPage from "@/pages/landing-business-english";
import VocabularyCards from "@/pages/primary/grade2/theme1/vocab/2.1.voc";
import VocabularyCards2_2 from "@/pages/primary/grade2/theme2/vocab/2.2.voc";
import ColorsVocabulary from "@/pages/preschool/vocab/0.2-colours/0.1.voc";
import NumbersVocabulary from "@/pages/preschool/vocab/0.1-numbers/0.1-numbers.voc";
import AlphabetVocabulary from "@/pages/preschool/vocab/0.0-alphabet/0.1-alphabet.voc";
import GreetingsVocabulary from "@/pages/preschool/vocab/0.3-greetings/0.3-greetings.voc";
import ActionsVocabulary from "@/pages/preschool/vocab/0.4-actions/0.4-actions.voc";
import PreSchoolVocabMenu from "@/pages/preschool/vocab/0.2-colours/pre-school-vocab-menu";
import PreSchoolGamesMenu from "@/pages/pre-school-games-menu";
import PrimarySchoolGrade2Theme1GamesMenu from "@/pages/primary-school-grade2-theme1-games-menu";
import PrimarySchoolGrade2Theme2GamesMenu from "@/pages/primary-school-grade2-theme2-games-menu";
import MatchingGame from "@/pages/primary/grade2/theme1/games/2.1.matching-game";
import MatchingGame2_2 from "@/pages/primary/grade2/theme2/games/2.2.matching-game";
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
import CrosswordGame from "@/pages/primary/grade2/theme1/games/2.1.crossword";
import CrosswordGame2_2 from "@/pages/primary/grade2/theme2/games/2.2.crossword";
import SpellQuestGame from "@/pages/primary/grade2/theme1/games/2.1.spell-quest";
import SpellQuestGame2_2 from "@/pages/primary/grade2/theme2/games/2.2.spell-quest";
import WordPopGame from "@/pages/primary/grade2/theme1/games/2.1.word-pop";
import WordPopGame2_2 from "@/pages/primary/grade2/theme2/games/2.2.word-pop";
import CatchThatGame from "@/pages/primary/grade2/theme1/games/2.1.catch-that";
import CatchThatGame2_2 from "@/pages/primary/grade2/theme2/games/2.2.catch-that";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainLandingPage} />
      <Route path="/pre-school" component={PreschoolLandingPage} />
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
      <Route path="/primary-school/grade-2/theme-1/2.1-vocab" component={VocabularyCards} />
      <Route path="/primary-school/grade-2/theme-2/2.2-vocab" component={VocabularyCards2_2} />
      <Route path="/primary-school/grade-2/theme-1/2.1-matching-game" component={MatchingGame} />
      <Route path="/primary-school/grade-2/theme-2/2.2-matching-game" component={MatchingGame2_2} />
      <Route path="/primary-school/grade-2/theme-1/crossword" component={CrosswordGame} />
      <Route path="/primary-school/grade-2/theme-2/crossword" component={CrosswordGame2_2} />
      <Route path="/primary-school/grade-2/theme-1/spell-quest" component={SpellQuestGame} />
      <Route path="/primary-school/grade-2/theme-2/spell-quest" component={SpellQuestGame2_2} />
      <Route path="/primary-school/grade-2/theme-1/word-pop" component={WordPopGame} />
      <Route path="/primary-school/grade-2/theme-2/word-pop" component={WordPopGame2_2} />
      <Route path="/primary-school/grade-2/theme-1/catch-that" component={CatchThatGame} />
      <Route path="/primary-school/grade-2/theme-2/catch-that" component={CatchThatGame2_2} />
      <Route path="/pre-school/kelime-kartlari" component={PreSchoolVocabMenu} />
      <Route path="/pre-school/kelime-kartlari/0.0-alphabet" component={AlphabetVocabulary} />
      <Route path="/pre-school/kelime-kartlari/0.1-numbers" component={NumbersVocabulary} />
      <Route path="/pre-school/kelime-kartlari/0.2-colours" component={ColorsVocabulary} />
      <Route path="/pre-school/kelime-kartlari/0.3-greetings" component={GreetingsVocabulary} />
      <Route path="/pre-school/kelime-kartlari/0.4-actions" component={ActionsVocabulary} />
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
