import express from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


export async function create(req : Request, res : Response) {
  const { id, name } = req.params;
  try{
    const lieu = await prisma.lieu.create({
      data: {
        id: parseInt(id),
        name: name,
        lat: 0, // Valeur par défaut, à ajuster
        lon: 0  // Valeur par défaut, à ajuster
      }
    });
    res.status(201).json(lieu);
  } catch (error) {
    console.error("Erreur lors de la création du lieu:", error);
    res.status(500).json({ error: "Erreur lors de la création du lieu."
    })
  }
}


export async function findUnique(req: Request, res: Response) {
  try{
    const lieu = await prisma.lieu.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });
    if (!lieu) {
      return res.status(404).json({ error: "Lieu non trouvé." });
    }
    res.json(lieu);
  } catch (error) {
    console.error("Erreur lors de la récupération du lieu:", error);
    res.status(500).json({ error: "Erreur lors de la récupération du lieu." });
  }
} 

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, lat, lon } = req.body;

    const updatedLieu = await prisma.lieu.update({
      where: { id: parseInt(id) },
      data: { name, lat, lon }
    });

    res.json(updatedLieu);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du lieu:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du lieu." });
  }
}

export async function delete(req: Request, res: Response) {
  try{
    const { id } = req.params;
    await prisma.lieu.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  }catch (error) {
    console.error("Erreur lors de la suppression du lieu:", error);
    res.status(500).json({ error: "Erreur lors de la suppression du lieu." });
  } 
}
/* 
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getProducts = async (req, res) => {
    try {
        const response = await prisma.product.findMany()
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const getProductById = async (req, res) => {
    try {
        const response = await prisma.product.findUnique({
            where: {
                id: Number(req.params.id),
            },
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

export const createProduct = async (req, res) => {
    const { name, price } = req.body
    try {
        const product = await prisma.product.create({
            data: {
                name: name,
                price: price,
            },
        })
        res.status(201).json(product)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const updateProduct = async (req, res) => {
    const { name, price } = req.body
    try {
        const product = await prisma.product.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                name: name,
                price: price,
            },
        })
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await prisma.product.delete({
            where: {
                id: Number(req.params.id),
            },
        })
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}
 */