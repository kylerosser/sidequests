import { Spinner } from "./Spinner"

type ButtonProps = {
  type?: 'submit' | 'button' | 'reset';
  variant?: 'primary' | 'secondary' | 'white';
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
};

const variantClasses = {
  primary: 'bg-sq-primary hover:bg-sq-primary-darker text-white',
  secondary: 'bg-sq-secondary hover:bg-sq-secondary-darker text-white',
  white: 'bg-white hover:bg-sq-light text-sq-dark border-1 border-sq-grey'
};

export const Button = ({
    type = 'button',
  variant = 'primary',
  children,
  className = '',
  onClick,
  loading = false
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer whitespace-nowrap ${variantClasses[variant]} ${className}`}
    >
      {loading ? <Spinner className="h-4 my-1"/> : children}
    </button>
  );
};