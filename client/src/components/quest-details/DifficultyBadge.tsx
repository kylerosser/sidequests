type DifficultyBadgeProps = {
    difficulty: 1 | 2 | 3 | 4;
}

const difficultyStyles = {
    1: "text-green-700",
    2: "text-yellow-700",
    3: "text-orange-700",
    4: "text-red-800",
}

const difficultyText = {
    1: "Easy",
    2: "Medium",
    3: "Hard",
    4: "Extreme",
}

export const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
    return (
        <div className={`inline-block text-center rounded-full border-1 px-2 ${difficultyStyles[difficulty]}`}>
            <p className="text-xs cursor-default">{difficultyText[difficulty]}</p>
        </div>
    )
}