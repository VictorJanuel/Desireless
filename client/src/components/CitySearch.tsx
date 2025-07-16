import { useState } from 'react';

type City = {
  display_name: string;
  lat: string;
  lon: string;
};

type Props = {
  onSelectCity: (lat: number, lon: number, name: string) => void;
};

export default function CitySearch({ onSelectCity }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (val.length < 3) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&addressdetails=1&limit=5`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Erreur recherche ville:', err);
    }
  };

  return (
    <div style={{ position: 'relative', marginBottom: 15 }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Rechercher une ville"
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: 16,
          borderRadius: 6,
          border: '1.5px solid #0078d4',
          boxShadow: '0 2px 6px rgba(0, 120, 212, 0.25)',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#005a9e')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#0078d4')}
      />
      {results.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1.5px solid #0078d4',
            borderTop: 'none',
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            maxHeight: 180,
            overflowY: 'auto',
            margin: 0,
            padding: 0,
            listStyle: 'none',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
          }}
        >
          {results.map((city, i) => (
            <li
              key={i}
              onMouseDown={(e) => e.preventDefault()} // empêche blur input au clic sur item
              onClick={() => {
                onSelectCity(parseFloat(city.lat), parseFloat(city.lon), city.display_name);
                setQuery(city.display_name);
                setResults([]);
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: i !== results.length - 1 ? '1px solid #ddd' : 'none',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e6f0ff')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {city.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
