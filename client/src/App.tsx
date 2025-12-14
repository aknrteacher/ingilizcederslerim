import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import VocabularyCards from "@/pages/primary/grade2/theme1/vocab/2.1.voc";
import ColorsVocabulary from "@/pages/preschool/vocab/colours/0.1.voc";
import PreSchoolVocabMenu from "@/pages/preschool/vocab/colours/pre-school-vocab-menu";
import Oyunlar from "@/pages/oyunlar";
import PreSchoolGamesMenu from "@/pages/pre-school-games-menu";
import MatchingGame from "@/pages/primary/grade2/theme1/games/2.1.matching-game";
import ColorsMatchingGame from "@/pages/preschool/games/colours/0.1.matching-game";
import ColorsCrosswordGame from "@/pages/preschool/games/colours/0.1.crossword";
import ColorsSpellQuestGame from "@/pages/preschool/games/colours/0.1.spell-quest";
import ColorsWordPopGame from "@/pages/preschool/games/colours/0.1.word-pop";
import ColorsCatchGame from "@/pages/preschool/games/colours/0.1.catch-that";
import CrosswordGame from "@/pages/primary/grade2/theme1/games/2.1.crossword";
import SpellQuestGame from "@/pages/primary/grade2/theme1/games/2.1.spell-quest";
import WordPopGame from "@/pages/primary/grade2/theme1/games/2.1.word-pop";
import CatchThatGame from "@/pages/primary/grade2/theme1/games/2.1.catch-that";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/oyunlar" component={Oyunlar} />
      <Route path="/oyunlar/okul-oncesi" component={PreSchoolGamesMenu} />
      <Route path="/pre-school/games" component={PreSchoolGamesMenu} />
      <Route path="/primary-school/grade-2/theme-1/games" component={Oyunlar} />
      <Route path="/primary-school/grade-2/theme-1/2.1-vocab" component={VocabularyCards} />
      <Route path="/primary-school/grade-2/theme-1/2.1-matching-game" component={MatchingGame} />
      <Route path="/primary-school/grade-2/theme-1/crossword" component={CrosswordGame} />
      <Route path="/primary-school/grade-2/theme-1/spell-quest" component={SpellQuestGame} />
      <Route path="/primary-school/grade-2/theme-1/word-pop" component={WordPopGame} />
      <Route path="/primary-school/grade-2/theme-1/catch-that" component={CatchThatGame} />
      <Route path="/pre-school/kelime-kartlari" component={PreSchoolVocabMenu} />
      <Route path="/pre-school/kelime-kartlari/0.1-vocab" component={ColorsVocabulary} />
      <Route path="/pre-school/0.1-matching-game" component={ColorsMatchingGame} />
      <Route path="/pre-school/0.1-crossword" component={ColorsCrosswordGame} />
      <Route path="/pre-school/0.1-spell-quest" component={ColorsSpellQuestGame} />
      <Route path="/pre-school/0.1-word-pop" component={ColorsWordPopGame} />
      <Route path="/pre-school/0.1-catch-that" component={ColorsCatchGame} />
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
