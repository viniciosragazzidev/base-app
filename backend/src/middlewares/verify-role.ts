import { FastifyRequest, FastifyReply } from 'fastify'

export function verifyRole(allowedRoles: string[]) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const userRole = request.user?.role

        if (!userRole || !allowedRoles.includes(userRole)) {

            return reply.status(403).send({ message: 'Acesso negado: sem permissão' })
        }
    }
}
