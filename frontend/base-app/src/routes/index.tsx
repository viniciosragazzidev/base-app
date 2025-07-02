import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../auth/useAuth'
import { useToastFunc } from '@/utils/hooks/useToastFunc'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { logout, isLoggedIn } = useAuth()

  const handleLogout = () => {

    useToastFunc({ message: 'Deslogado com sucesso', func: () => logout(), type: 'success' })
  }


  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = '/login'
    }
  }, [isLoggedIn])




  return (
    <div className="p-4">
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}
