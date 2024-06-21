import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  try {

    let userRole = await prisma.roles.findFirst({
      where: {
        nombre: 'user'
      }
    });
    if (!userRole) throw new Error('Role user not found');
    const {
      nombre,
      email,
      apellido,
      contrasena,
      telefono
    } = req.body;
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const user = await prisma.usuarios.create({ 
      data: {
        nombre,
        apellido,
        email,
        contrasena: hashedPassword,
        telefono,
        rolId: userRole.id
      }
    });
    res.status(201).json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'There was an error creating user' });
  }
};