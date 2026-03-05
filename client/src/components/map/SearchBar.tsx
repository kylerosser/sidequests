import { useState, useEffect } from 'react';
import searchImage from '/search_24dp_193E55_FILL0_wght400_GRAD0_opsz24.svg';
import closeImage from '/close_24dp_193E55_FILL0_wght400_GRAD0_opsz24.svg';
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

type SearchResults = {
    title: string
    preview: string
    url: string
}[]

export const SearchBar = () => {
    const [searchValue, setSearchValue] = useState('');
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [placeholderKey, setPlaceholderKey] = useState(0);
    const [loading, setLoading] = useState(false)
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
    const [displayedSearchQuery, setDisplayedSearchQuery] = useState('');

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

    const onSearch = () => {
        if (searchValue == '') return; //reject empty searches
        if (loading) return; //debounce loading state

        setLoading(true);
        setTimeout(() => {
            setDisplayedSearchQuery(searchValue);
            setLoading(false);
            setSearchResults([]) // todo: fetch from DB
        }, 1000)
    }

    const onClearResults = () => {
        setDisplayedSearchQuery('');
        setSearchResults(null);
    }

    return (
        <>
            <style>{`
                @keyframes placeholder-swap {
                    0%   { opacity: 1; }
                    40%  { opacity: 1; }
                    50%  { opacity: 0; }
                    60%  { opacity: 1; }
                    100% { opacity: 1; }
                }
            `}</style>

            <div className="relative w-full sm:w-lg pointer-events-auto flex flex-col" style={{ height: '100%' }}>

                {/* Search bar */}
                <form onSubmit={(e) => {
                            e.preventDefault()
                            onSearch()
                        }}>
                <div className="relative bg-white rounded-full border-1 border-sq-grey shadow-md h-[50px] px-5 py-2 z-10 flex-shrink-0">
                    
                    <div className="flex flex-row w-full h-full gap-3 relative">
                        {!searchValue && (
                            <span className="absolute inset-0 flex items-center pointer-events-none text-gray-400">
                                <span>Search for <span
                                    key={placeholderKey}
                                    className="font-semibold italic"
                                    style={{ animation: 'placeholder-swap 3s ease-in-out infinite', display: 'inline-block' }}
                                >{placeholderList[placeholderIndex]}</span></span>
                            </span>
                        )}
                        
                            <input
                                value={searchValue}
                                onChange={(e) => { if (!loading) setSearchValue(e.target.value) }}
                                className="focus:outline-none flex-1 bg-transparent relative z-10"
                                type="search"
                                placeholder=""
                            />
                            {/* Search button (always visible) */ }
                            <button className="cursor-pointer" type="submit">
                                <img className="w-6" src={searchImage} />
                            </button>

                            {/* Loading spinner (when loading) */}
                            {loading && <Spinner thickness={3} />}

                            {/* Close button (when not loading and search results visible*/}
                            {(!loading && searchResults) &&
                                <button className="cursor-pointer" type="button" onClick={onClearResults}>
                                    <img className="w-6" src={closeImage} />
                                </button>
                            }
                    </div>
                </div>
                </form>

                {/* Search results*/}
                { searchResults && 
                    <div
                        className="relative bg-white border-1 border-sq-grey shadow-md z-0 flex-1 min-h-0"
                        style={{
                            marginTop: '-25px',
                            borderRadius: '0 0 0.5rem 0.5rem',
                        }}
                    >
                        <div className="pr-1 py-1 h-full">
                            <div className="flex flex-col py-6 h-full overflow-y-auto scrollbar-thin scrollbar-sq-grey scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                                style={{ paddingTop: '33px' }}
                            >
                                <p className="px-6 text-sm mb-2 text-sq-dark">Showing results for <span className="font-italic font-semibold">{displayedSearchQuery}</span></p>
                                {searchResults.map((searchResult) => {
                                    return <div className="px-6 border-t-1 border-sq-grey py-3 cursor-pointer hover:bg-gray-100" key={searchResult.url}>
                                        <h1 className="font-bold">{searchResult.title}</h1>
                                        <p className="text-sm">{searchResult.preview}</p>
                                    </div>
                                })}
                                <hr className=" px-6 border-t-1 border-sq-grey" />

                                {/* No results found status text */}
                                {searchResults.length == 0 && 
                                    <div className="text-center flex-1 flex items-center justify-center">
                                        <i>No results found</i>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    );
};