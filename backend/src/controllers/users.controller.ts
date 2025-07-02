import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { loginUserService, logoutUserService, refreshAccessTokenService, registerUserService } from '../services/auth.service';
import { role, statusCode, userPayload } from '../utils/app.types';
import { prisma } from '../config/prisma/prisma-client';
import { loginWithGoogle } from '../services/google.auth.service';
import { getUsersService } from '../services/users.service';

export const getUsersController = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await getUsersService();

    if (result === statusCode.NOT_FOUND) return reply.status(404).send({ message: 'Usuários não encontrados' })

    return reply.status(200).send(result);
}
