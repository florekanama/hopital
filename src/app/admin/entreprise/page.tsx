

// // 'use client'
// // import { useState, useEffect, useCallback } from 'react'
// // import { useAuth } from '@/context/AuthContext'
// // import { supabase } from '@/lib/supabase/supabaseClient'
// // import LoadingSpinner from '@/components/Loader'
// // import { useRouter } from 'next/navigation'
// // import { MagnifyingGlassIcon, XMarkIcon, BuildingOfficeIcon, CheckBadgeIcon, DocumentTextIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

// // type Entreprise = {
// //   id: string
// //   raison_sociale: string
// //   nif: string
// //   logo_url: string | null
// //   created_at: string
// //   ville: string
// //   email: string
// //   telephone: string
// //   secteur_activite: string
// //   forme_juridique: string
// // }

// // type Declaration = {
// //   id: number
// //   type_impot: 'IPR' | 'IERE'
// //   periode: string
// //   statut: 'en_attente' | 'validée' | 'payée'
// //   montant_impot_total: number
// //   devise: 'FC' | 'USD'
// //   created_at: string
// //   preuve_paiement: string | null
// //   montant_paye: number
// //   date_paiement: string | null
// //   numero_quittance: string | null
// // }

// // export default function AdminEntreprisesPage() {
// //   const { user } = useAuth()
// //   const router = useRouter()
// //   const [entreprises, setEntreprises] = useState<Entreprise[]>([])
// //   const [declarations, setDeclarations] = useState<Declaration[]>([])
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState('')
// //   const [success, setSuccess] = useState('')
// //   const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null)
// //   const [searchTerm, setSearchTerm] = useState('')
// //   const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
// //   const [currentPage, setCurrentPage] = useState(1)
// //   const [declarationsPerPage] = useState(5)
// //   const [viewingProof, setViewingProof] = useState<string | null>(null)

// //   // Vérification du rôle admin
// //   useEffect(() => {
// //     const checkAdmin = async () => {
// //       if (!user?.id) return
      
// //       try {
// //         const { data, error } = await supabase
// //           .from('profiles')
// //           .select('role')
// //           .eq('id', user.id)
// //           .single()

// //         if (error) throw error
// //         if (data.role !== 'gestionnaire') router.push('/')
// //       } catch (err) {
// //         console.error('Erreur vérification rôle:', err)
// //         router.push('/')
// //       }
// //     }

// //     checkAdmin()
// //   }, [user, router])

// //   // Fonction de recherche optimisée avec debounce
// //   const fetchEntreprises = useCallback(async (search: string = '') => {
// //     try {
// //       setLoading(true)
      
// //       let query = supabase
// //         .from('entreprises')
// //         .select(`
// //           id,
// //           raison_sociale,
// //           nif,
// //           logo_url,
// //           created_at,
// //           ville,
// //           email,
// //           telephone,
// //           secteur_activite,
// //           forme_juridique
// //         `)
// //         .order('created_at', { ascending: false })

// //       if (search) {
// //         query = query.or(`raison_sociale.ilike.%${search}%,nif.ilike.%${search}%`)
// //       }

// //       const { data, error } = await query

// //       if (error) throw error
// //       setEntreprises(data as Entreprise[])
// //     } catch (err) {
// //       console.error('Erreur chargement entreprises:', err)
// //       setError('Erreur lors du chargement des entreprises')
// //     } finally {
// //       setLoading(false)
// //     }
// //   }, [])

// //   // Gestion de la recherche avec debounce
// //   useEffect(() => {
// //     if (searchTimeout) clearTimeout(searchTimeout)
    
// //     setSearchTimeout(
// //       setTimeout(() => {
// //         fetchEntreprises(searchTerm)
// //       }, 300)
// //     )

// //     return () => {
// //       if (searchTimeout) clearTimeout(searchTimeout)
// //     }
// //   }, [searchTerm, fetchEntreprises])

// //   // Chargement des déclarations
// //   useEffect(() => {
// //     if (!selectedEntreprise?.id) return

// //     const fetchDeclarations = async () => {
// //       try {
// //         setLoading(true)
// //         const { data, error } = await supabase
// //           .from('declarations')
// //           .select(`
// //             id,
// //             type_impot,
// //             periode,
// //             statut,
// //             montant_impot_total,
// //             devise,
// //             created_at,
// //             preuve_paiement,
// //             montant_paye,
// //             date_paiement,
// //             numero_quittance
// //           `)
// //           .eq('employer_id', selectedEntreprise.id)
// //           .order('created_at', { ascending: false })

// //         if (error) throw error
// //         setDeclarations(data as Declaration[])
// //         setCurrentPage(1) // Reset à la première page quand on change d'entreprise
// //       } catch (err) {
// //         console.error('Erreur chargement déclarations:', err)
// //         setError('Erreur lors du chargement des déclarations')
// //       } finally {
// //         setLoading(false)
// //       }
// //     }

// //     fetchDeclarations()
// //   }, [selectedEntreprise])

// //   const validateDeclaration = async (declarationId: number) => {
// //     try {
// //       setLoading(true)
// //       setError('')

// //       const { error } = await supabase
// //         .from('declarations')
// //         .update({ 
// //           statut: 'validée',
// //           updated_at: new Date().toISOString()
// //         })
// //         .eq('id', declarationId)

// //       if (error) throw error

// //       setDeclarations(prev => 
// //         prev.map(decl => 
// //           decl.id === declarationId ? { ...decl, statut: 'validée' } : decl
// //         )
// //       )

