
import Button from '@mui/material/Button';

type ShowPOI = {
  onClick: () => void;
};

const ButtonPOI = ({ onClick }: ShowPOI) => {
  return (
    <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
        <Button variant="contained" onClick={onClick}>Afficher les POI</Button>
    </div>
  );
};

export default ButtonPOI;