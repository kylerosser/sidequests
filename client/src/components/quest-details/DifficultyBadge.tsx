type DifficultyBadgeProps = {
    difficulty: 1 | 2 | 3 | 4;
    className?: string;
}

const difficultyStyles = {
    1: "text-green-700",
    2: "text-yellow-700",
    3: "text-red-800",
    4: "text-purple-950",
}

const difficultyText = {
    1: "Easy",
    2: "Medium",
    3: "Hard",
    4: "Extreme",
}

export const DifficultyBadge = ({ difficulty, className}: DifficultyBadgeProps) => {
    return (
        <div className={`inline-block text-center rounded-full border-1 px-2 ${difficultyStyles[difficulty]} ${className}`}>
            <p className="text-xs cursor-default">{difficultyText[difficulty]}</p>
        </div>
    )
}