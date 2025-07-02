import { fetchWithAuth } from '@/api/client'
import type { User } from '@/api/users'
import { useAuth } from '@/auth/useAuth'
import { useToastFunc } from '@/utils/hooks/useToastFunc'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/users')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    window.location.href = '/login'
  }
  const [users, setUsers] = useState<User[]>([])
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user = await fetchWithAuth('/api/users', {
          method: 'GET'
        })

        setUsers(user)
        useToastFunc({ message: `Fetched ${user.length} users`, func: () => { }, type: 'success' })
      } catch (err: any
      ) {
        useToastFunc({ message: err.message, func: () => { }, type: 'error' })
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="p-4">
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} {user.role}</li>
        ))}
      </ul>
    </div>
  )
}
