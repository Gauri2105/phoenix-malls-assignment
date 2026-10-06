import { useEffect, useState } from 'react';
import {
  GeoJSON,
  useMap,
} from 'react-leaflet';
import type {
  Feature,
  FeatureCollection,
  Geometry,
} from 'geojson';
import type { Path } from 'leaflet';

interface CountryLayerProps {
  selectedCountry: string | null;
  onCountrySelect: (country: string) => void;
}

interface CountryProperties {
  name?: string;
}

const COUNTRIES_URL =
  'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

function CountryController({
  selectedCountry,
}: {
  selectedCountry: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedCountry === 'India') {
      map.flyTo([20.5, 78.9], 5, {
        duration: 0.8,
      });
    }
  }, [map, selectedCountry]);

  return null;
}

export default function CountryLayer({
  selectedCountry,
  onCountrySelect,
}: CountryLayerProps) {
  const [countries, setCountries] =
    useState<
      FeatureCollection<
        Geometry,
        CountryProperties
      > | null
    >(null);

  useEffect(() => {
    let mounted = true;

    async function loadCountries() {
      try {
        const response =
          await fetch(COUNTRIES_URL);

        if (!response.ok) {
          throw new Error(
            'Unable to load country boundaries',
          );
        }

        const data =
          (await response.json()) as FeatureCollection<
            Geometry,
            CountryProperties
          >;

        if (mounted) {
          setCountries(data);
        }
      } catch (error) {
        console.error(
          'Country boundary loading failed:',
          error,
        );
      }
    }

    loadCountries();

    return () => {
      mounted = false;
    };
  }, []);

  if (!countries) {
    return null;
  }

  return (
    <>
      <GeoJSON
        key={selectedCountry ?? 'world'}
        data={countries}
        style={(feature) => {
          const countryName =
            feature?.properties?.name ?? '';

          const isSelected =
            countryName === selectedCountry;

          const hasPhoenixMalls =
            countryName === 'India';

          return {
            color: isSelected
              ? '#111111'
              : hasPhoenixMalls
                ? '#171717'
                : '#ffffff',

            weight: isSelected
              ? 2
              : hasPhoenixMalls
                ? 1.5
                : 0.6,

            fillColor: isSelected
              ? '#f2c94c'
              : hasPhoenixMalls
                ? '#f7d76b'
                : '#ffffff',

            fillOpacity: isSelected
              ? 0.35
              : hasPhoenixMalls
                ? 0.18
                : 0.04,
          };
        }}
        onEachFeature={(
          feature: Feature<
            Geometry,
            CountryProperties
          >,
          layer,
        ) => {
          const countryName =
            feature.properties?.name;

          if (!countryName) {
            return;
          }

          layer.bindTooltip(countryName, {
            sticky: true,
            direction: 'top',
          });

          /*
           * GeoJSON layers are paths on the map.
           * Cast the generic Leaflet layer to Path
           * so TypeScript knows setStyle() exists.
           */
          const pathLayer = layer as Path;

          layer.on({
            mouseover: () => {
              pathLayer.setStyle({
                weight: 2,
                fillOpacity: 0.3,
              });
            },

            mouseout: () => {
              pathLayer.setStyle({
                weight:
                  countryName === selectedCountry
                    ? 2
                    : countryName === 'India'
                      ? 1.5
                      : 0.6,

                fillOpacity:
                  countryName === selectedCountry
                    ? 0.35
                    : countryName === 'India'
                      ? 0.18
                      : 0.04,
              });
            },

            click: () => {
              if (countryName === 'India') {
                onCountrySelect('India');
              }
            },
          });
        }}
      />

      <CountryController
        selectedCountry={selectedCountry}
      />
    </>
  );
}