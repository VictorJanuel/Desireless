import requests
import json

def get_city_center(city_name):
    """Get the latitude and longitude of a city using Nominatim API."""
    NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
    params = {
        'q': city_name,
        'format': 'json',
        'limit': 1
    }
    response = requests.get(NOMINATIM_URL, params=params, headers={'User-Agent': 'POI-App'})
    response.raise_for_status()
    data = response.json()
    if not data:
        raise Exception(f"City '{city_name}' not found.")
    lat = float(data[0]['lat'])
    lon = float(data[0]['lon'])
    return lat, lon

def get_pois_around_city(lat, lon, radius_km, amenity='restaurant'):
    """Query POIs within a radius around the city center from Overpass API."""
    OVERPASS_URL = "http://overpass-api.de/api/interpreter"
    radius_m = radius_km * 1000  # convert km to meters
    query = f"""
    [out:json];
    (
      node["amenity"="{amenity}"](around:{radius_m},{lat},{lon});
      way["amenity"="{amenity}"](around:{radius_m},{lat},{lon});
      relation["amenity"="{amenity}"](around:{radius_m},{lat},{lon});
    );
    out center;
    """
    response = requests.post(OVERPASS_URL, data={'data': query})
    response.raise_for_status()
    return response.json()['elements']

if __name__ == "__main__":
    city_name = "Avignon"
    amenity = "bar"
    radius_km = 5  # Example: 50 km radius around the city center

    try:
        lat, lon = get_city_center(city_name)
        print(f"Center of {city_name}: lat={lat}, lon={lon}")

        pois = get_pois_around_city(lat, lon, radius_km, amenity)
        
        with open("sample.json", "w", encoding="utf-8") as outfile:
            json.dump(pois, outfile, indent=2, ensure_ascii=False)

        print(f"Found {len(pois)} POIs for amenity '{amenity}' within {radius_km} km of {city_name}.")
    except Exception as e:
        print(f"Error: {e}")
