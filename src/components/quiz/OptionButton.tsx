interface OptionButtonProps {
  optionId: string;
  text: string;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function OptionButton({ optionId, text, selected, onSelect }: OptionButtonProps) {
  return (
    <button
      onClick={() => onSelect(optionId)}
      className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200
        ${selected
          ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-gray-50'
        }`}
    >
      <span className="flex items-start gap-3">
        <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${selected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
          {selected && <span className="w-2 h-2 rounded-full bg-white" />}
        </span>
        <span>{text}</span>
      </span>
    </button>
  );
}
