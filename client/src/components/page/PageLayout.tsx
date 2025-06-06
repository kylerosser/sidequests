import type { ReactNode } from "react";

export const PageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-screen h-screen bg-sq-tint-lighter text-sq-dark">
            {children}
        </div>
    )
}