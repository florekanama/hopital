// app/profile/page.tsx
'use client'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, updateProfile, uploadProfileImage } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    email: user?.email || '',
  })
  const [imagePreview, setImagePreview] = useState(user?.profil_url || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!user) {
    router.push('/login')
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await updateProfile(formData)
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
      
      await uploadProfileImage(file)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white  rounded-lg overflow-hidden">
        {/* Header avec fond coloré */}
        <div className="bg-gradient-to-r rounded-2xl from-blue-600 to-teal-500 px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Mon Profil</h1>
            <span className="mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-medium bg text-gray-100">
              {user.role === 'admin' ? 'Administrateur' : 
               user.role === 'medecin' ? 'Médecin' : 'Patient'}
            </span>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Colonne gauche - Photo de profil */}
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt={`Photo de ${user.nom}`}
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                      <svg
                        className="h-20 w-20 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer group-hover:bg-blue-100 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <svg
                    className="w-5 h-5 text-gray-700 group-hover:text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
              </div>

              <div className="mt-6 text-center">
                <h2 className="text-xl font-bold text-gray-900">{user.nom}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="mt-1 text-sm text-gray-500">
                  Membre depuis {new Date(user.date_creation).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            {/* Colonne droite - Formulaire */}
            <div className="md:w-2/3">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="nom"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nom complet
                    </label>
                    <input
                      type="text"
                      name="nom"
                      id="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Adresse email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        loading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Enregistrement...
                        </>
                      ) : (
                        'Enregistrer les modifications'
                      )}
                    </button>
                  </div>
                </div>

                {success && (
                  <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-green-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Votre profil a été mis à jour avec succès
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}