import { createFileRoute } from '@tanstack/react-router';
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';
import { useState } from 'react';
import RoutingMachine from '../components/routingMachine';
import ButtonPOI from '../components/buttonPOI';
import CitySearch from '../components/CitySearch'; // adapte le chemin
import L from 'leaflet';


export const Route = createFileRoute('/map')({
  component: Map,
});

function Map() {

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#007bff',
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


  const [start, setStart] = useState<LatLngTuple | null>(null); // Paris
  const [end, setEnd] = useState<LatLngTuple | null>(null);     // Lyon
  const [cityNameStart, setCityNameStart] = useState("");
  const [cityNameEnd, setCityNameEnd] = useState("");

  const [pois, setPois] = useState<any[]>([]);  // stocker les POIs

  const poiIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });


  const handleStartSelectCity = (lat: number, lon: number, name: string) => {
    setStart([lat, lon]);
    setCityNameStart(name);
  };

  const handlerEndSelectCity = (lat: number, lon: number, name: string) => {
    setEnd([lat, lon]);
    setCityNameEnd(name);
  };

  const handleSearchCity = async (cityName: string) => {
    if (!cityName) {
      console.warn("Veuillez entrer un nom de ville.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/getCityByName?name=${encodeURIComponent(cityName)}`);
      const data = await res.json(); // data attendu: { lat, lon }

      if (data?.lat && data?.lon) {
        setStart([data.lat, data.lon]);
      } else {
        console.warn("Ville non trouvée.");
      }
    } catch (err) {
      console.error('Erreur récupération ville', err);
    }
  };


  const handleShowPoints = async () => {
    if (!start && !end) {
      console.warn("Aucun point défini.");
      return;
    }

    const fetchPOIs = async (lat: number, lon: number) => {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        amenity: 'bar',       // ou la valeur dynamique si besoin
        radius: '5',         // rayon en km
      });

      const url = `http://localhost:3001/getPois?${params.toString()}`;
      console.log("Fetch URL:", url);

      const res = await fetch(url);
      if (!res.ok) {
        console.error("Erreur HTTP:", res.status, res.statusText);
        return [];
      }
      return res.json();
    };

    try {
      const poisStart = start ? await fetchPOIs(start[0], start[1]) : [];
      const poisEnd = end ? await fetchPOIs(end[0], end[1]) : [];
      const allPois = [...poisStart, ...poisEnd];

      console.log("Total POIs reçus :", allPois);
      setPois(allPois);
    } catch (err) {
      console.error("Erreur API :", err);
    }
  };


  const handleShowPoisByAmenity = async (amenity: string) => {
    if (!start && !end) {
      console.warn("Aucun point défini.");
      return;
    }

    const fetchPOIs = async (lat: number, lon: number) => {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        amenity: amenity,  // dynamique
        radius: '5',
      });

      const url = `http://localhost:3001/getPois?${params.toString()}`;
      console.log("Fetch URL:", url);

      const res = await fetch(url);
      if (!res.ok) {
        console.error("Erreur HTTP:", res.status, res.statusText);
        return [];
      }
      return res.json();
    };

    try {
      const poisStart = start ? await fetchPOIs(start[0], start[1]) : [];
      const poisEnd = end ? await fetchPOIs(end[0], end[1]) : [];
      const allPois = [...poisStart, ...poisEnd];

      console.log(`Total POIs reçus pour ${amenity}:`, allPois);
      setPois(allPois);
    } catch (err) {
      console.error("Erreur API :", err);
    }
  };



  function handleChange(start: LatLngTuple, end: LatLngTuple): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Carte à gauche */}
      <div style={{ width: '75%' }}>
        <MapContainer center={start || [48.8566, 2.3522]} zoom={5} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

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

          {start && end && (
            <RoutingMachine start={start} end={end} onChange={handleChange} />
          )}

          {pois.map((poi, index) => {
            const lat = poi.lat ?? poi.center?.lat;
            const lon = poi.lon ?? poi.center?.lon;

            if (typeof lat !== 'number' || typeof lon !== 'number') {
              return null;
            }

            return (
              <Marker key={index} position={[lat, lon]}>
                <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                  <strong>{poi.tags?.name || "Point d'intérêt"}</strong><br />
                  Type: {poi.amenity || "N/A"}<br />
                  Adresse: {poi.tags?.['addr:street'] || "Adresse inconnue"}
                </Tooltip>

                {/* Popup toujours dispo au clic */}
                <Popup>
                  <strong>{poi.tags?.name || "Point d'intérêt"}</strong><br />
                  Type: {poi.amenity || "N/A"}<br />
                  Adresse: {poi.tags?.['addr:street'] || "Adresse inconnue"}<br />
                  {poi.tags?.website && (
                    <>
                      Site web: <a href={poi.tags.website} target="_blank" rel="noopener noreferrer">{poi.tags.website}</a>
                    </>
                  )}
                </Popup>
              </Marker>
            );
          })}


          <ButtonPOI onClick={handleShowPoints} />
        </MapContainer>
      </div>

      {/* Informations à droite */}
      <div style={{
        width: '25%',
        padding: 10,
        background: '#f5f5f5',
        overflowY: 'auto',
        maxHeight: '100vh',
        boxSizing: 'border-box'
      }}>

        <h3>Rechercher un point de départ</h3>
        <CitySearch onSelectCity={handleStartSelectCity} />

        <h3>Rechercher un point d'arrivée</h3>
        <CitySearch onSelectCity={handlerEndSelectCity} />

        <p><strong>Départ:</strong> {cityNameStart}</p>
        <p><strong>Arrivée:</strong> {cityNameEnd}</p>

        <h3>Points d'intérêt</h3>

        <button
          onClick={() => handleShowPoisByAmenity('bar')}
          style={buttonStyle}
        >
          🍻
        </button>

        <button
          onClick={() => handleShowPoisByAmenity('school')}
          style={{ ...buttonStyle, backgroundColor: '#28a745' }}
        >
          🎓
        </button>




        {pois.length > 0 ? (
          <ul>
            {pois.map((poi, index) => (
              <li key={index} style={{ color: 'black' }}>
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
