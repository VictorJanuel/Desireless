import axios from 'axios';
import * as fs from "fs";
import { parse } from 'path';

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

async function getCityName(lat: number, lon: number): Promise<string> {
  const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
  const params = {
    lat,
    lon,
    format: 'json',
  };
  const response = await axios.get(NOMINATIM_URL, {
    params,
    headers: { 'User-Agent': 'POI-App' },
  });

  const data = response.data;

  if (!data || !data.address) {
    throw new Error(`No address found for coordinates: ${lat}, ${lon}`);
  }

  const city = data.address.city || data.address.town || data.address.village || data.address.hamlet;

  if (!city) {
    throw new Error(`City not found in address data for coordinates: ${lat}, ${lon}`);
  }

  return city;
}


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
  tags?: Tags
}

function parserResult(pois: any[]){
  const pois_result: Poi[] = pois
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
            street: poi.tags['addr:street']
          }
        : undefined;

      return {
        type: poi.type,
        lat: poi.lat,
        lon: poi.lon,
        tags
      } satisfies Poi;
    });

  console.log(pois_result)
  return pois_result;
}


async function getPoisAroundCity(
  lat: number,
  lon: number,
  amenity: string,
  radiusKm: number
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

export async function fetchPoisForCity(lat: number, lon: number, amenity: string, radiusKm: number): Promise<any[]> {
  const city = await getCityName(lat, lon);

  const pois = await getPoisAroundCity(lat, lon, amenity, radiusKm);

  const pois_result = parserResult(pois);
  // Écrire dans un fichier si besoin
  //fs.writeFileSync('sample.json', JSON.stringify(pois, null, 2), { encoding: 'utf-8' });

  return pois_result;
}

/*export async function main() {
  try {
    const pois = await fetchPoisForCity(25, 5);
    console.log(`Found ${pois.length} POIs`);
  } catch (e: any) {
    console.error(`Error: ${e.message}`);
  }
}*/
