import { useState, useEffect } from 'react';
import searchImage from '/search_24dp_193E55_FILL0_wght400_GRAD0_opsz24.svg';
import { Spinner } from '../common/Spinner';
const placeholderList = [
    'caving at Rangitoto',
    'walks in Auckland',
    'bush walks near Piha',
    'things to do in West Auckland',
    'beach walks',
    'birdspotting',
    'North Island',
    'waterfalls near Auckland',
    'sunset viewpoints',
    'lava caves',
    'coastal walks',
    'short hikes',
    'day trips from Auckland',
    'lookouts in the Waitākere Ranges',
    'swimming holes',
    'hidden beaches',
    'island walks in the Hauraki Gulf',
    'historic sites',
    'abandoned places',
    'places to watch the sunrise',
    'quiet nature spots',
    'easy hikes',
    'scenic drives',
    'camping spots',
    'waterfalls in the Coromandel',
    'things to do in Northland'
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
    const [placeholderKey, setPlaceholderKey] = useState(0);
    const [loading, setLoading] = useState(false)

    const getRandomIndex = (currentIndex: number) => {
        let next;
        do {
            next = Math.floor(Math.random() * placeholderList.length);
        } while (next === currentIndex);
        return next;
    };

    useEffect(() => {
        const firstTimeout = setTimeout(() => {
            setPlaceholderIndex(i => getRandomIndex(i));
        }, 1500);
        const interval = setInterval(() => {
            setPlaceholderKey(k => k + 1);
            setTimeout(() => {
                setPlaceholderIndex(i => getRandomIndex(i));
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
                        <span className="absolute inset-0 flex items-center pointer-events-none text-gray-400">
                            <span>Search for <span
                                key={placeholderKey}
                                className="font-semibold font-italic"
                                style={{ animation: 'placeholder-swap 3s ease-in-out infinite', display: 'inline-block' }}
                            >{placeholderList[placeholderIndex]}</span></span>
                        </span>
                    )}
                    <input
                        value={searchValue}
                        onChange={(e) => {
                            if (!loading) setSearchValue(e.target.value)
                        }}
                        className=" focus:outline-none flex-1 bg-transparent relative z-10"
                        type="search"
                        placeholder=""
                    />
                    {
                        loading ? 
                        <Spinner/> : 
                        <button className="cursor-pointer" onClick={() => setLoading(true)}>
                            <img className="w-6" src={searchImage} />
                        </button>
                    }
                </div>
            </div>
        </>
    );
};