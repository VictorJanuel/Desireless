import express from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


export async function create(req : Request, res : Response) {
  const {userId, routeId} = req.params;
  try{
    const place = await prisma.routeUser.create({
      data: {
        user: {
          connect: {
            id: parseInt(userId)
          }
        },
        route: {
          connect: {
            id: parseInt(routeId)
          }
        }
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
    const {userId, routeId} = req.params;
    const routeUser = await prisma.routeUser.findUnique({
      where: {
        userId_routeId: {
          userId: parseInt(userId),
          routeId: parseInt(routeId)
        }
      }
    });
    if (!routeUser) {
      return res.status(404).json({ error: "Lieu non trouvé." });
    }
    res.json(routeUser);
  } catch (error) {
    console.error("Erreur lors de la récupération du lieu:", error);
    res.status(500).json({ error: "Erreur lors de la récupération du lieu." });
  }
} 

export async function update(req: Request, res: Response) {
  try {
    const {userId, routeId} = req.params;

    const updatedRouteUser = await prisma.routeUser.update({
      where: {
        userId_routeId: {
          userId: parseInt(userId),
          routeId: parseInt(routeId)
        }
      },
        data: {
            user: {
            connect: {
                id: parseInt(userId)
            }
            },
            route: {
            connect: {
                id: parseInt(routeId)
            }
            }
        }
    });

    res.json(updatedRouteUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du lieu:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du lieu." });
  }
}

export async function del(req: Request, res: Response) {
  try{
    const {id } = req.params;
    await prisma.routeUser.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  }catch (error) {
    console.error("Erreur lors de la suppression du lieu:", error);
    res.status(500).json({ error: "Erreur lors de la suppression du lieu." });
  } 
  return;
}
