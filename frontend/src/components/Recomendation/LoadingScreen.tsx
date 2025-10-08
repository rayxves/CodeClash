import { Loader } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Buscando recomendações...</p>
      </div>
    </div>
  );
}