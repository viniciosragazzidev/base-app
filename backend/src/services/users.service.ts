import { prisma } from "../config/prisma/prisma-client"
import { statusCode } from "../utils/app.types"


export const getUsersService = async () => {
    const users = await prisma.user.findMany()

    if (!users) return statusCode.NOT_FOUND
    return users
}