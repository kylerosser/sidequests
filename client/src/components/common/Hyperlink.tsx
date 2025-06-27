import type { ReactNode } from "react";
import { Link } from "react-router"

interface HyperlinkProps {
  children: ReactNode;
  href: string;
  className?: string;
}

export const Hyperlink = ({ children, href, className = "" }: HyperlinkProps) => {
  return (
    <Link
      to={href}
      className={`font-semibold text-sq-secondary cursor-pointer hover:text-sq-secondary-darker ${className}`}
    >
      {children}
    </Link>
  );
};