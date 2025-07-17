import { useState, useRef, useEffect } from "react";

interface ReadMoreProps {
  children: React.ReactNode;
  collapsedHeight?: number; // in px
  className?: string;
  gradient?: boolean;
  readMoreText?: string;
  showLessText?: string;
}

export function ReadMore({ children, collapsedHeight = 100, className = "", gradient=true, readMoreText="Read more", showLessText="Show less" }: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false);
  const [shouldShowToggle, setShouldShowToggle] = useState(false);
  const [height, setHeight] = useState<string | number>("auto");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const fullHeight = el.scrollHeight;

    if (fullHeight > collapsedHeight) {
      setShouldShowToggle(true);
      setHeight(expanded ? fullHeight : collapsedHeight);
    } else {
      setShouldShowToggle(false);
      setHeight("auto");
    }
  }, [expanded, collapsedHeight, children]);

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <div
          ref={contentRef}
          className="transition-all duration-200 ease-in-out overflow-hidden"
          style={{ height }}
        >
          {children}
        </div>

        {!expanded && shouldShowToggle && gradient && (
          <div className="absolute bottom-0 left-0 w-full h-10 0 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          
        )}
      </div>

      {shouldShowToggle && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="text-sq-secondary text-sm cursor-pointer"
        >
          {expanded ? showLessText : readMoreText}
        </button>
      )}
    </div>
  );
}
