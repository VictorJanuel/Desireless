import { PrismaClient } from '@prisma/client'
//import express from 'express';
import express = require('express');
import cors from 'cors';
import { fetchPoisForCity } from './controllers/PointsOfInterest.js'; // Assuming test.js exports a main function

//import test from 'node:test';

const prisma = new PrismaClient()

//const express = require('express');
const app = express();
const port = 3001;

app.use(cors()); // <--- autorise toutes les origines

/*app.get('/', (req, res) => {
  res.send('Hello World depuis Node.js et Express !');
  //res.send(test);
});*/


app.get('/pois', async (req, res) => {
  try {
    const city = req.query.city as string;
    const amenity = req.query.type as string; 
    const radiusKm = parseFloat(req.query.km as string)  || 1; // Default to 1 km if not provided
    console.log(`Recherche POIs de type "${amenity}" dans la ville "${city}" avec un rayon de ${radiusKm} km.`);
    //const pois = await fetchPoisForCity(city, amenity, radiusKm);
    //res.json(pois);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des POIs');
  }
});

app.get('/getPois', async (req, res) => {
  try {
  const lat = parseFloat(req.query.lat as string);
  const lon = parseFloat(req.query.lon as string);

  if (isNaN(lat) || isNaN(lon)) {
    res.status(400).send('Latitude et longitude doivent être des nombres valides.');
    return;
  }

  const pois = await fetchPoisForCity(lat, lon);
  console.log("bonjour" + lat + "bonsoir" + lon);
  res.json(pois);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des POIs');
  }
});






app.listen(port, () => {
  console.log(`Serveur Node.js lancé sur http://localhost:${port}`);
});
