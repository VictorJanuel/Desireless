import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

prisma.user.findMany(
  {where: {prenom: {}}}
);

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World depuis Node.js et Express !');
});

app.listen(port, () => {
  console.log(`Serveur Node.js lancé sur http://localhost:${port}`);
});
