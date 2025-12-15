import { useState, useEffect, ReactNode } from "react";
import { Maximize2, Minimize2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrimarySchoolGameHeaderProps {
  gameName: string;
  description: string;
  containerId: string;
  icon?: ReactNode;
}

export function PrimarySchoolGameHeader({ gameName, description, containerId, icon }: PrimarySchoolGameHeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Apply zoom to game content elements (like fullscreen makes things bigger)
  useEffect(() => {
    const element = document.getElementById(containerId);
    if (!element) return;

    // Find the main game container
    const container = (element.querySelector(".matching-game-container") || 
                      element.querySelector(".spell-quest-container") ||
                      element.querySelector(".word-pop-container") ||
                      element.querySelector(".color-catch-container") ||
                      element.querySelector(".catch-that-container") ||
                      element.querySelector(".max-w-6xl") ||
                      element) as HTMLElement;
    
    if (!container) return;

    const scaleValue = zoomLevel / 100;
    
    // Apply zoom as CSS variable that game elements can use
    container.style.setProperty('--zoom-scale', `${scaleValue}`);
    
    // For matching game, scale the game board content
    const gameBoard = container.querySelector('.game-board') as HTMLElement;
    if (gameBoard) {
      gameBoard.style.transform = `scale(${scaleValue})`;
      gameBoard.style.transformOrigin = "top center";
      gameBoard.style.transition = "transform 0.2s ease";
    }
    
    // For spell quest, scale the game main area
    const gameMain = container.querySelector('.game-main') as HTMLElement;
    if (gameMain) {
      gameMain.style.transform = `scale(${scaleValue})`;
      gameMain.style.transformOrigin = "top center";
      gameMain.style.transition = "transform 0.2s ease";
    }
    
    // For word pop, color catch, and catch-that, scale the main game area
    const mainGameArea = container.querySelector('.flex-1.flex') as HTMLElement;
    if (mainGameArea && (container.classList.contains('word-pop-container') || container.classList.contains('color-catch-container') || container.classList.contains('catch-that-container'))) {
      mainGameArea.style.transform = `scale(${scaleValue})`;
      mainGameArea.style.transformOrigin = "top center";
      mainGameArea.style.transition = "transform 0.2s ease";
    }
    
    // For catch-that, also scale the game play area specifically
    const gamePlayArea = container.querySelector('.flex-1.relative.overflow-hidden') as HTMLElement;
    if (gamePlayArea && container.classList.contains('catch-that-container')) {
      gamePlayArea.style.transform = `scale(${scaleValue})`;
      gamePlayArea.style.transformOrigin = "top center";
      gamePlayArea.style.transition = "transform 0.2s ease";
    }
    
    // For crossword, scale the grid area
    const gridArea = container.querySelector('#crossword-grid-area') as HTMLElement;
    if (gridArea) {
      gridArea.style.transform = `scale(${scaleValue})`;
      gridArea.style.transformOrigin = "top center";
      gridArea.style.transition = "transform 0.2s ease";
    }
  }, [zoomLevel, containerId, isFullscreen]);

  const handleZoomIn = () => {
    setZoomLevel(prev => {
      const newLevel = Math.min(prev + 10, 200); // Max 200%
      return newLevel;
    });
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const newLevel = Math.max(prev - 10, 50); // Min 50%
      return newLevel;
    });
  };

  const toggleFullscreen = async () => {
    const element = document.getElementById(containerId);
    if (!element) return;

    // Find the main game container to make fullscreen
    const container = (element.querySelector(".matching-game-container") || 
                      element.querySelector(".spell-quest-container") ||
                      element.querySelector(".word-pop-container") ||
                      element.querySelector(".color-catch-container") ||
                      element.querySelector(".catch-that-container") ||
                      element.querySelector(".max-w-6xl") ||
                      element) as HTMLElement;
    if (!container) return;

    // Also find wrapper for spell-quest to add class
    const wrapper = element.querySelector(".spell-quest-colors-wrapper") as HTMLElement;

    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        await container.requestFullscreen();
        // Also add CSS class for styling
        container.classList.add("fullscreen-active");
        if (wrapper) wrapper.classList.add("fullscreen-active");
        setIsFullscreen(true);
        
        // Zoom will be reapplied by useEffect after fullscreen is active
      } else {
        // Exit fullscreen
        await document.exitFullscreen();
        // Remove CSS class
        container.classList.remove("fullscreen-active");
        if (wrapper) wrapper.classList.remove("fullscreen-active");
        setIsFullscreen(false);
        
        // Zoom will be reapplied by useEffect after exiting fullscreen
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
      // Fallback: try CSS-based fullscreen if browser API fails
      if (!isFullscreen) {
        container.classList.add("fullscreen-active");
        if (wrapper) wrapper.classList.add("fullscreen-active");
        setIsFullscreen(true);
      } else {
        container.classList.remove("fullscreen-active");
        if (wrapper) wrapper.classList.remove("fullscreen-active");
        setIsFullscreen(false);
      }
    }
  };

  // Listen for fullscreen changes (user might press ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const element = document.getElementById(containerId);
      if (!element) return;
      
      const container = (element.querySelector(".matching-game-container") || 
                        element.querySelector(".spell-quest-container") ||
                        element.querySelector(".word-pop-container") ||
                        element.querySelector(".color-catch-container") ||
                        element.querySelector(".catch-that-container") ||
                        element.querySelector(".max-w-6xl") ||
                        element) as HTMLElement;
      
      // Also find wrapper for spell-quest
      const wrapper = element.querySelector(".spell-quest-colors-wrapper") as HTMLElement;
      
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      // Sync CSS class with fullscreen state and reapply zoom
      if (container) {
        const scaleValue = zoomLevel / 100;
        if (isCurrentlyFullscreen) {
          container.classList.add("fullscreen-active");
          if (wrapper) wrapper.classList.add("fullscreen-active");
          // Zoom will be reapplied by useEffect
        } else {
          container.classList.remove("fullscreen-active");
          if (wrapper) wrapper.classList.remove("fullscreen-active");
          // Zoom will be reapplied by useEffect
        }
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [containerId, zoomLevel]);

  return (
    <div className="primary-school-game-header">
      <div className="header-content">
        <div className="header-title-section">
          <div className="title-with-icon">
            {icon && <span className="game-icon">{icon}</span>}
            <h1 className="game-title">{gameName.toUpperCase()}</h1>
          </div>
          <p className="game-description">{description}</p>
        </div>
        
        <div className="header-controls">
          <Button
            onClick={handleZoomOut}
            variant="outline"
            size="icon"
            className="zoom-button"
            title="Zoom out"
            disabled={zoomLevel <= 50}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="zoom-percentage">{zoomLevel}%</span>
          <Button
            onClick={handleZoomIn}
            variant="outline"
            size="icon"
            className="zoom-button"
            title="Zoom in"
            disabled={zoomLevel >= 200}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            onClick={toggleFullscreen}
            variant="outline"
            size="icon"
            className="zoom-button"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

