'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function PatientDashboard() {
  // Type utilisateur directement dans le composant
  type User = {
    id: string
    nom: string
    email: string
    role: 'admin' | 'medecin' | 'patient'
    profil_url: string | null
    statut: boolean
  }

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Charger les données de l'utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) throw new Error('Non authentifié')

        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (error) throw error
        setUser(userData)
      } catch (error) {
        console.error('Erreur de chargement:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  // Mettre à jour le profil
 // Dans votre composant parent
const updateProfile = async (formData: Partial<User>): Promise<boolean> => {
  // 1. Vérification explicite que user existe
  if (!user) {
    console.error('Erreur: Aucun utilisateur connecté')
    return false
  }

  try {
    // 2. Mise à jour avec vérification des erreurs
    const { data, error } = await supabase
      .from('users')
      .update(formData)
      .eq('id', user.id) // Maintenant safe car user est vérifié
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Aucune donnée retournée')

    // 3. Mise à jour du state si nécessaire
    setUser(data)
    return true
  } catch (error) {
    console.error('Erreur de mise à jour:', error)
    return false
  }
}
  // Uploader une image de profil
  const uploadProfileImage = async (file: File): Promise<string | null> => {
    if (!user) return null

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)

      await updateProfile({ profil_url: publicUrl })
      return publicUrl
    } catch (error) {
      console.error('Erreur de téléchargement:', error)
      return null
    }
  }

  // Déconnexion
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Erreur de déconnexion:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Erreur de chargement du profil</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Patient</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Bonjour, {user.nom}</span>
            <button
              onClick={signOut}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <ProfileSection 
              user={user} 
              onUpdate={updateProfile} 
              onImageUpload={uploadProfileImage} 
            />
          </div>
        </div>
      </main>
    </div>
  )
}

// Composant ProfileSection intégré
function ProfileSection({ 
  user, 
  onUpdate,
  onImageUpload
}: {
  user: {
    id: string
    nom: string
    email: string
    role: 'admin' | 'medecin' | 'patient'
    profil_url: string | null
    statut: boolean
  }
  onUpdate: (formData: Partial<{
    id: string
    nom: string
    email: string
    role: 'admin' | 'medecin' | 'patient'
    profil_url: string | null
    statut: boolean
  }>) => Promise<boolean>
  onImageUpload: (file: File) => Promise<string | null>
}) {
  const [formData, setFormData] = useState({
    nom: user.nom,
    email: user.email,
  })
  const [imagePreview, setImagePreview] = useState(user.profil_url || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await onUpdate(formData)
      if (updated) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      await onImageUpload(file)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={imagePreview || '/default-profile.png'}
              alt="Photo de profil"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-300 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.nom}</h2>
            <p className="text-gray-600">Patient</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
            Nom complet
          </label>
          <input
            type="text"
            name="nom"
            id="nom"
            value={formData.nom}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Profil mis à jour avec succès
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}