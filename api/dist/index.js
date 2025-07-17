"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
//import express from 'express';
const express = require("express");
const cors_1 = __importDefault(require("cors"));
const PointsOfInterest_js_1 = require("./controllers/PointsOfInterest.js"); // Assuming test.js exports a main function
//import test from 'node:test';
const prisma = new client_1.PrismaClient();
//const express = require('express');
const app = express();
const port = 3001;
app.use((0, cors_1.default)()); // <--- autorise toutes les origines
/*app.get('/', (req, res) => {
  res.send('Hello World depuis Node.js et Express !');
  //res.send(test);
});*/
app.get('/pois', async (req, res) => {
    try {
        const city = req.query.city;
        const amenity = req.query.type;
        const radiusKm = parseFloat(req.query.km) || 1; // Default to 1 km if not provided
        console.log(`Recherche POIs de type "${amenity}" dans la ville "${city}" avec un rayon de ${radiusKm} km.`);
        //const pois = await fetchPoisForCity(city, amenity, radiusKm);
        //res.json(pois);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des POIs');
    }
});
app.get('/getPois', async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);
        if (isNaN(lat) || isNaN(lon)) {
            res.status(400).send('Latitude et longitude doivent être des nombres valides.');
            return;
        }
        const pois = await (0, PointsOfInterest_js_1.fetchPoisForCity)(lat, lon);
        console.log("bonjour" + lat + "bonsoir" + lon);
        res.json(pois);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des POIs');
    }
});
app.listen(port, () => {
    console.log(`Serveur Node.js lancé sur http://localhost:${port}`);
});
