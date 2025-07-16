// src/components/LatLong.tsx
import type { LatLngTuple } from "leaflet";

type LatLongProps = {
  start: LatLngTuple;
  end: LatLngTuple;
  onChange: (start: LatLngTuple, end: LatLngTuple) => void;
};

export default function LatLong({ start, end, onChange }: LatLongProps) {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const updated = [...start] as LatLngTuple;
    updated[index] = parseFloat(e.target.value);
    onChange(updated, end);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const updated = [...end] as LatLngTuple;
    updated[index] = parseFloat(e.target.value);
    onChange(start, updated);
  };

  return (
    <div style={{ position: "absolute", top: 10, left: 10, background: "white", padding: 10, zIndex: 1000 }}>
      <h3>Coordonnées</h3>
      <div>
        <label>Départ:</label>
        <input
          type="number"
          step="any"
          value={start[0]}
          onChange={(e) => handleStartChange(e, 0)}
        />
        <input
          type="number"
          step="any"
          value={start[1]}
          onChange={(e) => handleStartChange(e, 1)}
        />
      </div>
      <div>
        <label>Arrivée:</label>
        <input
          type="number"
          step="any"
          value={end[0]}
          onChange={(e) => handleEndChange(e, 0)}
        />
        <input
          type="number"
          step="any"
          value={end[1]}
          onChange={(e) => handleEndChange(e, 1)}
        />
      </div>
    </div>
  );
}