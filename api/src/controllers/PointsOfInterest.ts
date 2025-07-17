import axios from 'axios';

interface Tags {
  name?: string;
  amenity?: string;
  cuisine?: string;
  phone?: string;
  city?: string;
  housenumber?: string;
  postcode?: string;
  street?: string;
}

interface Poi {
  type: "node";
  lat: number;
  lon: number;
  tags?: Tags;
}

function parserResult(pois: any[]): Poi[] {
  return pois
    .filter(poi => poi.type === 'node')
    .map(poi => {
      const tags = poi.tags
        ? {
            name: poi.tags.name,
            amenity: poi.tags.amenity,
            cuisine: poi.tags.cuisine,
            phone: poi.tags.phone,
            city: poi.tags['addr:city'],
            housenumber: poi.tags['addr:housenumber'],
            postcode: poi.tags['addr:postcode'],
            street: poi.tags['addr:street'],
          }
        : undefined;

      return {
        type: poi.type,
        lat: poi.lat,
        lon: poi.lon,
        tags,
      };
    });
}

async function getPoisAroundCity(
  lat: number,
  lon: number,
  amenity: string,
  radiusKm: number = 2
): Promise<any[]> {
  const OVERPASS_URL = 'http://overpass-api.de/api/interpreter';
  const radiusM = radiusKm * 1000;

  const query = `
    [out:json];
    (
      node["amenity"="${amenity}"](around:${radiusM},${lat},${lon});
      way["amenity"="${amenity}"](around:${radiusM},${lat},${lon});
      relation["amenity"="${amenity}"](around:${radiusM},${lat},${lon});
    );
    out center;
  `;

  const response = await axios.post(OVERPASS_URL, `data=${encodeURIComponent(query)}`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return response.data.elements;
}

export async function fetchPoisForCity(
  lat: number,
  lon: number,
  amenity: string,
  radiusKm: number = 2
): Promise<Poi[]> {
  const pois = await getPoisAroundCity(lat, lon, amenity, radiusKm);
  return parserResult(pois);
}
