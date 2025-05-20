interface CodeFooterProps {
  description: string;
}

export default function CodeFooter({ description }: CodeFooterProps) {
  return (
    <div className="bg-gray-50 px-4 sm:px-5 py-2 border-t border-gray-200">
      <p className="text-gray-600 text-xs sm:text-sm">
        {description}
      </p>
    </div>
  );
}