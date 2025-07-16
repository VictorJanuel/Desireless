import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

declare module 'leaflet' {
  namespace Routing {
    function control(options: any): any;
    class Control {
      constructor(options?: any);
      remove(): void; // Add the missing remove method
    }
  }
}

type LatLngTuple = [number, number];

type Props = {
  start: L.LatLngTuple;
  end: L.LatLngTuple;
  onChange: (start: LatLngTuple, end: LatLngTuple) => void;
};

const RoutingMachine = ({ start, end, onChange }: Props) => {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map || !start || !end) return;
    // Nettoyer ancienne instance si elle existe
    if (routingControlRef.current !== null && (routingControlRef.current as any)._map) {
      try {
        routingControlRef.current.remove(); // <- Plus sûr que removeControl()
      } catch (error) {
        console.warn("Erreur lors du retrait du routing control :", error);
      }
    }

    // Créer nouvelle instance
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start), L.latLng(end)],
      lineOptions: { styles: [{ color: "#6FA1EC", weight: 4 }] },
      addWaypoints: false,
      draggableWaypoints: true,
      routeWhileDragging: true,
      fitSelectedRoutes: true,
      showAlternatives: false,
      autoRoute: true
    });
    
    routingControl.addTo(map);

    //routingControlRef.current = routingControl;
    routingControl.on("waypointschanged", function () {
      const waypoints = routingControl.getWaypoints();
      const newStart = [waypoints[0].latLng.lat, waypoints[0].latLng.lng] as LatLngTuple;
      const newEnd = [waypoints[1].latLng.lat, waypoints[1].latLng.lng] as LatLngTuple;
      onChange(newStart, newEnd);
    });

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end, onChange]);

  return null;
};

export default RoutingMachine;
