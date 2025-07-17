
import Button from '@mui/material/Button';

type SaveTrajet = {
  onClick: () => void;
};

const ButtonSave = ({ onClick }: SaveTrajet) => {
  return (
    <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
        <Button variant="contained" onClick={onClick}>Sauvegarder ce trajet</Button>
    </div>
  );
};

export default ButtonSave;