// //       setSuccess('Déclaration validée avec succès!')
// //       setTimeout(() => setSuccess(''), 3000)
// //     } catch (err) {
// //       console.error('Erreur validation déclaration:', err)
// //       setError('Erreur lors de la validation')
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const getStatusColor = (statut: string) => {
// //     switch (statut) {
// //       case 'validée': return 'bg-green-100 text-green-800'
// //       case 'payée': return 'bg-blue-100 text-blue-800'
// //       default: return 'bg-gray-100 text-gray-800'
// //     }
// //   }

// //   // Pagination pour les déclarations
// //   const indexOfLastDeclaration = currentPage * declarationsPerPage
// //   const indexOfFirstDeclaration = indexOfLastDeclaration - declarationsPerPage
// //   const currentDeclarations = declarations.slice(indexOfFirstDeclaration, indexOfLastDeclaration)
// //   const totalPages = Math.ceil(declarations.length / declarationsPerPage)

// //   const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

// //   if (loading) return <LoadingSpinner />

// //   return (
// //     <div className="max-w-7xl mx-auto p-4 sm:p-6">
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
// //         <div>
// //           <h1 className="text-2xl font-bold text-gray-900">Gestion des Entreprises</h1>
// //           <p className="text-sm text-gray-500">Liste des entreprises enregistrées</p>
// //         </div>
        
// //         {/* Barre de recherche améliorée */}
// //         <div className="relative w-full sm:w-64">
// //           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //             <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
// //           </div>
// //           <input
// //             type="text"
// //             placeholder="Rechercher entreprise..."
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// //           />
// //           {searchTerm && (
// //             <button
// //               onClick={() => setSearchTerm('')}
// //               className="absolute inset-y-0 right-0 pr-3 flex items-center"
// //             >
// //               <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
// //             </button>
// //           )}
// //         </div>
// //       </div>

// //       {/* Messages d'alerte */}
// //       {error && (
// //         <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
// //           <XMarkIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
// //           <div>{error}</div>
// //         </div>
// //       )}
      
// //       {success && (
// //         <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start">
// //           <CheckBadgeIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
// //           <div>{success}</div>
// //         </div>
// //       )}

// //       {/* Liste des entreprises */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //         {entreprises.length === 0 ? (
// //           <div className="col-span-full text-center py-12">
// //             <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
// //             <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune entreprise trouvée</h3>
// //             <p className="mt-1 text-sm text-gray-500">{searchTerm ? 'Essayez une autre recherche' : 'Aucune entreprise enregistrée'}</p>
// //           </div>
// //         ) : (
// //           entreprises.map((entreprise) => (
// //             <div 
// //               key={entreprise.id} 
// //               className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
// //               onClick={() => setSelectedEntreprise(entreprise)}
// //             >
// //               <div className="p-4">
// //                 <div className="flex items-start space-x-4">
// //                   <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
// //                     {entreprise.logo_url ? (
// //                       <img
// //                         src={entreprise.logo_url}
// //                         alt={`Logo ${entreprise.raison_sociale}`}
// //                         className="h-full w-full object-cover"
// //                       />
// //                     ) : (
// //                       <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
// //                     )}
// //                   </div>
// //                   <div className="flex-1 min-w-0">
// //                     <h3 className="text-base font-medium text-gray-900 truncate group-hover:text-blue-600">
// //                       {entreprise.raison_sociale}
// //                     </h3>
// //                     <p className="text-sm text-gray-500 truncate">NIF: {entreprise.nif}</p>
// //                     <p className="text-sm text-gray-500 truncate">{entreprise.ville}</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>

// //       {/* Modal de détails */}
// //       {selectedEntreprise && (
// //         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
// //           <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
// //             <div className="p-6">
// //               <div className="flex justify-between items-start mb-6">
// //                 <div>
// //                   <h2 className="text-xl font-bold text-gray-900">{selectedEntreprise.raison_sociale}</h2>
// //                   <p className="text-gray-500">NIF: {selectedEntreprise.nif}</p>
// //                 </div>
// //                 <button 
// //                   onClick={() => {
// //                     setSelectedEntreprise(null)
// //                     setDeclarations([])
// //                     setViewingProof(null)
// //                   }}
// //                   className="text-gray-400 hover:text-gray-600 rounded-full p-1"
// //                 >
// //                   <XMarkIcon className="h-6 w-6" />
// //                 </button>
// //               </div>

// //               {viewingProof ? (
// //                 <div className="mb-8">
// //                   <button 
// //                     onClick={() => setViewingProof(null)}
// //                     className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
// //                   >
// //                     <ArrowLeftIcon className="h-5 w-5 mr-1" />
// //                     Retour aux déclarations
// //                   </button>
                  
// //                   <div className="border border-gray-200 rounded-lg p-4">
// //                     <h3 className="text-lg font-medium text-gray-900 mb-4">Preuve de paiement</h3>
// //                     {viewingProof.endsWith('.pdf') ? (
// //                       <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
// //                         <DocumentTextIcon className="h-16 w-16 text-gray-400 mb-4" />
// //                         <p className="text-gray-500 mb-4">Document PDF - Téléchargez pour visualiser</p>
// //                         <a 
// //                           href={viewingProof} 
// //                           target="_blank" 
// //                           rel="noopener noreferrer"
// //                           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// //                         >
// //                           Télécharger le PDF
// //                         </a>
// //                       </div>
// //                     ) : (
// //                       <img 
// //                         src={viewingProof} 
// //                         alt="Preuve de paiement" 
// //                         className="w-full h-auto rounded-lg border border-gray-200"
// //                       />
// //                     )}
// //                   </div>
// //                 </div>
// //               ) : (
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
// //                   <div>
// //                     <div className="flex items-start space-x-4 mb-6">
// //                       <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
// //                         {selectedEntreprise.logo_url ? (
// //                           <img
// //                             src={selectedEntreprise.logo_url}
// //                             alt={`Logo ${selectedEntreprise.raison_sociale}`}
// //                             className="h-full w-full object-cover"
// //                           />
// //                         ) : (
// //                           <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
// //                         )}
// //                       </div>
// //                       <div>
// //                         <h3 className="text-lg font-medium text-gray-900">{selectedEntreprise.raison_sociale}</h3>
// //                         <p className="text-sm text-gray-500">{selectedEntreprise.forme_juridique}</p>
// //                       </div>
// //                     </div>

// //                     <div className="space-y-3">
// //                       <div>
// //                         <h4 className="text-sm font-medium text-gray-500 mb-1">Secteur d'activité</h4>
// //                         <p className="text-sm">{selectedEntreprise.secteur_activite || 'Non spécifié'}</p>
// //                       </div>
                      
// //                       <div>
// //                         <h4 className="text-sm font-medium text-gray-500 mb-1">Localisation</h4>
// //                         <p className="text-sm">{selectedEntreprise.ville || 'Non spécifié'}</p>
// //                       </div>
                      
// //                       <div>
// //                         <h4 className="text-sm font-medium text-gray-500 mb-1">Coordonnées</h4>
// //                         <p className="text-sm">{selectedEntreprise.email}</p>
// //                         <p className="text-sm">{selectedEntreprise.telephone}</p>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   <div>
// //                     <h3 className="text-lg font-medium text-gray-900 mb-4">Déclarations</h3>
                    
// //                     {declarations.length === 0 ? (
// //                       <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
// //                         <p className="text-gray-500">Aucune déclaration trouvée</p>
// //                       </div>
// //                     ) : (
// //                       <div className="space-y-3">
// //                         {currentDeclarations.map((declaration) => (
// //                           <div key={declaration.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
// //                             <div className="flex justify-between items-start">
// //                               <div>
// //                                 <p className="font-medium text-gray-900">
// //                                   {declaration.type_impot} - {declaration.periode}
// //                                 </p>
// //                                 <p className="text-sm text-gray-500">
// //                                   {new Date(declaration.created_at).toLocaleDateString('fr-FR')}
// //                                 </p>
// //                               </div>
// //                               <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(declaration.statut)}`}>
// //                                 {declaration.statut.replace('_', ' ')}
// //                               </span>
// //                             </div>
// //                             <div className="mt-3">
// //                               <p className="text-sm font-medium">
// //                                 Montant: {declaration.montant_impot_total.toLocaleString()} {declaration.devise}
// //                               </p>
// //                               {declaration.statut === 'payée' && (
// //                                 <p className="text-sm">
// //                                   Payé: {declaration.montant_paye.toLocaleString()} {declaration.devise} le {declaration.date_paiement ? new Date(declaration.date_paiement).toLocaleDateString('fr-FR') : 'N/A'}
// //                                 </p>
// //                               )}
// //                             </div>
// //                             <div className="mt-3 flex justify-between items-center">
// //                               {declaration.preuve_paiement && (
// //                                 <button
// //                                   onClick={() => setViewingProof(declaration.preuve_paiement)}
// //                                   className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
// //                                 >
// //                                   <DocumentTextIcon className="h-4 w-4 mr-1" />
// //                                   Voir preuve
// //                                 </button>
// //                               )}
// //                               {declaration.statut === 'payée' ? (
// //                                 <button
// //                                   onClick={(e) => {
// //                                     e.stopPropagation()
// //                                     validateDeclaration(declaration.id)
// //                                   }}
// //                                   className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
// //                                   disabled={loading}
// //                                 >
// //                                   Valider
// //                                 </button>
// //                               ) : (
// //                                 <span className="text-sm text-gray-500">
// //                                   {declaration.statut === 'validée' ? 'Déjà validée' : 'En attente de paiement'}
// //                                 </span>
// //                               )}
// //                             </div>
// //                           </div>
// //                         ))}

// //                         {/* Pagination */}
// //                         {totalPages > 1 && (
// //                           <div className="flex items-center justify-between mt-4">
// //                             <button
// //                               onClick={() => paginate(currentPage - 1)}
// //                               disabled={currentPage === 1}
// //                               className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
// //                             >
// //                               <ArrowLeftIcon className="h-4 w-4 mr-1" />
// //                               Précédent
// //                             </button>
                            
// //                             <span className="text-sm text-gray-700">
// //                               Page {currentPage} sur {totalPages}
// //                             </span>
                            
// //                             <button
// //                               onClick={() => paginate(currentPage + 1)}
// //                               disabled={currentPage === totalPages}
// //                               className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
// //                             >
// //                               Suivant
// //                               <ArrowRightIcon className="h-4 w-4 ml-1" />
// //                             </button>
// //                           </div>
// //                         )}
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// 'use client'
// import { useState, useEffect, useCallback } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { supabase } from '@/lib/supabase/supabaseClient'
// import LoadingSpinner from '@/components/Loader'
// import { useRouter } from 'next/navigation'
// import { 
//   MagnifyingGlassIcon, XMarkIcon, BuildingOfficeIcon, 
//   CheckBadgeIcon, DocumentTextIcon,DocumentCheckIcon, ArrowLeftIcon, 
//   ArrowRightIcon, CalendarIcon, 
//   CurrencyDollarIcon
// } from '@heroicons/react/24/outline'

// type Entreprise = {
//   id: string
//   raison_sociale: string
//   nif: string
//   logo_url: string | null
//   created_at: string
//   ville: string
//   email: string
//   telephone: string
//   secteur_activite: string
//   forme_juridique: string
// }

// type Declaration = {
//   id: number
//   type_impot: 'IPR' | 'IERE'
//   periode: string
//   statut: 'en_attente' | 'validée' | 'payée'
//   montant_impot_total: number
//   devise: 'FC' | 'USD'
//   created_at: string
//   preuve_paiement: string | null
//   montant_paye: number
//   date_paiement: string | null
//   numero_quittance: string | null
//   employer_id?: string
// }

// export default function AdminEntreprisesPage() {
//   const { user } = useAuth()
//   const router = useRouter()
//   const [entreprises, setEntreprises] = useState<Entreprise[]>([])
//   const [declarations, setDeclarations] = useState<Declaration[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [declarationsPerPage] = useState(5)
//   const [viewingProof, setViewingProof] = useState<string | null>(null)
//   const [periodeFilter, setPeriodeFilter] = useState<string>('')
//  const [stats, setStats] = useState({
//     totalEntreprises: 0,
//     totalDeclarations: 0,
//     declarationsEnAttente: 0,
//     declarationsValidees: 0
//   })

//   const fetchStats = useCallback(async () => {
//     try {
//       // Nombre total d'entreprises
//       const { count: entreprisesCount } = await supabase
//         .from('entreprises')
//         .select('*', { count: 'exact' })

//       // Nombre total de déclarations
//       const { count: declarationsCount } = await supabase
//         .from('declarations')
//         .select('*', { count: 'exact' })

//       // Déclarations par statut
//       const { count: enAttenteCount } = await supabase
//         .from('declarations')
//         .select('*', { count: 'exact' })
//         .eq('statut', 'en_attente')

//       const { count: valideesCount } = await supabase
//         .from('declarations')
//         .select('*', { count: 'exact' })
//         .eq('statut', 'validée')

//       setStats({
//         totalEntreprises: entreprisesCount || 0,
//         totalDeclarations: declarationsCount || 0,
//         declarationsEnAttente: enAttenteCount || 0,
//         declarationsValidees: valideesCount || 0
//       })
//     } catch (err) {
//       console.error('Erreur chargement statistiques:', err)
//     }
//   }, [])

//   useEffect(() => {
//     fetchStats()
//   }, [fetchStats])

//   // Vérification du rôle admin
//   useEffect(() => {
//     const checkAdmin = async () => {
//       if (!user?.id) return
      
//       try {
//         const { data, error } = await supabase
//           .from('profiles')
//           .select('role')
//           .eq('id', user.id)
//           .single()

//         if (error) throw error
//         if (data.role !== 'gestionnaire') router.push('/')
//       } catch (err) {
//         console.error('Erreur vérification rôle:', err)
//         router.push('/')
//       }
//     }

//     checkAdmin()
//   }, [user, router])

//   // Charger les entreprises
//   const fetchEntreprises = useCallback(async (search: string = '') => {
//     try {
//       setLoading(true)
      
//       let query = supabase
//         .from('entreprises')
//         .select('*')
//         .order('created_at', { ascending: false })

//       if (search) {
//         query = query.or(`raison_sociale.ilike.%${search}%,nif.ilike.%${search}%`)
//       }

//       const { data, error } = await query

//       if (error) throw error
//       setEntreprises(data as Entreprise[])
//     } catch (err) {
//       console.error('Erreur chargement entreprises:', err)
//       setError('Erreur lors du chargement des entreprises')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   // Gestion de la recherche avec debounce
//   useEffect(() => {
//     if (searchTimeout) clearTimeout(searchTimeout)
    
//     setSearchTimeout(
//       setTimeout(() => {
//         fetchEntreprises(searchTerm)
//       }, 300)
//     )

//     return () => {
//       if (searchTimeout) clearTimeout(searchTimeout)
//     }
//   }, [searchTerm, fetchEntreprises])

//   // Charger les déclarations avec filtre
//   const fetchDeclarations = useCallback(async (entrepriseId: string) => {
//     try {
//       setLoading(true)
//       let query = supabase
//         .from('declarations')
//         .select('*')
//         .eq('employer_id', entrepriseId)
//         .order('created_at', { ascending: false })

//       if (periodeFilter) {
//         query = query.eq('periode', periodeFilter)
//       }

//       const { data, error } = await query

//       if (error) throw error
//       setDeclarations(data as Declaration[])
//       setCurrentPage(1)
//     } catch (err) {
//       console.error('Erreur chargement déclarations:', err)
//       setError('Erreur lors du chargement des déclarations')
//     } finally {
//       setLoading(false)
//     }
//   }, [periodeFilter])

//   // Lorsqu'une entreprise est sélectionnée
//   const handleSelectEntreprise = (entreprise: Entreprise) => {
//     setSelectedEntreprise(entreprise)
//     fetchDeclarations(entreprise.id)
//   }

//   const validateDeclaration = async (declarationId: number) => {
//     try {
//       setLoading(true)
//       setError('')

//       const { error } = await supabase
//         .from('declarations')
//         .update({ 
//           statut: 'validée',
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', declarationId)

//       if (error) throw error

//       setDeclarations(prev => 
//         prev.map(decl => 
//           decl.id === declarationId ? { ...decl, statut: 'validée' } : decl
//         )
//       )

//       setSuccess('Déclaration validée avec succès!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (err) {
//       console.error('Erreur validation déclaration:', err)
//       setError('Erreur lors de la validation')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getStatusColor = (statut: string) => {
//     switch (statut) {
//       case 'validée': return 'bg-green-100 text-green-800'
//       case 'payée': return 'bg-blue-100 text-blue-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   // Pagination
//   const indexOfLastDeclaration = currentPage * declarationsPerPage
//   const indexOfFirstDeclaration = indexOfLastDeclaration - declarationsPerPage
//   const currentDeclarations = declarations.slice(indexOfFirstDeclaration, indexOfLastDeclaration)
//   const totalPages = Math.ceil(declarations.length / declarationsPerPage)

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

//   if (loading) return <LoadingSpinner />

//   return (
//     <div className="max-w-7xl mx-auto p-4 sm:p-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Gestion des Entreprises</h1>
//           <p className="text-sm text-gray-500">Liste des entreprises enregistrées</p>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//         <StatCard 
//           icon={<BuildingOfficeIcon className="h-6 w-6 text-blue-500" />}
//           title="Entreprises"
//           value={stats.totalEntreprises}
//           trend="+5% ce mois"
//         />
//         <StatCard 
//           icon={<DocumentTextIcon className="h-6 w-6 text-green-500" />}
//           title="Déclarations"
//           value={stats.totalDeclarations}
//           trend="+12% ce mois"
//         />
//         <StatCard 
//           icon={<DocumentCheckIcon className="h-6 w-6 text-yellow-500" />}
//           title="En attente"
//           value={stats.declarationsEnAttente}
//           trend={stats.declarationsEnAttente > 0 ? "À traiter" : "À jour"}
//         />
//         <StatCard 
//           icon={<CurrencyDollarIcon className="h-6 w-6 text-purple-500" />}
//           title="Validées" 
//           value={stats.declarationsValidees}
//           trend={`${Math.round((stats.declarationsValidees / stats.totalDeclarations) * 100)}% taux`}
//         />
//       </div>

//         </div>
        
//         <div className="relative w-full sm:w-64">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Rechercher entreprise..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           />
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm('')}
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//             >
//               <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Filtre calendrier visible seulement quand une entreprise est sélectionnée */}
//       {selectedEntreprise && (
//         <div className="mb-6 flex justify-between items-center">
//           <h2 className="text-lg font-semibold text-gray-900">
//             Déclarations pour {selectedEntreprise.raison_sociale}
//           </h2>
//           <div className="relative w-48">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <CalendarIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="month"
//               value={periodeFilter}
//               onChange={(e) => {
//                 setPeriodeFilter(e.target.value)
//                 fetchDeclarations(selectedEntreprise.id)
//               }}
//               className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             />
//             {periodeFilter && (
//               <button
//                 onClick={() => {
//                   setPeriodeFilter('')
//                   fetchDeclarations(selectedEntreprise.id)
//                 }}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//               >
//                 <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Messages d'alerte */}
//       {error && (
//         <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
//           <XMarkIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
//           <div>{error}</div>
//         </div>
//       )}
      
