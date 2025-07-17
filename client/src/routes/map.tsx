import { createFileRoute } from '@tanstack/react-router'
import { MapContainer } from 'react-leaflet'
import { Marker, Popup, TileLayer } from 'react-leaflet'
import type { LatLngTuple } from 'leaflet'
import { useState } from 'react'
import RoutingMachine from '../components/routingMachine'
import LatLong from '../components/latLong'
import ButtonPOI from '../components/buttonPOI'

const position: LatLngTuple = [51.505, -0.09]

export const Route = createFileRoute('/map')({
  component: Map,
})

  const handleShowPoints = async () => {
    console.log("Affichage des points d'intérêt ahfjvkzhevfa b");
    const maLat=48.8566;
    const maLon=2.3522;
    console.log("Lat:", maLat, "Lon:", maLon);
    try {
      const res = await fetch("http://localhost:3001/getPois?lat="+maLat+"&lon="+maLon);
      const data = await res.json();
      console.log("Points d'intérêt récupérés :", data);
      for (const poi of data) {
        const marker = L.marker([poi.lat, poi.lon]).bindPopup(poi.name || "Point d'intérêt");

        marker.addTo(map); // 👈 ajoute chaque marker à la carte
      }
    } catch (err) {
      console.error("Erreur API :", err);
    }
  };

function Map() {

  const [start, setStart] = useState<LatLngTuple>([48.8566, 2.3522]) // Paris
  const [end, setEnd] = useState<LatLngTuple>([45.7640, 4.8357])     // Lyon

  const handleChange = (newStart: LatLngTuple, newEnd: LatLngTuple) => {
    console.log("Start Longitude changed:", newStart);
    console.log("Start Longitude changed:", newEnd);
    setStart(newStart);
    setEnd(newEnd);
  };


  return (
    <div>
        <LatLong start={start} end={end} onChange={handleChange} />
        <MapContainer center={position} zoom={5} scrollWheelZoom={false} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
            <Popup>A pretty CSS3 popup. <br /> Easily customizable.</Popup>
        </Marker>
        <RoutingMachine start={start} end={end} onChange={handleChange} />
        <ButtonPOI onClick={handleShowPoints} />
        </MapContainer>
    </div>
  )
}