import express from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


export async function create(req : Request, res : Response) {
  const {id, lat, lon } = req.params;
  try{
    const place = await prisma.place.create({
      data: {
        latitude: parseFloat(lat), 
        longitude: parseFloat(lon) 
      }
    });
    res.status(201).json(place);
  } catch (error) {
    console.error("Erreur lors de la création du lieu:", error);
    res.status(500).json({ error: "Erreur lors de la création du lieu."
    })
  }
}


export async function findUnique(req: Request, res: Response) {
  try{
    const {id} = req.params;
    const place = await prisma.place.findUnique({
      where: {
        id: parseInt(id)
      }
    });
    if (!place) {
      return res.status(404).json({ error: "Lieu non trouvé." });
    }
    res.json(place);
  } catch (error) {
    console.error("Erreur lors de la récupération du lieu:", error);
    res.status(500).json({ error: "Erreur lors de la récupération du lieu." });
  }
} 

export async function update(req: Request, res: Response) {
  try {
    const {id, lat, lon } = req.params;

    const updatedPlace = await prisma.place.update({
      where: { 
        id: parseInt(id)
      },
        data: {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon)
        }
    });

    res.json(updatedPlace);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du lieu:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du lieu." });
  }
}

export async function del(req: Request, res: Response) {
  try{
    const {id } = req.params;
    await prisma.place.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  }catch (error) {
    console.error("Erreur lors de la suppression du lieu:", error);
    res.status(500).json({ error: "Erreur lors de la suppression du lieu." });
  } 
  return;
}