//       {success && (
//         <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start">
//           <CheckBadgeIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
//           <div>{success}</div>
//         </div>
//       )}

//       {/* Liste des entreprises */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//         {entreprises.length === 0 ? (
//           <div className="col-span-full text-center py-12">
//             <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
//             <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune entreprise trouvée</h3>
//             <p className="mt-1 text-sm text-gray-500">
//               {searchTerm ? 'Essayez une autre recherche' : 'Aucune entreprise enregistrée'}
//             </p>
//           </div>
//         ) : (
//           entreprises.map((entreprise) => (
//             <div 
//               key={entreprise.id} 
//               className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
//               onClick={() => handleSelectEntreprise(entreprise)}
//             >
//               <div className="p-4">
//                 <div className="flex items-start space-x-4">
//                   <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
//                     {entreprise.logo_url ? (
//                       <img
//                         src={entreprise.logo_url}
//                         alt={`Logo ${entreprise.raison_sociale}`}
//                         className="h-full w-full object-cover"
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).style.display = 'none'
//                         }}
//                       />
//                     ) : (
//                       <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-base font-medium text-gray-900 truncate group-hover:text-blue-600">
//                       {entreprise.raison_sociale}
//                     </h3>
//                     <p className="text-sm text-gray-500 truncate">NIF: {entreprise.nif}</p>
//                     <p className="text-sm text-gray-500 truncate">{entreprise.ville}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Liste des déclarations */}
//       {selectedEntreprise && (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
//           {declarations.length === 0 ? (
//             <div className="text-center py-8">
//               <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="mt-2 text-sm font-medium text-gray-900">
//                 {periodeFilter 
//                   ? `Aucune déclaration pour ${periodeFilter}` 
//                   : 'Aucune déclaration trouvée'}
//               </h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 {periodeFilter ? 'Essayez une autre période' : ''}
//               </p>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-200">
//               {currentDeclarations.map((declaration) => (
//                 <div key={declaration.id} className="p-4 hover:bg-gray-50">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="font-medium text-gray-900">
//                         {declaration.type_impot} - {declaration.periode}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {new Date(declaration.created_at).toLocaleDateString('fr-FR')}
//                       </p>
//                     </div>
//                     <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(declaration.statut)}`}>
//                       {declaration.statut.replace('_', ' ')}
//                     </span>
//                   </div>
//                   <div className="mt-3">
//                     <p className="text-sm font-medium">
//                       Montant: {declaration.montant_impot_total.toLocaleString()} {declaration.devise}
//                     </p>
//                     {declaration.statut === 'payée' && (
//                       <p className="text-sm">
//                         Payé: {declaration.montant_paye.toLocaleString()} {declaration.devise} le {declaration.date_paiement ? new Date(declaration.date_paiement).toLocaleDateString('fr-FR') : 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div className="mt-3 flex justify-between items-center">
//                     {declaration.preuve_paiement && (
//                       <button
//                         onClick={() => setViewingProof(declaration.preuve_paiement)}
//                         className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
//                       >
//                         <DocumentTextIcon className="h-4 w-4 mr-1" />
//                         Voir preuve
//                       </button>
//                     )}
//                     {declaration.statut === 'payée' ? (
//                       <button
//                         onClick={() => validateDeclaration(declaration.id)}
//                         className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                         disabled={loading}
//                       >
//                         Valider
//                       </button>
//                     ) : (
//                       <span className="text-sm text-gray-500">
//                         {declaration.statut === 'validée' ? 'Déjà validée' : 'En attente de paiement'}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
//               <button
//                 onClick={() => paginate(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <ArrowLeftIcon className="h-5 w-5 mr-1" />
//                 Précédent
//               </button>
//               <span className="text-sm text-gray-700">
//                 Page {currentPage} sur {totalPages}
//               </span>
//               <button
//                 onClick={() => paginate(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Suivant
//                 <ArrowRightIcon className="h-5 w-5 ml-1" />
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Modal pour la preuve de paiement */}
//       {viewingProof && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-6">
//                 <h2 className="text-xl font-bold text-gray-900">Preuve de paiement</h2>
//                 <button 
//                   onClick={() => setViewingProof(null)}
//                   className="text-gray-400 hover:text-gray-600 rounded-full p-1"
//                 >
//                   <XMarkIcon className="h-6 w-6" />
//                 </button>
//               </div>
              
