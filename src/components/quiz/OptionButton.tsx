import { cn } from '@/lib/utils';

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
      className={cn(
        'w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 font-body',
        selected
          ? 'border-navy bg-navy/5 text-navy font-medium'
          : 'border-line bg-white text-charcoal/80 hover:border-gold hover:bg-ivory'
      )}
    >
      <span className="flex items-start gap-3">
        <span
          className={cn(
            'mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center',
            selected ? 'border-navy bg-navy' : 'border-line'
          )}
        >
          {selected && <span className="w-2 h-2 rounded-full bg-white" />}
        </span>
        <span>{text}</span>
      </span>
    </button>
  );
}
