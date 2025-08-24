type StepperSegmentsProps = {
  current: number;        // 0..labels.length-1
  labels: string[];
  onStepClick?: (i: number) => void;
};

export default function StepperSegments({ current, labels, onStepClick }: StepperSegmentsProps) {
  return (
    <div className="w-full">
        {/* Labels */}
        <div className="mb-2 hidden md:flex gap-2">
            {labels.map((label, i) => (
            <div key={i} className="flex-1 text-left text-sm">
                {`${i+1}. ${label}`}
            </div>
            ))}
        </div>

        {/* Bars */}
        <div className="flex gap-2">
        {labels.map((_, i) => {
          const isOrange = i <= current;

          const base = "flex-1 h-2 rounded-full transition-colors";
          const color = isOrange ? "bg-sq-primary" : "bg-gray-300";

          return onStepClick ? (
            <button
              key={i}
              type="button"
              onClick={() => onStepClick(i)}
              className={`${base} ${color} focus:outline-none focus:ring-2 focus:ring-orange-400`}
              aria-current={i === current ? "step" : undefined}
            />
          ) : (
            <div
              key={i}
              className={`${base} ${color}`}
              aria-current={i === current ? "step" : undefined}
            />
          );
        })}
      </div>

      
    </div>
  );
}