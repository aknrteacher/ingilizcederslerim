import { ColourThisGame } from "@/components/games/ColourThisGame";
import { TEST_PRIMARY_COLOUR_THIS_VOCAB } from "@/data/test-primary-vocab";

export default function TestColourSoundGame() {
  return (
    <ColourThisGame
      vocab={TEST_PRIMARY_COLOUR_THIS_VOCAB}
      imageBasePath="/images/primary/test"
      gamesMenuHref="/primary-school/test-vocab"
      interactionMode="full-region"
    />
  );
}
