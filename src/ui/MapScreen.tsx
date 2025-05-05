import { useEffect, useRef } from 'react';
import { useGameStore } from '../lib/gameStore';
import { MAPTILER_API_KEY } from '../private/apiKeys';

const TEL_AVIV_CENTER = [32.0853, 34.7818];
const ZOOM = 14;

const TEL_AVIV_BOUNDS = [
  [32.078, 34.77], // southWest (lat, lng)
  [32.09, 34.785], // northEast (lat, lng)
];

const AREA_TO_MINIGAME: Record<string, string> = {
  Florentin: 'Florentin',
  'Old North': 'Old North',
  Kerem: 'Kerem',
  'Park Hamesila': 'parkHaMesilah',
  Kaplan: 'kaplan',
  Rothschild: 'rothschild',
  "Neve Sha'anan": 'tahanaMerkazit',
  'Beach/Tayelet': 'tayelet',
};

export function MapScreen() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const setSelectedNeighborhood = useGameStore((s) => s.setSelectedNeighborhood);
  const setGameState = useGameStore((s) => s.setGameState);
  const setSelectedMinigame = useGameStore((s) => s.setSelectedMinigame);
  const completedNeighborhoods = useGameStore((s) => s.completedNeighborhoods);

  useEffect(() => {
    let isMounted = true;
    // Load Leaflet CSS
    const leafletCss = document.createElement('link');
    leafletCss.rel = 'stylesheet';
    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCss);

    // Load Leaflet JS
    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletScript.async = true;
    leafletScript.onload = () => {
      // @ts-expect-error: Leaflet is loaded globally from CDN
      const L = window.L;
      if (!L || !mapRef.current || !isMounted) return;
      // Remove any previous map instance
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
      // Defensive: Only initialize if mapRef.current is still in the DOM
      if (!mapRef.current) return;
      const map = L.map(mapRef.current, {
        center: TEL_AVIV_CENTER,
        zoom: ZOOM,
        maxBounds: TEL_AVIV_BOUNDS,
        maxBoundsViscosity: 1.0,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false,
        zoomControl: false,
        attributionControl: true,
      });
      mapInstanceRef.current = map;
      L.tileLayer(
        `https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`,
        {
          attribution:
            '© <a href="https://www.maptiler.com/copyright/">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ).addTo(map);
      // Load GeoJSON
      fetch('/tel_aviv_neighborhoods.geojson')
        .then((res) => res.json())
        .then((geojson) => {
          if (!isMounted) return;
          function style(feature?: any) {
            const areaName = feature?.properties?.name;
            const isCompleted = completedNeighborhoods.includes(areaName);
            if (isCompleted) {
              return {
                color: '#bbb',
                weight: 2,
                fillColor: 'transparent',
                fillOpacity: 0,
                dashArray: '4 2',
              };
            }
            return {
              color: '#3388ff',
              weight: 2,
              fillColor: 'transparent',
              fillOpacity: 0,
            };
          }
          function highlight(e: unknown) {
            const areaName = (e as any)?.target?.feature?.properties?.name;
            const isCompleted = completedNeighborhoods.includes(areaName);
            if (isCompleted) return;
            (e as { target: { setStyle: (opts: unknown) => void } }).target.setStyle({
              weight: 4,
              color: '#1976d2',
            });
          }
          function reset(e: unknown) {
            const areaName = (e as any)?.target?.feature?.properties?.name;
            const isCompleted = completedNeighborhoods.includes(areaName);
            if (isCompleted) {
              (e as { target: { setStyle: (opts: unknown) => void } }).target.setStyle({
                weight: 2,
                color: '#bbb',
                dashArray: '4 2',
              });
            } else {
              (e as { target: { setStyle: (opts: unknown) => void } }).target.setStyle({
                weight: 2,
                color: '#3388ff',
              });
            }
          }
          function onEachFeature(feature: any, layer: any) {
            const areaName = feature?.properties?.name;
            const isCompleted = completedNeighborhoods.includes(areaName);
            if (feature.properties && feature.properties.name && layer.bindTooltip) {
              layer.bindTooltip(feature.properties.name, { sticky: true });
            }
            if (!isCompleted) {
              layer.on({
                mouseover: highlight,
                mouseout: reset,
                click: () => {
                  const validNeighborhoods = [
                    'Florentin',
                    'Old North',
                    'Kerem',
                    'Park Hamesila',
                    'Kaplan',
                    'Rothschild',
                    "Neve Sha'anan",
                    'Beach/Tayelet',
                    'Neve Tzedek',
                    'Memadion',
                  ];
                  if (
                    areaName &&
                    AREA_TO_MINIGAME[areaName] &&
                    validNeighborhoods.includes(areaName)
                  ) {
                    setSelectedNeighborhood(areaName as import('../lib/gameStore').Neighborhood);
                    setSelectedMinigame(AREA_TO_MINIGAME[areaName]);
                    setGameState('transition');
                  } else {
                    alert(`No minigame mapped for ${areaName || 'this area'}`);
                  }
                },
              });
            }
          }
          L.geoJSON(geojson, {
            style,
            onEachFeature,
          }).addTo(map);
        });
    };
    document.body.appendChild(leafletScript);
    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
      document.head.removeChild(leafletCss);
      document.body.removeChild(leafletScript);
    };
  }, [setSelectedNeighborhood, setGameState, setSelectedMinigame, completedNeighborhoods]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 1,
      }}
    />
  );
}
