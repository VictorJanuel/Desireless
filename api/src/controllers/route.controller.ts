import express from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient()


export async function create(req : Request, res : Response) {
  const {departurePlaceId, arrivalPlaceId } = req.params;
  try{

    const route = await prisma.route.create({
      data: {
        departurePlace: {
          connect: {
            id: parseInt(departurePlaceId)
          }
        },
        arrivalPlace: {
          connect: {
            id: parseInt(arrivalPlaceId)
          }
        }
      }
    });
    res.status(201).json(route);
  } catch (error) {
    console.error("Erreur lors de la création du lieu:", error);
    res.status(500).json({ error: "Erreur lors de la création du lieu."
    })
  }
}


export async function findUnique(req: Request, res: Response) {
  try{
    const {id} = req.params;
    const route = await prisma.route.findUnique({
      where: {
        id: parseInt(id)
      }
    });
    if (!route) {
      return res.status(404).json({ error: "Lieu non trouvé." });
    }
    res.json(route);
  } catch (error) {
    console.error("Erreur lors de la récupération du lieu:", error);
    res.status(500).json({ error: "Erreur lors de la récupération du lieu." });
  }
} 

export async function update(req: Request, res: Response) {
  try {
    const {id, departurePlaceId, arrivalPlaceId} = req.params;


    const updatedRoute = await prisma.route.update({
      where: { 
        id: parseInt(id)
      },
        data: {
            departurePlace: {
              connect: {
                id: parseInt(departurePlaceId)
              }
            },
            arrivalPlace: { 
              connect: {
                id: parseInt(arrivalPlaceId)
              }
            }
        }
    });
    res.json(updatedRoute);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du lieu:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du lieu." });
  }
}

export async function del(req: Request, res: Response) {
  try{
    const {id } = req.params;
    await prisma.route.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  }catch (error) {
    console.error("Erreur lors de la suppression du lieu:", error);
    res.status(500).json({ error: "Erreur lors de la suppression du lieu." });
  } 
}
