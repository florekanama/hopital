// types.ts
export type UserRole = 'admin' | 'medecin' | 'patient'

export interface UserProfile {
  id: string
  nom: string
  email: string
  role: UserRole
  profil_url: string | null
  statut: boolean
  date_creation: string
}