import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Saffron, Blue, Green custom markers
const saffronIcon = new L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: var(--accent-saffron); width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(255, 153, 51, 0.6);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

const blueIcon = new L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: var(--accent-blue); width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 128, 0.6);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

const greenIcon = new L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: var(--accent-green); width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(19, 136, 8, 0.6);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

// Mock active fleet locations around Bangalore
const mockFleet = [
    { id: 1, lat: 12.9716, lng: 77.5946, status: 'active', pilot: 'Rajesh Kumar' },
    { id: 2, lat: 12.9650, lng: 77.6000, status: 'available', pilot: 'Arun Singh' },
    { id: 3, lat: 12.9800, lng: 77.5850, status: 'active', pilot: 'Vikram Mehta' },
    { id: 4, lat: 12.9750, lng: 77.6100, status: 'maintenance', pilot: 'Suresh Patil' },
    { id: 5, lat: 12.9600, lng: 77.5800, status: 'available', pilot: 'Amit Shah' }
];

const AdminMapComponent = () => {
    return (
        <MapContainer
            center={[12.9716, 77.5946]}
            zoom={13}
            style={{ height: '100%', width: '100%', borderRadius: '24px', zIndex: 1 }}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {mockFleet.map(vehicle => (
                <Marker
                    key={vehicle.id}
                    position={[vehicle.lat, vehicle.lng]}
                    icon={vehicle.status === 'active' ? saffronIcon : vehicle.status === 'available' ? greenIcon : blueIcon}
                >
                    <Popup>
                        <div style={{ padding: '4px', textAlign: 'center' }}>
                            <div style={{ fontWeight: '900', fontSize: '1rem', color: 'var(--text-main)' }}>Pilot: {vehicle.pilot}</div>
                            <div style={{ fontSize: '0.8rem', color: vehicle.status === 'active' ? 'var(--accent-saffron)' : vehicle.status === 'available' ? 'var(--accent-green)' : 'var(--accent-blue)', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '4px' }}>
                                STATUS: {vehicle.status}
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default AdminMapComponent;
