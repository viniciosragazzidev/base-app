import { generateToken } from "../config/auth/jwt";
import { prisma } from "../config/prisma/prisma-client";
import { statusCode, userPayload } from "../utils/app.types";
import bcrypt from 'bcrypt'

import { v7 } from 'uuid'

export const registerUserService = async (user: userPayload) => {
    const userExists = await prisma.user.findUnique({
        where: { email: user.email },
    });

    if (userExists) {
        return statusCode.BAD_REQUEST;
    }

    const passwordHash = await bcrypt.hash(user.password, 10);

    const userCreated = await prisma.user.create({
        data: {
            name: user.name,
            email: user.email,
            password: passwordHash,
            role: user.role,
        },
    });

    return userCreated;
};


export const loginUserService = async ({ email, password }: { email: string, password: string }) => {

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        return statusCode.NOT_FOUND
    }

    const sessionCount = await prisma.session.count({
        where: { userId: user.id }
    })

    if (sessionCount >= user.maxSessions) {
        return statusCode.FORBIDDEN
    }
    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
        return statusCode.UNAUTHORIZED
    }

    const token = generateToken({ sub: user.id, role: user.role })

    const refreshTokenUUID = v7()
    const refreshToken = await prisma.session.create({
        data: {
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // 7 dias
            refreshToken: refreshTokenUUID,
        }
    })

    return {
        accessToken: token,
        refreshToken: refreshToken.refreshToken,
        user: {
            id: user.id,
            role: user.role,
        },
        message: 'Login feito com sucesso'
    }

}

export const refreshAccessTokenService = async (refreshToken: string) => {
    const session = await prisma.session.findUnique({
        where: { refreshToken },
        include: { user: true },
    })

    if (!session) return statusCode.UNAUTHORIZED

    if (new Date() > session.expiresAt) {
        // Expirou, limpa a sessão
        await prisma.session.delete({ where: { id: session.id } })
        return statusCode.UNAUTHORIZED
    }

    const token = generateToken({
        sub: session.user.id,
        role: session.user.role,
    })

    return token
}


export const logoutUserService = async (refreshToken: string) => {
    await prisma.session.deleteMany({
        where: { refreshToken },
    })

    return statusCode.OK
}
