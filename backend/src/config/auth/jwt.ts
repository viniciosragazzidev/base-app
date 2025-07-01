import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'senha_secreta_segura'

export function generateToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
}

export function verifyToken(token: string): string | jwt.JwtPayload {
    return jwt.verify(token, JWT_SECRET)
}
