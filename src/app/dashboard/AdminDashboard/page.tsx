
//   )
// }
'use client'
import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'

export default function AdminDashboard() {
  const { user, signOut } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Charger les utilisateurs
  const loadUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('date_creation', { ascending: false })
      
      if (error) throw error
      setUsers(data)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  // Ouvrir le modal de modification
  const openEditModal = (user: any) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  // Fermer le modal
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  // Mettre à jour un utilisateur
  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from('users')
        .update({
          nom: editingUser.nom,
          email: editingUser.email,
          role: editingUser.role,
          statut: editingUser.statut
        })
        .eq('id', editingUser.id)

      if (error) throw error
      
      loadUsers()
      closeModal()
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setLoading(false)
    }
  }

  // Uploader une image de profil
  const uploadProfileImage = async (file: File) => {
    if (!editingUser) return

    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${editingUser.id}.${fileExt}`
      const filePath = `${editingUser.id}/${fileName}`

      // Supprimer l'ancienne image si elle existe
      if (editingUser.profil_url) {
        const oldFilePath = editingUser.profil_url.split('/').pop()
        await supabase.storage.from('profiles').remove([oldFilePath])
      }

      // Uploader la nouvelle image
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)

      // Mettre à jour l'utilisateur
      const { error: updateError } = await supabase
        .from('users')
        .update({ profil_url: publicUrl })
        .eq('id', editingUser.id)

      if (updateError) throw updateError

      // Mettre à jour l'affichage
      setEditingUser({ ...editingUser, profil_url: publicUrl })
      loadUsers()
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  // Basculer le statut actif/inactif
  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('users')
        .update({ statut: !currentStatus })
        .eq('id', userId)

      if (error) throw error
      
      loadUsers()
    } catch (error) {
      console.error('Error toggling user status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])
  // Fonction pour télécharger les données
  const downloadData = (format: 'json' | 'csv') => {
    if (users.length === 0) return

    let content: string
    let mimeType: string
    let extension: string

    if (format === 'json') {
      content = JSON.stringify(users, null, 2)
      mimeType = 'application/json'
      extension = 'json'
    } else {
      // Convertir en CSV
      const headers = Object.keys(users[0]).join(',')
      const rows = users.map(user => 
        Object.values(user).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
      )
      content = [headers, ...rows].join('\n')
      mimeType = 'text/csv'
      extension = 'csv'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `utilisateurs.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  return (
    <div className="min-h-screen ">
    
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
  <h3 className="text-lg leading-6 font-medium text-gray-900">
    Liste des utilisateurs
  </h3>
  <div className="flex space-x-2">
    <button
      onClick={() => downloadData('json')}
      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
    >
      Télécharger JSON
    </button>
    <button
      onClick={() => downloadData('csv')}
      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
    >
      Télécharger CSV
    </button>
  </div>
</div>
      <main className="max-w-7xl scrollbar-hide mx-auto ">
        <div className="px-4 py-6 sm:px-0 scrollbar-hide">
          <div className="bg-white scrollbar-hide shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Liste des utilisateurs
              </h3>
            </div>
            
            {loading ? (
              <div className="p-4 text-center">
                Chargement des utilisateurs...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Photo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y scrollbar-hide divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            {user.profil_url ? (
                              <Image
                                src={user.profil_url}
                                alt={`Photo de ${user.nom}`}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                                <span className="text-gray-500 text-xs">Pas de photo</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.nom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span 
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.statut ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.statut ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user.id, user.statut)}
                            className={`${
                              user.statut ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {user.statut ? 'Désactiver' : 'Activer'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de modification */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 bg-gray-600/20 backdrop-blur-lg bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">Modifier l'utilisateur</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Fermer</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={updateUser} className="mt-4 space-y-4">
                <div className="flex flex-col items-center">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4">
                    {editingUser.profil_url ? (
                      <Image
                        src={editingUser.profil_url}
                        alt={`Photo de ${editingUser.nom}`}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                        <span className="text-gray-500">Pas de photo</span>
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer bg-blue-50 text-blue-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100">
                    {uploading ? 'Téléchargement...' : 'Changer la photo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && uploadProfileImage(e.target.files[0])}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>

                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="nom"
                    value={editingUser.nom}
                    onChange={(e) => setEditingUser({...editingUser, nom: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Rôle
                  </label>
                  <select
                    id="role"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="admin">Admin</option>
                    <option value="medecin">Médecin</option>
                    <option value="patient">Patient</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="statut"
                    checked={editingUser.statut}
                    onChange={(e) => setEditingUser({...editingUser, statut: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="statut" className="ml-2 block text-sm text-gray-900">
                    Compte actif
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}