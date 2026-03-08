import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Enhanced Markers for Incredible India Theme
const createCustomIcon = (color) => L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
        background-color: ${color};
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

const pickupIcon = createCustomIcon('#FF9933'); // Indian Saffron
const dropIcon = createCustomIcon('#000080');   // Chakra Blue

const cabIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png',
    iconSize: [45, 45],
    iconAnchor: [22, 22]
});

const MapComponent = ({ pickup, drop, onPickupSelect, onDropSelect, mode, nearbyDrivers = [] }) => {

    function MapEvents() {
        useMapEvents({
            click(e) {
                if (mode === 'pickup') onPickupSelect(e.latlng);
                else if (mode === 'drop') onDropSelect(e.latlng);
            },
        });
        return null;
    }

    function FlyToLoc({ coords }) {
        const map = useMap();
        useEffect(() => {
            if (coords) map.flyTo(coords, 14);
        }, [coords]);
        return null;
    }

    return (
        <MapContainer center={[12.9716, 77.5946]} zoom={12} style={{ height: '100%', width: '100%', background: '#fff9f5' }} zoomControl={false}>
            {/* Soft Voyager Tiles for Clean UI */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <MapEvents />
            {pickup && <Marker position={pickup} icon={pickupIcon} />}
            {drop && <Marker position={drop} icon={dropIcon} />}
            {nearbyDrivers.map(d => (
                <Marker key={d.id} position={[d.lat, d.lng]} icon={cabIcon} />
            ))}
            {mode === 'pickup' && pickup && <FlyToLoc coords={pickup} />}
            {mode === 'drop' && drop && <FlyToLoc coords={drop} />}
        </MapContainer>
    );
};

export default MapComponent;
