'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminDashboard from './AdminDashboard/page'
import MedecinDashboard from './MedecinDashboard/page'
import PatientDashboard from './PatientDashboard/page'
import Loader from '@/components/Loader'
export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <Loader />
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />
    case 'medecin':
      return <MedecinDashboard />
    case 'patient':
      return <PatientDashboard />
    default:
      return <div>Rôle non reconnu</div>
  }
}