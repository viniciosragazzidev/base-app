import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../auth/useAuth'
import { useEffect, useState } from 'react'
import { getUsers, type User } from '../api/users'
import { toast } from 'sonner'
import { useToastFunc } from '@/utils/hooks/useToastFunc'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { logout } = useAuth()

  const handleLogout = () => {

    useToastFunc({ message: 'Deslogado com sucesso', func: () => logout(), type: 'success' })
  }



  return (
    <div className="p-4">
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}
