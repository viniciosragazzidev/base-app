import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { loginUserService, logoutUserService, refreshAccessTokenService, registerUserService } from '../services/auth.service';
import { role, userPayload } from '../utils/app.types';
import { prisma } from '../config/prisma/prisma-client';
import { loginWithGoogle } from '../services/google.auth.service';

const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.nativeEnum(role),
});

export async function registerController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const body = createUserSchema.parse(request.body);

    const result = await registerUserService(body as userPayload);

    if (result === 400) {
        return reply.status(400).send({ message: 'E-mail já em uso.' });
    }

    return reply.status(201).send(result);
}


const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})
export async function loginController(request: FastifyRequest, reply: FastifyReply) {

    const { email, password } = loginSchema.parse(request.body)

    const result = await loginUserService({ email, password })

    if (result === 404) {
        return reply.status(404).send({ message: 'E-mail ou senha incorretos.' })
    }

    if (result === 401) {
        return reply.status(401).send({ message: 'E-mail ou senha incorretos.' })
    }

    if (result === 403) {
        return reply.status(403).send({ message: 'Limite de sessões atingido.' })
    }





    return reply.status(200).send({ token: result })
}


export async function googleLoginController(request: FastifyRequest, reply: FastifyReply) {
    const { idToken } = request.body as { idToken: string }

    const result = await loginWithGoogle(idToken)

    if (result.statusCode === 401) {
        return reply.status(401).send({ message: 'Google login inválido' })
    }

    return reply.status(200).send(result)

}

export async function refreshController(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
        refreshToken: z.string().uuid(),
    })

    const { refreshToken } = schema.parse(request.body)

    const token = await refreshAccessTokenService(refreshToken)

    if (token === 401) {
        return reply.status(401).send({ message: 'Refresh token inválido ou expirado' })
    }

    return reply.send({ accessToken: token })
}

export async function logoutController(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
        refreshToken: z.string().uuid(),
    })

    const { refreshToken } = schema.parse(request.body)

    await logoutUserService(refreshToken)

    return reply.status(200).send({ message: 'Logout feito com sucesso' })
}