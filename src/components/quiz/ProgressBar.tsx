interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-[length:var(--step-0)] text-muted mb-2 font-body">
        <span>Question {current} of {total}</span>
        <span>{percentage}% complete</span>
      </div>
      <div className="h-2 w-full rounded-full bg-line">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-electric-700 to-electric-500 transition-[width] duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
