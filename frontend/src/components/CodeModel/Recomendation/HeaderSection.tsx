import { ChevronLeft } from "lucide-react";

interface HeaderSectionProps {
  onBack: () => void;

}

export default function HeaderSection({
  onBack,

}: HeaderSectionProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium group"
      >
        <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span>Voltar</span>
      </button>
    </div>
  );
}
