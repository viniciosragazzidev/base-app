// Require the framework and instantiate it

// ESM
import Fastify from 'fastify'
import { userRoutes } from '../routes/users.router'
import { ZodError } from 'zod'
import { authRoutes } from '../routes/auth.router'
import cors from '@fastify/cors'

const fastify = Fastify({
    logger: true
})

fastify.register(cors, {
    origin: ['http://localhost:5173'], // domínio do frontend
    credentials: true // permite enviar cookies, se usar cookie com refresh
})
// errors 

fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: 'Erro de validação',
            errors: error.format(),
        })
    }

    return reply.status(500).send({
        message: 'Erro interno do servidor',
    })
})





//routes

fastify.register(userRoutes, { prefix: '/api' })
fastify.register(authRoutes, { prefix: '/api' })

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})