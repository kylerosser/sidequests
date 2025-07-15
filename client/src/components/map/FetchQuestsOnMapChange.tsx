import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import { LatLngBounds } from 'leaflet'

import { questsApi } from '../../api/questsApi'
import type { Quest } from '../../api/questsApi'

const FETCH_QUESTS_DEBOUNCE_MS = 600; // Debounce time in ms for fetching quests
const FETCH_QUESTS_BOUNDS_MARGIN = 0.2 // Proportion of margin to pad the bounds with when fetching
//  (for the sake of prefetching nearby quests just out of view)

type FetchQuestsOnMapChangeProps = {
	setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
}

export const FetchQuestsOnMapChange = ({ setQuests }: FetchQuestsOnMapChangeProps) => {
		const map = useMap();
		const lastBoundsRef = useRef<LatLngBounds | null>(null);
		const timeoutRef = useRef<NodeJS.Timeout | null>(null);

		useEffect(() => {
			const fetchQuests = async () => {
				const bounds = map.getBounds();

				// If the new bounds are contained within the previous bounds (with the margin padding included), 
				// we don't want to fetch as this is unnecessary.
				const lastBounds = lastBoundsRef.current;
				const shouldFetch = !lastBounds || !lastBounds.pad(FETCH_QUESTS_BOUNDS_MARGIN).contains(bounds);
				if (!shouldFetch) return;

				// Pad bounds with extra margin to fetch around the viewable area of the map as well
				const minBound = bounds.pad(FETCH_QUESTS_BOUNDS_MARGIN).getSouthWest();
				const maxBound = bounds.pad(FETCH_QUESTS_BOUNDS_MARGIN).getNorthEast();

				const fetchResponse = await questsApi.fetchQuestsWithinBounds(
					minBound.lng,
					minBound.lat,
					maxBound.lng,
					maxBound.lat
				);

				if (fetchResponse.success) {
					setQuests(fetchResponse.data as Quest[]);
					lastBoundsRef.current = bounds;
				}
			};

			const debouncedFetch = () => {
				if (timeoutRef.current) clearTimeout(timeoutRef.current);
				timeoutRef.current = setTimeout(() => {
					fetchQuests().catch(console.error);
				}, FETCH_QUESTS_DEBOUNCE_MS);
			};

			map.on('dragend', debouncedFetch);
			map.on('zoomend', debouncedFetch);

			debouncedFetch();

			return () => {
				map.off('dragend', debouncedFetch);
				map.off('zoomend', debouncedFetch);
				if (timeoutRef.current) clearTimeout(timeoutRef.current);
			};
		}, [map, setQuests]);

		return null;
};