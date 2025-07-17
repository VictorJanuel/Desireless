import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as Lieu from '../controllers/LieuController';

const router = express.Router();
const prisma = new PrismaClient();

// Get all users
router.get('/findUnique/:id', Lieu.findUnique);
// Create a new user
router.post('/create', Lieu.create);
// Update a user
router.put('/update/:id', Lieu.update);
// Delete a user
router.delete('/delete/:id', Lieu.delete);

export default router;