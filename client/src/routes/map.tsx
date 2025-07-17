import { createFileRoute } from '@tanstack/react-router';
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';
import { useState } from 'react';
import RoutingMachine from '../components/routingMachine';
import CitySearch from '../components/CitySearch';
import L from 'leaflet';

export const Route = createFileRoute('/map')({
  component: Map,
});

<<<<<<< HEAD
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
  const fetchPOIs = async (lat: number, lon: number, amenity: string) => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      amenity,
      radius: '5',
    });

    const url = `http://localhost/api/getPois?${params.toString()}`;
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
      const poisStart = start ? await fetchPOIs(start[0], start[1], amenity) : [];
      const poisEnd = end ? await fetchPOIs(end[0], end[1], amenity) : [];
      const allPois = [...poisStart, ...poisEnd];

      setPoisByCategory((prev) => ({
        ...prev,
        [amenity]: allPois,
      }));
      setActiveAmenities((prev) => [...prev, amenity]);
    }
  };

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
=======


function Map() {

  const [start, setStart] = useState<LatLngTuple>([48.8566, 2.3522]) // Paris
  const [end, setEnd] = useState<LatLngTuple>([45.7640, 4.8357])     // Lyon
  const [markers, setMarkers] = useState<{ position: LatLngTuple; popup: string }[]>([]);

  const handleChange = (newStart: LatLngTuple, newEnd: LatLngTuple) => {
    console.log("Start Longitude changed:", newStart);
    console.log("Start Longitude changed:", newEnd);
    setStart(newStart);
    setEnd(newEnd);
  };

  const handleShowPoints = async () => {
    console.log("Affichage des points d'intérêt ahfjvkzhevfa b");
    const maLat=48.8566;
    const maLon=2.3522;
    console.log("Lat:", maLat, "Lon:", maLon);
    try {
      const res = await fetch("http://localhost:3001/getPois?lat="+maLat+"&lon="+maLon);
      const data = await res.json();
      console.log("Points d'intérêt récupérés :", data);
      const newMarkers = data.map((poi: any) => ({
        position: [poi.lat, poi.lon] as LatLngTuple,
        popup: poi.name || "Point d'intérêt",
      }));

        setMarkers(newMarkers);
    } catch (err) {
      console.error("Erreur API :", err);
    }
  };

  return (
    <div>
        <LatLong start={start} end={end} onChange={handleChange} />
        <MapContainer center={position} zoom={5} scrollWheelZoom={false} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => (
            <Marker key={index} position={marker.position}>
                <Popup>{marker.popup}</Popup>
            </Marker>
        ))}
        <RoutingMachine start={start} end={end} onChange={handleChange} />
        <ButtonPOI onClick={handleShowPoints} />
>>>>>>> 46843cd (oubli)
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
        <p>
          <strong>Arrivée:</strong> {cityNameEnd}
        </p>

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
