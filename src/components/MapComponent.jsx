import React, { useMemo } from 'react';
import { MapPin, Navigation, Landmark } from 'lucide-react';

const MapComponent = ({ pickup, drop, driverLat, driverLng, status, height = 320 }) => {
  // Coordinate projection helper
  const scale = 5000; // zoom level
  const width = 600;
  const svgHeight = height;

  // Compute map center (midpoint of pickup/drop or defaults)
  const center = useMemo(() => {
    if (pickup && drop) {
      return {
        lat: (pickup.lat + drop.lat) / 2,
        lng: (pickup.lng + drop.lng) / 2
      };
    } else if (pickup) {
      return { lat: pickup.lat, lng: pickup.lng };
    }
    return { lat: 28.6304, lng: 77.2177 }; // Default Delhi Connaught Place
  }, [pickup, drop]);

  const toSvgCoords = (lat, lng) => {
    if (!lat || !lng) return { x: width / 2, y: svgHeight / 2 };
    
    // Simple equirectangular projection centered on our midpoint
    const x = width / 2 + (lng - center.lng) * scale * 1.15; // stretch lng slightly for aspect ratio
    const y = svgHeight / 2 - (lat - center.lat) * scale;
    return { x, y };
  };

  const pickupPos = pickup ? toSvgCoords(pickup.lat, pickup.lng) : null;
  const dropPos = drop ? toSvgCoords(drop.lat, drop.lng) : null;
  const driverPos = (driverLat && driverLng) ? toSvgCoords(driverLat, driverLng) : null;

  // Generate some static grid roads in background based on New Delhi radial style
  const { gridRoads, treePositions, roadLabels } = useMemo(() => {
    const roads = [];
    const trees = [];
    const labels = [];
    
    // Circular rings
    for (let r = 50; r <= 250; r += 60) {
      roads.push({ type: 'circle', cx: width / 2, cy: svgHeight / 2, r });
    }
    
    // Radial spokes
    const roadNames = ['Janpath Marg', 'Parliament St', 'Barakhamba Rd', 'Kasturba Gandhi Rd', 'Ashoka Rd', 'Baba Kharak Singh Rd', 'Punchkuian Rd', 'Connaught Circus'];
    let labelIdx = 0;
    
    for (let angle = 0; angle < 360; angle += 45) {
      const rad = (angle * Math.PI) / 180;
      roads.push({
        type: 'line',
        x1: width / 2 - Math.cos(rad) * 350,
        y1: svgHeight / 2 - Math.sin(rad) * 350,
        x2: width / 2 + Math.cos(rad) * 350,
        y2: svgHeight / 2 + Math.sin(rad) * 350
      });

      // Add road text details
      if (angle < 180) {
        labels.push({
          text: roadNames[labelIdx % roadNames.length],
          x: width / 2 + Math.cos(rad) * 140,
          y: svgHeight / 2 - Math.sin(rad) * 140,
          rot: -angle
        });
        labelIdx++;
      }
    }

    // Populate mock tree greenery positions
    const seedPoints = [
      { x: 120, y: 80 }, { x: 450, y: 90 }, { x: 500, y: 220 },
      { x: 100, y: 240 }, { x: 180, y: 260 }, { x: 380, y: 60 },
      { x: 280, y: 40 }, { x: 340, y: 280 }, { x: 80, y: 150 }
    ];
    seedPoints.forEach(pt => {
      // Scale based on height
      const y = (pt.y / 320) * svgHeight;
      trees.push({ x: pt.x, y });
    });

    return { gridRoads: roads, treePositions: trees, roadLabels: labels };
  }, [svgHeight]);

  // Compute heading rotation angle for the driver's cab marker
  const rotationAngle = useMemo(() => {
    if (!driverLat || !driverLng || !pickup || !drop) return 0;
    
    let targetLat = pickup.lat;
    let targetLng = pickup.lng;
    
    // If en route, target drop location
    if (status === 'started') {
      targetLat = drop.lat;
      targetLng = drop.lng;
    }
    
    const dLat = targetLat - driverLat;
    const dLng = targetLng - driverLng;
    
    if (Math.abs(dLat) < 0.0001 && Math.abs(dLng) < 0.0001) return 0;
    
    const angleRad = Math.atan2(-dLat, dLng); // Invert dLat because SVG Y goes down
    const angleDeg = angleRad * (180 / Math.PI);
    
    // Map standard polar 0 (East) to SVG rotation (East is 90 if vehicle standard is facing up,
    // but our vehicle draws pointing Up/North, so standard is 0 = North).
    // Let's adjust rotation angle to match standard drawing direction:
    return 90 - angleDeg; 
  }, [driverLat, driverLng, pickup, drop, status]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: `${height}px`,
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)',
      background: 'var(--bg-tertiary)'
    }}>
      {/* Visual background details */}
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${svgHeight}`} preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
        {/* Grids */}
        <defs>
          <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--border-color)" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridPattern)" />

        {/* Green Parks / Zones */}
        <circle cx={width / 2} cy={svgHeight / 2} r="45" fill="var(--emerald)" opacity="0.08" />
        
        {/* Road Grid lines */}
        {gridRoads.map((road, idx) => (
          road.type === 'circle' ? (
            <circle
              key={`r-${idx}`}
              cx={road.cx}
              cy={road.cy}
              r={road.r}
              fill="none"
              stroke="var(--border-color)"
              strokeWidth="2"
              opacity="0.25"
            />
          ) : (
            <line
              key={`l-${idx}`}
              x1={road.x1}
              y1={road.y1}
              x2={road.x2}
              y2={road.y2}
              stroke="var(--border-color)"
              strokeWidth="2.5"
              opacity="0.2"
            />
          )
        ))}

        {/* Ashoka Chakra Centerpiece Sketch (Incredible India theme) */}
        <g transform={`translate(${width / 2}, ${svgHeight / 2})`} opacity="0.2">
          <circle r="14" fill="none" stroke="var(--chakra)" strokeWidth="1.5" />
          <circle r="2" fill="var(--chakra)" />
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={`spoke-${i}`}
              x1="0"
              y1="0"
              x2="0"
              y2="-14"
              stroke="var(--chakra)"
              strokeWidth="0.75"
              transform={`rotate(${(i * 360) / 24})`}
            />
          ))}
        </g>

        {/* Landscaped trees */}
        {treePositions.map((tree, i) => (
          <g key={`tree-${i}`} transform={`translate(${tree.x}, ${tree.y})`} opacity="0.35">
            {/* Trunk */}
            <line x1="0" y1="0" x2="0" y2="4" stroke="#78350f" strokeWidth="1.5" />
            {/* Canopy */}
            <circle cx="0" cy="-2" r="5" fill="var(--emerald)" />
          </g>
        ))}

        {/* Road labels */}
        {roadLabels.map((lbl, i) => (
          <text
            key={`lbl-${i}`}
            x={lbl.x}
            y={lbl.y}
            fill="var(--text-muted)"
            fontSize="8px"
            fontWeight="600"
            textAnchor="middle"
            transform={`rotate(${lbl.rot}, ${lbl.x}, ${lbl.y})`}
            opacity="0.65"
          >
            {lbl.text}
          </text>
        ))}

        {/* Route Line if requested/accepted/started */}
        {pickupPos && dropPos && (
          <>
            {/* Background glowing path */}
            <path
              d={`M ${pickupPos.x} ${pickupPos.y} L ${dropPos.x} ${dropPos.y}`}
              fill="none"
              stroke="var(--saffron)"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.2"
            />
            {/* Foreground path */}
            <path
              d={`M ${pickupPos.x} ${pickupPos.y} L ${dropPos.x} ${dropPos.y}`}
              fill="none"
              stroke="var(--chakra)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="6,4"
              opacity="0.75"
            />
          </>
        )}

        {/* Pickup Pin */}
        {pickupPos && (
          <g transform={`translate(${pickupPos.x}, ${pickupPos.y})`}>
            <circle r="22" fill="var(--emerald)" opacity="0.15" />
            <circle r="12" fill="var(--emerald)" opacity="0.3">
              <animate attributeName="r" values="8;20;8" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle r="6" fill="var(--emerald)" />
          </g>
        )}

        {/* Dropoff Pin */}
        {dropPos && (
          <g transform={`translate(${dropPos.x}, ${dropPos.y})`}>
            <circle r="22" fill="#E11D48" opacity="0.15" />
            <circle r="12" fill="#E11D48" opacity="0.3">
              <animate attributeName="r" values="8;20;8" dur="3s" repeatCount="indefinite" begin="1.5s" />
            </circle>
            <circle r="6" fill="#E11D48" />
          </g>
        )}

        {/* Moving Driver Cab Pin */}
        {driverPos && (
          <g transform={`translate(${driverPos.x}, ${driverPos.y}) rotate(${rotationAngle})`}>
            <circle r="26" fill="var(--saffron)" opacity="0.15">
              <animate attributeName="r" values="12;24;12" dur="2s" repeatCount="indefinite" />
            </circle>
            {/* Draw Car Chassis pointing Up (North 0deg) */}
            <rect x="-8" y="-12" width="16" height="24" rx="4" fill="var(--saffron)" stroke="#FFF" strokeWidth="1.5" />
            {/* Windshield */}
            <rect x="-6" y="-7" width="12" height="4" fill="var(--bg-secondary)" />
            {/* Rear window */}
            <rect x="-6" y="5" width="12" height="3" fill="var(--bg-secondary)" />
            {/* Yellow headlights */}
            <circle cx="-5" cy="-12" r="1.5" fill="#FFE800" />
            <circle cx="5" cy="-12" r="1.5" fill="#FFE800" />
            {/* Red taillights */}
            <rect x="-6" y="11" width="3" height="1" fill="#FF0000" />
            <rect x="3" y="11" width="3" height="1" fill="#FF0000" />
          </g>
        )}
      </svg>

      {/* Floating UI Badges */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-color)',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: 'var(--card-shadow)'
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'var(--emerald)',
          animation: 'onlinePulse 1.5s infinite'
        }}></span>
        <span>GPS Simulator Engine</span>
      </div>

      {pickup && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-color)',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '600',
          boxShadow: 'var(--card-shadow)'
        }}>
          {status === 'requested' && 'Finding Cab...'}
          {status === 'accepted' && 'Driver Dispatched'}
          {status === 'arriving' && 'Driver Arriving'}
          {status === 'arrived' && 'Driver at Pickup Location'}
          {status === 'started' && 'Trip Active'}
          {!status && 'Ready'}
        </div>
      )}
    </div>
  );
};

export default MapComponent;
