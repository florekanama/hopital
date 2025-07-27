

'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { dgmSupabase } from '@/lib/supabase/dgmSupabaseClient'
import { FiSearch, FiEdit, FiEye, FiTrash2, FiChevronLeft, FiChevronRight, FiPlus, FiCheck, FiX } from 'react-icons/fi'
import VisaDetailModal from '@/components/VisaDetailModal'
import Image from 'next/image'
import Link from 'next/link'

type Visa = {
  id: string
  visa_number: string
  last_name: string
  first_name: string
  nationality: string
  visa_type: 'single_entry' | 'multiple_entry' | 'transit' | 'official'
  visa_category: 'tourist' | 'work' | 'student' | 'transit'
  expiration_date: string
  created_at: string
  photo_url: string | null
  issuing_country: string
  birth_date: string
  birth_place: string 
  issuing_place: string
  passport_number: string
  genre: 'Masculin' | 'Féminin'
  passport_issue_date: string
  duration_of_stay: string
  validate: boolean
}

const ITEMS_PER_PAGE = 8

export default function VisaListPage() {
  const { user } = useAuth()
  const [visas, setVisas] = useState<Visa[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedVisa, setSelectedVisa] = useState<Visa | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'all' | 'validated' | 'pending'>('all')

  useEffect(() => {
    const fetchVisas = async () => {
      try {
        setLoading(true)
        
        let query = dgmSupabase
          .from('visas')
          .select('*')
          .order('created_at', { ascending: false })

        // Filtre par statut de validation
        if (activeTab === 'validated') {
          query = query.eq('validate', true)
        } else if (activeTab === 'pending') {
          query = query.eq('validate', false)
        }

        if (filterType !== 'all') {
          query = query.eq('visa_type', filterType)
        }
        if (filterCategory !== 'all') {
          query = query.eq('visa_category', filterCategory)
        }

        const { data, error } = await query

        if (error) throw error
        setVisas(data || [])
      } catch (err) {
        console.error('Error fetching visas:', err)
        setError('Erreur lors du chargement des visas')
      } finally {
        setLoading(false)
      }
    }

    fetchVisas()
  }, [filterType, filterCategory, activeTab])

  const filteredVisas = visas.filter(visa => 
    visa.visa_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visa.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visa.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visa.nationality.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredVisas.length / ITEMS_PER_PAGE)
  const currentItems = filteredVisas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const getVisaTypeLabel = (type: string) => {
    switch(type) {
      case 'single_entry': return 'Entrée simple'
      case 'multiple_entry': return 'Multi-entrée'
      case 'transit': return 'Transit'
      case 'official': return 'Officiel'
      default: return type
    }
  }

  const getVisaCategoryLabel = (category: string) => {
    switch(category) {
      case 'tourist': return 'Tourisme'
      case 'work': return 'Travail'
      case 'student': return 'Étudiant'
      case 'transit': return 'Transit'
      default: return category
    }
  }

  const handleViewDetails = (visa: Visa) => {
    setSelectedVisa(visa)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedVisa(null)
  }

  const toggleValidation = async (visaId: string, currentStatus: boolean) => {
    try {
      const { error } = await dgmSupabase
        .from('visas')
        .update({ validate: !currentStatus })
        .eq('id', visaId)

      if (error) throw error

      // Mettre à jour l'état local
      setVisas(prev => prev.map(visa => 
        visa.id === visaId ? { ...visa, validate: !currentStatus } : visa
      ))
    } catch (err) {
      console.error('Error updating visa validation:', err)
      setError('Erreur lors de la mise à jour du visa')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 ">
          <div>
            {/* <h1 className="text-2xl font-bold text-gray-900">Gestion des visas</h1> */}
            <p className="text-gray-500 mt-1">Liste complète des visas enregistrés</p>
          </div>
          {/* <Link 
            href="/visas/create" 
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            Nouveau visa
          </Link> */}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* Onglets */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Tous les visas
            </button>
            <button
              onClick={() => setActiveTab('validated')}
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'validated' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Validés
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              En attente
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom, prénom, numéro..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de visa</label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous types</option>
                <option value="single_entry">Entrée simple</option>
                <option value="multiple_entry">Multi-entrée</option>
                <option value="transit">Transit</option>
                <option value="official">Officiel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes catégories</option>
                <option value="tourist">Tourisme</option>
                <option value="work">Travail</option>
                <option value="student">Étudiant</option>
                <option value="transit">Transit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 border-b border-red-100">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Visa list */}
              <div className="divide-y divide-gray-100">
                {currentItems.length > 0 ? (
                  currentItems.map((visa) => (
                    <div 
                      key={visa.id} 
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(visa)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-4">
                          {visa.photo_url ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 relative">
                              <Image
                                src={visa.photo_url}
                                alt={`${visa.last_name} ${visa.first_name}`}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              <span className="text-xs">N/A</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <h3 className="text-base font-medium text-gray-900">
                                {visa.last_name} {visa.first_name}
                                {visa.validate && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Validé
                                  </span>
                                )}
                              </h3>
                              <div className="flex items-center mt-1 text-sm text-gray-500 space-x-2">
                                <span>{visa.nationality}</span>
                                <span>•</span>
                                <span>{getVisaTypeLabel(visa.visa_type)}</span>
                                <span>•</span>
                                <span>{getVisaCategoryLabel(visa.visa_category)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                #{visa.visa_number}
                              </p>
                              <p className="text-sm text-gray-500">
                                Expire le {formatDate(visa.expiration_date)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4 flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleValidation(visa.id, visa.validate)
                            }}
                            className={`p-2 rounded-full ${visa.validate ? 'text-red-600 hover:text-red-800 hover:bg-red-50' : 'text-green-600 hover:text-green-800 hover:bg-green-50'}`}
                            title={visa.validate ? 'Invalider' : 'Valider'}
                          >
                            {visa.validate ? <FiX className="h-5 w-5" /> : <FiCheck className="h-5 w-5" />}
                          </button>
                          {/* <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewDetails(visa)
                            }}
                            className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                            title="Voir détails"
                          >
                            <FiEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50"
                            title="Modifier"
                          >
                            <FiEdit className="h-5 w-5" />
                          </button> */}
                        
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Aucun visa trouvé</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FiChevronLeft className="mr-1" />
                    Précédent
                  </button>
                  
                  <div className="hidden sm:flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <div className="sm:hidden text-sm text-gray-700">
                    Page {currentPage} sur {totalPages}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Suivant
                    <FiChevronRight className="ml-1" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedVisa && (
        <VisaDetailModal 
          visa={selectedVisa} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  )
}