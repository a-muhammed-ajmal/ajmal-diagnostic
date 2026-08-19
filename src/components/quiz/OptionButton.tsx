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
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(optionId)}
      className={cn(
        'w-full min-h-[52px] text-left px-5 py-4 rounded-xl border-2 font-body',
        'transition-all duration-200 ease-out',
        selected
          ? 'border-brand bg-brand-soft text-ink font-semibold shadow-1'
          : 'border-line bg-white text-ink hover:-translate-y-0.5 hover:border-brand hover:bg-brand-tint hover:shadow-1'
      )}
    >
      <span className="flex items-start gap-3">
        {/* The filled dot is the non-colour signal for the selected state. */}
        <span
          className={cn(
            'mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center',
            'transition-[border-color,background-color] duration-200 ease-out',
            selected ? 'border-brand bg-brand' : 'border-line-strong bg-white'
          )}
          aria-hidden="true"
        >
          {selected && <span className="w-2 h-2 rounded-full bg-white" />}
        </span>
        <span>{text}</span>
      </span>
    </button>
  );
}
