import { createFileRoute } from '@tanstack/react-router';
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';
import { useEffect, useState } from 'react';
import RoutingMachine from '../components/routingMachine';
import CitySearch from '../components/CitySearch';
import L from 'leaflet';

export const Route = createFileRoute('/map')({
  component: Map,
});

function Map() {
  const buttonStyle: React.CSSProperties = {
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    marginBottom: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'background-color 0.3s',
  };

  const barButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
  };

  const schoolButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745',
  };

  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const [start, setStart] = useState<LatLngTuple | null>(null);
  const [end, setEnd] = useState<LatLngTuple | null>(null);
  const [cityNameStart, setCityNameStart] = useState('');
  const [cityNameEnd, setCityNameEnd] = useState('');
  const [radiusStart, setRadiusStart] = useState<number>(5); // en km
  const [radiusEnd, setRadiusEnd] = useState<number>(5);


  // State POIs par catégorie
  const [poisByCategory, setPoisByCategory] = useState<Record<string, any[]>>({});

  // Track des catégories actives (boutons "enfoncés")
  const [activeAmenities, setActiveAmenities] = useState<string[]>([]);

  const handleStartSelectCity = (lat: number, lon: number, name: string) => {
    setStart([lat, lon]);
    setCityNameStart(name);
  };

  const handlerEndSelectCity = (lat: number, lon: number, name: string) => {
    setEnd([lat, lon]);
    setCityNameEnd(name);
  };

  // Fonction pour fetch les POIs par catégorie
  const fetchPOIs = async (lat: number, lon: number, amenity: string, radius: number) => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      amenity,
      radius: radius.toString(),
    });

    const url = `/api/getPois?${params.toString()}`;
    console.log(url);
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Erreur HTTP:', res.status, res.statusText);
      return [];
    }
    return res.json();
  };

  // Toggle POIs pour une catégorie
  const handleToggleAmenity = async (amenity: string) => {
    if (!start && !end) {
      console.warn('Aucun point défini.');
      return;
    }

    if (activeAmenities.includes(amenity)) {
      // On enlève la catégorie et ses POIs
      setActiveAmenities((prev) => prev.filter((a) => a !== amenity));
      setPoisByCategory((prev) => {
        const copy = { ...prev };
        delete copy[amenity];
        return copy;
      });
    } else {
      // On fetch et ajoute la catégorie + ses POIs
      const poisStart = start ? await fetchPOIs(start[0], start[1], amenity, radiusStart) : [];
      const poisEnd = end ? await fetchPOIs(end[0], end[1], amenity, radiusEnd) : [];
      const allPois = [...poisStart, ...poisEnd];

      setPoisByCategory((prev) => ({
        ...prev,
        [amenity]: allPois,
      }));
      setActiveAmenities((prev) => [...prev, amenity]);
    }
  };

  const refreshPOIs = async () => {
    if (!start && !end) return;

    const updatedPoisByCategory: Record<string, any[]> = {};

    for (const amenity of activeAmenities) {
      const poisStart = start ? await fetchPOIs(start[0], start[1], amenity, radiusStart) : [];
      const poisEnd = end ? await fetchPOIs(end[0], end[1], amenity, radiusEnd) : [];
      updatedPoisByCategory[amenity] = [...poisStart, ...poisEnd];
    }

    setPoisByCategory(updatedPoisByCategory);
  };


  useEffect(() => {
    if (activeAmenities.length > 0) {
      refreshPOIs();
    }
  }, [radiusStart, radiusEnd, start, end]); 


  function handleChange(start: LatLngTuple, end: LatLngTuple): void {
    throw new Error('Function not implemented.');
  }

  // Fusionne tous les POIs actifs dans un tableau plat
  const allPois = Object.values(poisByCategory).flat();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '75%' }}>
        <MapContainer center={start || [48.8566, 2.3522]} zoom={5} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {start && (
            <Marker position={start}>
              <Popup>Point de départ</Popup>
            </Marker>
          )}

          {end && (
            <Marker position={end}>
              <Popup>Point d'arrivée</Popup>
            </Marker>
          )}

          {start && end && <RoutingMachine start={start} end={end} onChange={handleChange} />}

          {allPois.map((poi, index) => {
            const lat = poi.lat ?? poi.center?.lat;
            const lon = poi.lon ?? poi.center?.lon;

            if (typeof lat !== 'number' || typeof lon !== 'number') {
              return null;
            }

            // Icone selon la catégorie (amenity)
            const icon =
              poi.tags.amenity === 'bar'
                ? blueIcon
                : poi.tags.amenity === 'school'
                ? greenIcon
                : redIcon;

            return (
              <Marker key={`${poi.osm_id}-${index}`} position={[lat, lon]} icon={icon}>
                <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                  <strong>{poi.tags?.name || "Point d'intérêt"}</strong>
                  <br />
                  Type: {poi.amenity || 'N/A'}
                  <br />
                  Adresse: {poi.tags?.['addr:street'] || 'Adresse inconnue'}
                </Tooltip>
                <Popup>
                  <strong>{poi.tags?.name || "Point d'intérêt"}</strong>
                  <br />
                  Type: {poi.amenity || 'N/A'}
                  <br />
                  Adresse: {poi.tags?.['addr:street'] || 'Adresse inconnue'}
                  <br />
                  {poi.tags?.website && (
                    <>
                      Site web:{' '}
                      <a href={poi.tags.website} target="_blank" rel="noopener noreferrer">
                        {poi.tags.website}
                      </a>
                    </>
                  )}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div
        style={{
          width: '25%',
          padding: 10,
          background: '#f5f5f5',
          overflowY: 'auto',
          maxHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        <h3>Rechercher un point de départ</h3>
        <CitySearch onSelectCity={handleStartSelectCity} />

        <h3>Rechercher un point d'arrivée</h3>
        <CitySearch onSelectCity={handlerEndSelectCity} />

        <p>
          <strong>Départ:</strong> {cityNameStart}
        </p>
        {start && (
          <div>
            Rayon: {radiusStart} km
            <input
              type="range"
              min={1}
              max={20}
              value={radiusStart}
              onChange={(e) => setRadiusStart(Number(e.target.value))}
            />
          </div>
        )}

        <p>
          <strong>Arrivée:</strong> {cityNameEnd}
        </p>
        {end && (
          <div>
            Rayon: {radiusEnd} km
            <input
              type="range"
              min={1}
              max={20}
              value={radiusEnd}
              onChange={(e) => setRadiusEnd(Number(e.target.value))}
            />
          </div>
        )}

        <h3>Points d'intérêt</h3>

        <button
          onClick={() => handleToggleAmenity('bar')}
          style={activeAmenities.includes('bar') ? { ...barButtonStyle, filter: 'brightness(0.8)' } : barButtonStyle}
        >
          🍻
        </button>

        <button
          onClick={() => handleToggleAmenity('school')}
          style={activeAmenities.includes('school') ? { ...schoolButtonStyle, filter: 'brightness(0.8)' } : schoolButtonStyle}
        >
          🎓
        </button>

        {allPois.length > 0 ? (
          <ul>
            {allPois.map((poi, index) => (
              <li key={`${poi.osm_id}-${index}`} style={{ color: 'black' }}>
                {poi.tags?.name || 'Point sans nom'}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun POI chargé</p>
        )}
      </div>
    </div>
  );
}

export default Map;