//               <div className="border border-gray-200 rounded-lg p-4">
//                 {viewingProof.endsWith('.pdf') ? (
//                   <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
//                     <DocumentTextIcon className="h-16 w-16 text-gray-400 mb-4" />
//                     <p className="text-gray-500 mb-4">Document PDF - Téléchargez pour visualiser</p>
//                     <a 
//                       href={viewingProof} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                     >
//                       Télécharger le PDF
//                     </a>
//                   </div>
//                 ) : (
//                   <img 
//                     src={viewingProof} 
//                     alt="Preuve de paiement" 
//                     className="w-full h-auto rounded-lg border border-gray-200"
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// // Composant de carte statistique
// function StatCard({ icon, title, value, trend }: { 
//   icon: React.ReactNode, 
//   title: string, 
//   value: number, 
//   trend: string 
// }) {
//   return (
//     <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <div className="p-2 rounded-full bg-gray-50">
//             {icon}
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <p className="text-2xl font-semibold text-gray-900">{value}</p>
//           </div>
//         </div>
//         <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
//           {trend}
//         </span>
//       </div>
//     </div>
//   )
// }

// 'use client'
// import { useState, useEffect, useCallback } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { supabase } from '@/lib/supabase/supabaseClient'
// import LoadingSpinner from '@/components/Loader'
// import { useRouter } from 'next/navigation'
// import { 
//   MagnifyingGlassIcon, XMarkIcon, BuildingOfficeIcon, 
//   CheckBadgeIcon, DocumentTextIcon, DocumentCheckIcon, ArrowLeftIcon, 
//   ArrowRightIcon, CalendarIcon, 
//   CurrencyDollarIcon, ArrowDownTrayIcon
// } from '@heroicons/react/24/outline'

