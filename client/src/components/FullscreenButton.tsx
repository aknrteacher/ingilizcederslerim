import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FullscreenButtonProps {
  containerId: string;
}

export function FullscreenButton({ containerId }: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const element = document.getElementById(containerId);
    if (!element) return;

    const container = element.querySelector(".matching-game-container") as HTMLElement;
    if (!container) return;

    if (!isFullscreen) {
      container.classList.add("fullscreen-active");
      setIsFullscreen(true);
    } else {
      container.classList.remove("fullscreen-active");
      setIsFullscreen(false);
    }
  };

  return (
    <Button
      onClick={toggleFullscreen}
      variant="outline"
      size="icon"
      className="h-9 w-9"
      data-testid="button-fullscreen"
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <Minimize2 className="h-4 w-4" />
      ) : (
        <Maximize2 className="h-4 w-4" />
      )}
    </Button>
  );
}
