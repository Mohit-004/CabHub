import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Enhanced Markers for Driver App (Incredible India Theme)
const createCustomIcon = (color) => L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
        background-color: ${color};
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const pickupIcon = createCustomIcon('#FF9933'); // Indian Saffron
const dropIcon = createCustomIcon('#000080');   // Chakra Blue
const driverPosIcon = createCustomIcon('#138808'); // Emerald Green (Pilot)

const cabIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png',
    iconSize: [45, 45],
    iconAnchor: [22, 22]
});

const MapComponent = ({ driverCoords, pickupCoords, dropCoords, activeMission = false }) => {

    function FlyToLoc({ coords }) {
        const map = useMap();
        useEffect(() => {
            if (coords) map.flyTo(coords, 14);
        }, [coords]);
        return null;
    }

    return (
        <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: '100%', width: '100%', background: '#fff9f5' }} zoomControl={false}>
            {/* Soft Voyager Tiles for Clean UI */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {driverCoords && <Marker position={driverCoords} icon={driverPosIcon} />}
            {pickupCoords && <Marker position={pickupCoords} icon={pickupIcon} />}
            {dropCoords && <Marker position={dropCoords} icon={dropIcon} />}

            {(driverCoords && !activeMission) && <FlyToLoc coords={driverCoords} />}
            {activeMission && pickupCoords && <FlyToLoc coords={pickupCoords} />}
        </MapContainer>
    );
};

export default MapComponent;
