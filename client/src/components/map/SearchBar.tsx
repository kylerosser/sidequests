import { useState, useEffect } from 'react';
import searchImage from '/search_24dp_193E55_FILL0_wght400_GRAD0_opsz24.svg';

const placeholderList = [
    'caving at Rangitoto',
    'walks in Auckland',
    'bush walk near Piha',
    'things to do in Manukau'
];

const style = `
@keyframes placeholder-swap {
    0%   { opacity: 1; }
    40%  { opacity: 1; }
    50%  { opacity: 0; }
    60%  { opacity: 1; }
    100% { opacity: 1; }
}
`;

export const SearchBar = () => {
    const [searchValue, setSearchValue] = useState('');
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [key, setKey] = useState(0);

    useEffect(() => {
        const firstTimeout = setTimeout(() => {
            setPlaceholderIndex(1);
        }, 1500);

        const interval = setInterval(() => {
            setKey(k => k + 1);
            setTimeout(() => {
                setPlaceholderIndex(i => (i + 1) % placeholderList.length);
            }, 1500);
        }, 3000);

        return () => {
            clearTimeout(firstTimeout);
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            <style>{style}</style>
            <div className="relative bg-white rounded-full border-1 border-sq-grey shadow-md h-[50px] w-full sm:w-lg pointer-events-auto px-5 py-2">
                <div className="flex flex-row w-full h-full gap-2 relative">
                    {!searchValue && (
                        <span
                            key={key}
                            className="absolute inset-0 flex items-center pointer-events-none text-gray-400"
                            style={{ animation: 'placeholder-swap 3s ease-in-out infinite' }}
                        >
                            {placeholderList[placeholderIndex]}
                        </span>
                    )}
                    <input
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        className="focus:outline-none flex-1 bg-transparent relative z-10"
                        type="search"
                        placeholder=""
                    />
                    <img className="w-6" src={searchImage} />
                </div>
            </div>
        </>
    );
};