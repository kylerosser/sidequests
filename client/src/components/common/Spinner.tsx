type SpinnerProps = {
  className?: string;
  thickness?: 4 | 3 | 2 | 1
}

const thicknessMap = {
  1: "border",
  2: "border-2",
  3: "border-[3px]",
  4: "border-4",
} as const;

export const Spinner = ({className = '', thickness = 4 }: SpinnerProps) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`h-6 w-6 ${thicknessMap[thickness]} border-sq-white border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};