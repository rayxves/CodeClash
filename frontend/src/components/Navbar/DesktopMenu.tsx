"use client";
import { Filter } from "lucide-react";

interface DesktopMenuProps {
  toggleFilter: (filterType: string) => void;
}

export default function DesktopMenu({
  toggleFilter,
}: DesktopMenuProps) {
  return (
    <ul className="hidden md:flex space-x-6 text-sm items-center font-medium  text-whitesmoke relative">
       <li className="hover:text-gray-300 hover:cursor-pointer">
        <a href="/">Home</a>
      </li>
      <li className="hover:text-gray-300 hover:cursor-pointer">
        <a href="/about">Sobre</a>
      </li>
      <li className="hover:text-gray-300 hover:cursor-pointer">
        <a href="#">Submissão</a>
      </li>
      <li className="hover:text-gray-300 hover:cursor-pointer">
        <a href="code-model">Códigos Modelo</a>
      </li>
      <li className="relative">
        <button
          onClick={() => toggleFilter("name")}
          className="flex items-center gap-2 hover:text-gray-300 hover:cursor-pointer"
        >
          <span>Filtros</span>
          <Filter className="w-4 h-4" />
        </button>
      </li>
      <li>
        <a
          href="#"
          className="bg-button  hover:bg-buttonhover text-whitesmoke px-4 py-2 rounded-md"
        >
          Get Started
        </a>
      </li>
    </ul>
  );
}