// type Entreprise = {
//   id: string
//   raison_sociale: string
//   nif: string
//   logo_url: string | null
//   created_at: string
//   ville: string
//   email: string
//   telephone: string
//   secteur_activite: string
//   forme_juridique: string
// }

// type Declaration = {
//   id: number
//   type_impot: 'IPR' | 'IERE'
//   periode: string
//   statut: 'en_attente' | 'validée' | 'payée'
//   montant_impot_total: number
//   devise: 'FC' | 'USD'
//   created_at: string
//   preuve_paiement: string | null
//   montant_paye: number
//   date_paiement: string | null
//   numero_quittance: string | null
//   employer_id?: string
// }

// export default function AdminEntreprisesPage() {
//   const { user } = useAuth()
//   const router = useRouter()
//   const [entreprises, setEntreprises] = useState<Entreprise[]>([])
//   const [declarations, setDeclarations] = useState<Declaration[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [declarationsPerPage] = useState(5)
//   const [viewingProof, setViewingProof] = useState<string | null>(null)
//   const [periodeFilter, setPeriodeFilter] = useState<string>('')
//   const [stats, setStats] = useState({
//     totalEntreprises: 0,
//     totalDeclarations: 0,
//     declarationsEnAttente: 0,
//     declarationsValidees: 0
//   })

//   // Fonction pour télécharger un fichier
//   const downloadFile = async (fileUrl: string) => {
//     try {
//       // Extraire le chemin du fichier à partir de l'URL
//       const filePath = fileUrl.split('/').slice(-2).join('/')
//       const fileName = filePath.split('/').pop() || 'preuve_paiement'

//       const { data, error } = await supabase.storage
//         .from('declaration_paiements')
//         .download(filePath)

//       if (error) throw error

//       const url = window.URL.createObjectURL(data)
//       const link = document.createElement('a')
//       link.href = url
//       link.setAttribute('download', fileName)
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//     } catch (err) {
//       console.error('Erreur de téléchargement:', err)
//       setError('Erreur lors du téléchargement du fichier')
//     }
//   }

//   // Fonction pour obtenir l'URL publique ou signée
//   const getFileUrl = async (path: string | null) => {
//     if (!path) return null
    
//     try {
//       // Si c'est déjà une URL complète (comme pour les logos)
//       if (path.startsWith('http')) {
//         return path
//       }

//       // Générer une URL signée pour les fichiers dans le bucket privé
//       const { data } = await supabase.storage
//         .from('declaration_paiements')
//         .createSignedUrl(path, 3600) // URL valide 1 heure

//       return data?.signedUrl || null
//     } catch (error) {
//       console.error('Erreur génération URL:', error)
//       return null
//     }
//   }

//   // Gestion de l'affichage des preuves
//   const handleViewProof = async (path: string | null) => {
//     if (!path) return
    
//     try {
//       const url = await getFileUrl(path)
//       if (url) {
//         setViewingProof(url)
//       } else {
//         setError('Impossible de charger la preuve de paiement')
//       }
//     } catch (err) {
//       console.error('Erreur affichage preuve:', err)
//       setError('Erreur lors du chargement de la preuve')
//     }
//   }

//   const fetchStats = useCallback(async () => {
//     try {
//       // Nombre total d'entreprises
//       const { count: entreprisesCount } = await supabase
//         .from('entreprises')
//         .select('*', { count: 'exact' })

//       // Nombre total de déclarations
//       const { count: declarationsCount } = await supabase
//         .from('declarations')
//         .select('*', { count: 'exact' })

//       // Déclarations par statut
//       const { count: enAttenteCount } = await supabase
//         .from('declarations')
//         .select('*', { count: 'exact' })
//         .eq('statut', 'en_attente')

//       const { count: valideesCount } = await supabase
//         .from('declarations')
//         .select('*', { count: 'exact' })
//         .eq('statut', 'validée')

//       setStats({
//         totalEntreprises: entreprisesCount || 0,
//         totalDeclarations: declarationsCount || 0,
//         declarationsEnAttente: enAttenteCount || 0,
//         declarationsValidees: valideesCount || 0
//       })
//     } catch (err) {
//       console.error('Erreur chargement statistiques:', err)
//     }
//   }, [])

//   useEffect(() => {
//     fetchStats()
//   }, [fetchStats])

//   // Vérification du rôle admin
//   useEffect(() => {
//     const checkAdmin = async () => {
//       if (!user?.id) return
      
//       try {
//         const { data, error } = await supabase
//           .from('profiles')
//           .select('role')
//           .eq('id', user.id)
//           .single()

//         if (error) throw error
//         if (data.role !== 'gestionnaire') router.push('/')
//       } catch (err) {
//         console.error('Erreur vérification rôle:', err)
//         router.push('/')
//       }
//     }

//     checkAdmin()
//   }, [user, router])

//   // Charger les entreprises
//   const fetchEntreprises = useCallback(async (search: string = '') => {
//     try {
//       setLoading(true)
      
//       let query = supabase
//         .from('entreprises')
//         .select('*')
//         .order('created_at', { ascending: false })

//       if (search) {
//         query = query.or(`raison_sociale.ilike.%${search}%,nif.ilike.%${search}%`)
//       }

//       const { data, error } = await query

//       if (error) throw error
//       setEntreprises(data as Entreprise[])
//     } catch (err) {
//       console.error('Erreur chargement entreprises:', err)
//       setError('Erreur lors du chargement des entreprises')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   // Gestion de la recherche avec debounce
//   useEffect(() => {
//     if (searchTimeout) clearTimeout(searchTimeout)
    
//     setSearchTimeout(
//       setTimeout(() => {
//         fetchEntreprises(searchTerm)
//       }, 300)
//     )

//     return () => {
//       if (searchTimeout) clearTimeout(searchTimeout)
//     }
//   }, [searchTerm, fetchEntreprises])

//   // Charger les déclarations avec filtre
//   const fetchDeclarations = useCallback(async (entrepriseId: string) => {
//     try {
//       setLoading(true)
//       let query = supabase
//         .from('declarations')
//         .select('*')
//         .eq('employer_id', entrepriseId)
//         .order('created_at', { ascending: false })

//       if (periodeFilter) {
//         query = query.eq('periode', periodeFilter)
//       }

//       const { data, error } = await query

//       if (error) throw error
//       setDeclarations(data as Declaration[])
//       setCurrentPage(1)
//     } catch (err) {
//       console.error('Erreur chargement déclarations:', err)
//       setError('Erreur lors du chargement des déclarations')
//     } finally {
//       setLoading(false)
//     }
//   }, [periodeFilter])

//   // Lorsqu'une entreprise est sélectionnée
//   const handleSelectEntreprise = (entreprise: Entreprise) => {
//     setSelectedEntreprise(entreprise)
//     fetchDeclarations(entreprise.id)
//   }

//   const validateDeclaration = async (declarationId: number) => {
//     try {
//       setLoading(true)
//       setError('')

//       const { error } = await supabase
//         .from('declarations')
//         .update({ 
//           statut: 'validée',
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', declarationId)

//       if (error) throw error

//       setDeclarations(prev => 
//         prev.map(decl => 
//           decl.id === declarationId ? { ...decl, statut: 'validée' } : decl
//         )
//       )

