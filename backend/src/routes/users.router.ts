import { FastifyInstance } from 'fastify'
import { prisma } from '../config/prisma/prisma-client'
import { verifyRole } from '../middlewares/verify-role'
import { verifyJWT } from '../plugins/auth'
import { role } from '../utils/app.types'
import { getUsersController } from '../controllers/users.controller'

export async function userRoutes(app: FastifyInstance) {
    // Aplica verificação de JWT em todas as rotas
    app.addHook('preHandler', verifyJWT)

    // Rota protegida + Swagger schema
    app.get(
        '/users',
        {
            preHandler: [verifyRole([role.admin])],
            schema: {
                tags: ['Users'],
                summary: 'Lista todos os usuários (somente admins)',
                response: {
                    200: {
                        description: 'Lista de usuários',
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' },
                                email: { type: 'string' },
                                role: { type: 'string' },
                                createdAt: { type: 'string', format: 'date-time' },
                            },
                        },
                    },
                    401: {
                        description: 'Não autenticado',
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                        },
                    },
                    403: {
                        description: 'Acesso negado (não é admin)',
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                        },
                    },
                },
            },
        },
        getUsersController
    )
}
