import { ChevronRight, RotateCcw } from "lucide-react";
import type { NavigationMode } from "../../../types/navigation";

interface TreeControlsProps {
  navigationMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
  onNext: () => void;
  onReset: () => void;
}

export default function TreeControls({
  navigationMode,
  onModeChange,
  onNext,
  onReset,
}: TreeControlsProps) {
  const modes: NavigationMode[] = ["depth", "breadth", "algorithms"];
  const modeLabels: Record<NavigationMode, string> = {
    depth: "Profundidade",
    breadth: "Largura",
    algorithms: "Algoritmos",
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full lg:w-auto">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
              navigationMode === mode
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            {modeLabels[mode]}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground text-sm transition-all"
        >
          Próximo Sugerido
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 p-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg font-medium transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}