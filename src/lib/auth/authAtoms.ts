import { atom } from 'jotai'

export type UserRole = 'admin' | 'medecin' | 'patient'

export interface User {
  id: string
  nom: string
  email: string
  role: UserRole
  profil_url: string | null
  statut: boolean
  date_creation: string
}

export const userAtom = atom<User | null>(null)
export const loadingAtom = atom<boolean>(true)