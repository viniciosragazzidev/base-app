
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const accessToken = localStorage.getItem('accessToken')
    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    }

    let res = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
    })

    if (res.status === 401) {
        // Tenta refresh
        const refreshRes = await fetch('/api/refresh', {
            method: 'POST',
            credentials: 'include',
        })

        if (!refreshRes.ok) {
            console.warn('❌ Refresh token falhou, redirecionando pro login.')
            localStorage.removeItem('accessToken')
            window.location.href = '/login'
            return
        }

        const refreshData = await refreshRes.json()
        localStorage.setItem('accessToken', refreshData.accessToken)

        // Retry original request com novo token
        const retryRes = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                Authorization: `Bearer ${refreshData.accessToken}`
            },
            credentials: 'include',
        })

        return handleResponse(retryRes)
    }

    return handleResponse(res)
}
async function handleResponse(res: Response) {
    const isJson = res.headers.get('Content-Type')?.includes('application/json')
    const data = isJson ? await res.json() : null

    if (!res.ok) {
        const errorMessage = data?.message || 'Erro desconhecido'
        const status = res.status

        // Reage de acordo com status específico
        switch (status) {
            case 400:
                throw new Error(`Dados inválidos: ${errorMessage}`)
            case 401:
                throw new Error('Não autenticado.')
            case 403:
                throw new Error('Você não tem permissão para isso.')
            case 404:
                throw new Error('Recurso não encontrado.')
            case 500:
                throw new Error('Erro interno do servidor.')
            default:
                throw new Error(errorMessage)
        }
    }

    return data
}

export function logoutFunc() {
    localStorage.removeItem('accessToken')
    // refreshToken já está no cookie, então no logout o backend deve limpá-lo
    fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // pro backend conseguir limpar o cookie
    }).finally(() => {
        window.location.href = '/login'
    })
}
