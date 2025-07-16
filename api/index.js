import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

import express from 'express';

//const express = require('express');
const app = express();
const port = 3000;

app.get('/api', (req, res) => {
  res.send('Hello World toto depuis Node.js et Express !');
});

app.listen(port, () => {
  console.log(`Serveur Node.js lancé sur http://localhost:${port}`);
});