//       setSuccess('Déclaration validée avec succès!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (err) {
//       console.error('Erreur validation déclaration:', err)
//       setError('Erreur lors de la validation')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getStatusColor = (statut: string) => {
//     switch (statut) {
//       case 'validée': return 'bg-green-100 text-green-800'
//       case 'payée': return 'bg-blue-100 text-blue-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   // Pagination
//   const indexOfLastDeclaration = currentPage * declarationsPerPage
//   const indexOfFirstDeclaration = indexOfLastDeclaration - declarationsPerPage
//   const currentDeclarations = declarations.slice(indexOfFirstDeclaration, indexOfLastDeclaration)
//   const totalPages = Math.ceil(declarations.length / declarationsPerPage)

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

//   if (loading) return <LoadingSpinner />

//   return (
//     <div className="max-w-7xl mx-auto p-4 sm:p-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Gestion des Entreprises</h1>
//           <p className="text-sm text-gray-500">Liste des entreprises enregistrées</p>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//         <StatCard 
//           icon={<BuildingOfficeIcon className="h-6 w-6 text-blue-500" />}
//           title="Entreprises"
//           value={stats.totalEntreprises}
//           trend="+5% ce mois"
//         />
//         <StatCard 
//           icon={<DocumentTextIcon className="h-6 w-6 text-green-500" />}
//           title="Déclarations"
//           value={stats.totalDeclarations}
//           trend="+12% ce mois"
//         />
//         <StatCard 
//           icon={<DocumentCheckIcon className="h-6 w-6 text-yellow-500" />}
//           title="En attente"
//           value={stats.declarationsEnAttente}
//           trend={stats.declarationsEnAttente > 0 ? "À traiter" : "À jour"}
//         />
//         <StatCard 
//           icon={<CurrencyDollarIcon className="h-6 w-6 text-purple-500" />}
//           title="Validées" 
//           value={stats.declarationsValidees}
//           trend={`${Math.round((stats.declarationsValidees / stats.totalDeclarations) * 100)}% taux`}
//         />
//       </div>

//         </div>
        
//         <div className="relative w-full sm:w-64">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Rechercher entreprise..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           />
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm('')}
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//             >
//               <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Filtre calendrier visible seulement quand une entreprise est sélectionnée */}
//       {selectedEntreprise && (
//         <div className="mb-6 flex justify-between items-center">
//           <h2 className="text-lg font-semibold text-gray-900">
//             Déclarations pour {selectedEntreprise.raison_sociale}
//           </h2>
//           <div className="relative w-48">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <CalendarIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="month"
//               value={periodeFilter}
//               onChange={(e) => {
//                 setPeriodeFilter(e.target.value)
//                 fetchDeclarations(selectedEntreprise.id)
//               }}
//               className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             />
//             {periodeFilter && (
//               <button
//                 onClick={() => {
//                   setPeriodeFilter('')
//                   fetchDeclarations(selectedEntreprise.id)
//                 }}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//               >
//                 <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Messages d'alerte */}
//       {error && (
//         <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
//           <XMarkIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
//           <div>{error}</div>
//         </div>
//       )}
      
//       {success && (
//         <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start">
//           <CheckBadgeIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
//           <div>{success}</div>
//         </div>
//       )}

//       {/* Liste des entreprises */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//         {entreprises.length === 0 ? (
//           <div className="col-span-full text-center py-12">
//             <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
//             <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune entreprise trouvée</h3>
//             <p className="mt-1 text-sm text-gray-500">
//               {searchTerm ? 'Essayez une autre recherche' : 'Aucune entreprise enregistrée'}
//             </p>
//           </div>
//         ) : (
//           entreprises.map((entreprise) => (
//             <div 
//               key={entreprise.id} 
//               className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
//               onClick={() => handleSelectEntreprise(entreprise)}
//             >
//               <div className="p-4">
//                 <div className="flex items-start space-x-4">
//                   <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
//                     {entreprise.logo_url ? (
//                       <img
//                         src={entreprise.logo_url}
//                         alt={`Logo ${entreprise.raison_sociale}`}
//                         className="h-full w-full object-cover"
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).style.display = 'none'
//                         }}
//                       />
//                     ) : (
//                       <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-base font-medium text-gray-900 truncate group-hover:text-blue-600">
//                       {entreprise.raison_sociale}
//                     </h3>
//                     <p className="text-sm text-gray-500 truncate">NIF: {entreprise.nif}</p>
//                     <p className="text-sm text-gray-500 truncate">{entreprise.ville}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Liste des déclarations */}
//       {selectedEntreprise && (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
//           {declarations.length === 0 ? (
//             <div className="text-center py-8">
//               <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="mt-2 text-sm font-medium text-gray-900">
//                 {periodeFilter 
//                   ? `Aucune déclaration pour ${periodeFilter}` 
//                   : 'Aucune déclaration trouvée'}
//               </h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 {periodeFilter ? 'Essayez une autre période' : ''}
//               </p>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-200">
//               {currentDeclarations.map((declaration) => (
//                 <div key={declaration.id} className="p-4 hover:bg-gray-50">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="font-medium text-gray-900">
//                         {declaration.type_impot} - {declaration.periode}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {new Date(declaration.created_at).toLocaleDateString('fr-FR')}
//                       </p>
//                     </div>
//                     <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(declaration.statut)}`}>
//                       {declaration.statut.replace('_', ' ')}
//                     </span>
//                   </div>
//                   <div className="mt-3">
//                     <p className="text-sm font-medium">
//                       Montant: {declaration.montant_impot_total.toLocaleString()} {declaration.devise}
//                     </p>
//                     {declaration.statut === 'payée' && (
//                       <p className="text-sm">
//                         Payé: {declaration.montant_paye.toLocaleString()} {declaration.devise} le {declaration.date_paiement ? new Date(declaration.date_paiement).toLocaleDateString('fr-FR') : 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div className="mt-3 flex justify-between items-center">
//                     {declaration.preuve_paiement && (
//                       <div className="flex space-x-2">
//                         {/* <button
//                           onClick={() => handleViewProof(declaration.preuve_paiement)}
//                           className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
//                         >
//                           <DocumentTextIcon className="h-4 w-4 mr-1" />
//                           Voir preuve
//                         </button> */}
//                         <button
//   onClick={() => declaration.preuve_paiement && downloadFile(declaration.preuve_paiement)}
//   className="flex items-center text-blue-600 cursor-pointer hover:text-gray-800 text-sm"
//   disabled={!declaration.preuve_paiement}
// >
//   <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
//   Télécharger
// </button>
//                       </div>
//                     )}
//                     {declaration.statut === 'payée' ? (
//                       <button
//                         onClick={() => validateDeclaration(declaration.id)}
//                         className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                         disabled={loading}
//                       >
//                         Valider
//                       </button>
//                     ) : (
//                       <span className="text-sm text-gray-500">
//                         {declaration.statut === 'validée' ? 'Déjà validée' : 'En attente de paiement'}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
//               <button
//                 onClick={() => paginate(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <ArrowLeftIcon className="h-5 w-5 mr-1" />
//                 Précédent
//               </button>
//               <span className="text-sm text-gray-700">
//                 Page {currentPage} sur {totalPages}
//               </span>
//               <button
//                 onClick={() => paginate(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Suivant
//                 <ArrowRightIcon className="h-5 w-5 ml-1" />
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Modal pour la preuve de paiement */}
//       {viewingProof && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-6">
//                 <h2 className="text-xl font-bold text-gray-900">Preuve de paiement</h2>
//                 <button 
//                   onClick={() => setViewingProof(null)}
//                   className="text-gray-400 hover:text-gray-600 rounded-full p-1"
//                 >
//                   <XMarkIcon className="h-6 w-6" />
//                 </button>
//               </div>
              
