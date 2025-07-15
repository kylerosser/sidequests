import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

import { questsApi } from '../../api/questsApi'
import type { Quest } from '../../api/questsApi'

type FetchQuestsOnMapChangeProps = {
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
}
export const FetchQuestsOnMapChange = ({ setQuests }: FetchQuestsOnMapChangeProps) => {
    const map = useMap();

    useEffect(() => {
      const fetchQuests = () => {
        (async() => {
            const bounds = map.getBounds();
            const minBound = bounds.getSouthWest();
            const maxBound = bounds.getNorthEast();

            const fetchResponse = await questsApi.fetchQuestsWithinBounds(
                minBound.lng,
                minBound.lat,
                maxBound.lng,
                maxBound.lat
            );

            if (fetchResponse.success) {
                setQuests(fetchResponse.data as Quest[]);
            }
        })();
      };

      map.on('dragend', fetchQuests);
      map.on('zoomend', fetchQuests);

      return () => {
        map.off('dragend', fetchQuests);
        map.off('zoomend', fetchQuests);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]);

    return null;
};