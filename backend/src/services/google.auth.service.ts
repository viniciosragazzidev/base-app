// src/services/google.service.ts
import { OAuth2Client } from 'google-auth-library'
import { prisma } from '../config/prisma/prisma-client'
import { v7 as uuidv7 } from 'uuid'
import { role, statusCode } from '../utils/app.types'
import { generateToken } from '../config/auth/jwt'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function loginWithGoogle(idToken: string) {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    if (!payload) return { statusCode: statusCode.UNAUTHORIZED, message: 'Google token inválido' }

    const email = payload.email!
    const name = payload.name || 'Usuário Google'

    // Procura user ou cria
    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        user = await prisma.user.create({
            data: {
                name,
                email,
                password: '', // não precisa
                role: role.user
            }
        })
    }

    const accessToken = generateToken({ sub: user.id, role: user.role })
    const refreshTokenUUID = uuidv7()

    await prisma.session.create({
        data: {
            userId: user.id,
            refreshToken: refreshTokenUUID,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
    })

    return {
        accessToken,
        refreshToken: refreshTokenUUID
    }
}
