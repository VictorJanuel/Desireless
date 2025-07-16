import { createFileRoute } from '@tanstack/react-router'
import { MapContainer } from 'react-leaflet/MapContainer'
import { Marker } from 'react-leaflet/Marker'
import { Popup } from 'react-leaflet/Popup'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'

import type { LatLngTuple } from 'leaflet'

const position: LatLngTuple = [51.505, -0.09]



export const Route = createFileRoute('/map')({
  component: Map,
})

function Map() {
  //const map = useMap()
  //map.setView(position, 13)

  return (
    <MapContainer center={position} zoom={5} scrollWheelZoom={false} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  )
}

