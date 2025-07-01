import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyToken } from '../config/auth/jwt'

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers.authorization

    if (!authHeader) {
        return reply.status(401).send({ message: 'Token ausente' })
    }

    const [, token] = authHeader.split(' ')

    try {
        const payload = verifyToken(token)

        // ✅ Aqui validamos se é JwtPayload
        if (typeof payload !== 'object' || !('sub' in payload) || !('role' in payload)) {
            return reply.status(401).send({ message: 'Token mal formatado' })
        }

        request.user = {
            sub: payload.sub as string,
            role: payload.role as string,
        }
    } catch (err) {
        return reply.status(401).send({ message: 'Token inválido' })
    }
}
