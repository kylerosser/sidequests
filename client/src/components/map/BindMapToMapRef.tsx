import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useMapRef } from "../../hooks/useMapRef";

export const BindMapToMapRef = () => {
    const map = useMap();
    const mapRef = useMapRef();

    useEffect(() => {
        mapRef.current = map;
    }, [map, mapRef]);
    return null
}