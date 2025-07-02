import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider } from '../auth/AuthProvider'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from '@/components/ui/sonner';


const envGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID


export const Route = createRootRoute({

    component: () => (
        <GoogleOAuthProvider clientId={envGoogleClientId}>
            <AuthProvider>
                <Toaster />

                <Outlet />
                <TanStackRouterDevtools />
            </AuthProvider>
        </GoogleOAuthProvider>
    ),
})