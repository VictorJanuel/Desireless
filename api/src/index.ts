import express, { Request, Response } from 'express';
import cors from 'cors';
import { fetchPoisForCity } from './controllers/PointsOfInterest';
import { Http2ServerRequest } from 'http2';

const app = express();
app.use(cors());

app.get('/getPois', async (req: Request, res: Response) => {
  const { lat, lon, amenity, radius} = req.query;

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

app.get('/', (req, res) => {
  res.send('API is running');
});




 app.get('/route/driving/:coordinates', async (req, res) => {
    //const { lat, lon, amenity, radius} = req.query;
    console.log(req.url +"mdrhjf bbf a")
    const newUrl = req.url.slice(6);
    const url = `http://osrm-backend:5000/route/v1${newUrl}`; // redirige vers OSRM
    try {
      const osrmRes = await fetch(url);

      if (!osrmRes.ok) {
        const text = await osrmRes.text(); // utile pour debug
        throw new Error(`Erreur OSRM: ${osrmRes.status} - ${text}`);
      }

      const data = await osrmRes.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Erreur proxy OSRM :", error);
      res.status(500).json({ error: "Erreur proxy OSRM" });
    }
  }
);
 
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
