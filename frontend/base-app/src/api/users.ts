import { fetchWithAuth } from "./client"

export type User = {
    id: string
    name: string
    email: string
    role: string
}

export async function getUsers(): Promise<User[]> {
    const res = await fetchWithAuth('http://localhost:3000/api/users', {
        method: 'GET',
    })

    return res.data || res // depende da estrutura da resposta
}
