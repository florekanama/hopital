
'use client'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import dynamic from 'next/dynamic'
import { Page, Text, View, Document, StyleSheet, Font} from '@react-pdf/renderer'
import { RendezVousPDF } from '@/components/RendezVousPDF'

interface RendezVous {
  id: string
  date_heure: string
  statut: string
  motif: string
  medecin: {
    nom: string
    specialite: string
  }
  patient: {
    nom: string
  }
}

interface MedecinOption {
  id: string
  nom: string
  specialite: string
}
const PDFDownloadButton = dynamic(
  () => import('@/components/PDFDownloadButton'),
  { 
    ssr: false,
    loading: () => <button disabled className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed">
      Préparation PDF...
    </button>
  }
)

export default function ListeRendezVous() {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [filtersApplied, setFiltersApplied] = useState(true);
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([])
  const [medecins, setMedecins] = useState<MedecinOption[]>([])
  const [filters, setFilters] = useState({
    medecinId: '',
    dateDebut: '',
    dateFin: '',
    statut: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  })

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    fetchMedecins()
    fetchRendezVous()
  }, [user, authLoading, router, pagination.page, filters])

  const fetchMedecins = async () => {
    try {
      // Récupérer d'abord les infos des médecins
      const { data: medecinsData, error: medecinsError } = await supabase
        .from('medecin_infos')
        .select('id, user_id, specialite_id')
      
      if (medecinsError) throw medecinsError
      if (!medecinsData) return

      // Récupérer les noms des utilisateurs
      const userIds = medecinsData.map(m => m.user_id)
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, nom')
        .in('id', userIds)
      
      if (usersError) throw usersError

      // Récupérer les spécialités
      const specialiteIds = medecinsData.map(m => m.specialite_id).filter(Boolean)
      const { data: specialitesData, error: specialitesError } = await supabase
        .from('specialites')
        .select('id, nom')
        .in('id', specialiteIds)
      
      if (specialitesError) throw specialitesError

      // Combiner les données
      const medecinsWithNames = medecinsData.map(medecin => {
        const user = usersData?.find(u => u.id === medecin.user_id)
        const specialite = specialitesData?.find(s => s.id === medecin.specialite_id)
        return {
          id: medecin.id,
          nom: user?.nom || 'Médecin inconnu',
          specialite: specialite?.nom || 'Non spécifiée'
        }
      })

      setMedecins(medecinsWithNames)
    } catch (error: any) {
      console.error('Erreur lors du chargement des médecins:', error)
      toast.error(`Erreur lors du chargement des médecins: ${error.message}`)
    }
  }

  const fetchRendezVous = async () => {
    try {
      setLoading(true); setFiltersApplied(false);
      
      let query = supabase
        .from('rendez_vous')
        .select(`
          id,
          date_heure,
          statut,
          motif,
          medecin_infos:medecin_id (
            id,
            user_id,
            specialite_id,
            users:user_id ( nom ),
            specialites:specialite_id ( nom )
          ),
          patient_infos:patient_id (
            id,
            user_id,
            users:user_id ( nom )
          )
        `, { count: 'exact' })
        .order('date_heure', { ascending: false })
        .range(
          (pagination.page - 1) * pagination.pageSize,
          pagination.page * pagination.pageSize - 1
        )

      // Appliquer les filtres
      if (filters.medecinId) {
        query = query.eq('medecin_id', filters.medecinId)
      }
      
      if (filters.dateDebut) {
        query = query.gte('date_heure', `${filters.dateDebut}T00:00:00`)
      }
      
      if (filters.dateFin) {
        query = query.lte('date_heure', `${filters.dateFin}T23:59:59`)
      }
      
      if (filters.statut) {
        query = query.eq('statut', filters.statut)
      }

      const { data, count, error } = await query

      if (error) throw error

      const formattedData = data?.map((item: any) => ({
        id: item.id,
        date_heure: item.date_heure,
        statut: item.statut,
        motif: item.motif,
        medecin: {
          nom: item.medecin_infos?.users?.nom || 'Médecin inconnu',
          specialite: item.medecin_infos?.specialites?.nom || 'Non spécifiée'
        },
        patient: {
          nom: item.patient_infos?.users?.nom || 'Patient inconnu'
        }
      })) || []

      setRendezVous(formattedData)
      setPagination(prev => ({ ...prev, total: count || 0 }))
    } catch (error: any) {
      console.error('Erreur lors du chargement des rendez-vous:', error)
      toast.error(`Erreur: ${error.message}`)
    } finally {
      setLoading(false);
       setTimeout(() => setFiltersApplied(true), 500); 
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const resetFilters = () => {
    setFilters({
      medecinId: '',
      dateDebut: '',
      dateFin: '',
      statut: ''
    })
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, 'PPpp', { locale: fr })
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'confirmé':
        return 'bg-green-100 text-green-800'
      case 'annulé':
        return 'bg-red-100 text-red-800'
      case 'terminé':
        return 'bg-blue-100 text-blue-800'
      case 'absent':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
const updateRdvStatus = async (rdvId: string, present: boolean) => {
  try {
    const { error } = await supabase
      .from('rendez_vous')
      .update({ 
        statut: present ? 'terminé' : 'absent',
        present 
      })
      .eq('id', rdvId)

    if (error) throw error

    toast.success('Statut mis à jour avec succès')
    fetchRendezVous() // Rafraîchir la liste
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour:', error)
    toast.error(`Erreur: ${error.message}`)
  }
}
  return (
    <div className="min-h-screen bg-gray-0 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="mt-2 text-lg text-gray-600">
            Consultez et gérez tous les rendez-vous programmés
          </p>
{/*          
{filtersApplied && !pdfLoading ? (
  <PDFDownloadLink
    document={<RendezVousPDF 
      rendezVous={rendezVous} 
      filters={filters} 
      medecins={medecins} 
    />}
    fileName={`rendez-vous_${format(new Date(), 'yyyy-MM-dd')}.pdf`}
    style={{ textDecoration: 'none' }}
  >
    {({ loading }) => (
      <button
        className={`px-4 py-2 text-white rounded-md transition-colors ${
          loading ? 'bg-green-500 cursor-wait' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Génération PDF...' : 'Télécharger PDF'}
      </button>
    )}
  </PDFDownloadLink>
) : (
  <button 
    disabled
    className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
  >
    {loading ? 'Application des filtres...' : 'Préparation PDF...'}
  </button>
)} */}
{filtersApplied && !pdfLoading ? (
  <PDFDownloadButton 
    rendezVous={rendezVous} 
    filters={filters} 
    medecins={medecins} 
  />
) : (
  <button 
    disabled
    className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
  >
    {loading ? 'Application des filtres...' : 'Préparation PDF...'}
  </button>
)}
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filtrer les rendez-vous</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Médecin</label>
              <select
                name="medecinId"
                value={filters.medecinId}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les médecins</option>
                {medecins.map(medecin => (
                  <option key={medecin.id} value={medecin.id}>
                    {medecin.nom} ({medecin.specialite})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
              <input
                type="date"
                name="dateDebut"
                value={filters.dateDebut}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
              <input
                type="date"
                name="dateFin"
                value={filters.dateFin}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                name="statut"
                value={filters.statut}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option value="planifié">Planifié</option>
                <option value="confirmé">Confirmé</option>
                <option value="annulé">Annulé</option>
                <option value="terminé">Terminé</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Réinitialiser
            </button>
            <button
              onClick={fetchRendezVous}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Appliquer
            </button>
          </div>
        </div>

        {/* Liste des rendez-vous */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : rendezVous.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun rendez-vous trouvé</h3>
                <p className="mt-1 text-sm text-gray-500">Aucun rendez-vous ne correspond à vos critères de recherche.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Heure
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Médecin
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Motif
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rendezVous.map((rdv) => (
                      <tr key={rdv.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDateTime(rdv.date_heure)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{rdv.medecin.nom}</div>
                          <div className="text-sm text-gray-500">{rdv.medecin.specialite}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{rdv.patient.nom}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{rdv.motif || 'Non spécifié'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(rdv.statut)}`}>
                            {rdv.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {rendezVous.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page * pagination.pageSize >= pagination.total}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">{(pagination.page - 1) * pagination.pageSize + 1}</span> à{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.pageSize, pagination.total)}
                    </span>{' '}
                    sur <span className="font-medium">{pagination.total}</span> résultats
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Précédent</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === Math.ceil(pagination.total / pagination.pageSize) ||
                        Math.abs(page - pagination.page) <= 2
                      )
                      .map((page, i, arr) => (
                        <React.Fragment key={page}>
                          {i > 0 && arr[i] - arr[i - 1] > 1 && (
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === pagination.page
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page * pagination.pageSize >= pagination.total}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Suivant</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}