//               <div className="border border-gray-200 rounded-lg p-4">
//                 {viewingProof.endsWith('.pdf') ? (
//                   <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
//                     <DocumentTextIcon className="h-16 w-16 text-gray-400 mb-4" />
//                     <p className="text-gray-500 mb-4">Document PDF - Téléchargez pour visualiser</p>
//                     <div className="flex space-x-3">
//                       <a 
//                         href={viewingProof} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                       >
//                         Ouvrir
//                       </a>
//                       <button
//                         onClick={() => downloadFile(viewingProof)}
//                         className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//                       >
//                         <ArrowDownTrayIcon className="h-4 w-4 mr-1 inline" />
//                         Télécharger
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <img 
//                       src={viewingProof} 
//                       alt="Preuve de paiement" 
//                       className="w-full h-auto rounded-lg border border-gray-200 mb-4"
//                     />
//                     <button
//                       onClick={() => downloadFile(viewingProof)}
//                       className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//                     >
//                       <ArrowDownTrayIcon className="h-4 w-4 mr-1 inline" />
//                       Télécharger l'image
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// // Composant de carte statistique
// function StatCard({ icon, title, value, trend }: { 
//   icon: React.ReactNode, 
//   title: string, 
//   value: number, 
//   trend: string 
// }) {
//   return (
//     <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <div className="p-2 rounded-full bg-gray-50">
//             {icon}
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <p className="text-2xl font-semibold text-gray-900">{value}</p>
//           </div>
//         </div>
//         <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
//           {trend}
//         </span>
//       </div>
//     </div>
//   )
// }

'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase/supabaseClient'
import LoadingSpinner from '@/components/Loader'
import { useRouter } from 'next/navigation'
import { 
  MagnifyingGlassIcon, XMarkIcon, BuildingOfficeIcon, 
  CheckBadgeIcon, DocumentTextIcon, DocumentCheckIcon, ArrowLeftIcon, 
  ArrowRightIcon, CalendarIcon, 
  CurrencyDollarIcon, ArrowDownTrayIcon,
  Squares2X2Icon, UserGroupIcon
} from '@heroicons/react/24/outline'
import GestionnaireRoleRequestsPage from '../request/page'

type Entreprise = {
  id: string
  raison_sociale: string
  nif: string
  logo_url: string | null
  created_at: string
  ville: string
  email: string
  telephone: string
  secteur_activite: string
  forme_juridique: string
}

type Declaration = {
  id: number
  type_impot: 'IPR' | 'IERE'
  periode: string
  statut: 'en_attente' | 'validée' | 'payée'
  montant_impot_total: number
  devise: 'FC' | 'USD'
  created_at: string
  preuve_paiement: string | null
  montant_paye: number
  date_paiement: string | null
  numero_quittance: string | null
  employer_id?: string
}

type TabType = 'entreprises' | 'autre-vue'

