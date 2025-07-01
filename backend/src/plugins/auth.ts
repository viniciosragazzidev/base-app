// src/plugins/verify-jwt.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ message: 'Token ausente' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
            sub: string
            role: string
        }

        request.user = {
            id: payload.sub,
            role: payload.role,
        }
    } catch (err) {
        return reply.status(401).send({ message: 'Token inválido ou expirado' })
    }
}
