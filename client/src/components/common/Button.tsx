type ButtonProps = {
  type?: 'submit' | 'button' | 'reset';
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
};

const variantClasses = {
  primary: 'bg-sq-primary hover:bg-sq-primary-darker text-white',
  secondary: 'bg-sq-secondary hover:bg-sq-secondary-darker text-white'
};

export const Button = ({
  type = 'button',
  variant = 'primary',
  children,
  className = '',
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};