export default function AdminEntreprisesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [declarations, setDeclarations] = useState<Declaration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [declarationsPerPage] = useState(5)
  const [viewingProof, setViewingProof] = useState<string | null>(null)
  const [periodeFilter, setPeriodeFilter] = useState<string>('')
  const [stats, setStats] = useState({
    totalEntreprises: 0,
    totalDeclarations: 0,
    declarationsEnAttente: 0,
    declarationsValidees: 0
  })
  const [activeTab, setActiveTab] = useState<TabType>('entreprises')

  // Fonction pour télécharger un fichier
  const downloadFile = async (fileUrl: string) => {
    try {
      // Extraire le chemin du fichier à partir de l'URL
      const filePath = fileUrl.split('/').slice(-2).join('/')
      const fileName = filePath.split('/').pop() || 'preuve_paiement'

      const { data, error } = await supabase.storage
        .from('declaration_paiements')
        .download(filePath)

      if (error) throw error

      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Erreur de téléchargement:', err)
      setError('Erreur lors du téléchargement du fichier')
    }
  }

  // Fonction pour obtenir l'URL publique ou signée
  const getFileUrl = async (path: string | null) => {
    if (!path) return null
    
    try {
      // Si c'est déjà une URL complète (comme pour les logos)
      if (path.startsWith('http')) {
        return path
      }

      // Générer une URL signée pour les fichiers dans le bucket privé
      const { data } = await supabase.storage
        .from('declaration_paiements')
        .createSignedUrl(path, 3600) // URL valide 1 heure

      return data?.signedUrl || null
    } catch (error) {
      console.error('Erreur génération URL:', error)
      return null
    }
  }

  // Gestion de l'affichage des preuves
  const handleViewProof = async (path: string | null) => {
    if (!path) return
    
    try {
      const url = await getFileUrl(path)
      if (url) {
        setViewingProof(url)
      } else {
        setError('Impossible de charger la preuve de paiement')
      }
    } catch (err) {
      console.error('Erreur affichage preuve:', err)
      setError('Erreur lors du chargement de la preuve')
    }
  }

  const fetchStats = useCallback(async () => {
    try {
      // Nombre total d'entreprises
      const { count: entreprisesCount } = await supabase
        .from('entreprises')
        .select('*', { count: 'exact' })

      // Nombre total de déclarations
      const { count: declarationsCount } = await supabase
        .from('declarations')
        .select('*', { count: 'exact' })

      // Déclarations par statut
      const { count: enAttenteCount } = await supabase
        .from('declarations')
        .select('*', { count: 'exact' })
        .eq('statut', 'en_attente')

      const { count: valideesCount } = await supabase
        .from('declarations')
        .select('*', { count: 'exact' })
        .eq('statut', 'validée')

      setStats({
        totalEntreprises: entreprisesCount || 0,
        totalDeclarations: declarationsCount || 0,
        declarationsEnAttente: enAttenteCount || 0,
        declarationsValidees: valideesCount || 0
      })
    } catch (err) {
      console.error('Erreur chargement statistiques:', err)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Vérification du rôle admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.id) return
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) throw error
        if (data.role !== 'gestionnaire') router.push('/')
      } catch (err) {
        console.error('Erreur vérification rôle:', err)
        router.push('/')
      }
    }

    checkAdmin()
  }, [user, router])

  // Charger les entreprises
  const fetchEntreprises = useCallback(async (search: string = '') => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('entreprises')
        .select('*')
        .order('created_at', { ascending: false })

      if (search) {
        query = query.or(`raison_sociale.ilike.%${search}%,nif.ilike.%${search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setEntreprises(data as Entreprise[])
    } catch (err) {
      console.error('Erreur chargement entreprises:', err)
      setError('Erreur lors du chargement des entreprises')
    } finally {
      setLoading(false)
    }
  }, [])

  // Gestion de la recherche avec debounce
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout)
    
    setSearchTimeout(
      setTimeout(() => {
        fetchEntreprises(searchTerm)
      }, 300)
    )

    return () => {
      if (searchTimeout) clearTimeout(searchTimeout)
    }
  }, [searchTerm, fetchEntreprises])

  // Charger les déclarations avec filtre
  const fetchDeclarations = useCallback(async (entrepriseId: string) => {
    try {
      setLoading(true)
      let query = supabase
        .from('declarations')
        .select('*')
        .eq('employer_id', entrepriseId)
        .order('created_at', { ascending: false })

      if (periodeFilter) {
        query = query.eq('periode', periodeFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setDeclarations(data as Declaration[])
      setCurrentPage(1)
    } catch (err) {
      console.error('Erreur chargement déclarations:', err)
      setError('Erreur lors du chargement des déclarations')
    } finally {
      setLoading(false)
    }
  }, [periodeFilter])

  // Lorsqu'une entreprise est sélectionnée
  const handleSelectEntreprise = (entreprise: Entreprise) => {
    setSelectedEntreprise(entreprise)
    fetchDeclarations(entreprise.id)
  }

  const validateDeclaration = async (declarationId: number) => {
    try {
      setLoading(true)
      setError('')

      const { error } = await supabase
        .from('declarations')
        .update({ 
          statut: 'validée',
          updated_at: new Date().toISOString()
        })
        .eq('id', declarationId)

      if (error) throw error

      setDeclarations(prev => 
        prev.map(decl => 
          decl.id === declarationId ? { ...decl, statut: 'validée' } : decl
        )
      )

      setSuccess('Déclaration validée avec succès!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Erreur validation déclaration:', err)
      setError('Erreur lors de la validation')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'validée': return 'bg-green-100 text-green-800'
      case 'payée': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Pagination
  const indexOfLastDeclaration = currentPage * declarationsPerPage
  const indexOfFirstDeclaration = indexOfLastDeclaration - declarationsPerPage
  const currentDeclarations = declarations.slice(indexOfFirstDeclaration, indexOfLastDeclaration)
  const totalPages = Math.ceil(declarations.length / declarationsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* En-tête avec titre et recherche */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center  gap-4">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1> */}
          <p className="text-sm text-gray-500">Gestion des Demande de rôle et validation de déclarations</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher entreprise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('entreprises')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'entreprises' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <Squares2X2Icon className="h-5 w-5 mr-2" />
            Gestion des entreprises
          </button>
          <button
            onClick={() => setActiveTab('autre-vue')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'autre-vue' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <UserGroupIcon className="h-5 w-5 mr-2" />
            Autre vue
          </button>
        </nav>
      </div>

      {/* Cartes statistiques - Responsive */}
    

      {/* Contenu des onglets */}
      {activeTab === 'entreprises' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={<BuildingOfficeIcon className="h-6 w-6 text-blue-500" />}
          title="Entreprises"
          value={stats.totalEntreprises}
          trend="+5% ce mois"
        />
        <StatCard 
          icon={<DocumentTextIcon className="h-6 w-6 text-green-500" />}
          title="Déclarations"
          value={stats.totalDeclarations}
          trend="+12% ce mois"
        />
        <StatCard 
          icon={<DocumentCheckIcon className="h-6 w-6 text-yellow-500" />}
          title="En attente"
          value={stats.declarationsEnAttente}
          trend={stats.declarationsEnAttente > 0 ? "À traiter" : "À jour"}
        />
        <StatCard 
  icon={<CurrencyDollarIcon className="h-6 w-6 text-purple-500" />}
  title="Validées" 
  value={stats.declarationsValidees}
  trend={
    stats.totalDeclarations > 0 
      ? `${Math.round((stats.declarationsValidees / stats.totalDeclarations) * 100)}% taux` 
      : "Aucune déclaration"
  }
/>
      </div>
          {/* Liste des entreprises */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {entreprises.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune entreprise trouvée</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Essayez une autre recherche' : 'Aucune entreprise enregistrée'}
                </p>
              </div>
            ) : (
              entreprises.map((entreprise) => (
                <div 
                  key={entreprise.id} 
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => handleSelectEntreprise(entreprise)}
                >
                  <div className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {entreprise.logo_url ? (
                          <img
                            src={entreprise.logo_url}
                            alt={`Logo ${entreprise.raison_sociale}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        ) : (
                          <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-900 truncate group-hover:text-blue-600">
                          {entreprise.raison_sociale}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">NIF: {entreprise.nif}</p>
                        <p className="text-sm text-gray-500 truncate">{entreprise.ville}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Liste des déclarations */}
          {selectedEntreprise && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Déclarations pour {selectedEntreprise.raison_sociale}
                  </h2>
                  <div className="relative w-full sm:w-48">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="month"
                      value={periodeFilter}
                      onChange={(e) => {
                        setPeriodeFilter(e.target.value)
                        fetchDeclarations(selectedEntreprise.id)
                      }}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {periodeFilter && (
                      <button
                        onClick={() => {
                          setPeriodeFilter('')
                          fetchDeclarations(selectedEntreprise.id)
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {declarations.length === 0 ? (
                <div className="text-center py-8">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {periodeFilter 
                      ? `Aucune déclaration pour ${periodeFilter}` 
                      : 'Aucune déclaration trouvée'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {periodeFilter ? 'Essayez une autre période' : ''}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {currentDeclarations.map((declaration) => (
                    <div key={declaration.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {declaration.type_impot} - {declaration.periode}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(declaration.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(declaration.statut)}`}>
                          {declaration.statut.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium">
                          Montant: {declaration.montant_impot_total.toLocaleString()} {declaration.devise}
                        </p>
                        {declaration.statut === 'payée' && (
                          <p className="text-sm">
                            Payé: {declaration.montant_paye.toLocaleString()} {declaration.devise} le {declaration.date_paiement ? new Date(declaration.date_paiement).toLocaleDateString('fr-FR') : 'N/A'}
                          </p>
                        )}
                      </div>
                      <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        {declaration.preuve_paiement && (
                          <button
                            onClick={() => declaration.preuve_paiement && downloadFile(declaration.preuve_paiement)}
                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                            Télécharger preuve
                          </button>
                        )}
                        {declaration.statut === 'payée' ? (
                          <button
                            onClick={() => validateDeclaration(declaration.id)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            disabled={loading}
                          >
                            Valider
                          </button>
                        ) : (
                          <span className="text-sm text-gray-500">
                            {declaration.statut === 'validée' ? 'Déjà validée' : 'En attente de paiement'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-1" />
                    Précédent
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                    <ArrowRightIcon className="h-5 w-5 ml-1" />
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 ">
          {/* <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Autre vue</h3>
            <p className="mt-1 text-sm text-gray-500">
              Vous pouvez ajouter ici un autre composant
            </p>
          </div> */}
          <GestionnaireRoleRequestsPage/>
        </div>
      )}

      {/* Messages d'alerte */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start shadow-lg max-w-sm">
            <XMarkIcon 
              className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 cursor-pointer" 
              onClick={() => setError('')} 
            />
            <div>{error}</div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start shadow-lg max-w-sm">
            <CheckBadgeIcon 
              className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 cursor-pointer" 
              onClick={() => setSuccess('')} 
            />
            <div>{success}</div>
          </div>
        </div>
      )}

      {/* Modal pour la preuve de paiement */}
      {viewingProof && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">Preuve de paiement</h2>
                <button 
                  onClick={() => setViewingProof(null)}
                  className="text-gray-400 hover:text-gray-600 rounded-full p-1"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                {viewingProof.endsWith('.pdf') ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                    <DocumentTextIcon className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">Document PDF - Téléchargez pour visualiser</p>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                      <a 
                        href={viewingProof} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
                      >
                        Ouvrir
                      </a>
                      <button
                        onClick={() => downloadFile(viewingProof)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center justify-center"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-1 inline" />
                        Télécharger
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <img 
                      src={viewingProof} 
                      alt="Preuve de paiement" 
                      className="w-full h-auto rounded-lg border border-gray-200 mb-4"
                    />
                    <button
                      onClick={() => downloadFile(viewingProof)}
                      className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center justify-center"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-1 inline" />
                      Télécharger l'image
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Composant de carte statistique amélioré pour le responsive
function StatCard({ icon, title, value, trend }: { 
  icon: React.ReactNode, 
  title: string, 
  value: number, 
  trend: string 
}) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm h-full">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-gray-50">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className="text-xl sm:text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 hidden sm:inline">
          {trend}
        </span>
      </div>
      <div className="mt-2 sm:hidden">
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
          {trend}
        </span>
      </div>
    </div>
  )
}