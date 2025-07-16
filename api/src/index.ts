import express, { Request, Response } from 'express';
import cors from 'cors';
import { fetchPoisForCity } from './controllers/PointsOfInterest';

const app = express();
app.use(cors());

app.get('/getPois', async (req: Request, res: Response) => {
  const { lat, lon, amenity = 'restaurant', radius = '10' } = req.query;

  if (!lat || !lon) {
    return res.status(400).send('Latitude et longitude doivent être définis.');
  }

  try {
    const pois = await fetchPoisForCity(
      parseFloat(lat as string),
      parseFloat(lon as string),
      amenity as string,
      parseFloat(radius as string)
    );
    res.json(pois);
  } catch (error) {
    console.error("Erreur backend getPois:", error);
    res.status(500).send('Erreur lors de la récupération des POIs.');
  }
});


app.listen(3001, () => {
  console.log('Serveur démarré sur le port 3001');
});
