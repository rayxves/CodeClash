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
        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base group"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 group-hover:-translate-x-0.5 transition-transform" />
        <span className="whitespace-nowrap">Voltar</span>
      </button>
    </div>
  );
}
