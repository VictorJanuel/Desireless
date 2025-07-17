import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as RouteUser from '../controllers/place.controller';

const router = express.Router();
const prisma = new PrismaClient();

// Get all users
router.get('/findUnique/:id', RouteUser.findUnique);
// Create a new user
router.post('/create', RouteUser.create);
// Update a user
router.put('/update/:id', RouteUser.update);
// Delete a user
router.delete('/delete/:id', RouteUser.del);

export default router;