import { FastifyInstance } from 'fastify'
import { prisma } from '../config/prisma/prisma-client'
import { verifyJwt } from '../middlewares/verify-jwt'
import { role } from '../utils/app.types'
import { verifyRole } from '../middlewares/verify-role'
import { verifyJWT } from '../plugins/auth'

export async function userRoutes(app: FastifyInstance) {
    app.addHook('preHandler', verifyJWT)


    app.get('/users', { preHandler: [verifyRole([role.admin])] }, async (request, reply) => {
        const users = await prisma.user.findMany()
        return reply.status(200).send(users)
    })


}
