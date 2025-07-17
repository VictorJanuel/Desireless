import express, { Request, Response } from 'express';
import cors from 'cors';
import { fetchPoisForCity } from './controllers/PointsOfInterest';
import { PrismaClient } from '@prisma/client';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
export const prisma = new PrismaClient();

const app = express();
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.get('/api', (req, res) => {
  res.send('Hello, world!');
});

app.use("/api/auth", (req, res, next) => {
  console.log("Handling auth request:", req.method, req.url);
  // console.log("Registered BetterAuth routes:");
  // (auth as any)._router?.routes?.forEach?.((route: any) => {
  //   console.log(`${route.method} ${route.path}`);
  // });
  console.log("Auth request details:", {
    method: req.method,
    url: req.originalUrl,
    path: req.path,
    body: req.body,
    host: req.headers.host,
  });
  // next();
  auth.api.signUpEmail({
    body: {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name
    }
  }).then((result) => {
    console.log("SignUp result:", result);
    res.json(result);
  }).catch((error) => {
    console.error("SignUp error:", error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription.' });
  });
});

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


app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
