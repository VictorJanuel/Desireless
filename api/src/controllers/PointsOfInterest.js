"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPoisForCity = fetchPoisForCity;
exports.getCityName = getCityName;
exports.main = main;
const axios_1 = __importDefault(require("axios"));
async function getCityCenter(cityName) {
    const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
    const params = {
        q: cityName,
        format: 'json',
        limit: 1,
    };
    const response = await axios_1.default.get(NOMINATIM_URL, {
        params,
        headers: { 'User-Agent': 'POI-App' },
    });
    const data = response.data;
    if (!data || data.length === 0) {
        throw new Error(`City '${cityName}' not found.`);
    }
    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    const cityName_verif = await getCityName(lat, lon);
    console.log(`City center for '${cityName_verif}': lat=${lat}, lon=${lon}`);
    return { lat, lon };
}
async function getCityName(lat, lon) {
    const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
    const params = {
        lat,
        lon,
        format: 'json',
    };
    const response = await axios_1.default.get(NOMINATIM_URL, {
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
function parserResult(pois) {
    const pois_result = pois
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
        };
    });
    console.log(pois_result);
    return pois_result;
}
async function getPoisAroundCity(lat, lon, radiusKm, amenity = 'restaurant') {
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
    const response = await axios_1.default.post(OVERPASS_URL, `data=${encodeURIComponent(query)}`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data.elements;
}
async function fetchPoisForCity(lat, lon) {
    const city = await getCityName(lat, lon);
    const pois = await getPoisAroundCity(lat, lon, 3, 'bar');
    const pois_result = parserResult(pois);
    // Écrire dans un fichier si besoin
    //fs.writeFileSync('sample.json', JSON.stringify(pois, null, 2), { encoding: 'utf-8' });
    return pois_result;
}
async function main() {
    try {
        const pois = await fetchPoisForCity(25, 5);
        console.log(`Found ${pois.length} POIs`);
    }
    catch (e) {
        console.error(`Error: ${e.message}`);
    }
}
