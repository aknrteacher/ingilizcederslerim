import { ColourThisGame } from "@/components/games/ColourThisGame";
import { COLOUR_THIS_VOCAB, getColourThisGamesMenuHref, getColourThisImageBase } from "@/data/colour-this-vocab";

const UNIT_ID = "3.4" as const;

export default function ColourThis3_4() {
  return (
    <ColourThisGame
      vocab={COLOUR_THIS_VOCAB[UNIT_ID]}
      imageBasePath={getColourThisImageBase(UNIT_ID)}
      gamesMenuHref={getColourThisGamesMenuHref(UNIT_ID)}
    />
  );
}
