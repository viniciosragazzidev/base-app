import dotenv from 'dotenv'
dotenv.config()

import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { ZodError } from 'zod'

import { userRoutes } from '../routes/users.router'
import { authRoutes } from '../routes/auth.router'

const fastify = Fastify({
})

// 🟢 CORS tem que vir ANTES de qualquer coisa que lide com requests!
fastify.register(cors, {
    origin: ['http://localhost:5173'],
    credentials: true
})

// 🟢 Cookie precisa vir ANTES das rotas que usam cookies
fastify.register(fastifyCookie, {
})

// 🟢 Swagger pode vir depois de CORS e cookies
fastify.register(swagger, {
    swagger: {
        info: {
            title: 'Base App - API',
            description: 'Documentação automática das rotas',
            version: '1.0.0'
        },
        host: 'localhost:3000',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json']
    }
})

fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'full'
    }
})

// 🔥 Tratamento de erros
fastify.setErrorHandler((error, request, reply) => {
    console.error('🔥 ERRO INTERNO:', error)

    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: 'Erro de validação',
            errors: error.format()
        })
    }

    return reply.status(500).send({
        message: 'Erro interno do servidor'
    })
})

// ✅ Rotas devem vir DEPOIS de configurar tudo acima
fastify.register(userRoutes, { prefix: '/api' })
fastify.register(authRoutes, { prefix: '/api' })


fastify.addHook('onRequest', async (request, reply) => {
    console.log('🧪 Cookies recebidos:', request.cookies)
})

// 🚀 Starta o servidor
fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    console.log(`🔥 Servidor rodando em ${address}`)
})
