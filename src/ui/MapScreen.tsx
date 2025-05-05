import { useEffect, useRef } from 'react';
import { useGameStore } from '../lib/gameStore';
import { MAPTILER_API_KEY } from '../private/apiKeys';

const TEL_AVIV_CENTER = [32.0853, 34.7818];
const ZOOM = 13;

const AREA_TO_MINIGAME: Record<string, string> = {
  Florentin: 'Florentin',
  'Old North': 'oldNorth',
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
      const map = L.map(mapRef.current).setView(TEL_AVIV_CENTER, ZOOM);
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
          function style() {
            return {
              color: '#3388ff',
              weight: 2,
              fillColor: '#3388ff',
              fillOpacity: 0.3,
            };
          }
          function highlight(e: unknown) {
            (e as { target: { setStyle: (opts: unknown) => void } }).target.setStyle({
              fillOpacity: 0.6,
            });
          }
          function reset(e: unknown) {
            (e as { target: { setStyle: (opts: unknown) => void } }).target.setStyle({
              fillOpacity: 0.3,
            });
          }
          function onEachFeature(feature: unknown, layer: unknown) {
            const f = feature as { properties?: { name?: string } };
            const lyr = layer as {
              bindTooltip?: (name: string, opts: unknown) => void;
              on: (handlers: unknown) => void;
            };
            if (f.properties && f.properties.name && lyr.bindTooltip) {
              lyr.bindTooltip(f.properties.name, { sticky: true });
            }
            lyr.on({
              mouseover: highlight,
              mouseout: reset,
              click: () => {
                const areaName = f.properties?.name;
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
  }, [setSelectedNeighborhood, setGameState, setSelectedMinigame]);

  return <div ref={mapRef} style={{ width: '100vw', height: '100vh', zIndex: 1 }} />;
}
