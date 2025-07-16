import axios from 'axios';
import * as fs from "fs";

async function getCityCenter(cityName: string): Promise<{ lat: number; lon: number }> {
  const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
  const params = {
    q: cityName,
    format: 'json',
    limit: 1,
  };
  const response = await axios.get(NOMINATIM_URL, {
    params,
    headers: { 'User-Agent': 'POI-App' },
  });
  const data = response.data;
  if (!data || data.length === 0) {
    throw new Error(`City '${cityName}' not found.`);
  }
  const lat = parseFloat(data[0].lat);
  const lon = parseFloat(data[0].lon);
  return { lat, lon };
}

async function getPoisAroundCity(
  lat: number,
  lon: number,
  radiusKm: number,
  amenity: string = 'restaurant'
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

async function main() {
  const cityName = 'Avignon';
  const amenity = 'bar';
  const radiusKm = 5;

  try {
    const { lat, lon } = await getCityCenter(cityName);
    console.log(`Center of ${cityName}: lat=${lat}, lon=${lon}`);

    const pois = await getPoisAroundCity(lat, lon, radiusKm, amenity);

    fs.writeFileSync('sample.json', JSON.stringify(pois, null, 2), { encoding: 'utf-8' });
    console.log(`Found ${pois.length} POIs for amenity '${amenity}' within ${radiusKm} km of ${cityName}.`);
  } catch (e: any) {
    console.error(`Error: ${e.message}`);
  }
}

main();
