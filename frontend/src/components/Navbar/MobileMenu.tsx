"use client";
import { X } from "lucide-react";

interface MobileMenuProps {
  toggleMenu: () => void;
}

export default function MobileMenu({ toggleMenu }: MobileMenuProps) {
  return (
    <div className="absolute top-full right-0 mt-0 bg-navbar rounded-b-md shadow-md py-4 pt-0 px-6  text-whitesmoke text-right w-fit z-50">
      <div className="flex justify-end mb-2">
        <button onClick={toggleMenu} aria-label="Fechar menu">
          <X className="w-4 h-4" />
        </button>
      </div>
      <nav className="flex flex-col w-full space-y-4 mt-6 text-sm font-medium text-center">
      <a
          href="/"
          className="bg-gray-700 rounded hover:bg-gray-600 shadow-md w-full py-2 px-8 sm:px-12 hover:cursor-pointer"
        >
          Home
        </a>
       
        <a
          href="/submission"
          className="bg-gray-700 rounded hover:bg-gray-600 shadow-md w-full py-2 px-8 sm:px-12 hover:cursor-pointer"
        >
          Submissão
        </a>
        <a
          href="/code-model"
          className="bg-gray-700 rounded hover:bg-gray-600 shadow-md w-full py-2 px-8 sm:px-12 hover:cursor-pointer"
        >
          Códigos Modelo
        </a>
        <a
          href="/about"
          className="bg-gray-700 rounded hover:bg-gray-600 shadow-md w-full py-2 px-8 sm:px-12 hover:cursor-pointer"
        >
          Sobre 
        </a>
        <a
          href="/submission"
          className="bg-button hover:bg-buttonhover text-whitesmoke px-4 py-2 rounded-md text-center  hover:cursor-pointer"
        >
          Get Started
        </a>
      </nav>
    </div>
  );
}
