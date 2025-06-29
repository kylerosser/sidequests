import type { ReactNode } from "react";
import { Link } from "react-router"

interface HyperlinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const Hyperlink = ({ children, href, className = "", onClick }: HyperlinkProps) => {
  return (
    <Link
      to={href}
      className={`font-semibold text-sq-secondary cursor-pointer hover:text-sq-secondary-darker ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};