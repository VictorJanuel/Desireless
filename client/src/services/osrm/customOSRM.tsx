import L from "leaflet";

export class CustomOSRM {
  options: any;

  constructor(options = {}) {
    this.options = options;
  }

  route(waypoints: L.LatLng[], callback: Function) {
    const start = `${waypoints[0].lng},${waypoints[0].lat}`;
    const end = `${waypoints[1].lng},${waypoints[1].lat}`;

    fetch(`/api/route?start=${start}&end=${end}`)
      .then(res => res.json())
      .then(data => {
        if (!data.routes || !data.routes.length) {
          callback(null, []);
          return;
        }

        const route = data.routes[0];

        // If route.geometry is an encoded polyline string, you need to decode it first.
        // You can use the 'polyline' package for decoding.
        // import polyline from '@mapbox/polyline'; at the top of the file if not already imported.
        // const latlngs = polyline.decode(route.geometry).map(([lat, lng]) => L.latLng(lat, lng));
        // const line = L.polyline(latlngs);

        // If route.geometry is already an array of coordinates (GeoJSON), use:
        const line = L.polyline(route.geometry.coordinates.map(([lng, lat]: [number, number]) => L.latLng(lat, lng)));
        const summary = route.legs.reduce(
          (acc: any, leg: any) => {
            acc.distance += leg.distance;
            acc.time += leg.duration;
            return acc;
          },
          { distance: 0, time: 0 }
        );

        callback(null, [
          {
            name: "Custom route",
            coordinates: line.getLatLngs(),
            summary,
          },
        ]);
      })
      .catch((err) => {
        console.error("Routing error", err);
        callback(err);
      });
  }
}
