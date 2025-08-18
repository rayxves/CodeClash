interface CodeFooterProps {
  description: string;
}

export default function CodeFooter({ description }: CodeFooterProps) {
  return (
    <div className="bg-gray-300 px-4 sm:px-5 py-2">
      <p className="text-gray-900 text-xs sm:text-sm">
        {description}
      </p>
    </div>
  );
}