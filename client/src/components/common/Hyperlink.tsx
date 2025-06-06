import type { ReactNode } from "react";

interface HyperlinkProps {
  children: ReactNode;
  href: string;
  className?: string;
}

export const Hyperlink = ({ children, href, className = "" }: HyperlinkProps) => {
  return (
    <a
      href={href}
      className={`font-semibold text-sq-secondary hover:text-sq-secondary-darker ${className}`}
    >
      {children}
    </a>
  );
};