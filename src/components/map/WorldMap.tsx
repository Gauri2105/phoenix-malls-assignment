import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useMemo } from 'react';

import type { MallWithStatus } from '../../types/mall';
import CountryLayer from './CountryLayer';

interface WorldMapProps {
  malls: MallWithStatus[];
  selectedMallId: string | null;
  selectedCountry: string | null;
  onSelectMall: (mall: MallWithStatus) => void;
  onSelectCountry: (country: string) => void;
}

function createMallIcon(status: MallWithStatus['status']) {
  const isOpen = status === 'OPEN';

  return L.divIcon({
    className: 'mall-marker-wrapper',
    html: `
      <div class="mall-marker ${
        isOpen ? 'mall-marker--open' : 'mall-marker--closed'
      }">
        <span class="mall-marker__pulse"></span>
        <span class="mall-marker__dot"></span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

function MapController({
  selectedMallId,
  malls,
}: {
  selectedMallId: string | null;
  malls: MallWithStatus[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedMallId) {
      return;
    }

    const selectedMall = malls.find((mall) => mall.id === selectedMallId);

    if (!selectedMall) {
      return;
    }

    map.flyTo([selectedMall.latitude, selectedMall.longitude], 12, {
      duration: 0.8,
    });
  }, [map, selectedMallId, malls]);

  return null;
}

export default function WorldMap({
  malls,
  selectedMallId,
  selectedCountry,
  onSelectMall,
  onSelectCountry,
}: WorldMapProps) {
  const markers = useMemo(
    () =>
      malls.map((mall) => ({
        ...mall,
        icon: createMallIcon(mall.status),
      })),
    [malls]
  );

  return (
    <MapContainer
      center={[20, 10]}
      zoom={2}
      minZoom={2}
      maxZoom={18}
      scrollWheelZoom
      zoomControl
      className="world-map"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <CountryLayer
        selectedCountry={selectedCountry}
        onCountrySelect={onSelectCountry}
      />

      <MapController selectedMallId={selectedMallId} malls={malls} />

      {markers.map((mall) => (
        <Marker
          key={mall.id}
          position={[mall.latitude, mall.longitude]}
          icon={mall.icon}
          eventHandlers={{
            click: () => onSelectMall(mall),
          }}
        >
          <Popup>
            <div className="map-popup">
              <strong>{mall.name}</strong>

              <span>
                {mall.city}, {mall.country}
              </span>

              <span
                className={
                  mall.status === 'OPEN'
                    ? 'popup-status popup-status--open'
                    : 'popup-status popup-status--closed'
                }
              >
                {mall.status}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
