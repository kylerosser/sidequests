import { Marker, Tooltip } from "react-leaflet";
import { divIcon } from "leaflet";
import type { LatLngExpression } from "leaflet";

interface QuestMarkerProps {
	position: LatLngExpression;
}

const customIcon = divIcon({
	className: "",
	html: `
		<div class="shadow-md rounded-full"><div class="quest-marker transition-transform duration-200 ease-in-out w-[20px] h-[20px] bg-sq-primary border-2 border-white rounded-full hover:scale-125 hover:shadow-[0_0_0_2px_#e1842a]"></div></div>
	`,
	iconSize: [20, 20],
	iconAnchor: [10, 10],
});

export const QuestMarker = ({ position }: QuestMarkerProps) => {
	return (
		<Marker 
		position={position} 
		icon={customIcon}
		>
			<Tooltip className="disable-leaflet-tooltip" direction="top" offset={[0, -18]} opacity={1} permanent={false} sticky={false}>
				<div className="relative m-0">
					{/* Bubble */}
					<div className="bg-white text-sm font-sans text-sq-dark px-3 py-2 rounded-lg shadow-md border border-gray-300">
						Placeholder tooltip text
					</div>
					{/* Arrow */}
    				<div className="absolute -bottom-2 left-1/2 -translate-x-[calc(50%-0.5px)] w-4 h-4 bg-white rotate-45 border-r border-b border-gray-300"/>
				</div>
			</Tooltip>
		</Marker>
	);
};