import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as Place from '../controllers/place.controller';

const router = express.Router();
const prisma = new PrismaClient();

// Get all users
router.get('/findUnique/:id', Place.findUnique);
// Create a new user
router.post('/create', Place.create);
// Update a user
router.put('/update/:id', Place.update);
// Delete a user
router.delete('/delete/:id', Place.del);

export default router;