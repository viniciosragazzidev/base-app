import { FastifyInstance } from 'fastify'
import { googleLoginController, loginController, refreshController, registerController } from '../controllers/auth.controller';
import { loginWithGoogle } from '../services/google.auth.service';
export async function authRoutes(app: FastifyInstance) {
    app.post('/register', registerController);
    app.post('/login', loginController)
    app.post('/refresh', refreshController)
    app.post('/google-login', googleLoginController)
}
