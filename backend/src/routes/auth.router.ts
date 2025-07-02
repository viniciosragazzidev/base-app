import { FastifyInstance } from 'fastify'
import { googleLoginController, loginController, logoutController, refreshController, registerController } from '../controllers/auth.controller';
export async function authRoutes(app: FastifyInstance) {
    app.post('/register', {
        schema: {
            tags: ['Auth'],
            summary: 'Cria um novo usuário',

            body: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    role: { type: 'string' }
                },
                required: ['name', 'email', 'password', 'role']
            },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, registerController);
    app.post('/login', {
        schema: {
            tags: ['Auth'],
            summary: 'Autentica um usuário',
            body: {
                description: 'Autentica um usuário',
                type: 'object',
                properties: {
                    email: { type: 'string' },
                    password: { type: 'string' }
                },
                required: ['email', 'password']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                        user: {
                            id: { type: 'string' },
                            role: { type: 'string' },
                        },
                        message: { type: 'string' }
                    }
                },
                401: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, loginController)
    app.post('/logout', logoutController)
    app.post('/refresh', refreshController)
    app.post('/google-login', googleLoginController)
}
