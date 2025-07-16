import { createFileRoute } from '@tanstack/react-router'
import { MapContainer } from 'react-leaflet'
import { Marker, Popup, TileLayer } from 'react-leaflet'
import type { LatLngTuple } from 'leaflet'
import { useState } from 'react'
import RoutingMachine from './routingMachine'

const position: LatLngTuple = [51.505, -0.09]

export const Route = createFileRoute('/map')({
  component: Map,
})

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ position: "absolute", zIndex: 1000, padding: 10, background: "white" }}>
        <label>
          Start Latitude:
          <input
            type="number"
            value={start[0]}
            onChange={(e) => setStart([parseFloat(e.target.value), start[1]])}
          />
        </label>
        <label>
          Start Longitude:
          <input
            type="number"
            value={start[1]}
            onChange={(e) => {
                setStart([start[0], parseFloat(e.target.value)]);
            }}
          />
        </label>
        <label>
          End Latitude:
          <input
            type="number"
            value={end[0]}
            onChange={(e) => setEnd([parseFloat(e.target.value), end[1]])}
          />
        </label>
        <label>
          End Longitude:
          <input
            type="number"
            value={end[1]}
            onChange={(e) => setEnd([end[0], parseFloat(e.target.value)])}
          />
        </label>
      </div>

        <MapContainer center={position} zoom={5} scrollWheelZoom={false} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
            <Popup>A pretty CSS3 popup. <br /> Easily customizable.</Popup>
        </Marker>
        <RoutingMachine start={start} end={end} onChange={handleChange} />
        </MapContainer>
    </div>
  )
}