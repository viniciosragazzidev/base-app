import { createContext, useState } from 'react'
import { logoutFunc } from '../api/client'
import { Navigate } from '@tanstack/react-router'

interface AuthContextType {
    isLoggedIn: boolean
    login: (tokens: { accessToken: string, refreshToken: string }) => void
    logout: () => void
}

export const AuthContext = createContext({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'))

    const login = ({ accessToken, refreshToken }: { accessToken: string, refreshToken: string }) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        setIsLoggedIn(true)
    }

    const logout = () => {
        localStorage.clear()

        setIsLoggedIn(false)

        logoutFunc()

        Navigate({ to: '/login' })

    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
