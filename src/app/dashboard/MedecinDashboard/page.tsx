'use client'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

export default function MedecinDashboard() {
  const { user, signOut } = useAuth()
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Fonction pour charger les patients
//   const loadPatients = async () => {
//     setLoading(true)
//     try {
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('role', 'patient')
      
//       if (error) throw error
      
//       setPatients(data)
//     } catch (error) {
//       console.error('Error loading patients:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     loadPatients()
//   }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      
      
      <main className="max-w-7xl mx-auto ">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Mes patients
              </h3>
            </div>
            
            {loading ? (
              <div className="p-4 text-center">Chargement des patients...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dernière consultation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {patient.nom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {/* Ici vous pourriez afficher la date de la dernière consultation */}
                          Non disponible
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Voir dossier
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            Nouvelle consultation
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
    </div>
  )
}