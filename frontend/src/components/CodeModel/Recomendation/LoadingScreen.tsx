import { Loader } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Buscando recomendações...</p>
      </div>
    </div>
  );
}