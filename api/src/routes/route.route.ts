import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as Route from '../controllers/place.controller';

const router = express.Router();
const prisma = new PrismaClient();

// Get all users
router.get('/findUnique/:id', Route.findUnique);
// Create a new user
router.post('/create', Route.create);
// Update a user
router.put('/update/:id', Route.update);
// Delete a user
router.delete('/delete/:id', Route.del);

export default router;