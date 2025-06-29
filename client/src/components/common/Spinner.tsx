type SpinnerProps = {
  className?: string;
}

export const Spinner = ({className = ''}: SpinnerProps) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="h-6 w-6 border-4 border-sq-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
};