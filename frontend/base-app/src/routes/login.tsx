import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
    component: RouteComponent,
})

import { useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { GoogleLogin } from '@react-oauth/google'
import { toast } from 'sonner'
import { useToastFunc } from '@/utils/hooks/useToastFunc'

function RouteComponent() {
    const { login, isLoggedIn } = useAuth()

    if (isLoggedIn) {
        window.location.href = '/'
        return null
    }
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        if (res.ok) {
            const data = await res.json()

            const dataLogin = { accessToken: data.accessToken, refreshToken: data.refreshToken }
            useToastFunc({ message: 'Logado com sucesso', func: () => login(dataLogin), type: 'success' })
        } else {
            const data = await res.json()

            console.log(data.message);

            toast(data.message)
        }
    }

    return (
        <>

            <form onSubmit={handleSubmit}>
                <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input placeholder="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Entrar</button>
            </form>


            <GoogleLogin
                onSuccess={async (credentialResponse) => {
                    const idToken = credentialResponse.credential // ← É ISSO que vai pro backend!

                    const res = await fetch('/api/google-login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ idToken })
                    })

                    const data = await res.json()
                    // aqui você salva os tokens recebidos do backend

                    login({ accessToken: data.accessToken, refreshToken: data.refreshToken })
                }}
                onError={() => {
                    toast.error('Erro no login com Google')

                }}
            />

        </>



    )
}
