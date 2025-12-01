import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import VocabularyCards from "@/pages/2.1.voc";
import ColorsVocabulary from "@/pages/0.1.voc";
import PreSchoolVocabMenu from "@/pages/pre-school-vocab-menu";
import Oyunlar from "@/pages/oyunlar";
import MatchingGame from "@/pages/2.1.matching-game";
import ColorsMatchingGame from "@/pages/0.1.matching-game";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/oyunlar" component={Oyunlar} />
      <Route path="/primary-school/grade-2/theme-1/games" component={Oyunlar} />
      <Route path="/primary-school/grade-2/theme-1/2.1-vocab" component={VocabularyCards} />
      <Route path="/primary-school/grade-2/theme-1/2.1-matching-game" component={MatchingGame} />
      <Route path="/pre-school/kelime-kartlari" component={PreSchoolVocabMenu} />
      <Route path="/pre-school/kelime-kartlari/0.1-vocab" component={ColorsVocabulary} />
      <Route path="/pre-school/0.1-matching-game" component={ColorsMatchingGame} />
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
