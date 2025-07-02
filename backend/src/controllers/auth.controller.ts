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

    console.log('>>> Cookie setado com:', result.refreshToken)



    return reply.status(200).setCookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: false, // OK pra dev
        sameSite: 'strict', // tranquilo porque agora parece tudo mesmo domínio
        path: '/',
        maxAge: 60 * 60 * 24 * 7
    }).send(result)
}


export async function googleLoginController(request: FastifyRequest, reply: FastifyReply) {
    const { idToken } = request.body as { idToken: string }

    const result = await loginWithGoogle(idToken)

    if (result.statusCode === 401) {
        return reply.status(401).send({ message: 'Google login inválido' })
    }

    const { accessToken, refreshToken } = result as { accessToken: string, refreshToken: string }

    return reply.status(200).setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // OK pra dev
        sameSite: 'strict', // tranquilo porque agora parece tudo mesmo domínio
        path: '/',
        maxAge: 60 * 60 * 24 * 7
    }).send(result)

}

// Nota: Refresh token serve para termos um token de acesso com maior tempo de expiração    
export async function refreshController(request: FastifyRequest, reply: FastifyReply) {
    const refreshToken = request.cookies.refreshToken


    if (!refreshToken) {
        return reply.status(401).send({ message: 'Refresh token não encontrado' })
    }

    const session = await prisma.session.findUnique({
        where: { refreshToken }
    })

    if (!session) {
        return reply.status(401).send({ message: 'Sessão expirada' })
    }
    const token = await refreshAccessTokenService(refreshToken)

    if (token === 401) {
        return reply.status(401).send({ message: 'Refresh token inválido ou expirado' })
    }

    return reply.send({ accessToken: token })
}

export async function logoutController(request: FastifyRequest, reply: FastifyReply) {
    const cookie = request.cookies.refreshToken
    console.log('Cookies recebidos no logout:', request.cookies)



    const refreshToken = cookie as string

    await logoutUserService(refreshToken)

    return reply
        .clearCookie('refreshToken', { path: '/' })
        .status(200)
        .send({ message: 'Logout realizado com sucesso' })
}