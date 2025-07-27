// // 'use client'
// // import { useState, useEffect } from 'react'
// // import { useAuth } from '@/context/AuthContext'
// // import { supabase } from '@/lib/supabase/supabaseClient'
// // import LoadingSpinner from '@/components/Loader'
// // import { FiSearch, FiAlertTriangle, FiCheckCircle, FiDollarSign, FiCalendar, FiUser } from 'react-icons/fi'

// // type Entreprise = {
// //   id: string
// //   raison_sociale: string
// //   nif: string
// //   forme_juridique: string
// //   secteur_activite: string
// //   date_creation: string
// //   email: string
// //   telephone: string
// //   devise: string
// //   logo_url?: string
// // }

// // type Declaration = {
// //   id: number
// //   type_impot: 'IPR' | 'IERE'
// //   periode: string
// //   date_declaration: string
// //   reference_dgi: string
// //   statut: 'en_attente' | 'validée' | 'payée'
// //   base_imposable_totale: number
// //   montant_impot_total: number
// //   nombre_employes: number
// //   devise: 'FC' | 'USD'
// //   montant_paye?: number
// //   date_paiement?: string
// //   numero_quittance?: string
// //   preuve_paiement?: string
// // }

// // type Employee = {
// //   id: number
// //   nom: string
// //   prenom: string
// //   nif: string
// //   salaire_brut: number
// //   date_embauche: string
// //   etranger: boolean
// // }

// // export default function IGFDashboard() {
// //   const { user } = useAuth()
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState('')
// //   const [entreprises, setEntreprises] = useState<Entreprise[]>([])
// //   const [searchTerm, setSearchTerm] = useState('')
// //   const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null)
// //   const [declarations, setDeclarations] = useState<Declaration[]>([])
// //   const [employees, setEmployees] = useState<Employee[]>([])
// //   const [validationStatus, setValidationStatus] = useState<Record<string, boolean>>({})

// //   // Vérifier le rôle de l'utilisateur
// //   useEffect(() => {
// //     const checkRole = async () => {
// //       if (!user) return
      
// //       try {
// //         setLoading(true)
// //         const { data, error } = await supabase
// //           .from('users')
// //           .select('role')
// //           .eq('id', user.id)
// //           .single()

// //         if (error) throw error

// //         if (data.role !== 'igf') {
// //           setError('Accès non autorisé')
// //         }
// //       } catch (err) {
// //         console.error('Erreur vérification rôle:', err)
// //         setError('Erreur de vérification des permissions')
// //       } finally {
// //         setLoading(false)
// //       }
// //     }

// //     checkRole()
// //   }, [user])

// //   // Charger toutes les entreprises
// //   useEffect(() => {
// //     if (error) return

// //     const fetchEntreprises = async () => {
// //       try {
// //         setLoading(true)
// //         const { data, error } = await supabase
// //           .from('entreprises')
// //           .select('id, raison_sociale, nif, forme_juridique, secteur_activite, date_creation, email, telephone, devise, logo_url')
// //           .order('raison_sociale', { ascending: true })

// //         if (error) throw error

// //         setEntreprises(data as Entreprise[])
        
// //         // Charger les statuts de validation
// //         const { data: validationData } = await supabase
// //           .from('igf_validations')
// //           .select('entreprise_id')
        
// //         const statusMap = validationData?.reduce((acc, curr) => {
// //           acc[curr.entreprise_id] = true
// //           return acc
// //         }, {} as Record<string, boolean>)

// //         setValidationStatus(statusMap || {})
// //       } catch (err) {
// //         console.error('Erreur chargement entreprises:', err)
// //         setError('Erreur lors du chargement des entreprises')
// //       } finally {
// //         setLoading(false)
// //       }
// //     }

// //     fetchEntreprises()
// //   }, [error])

// //   // Charger les données d'une entreprise sélectionnée
// //   useEffect(() => {
// //     if (!selectedEntreprise) return

// //     const fetchEntrepriseData = async () => {
// //       try {
// //         setLoading(true)
        
// //         // Charger les déclarations
// //         const { data: declData, error: declError } = await supabase
// //           .from('declarations')
// //           .select('*')
// //           .eq('employer_id', selectedEntreprise.id)
// //           .order('date_declaration', { ascending: false })

// //         if (declError) throw declError

// //         setDeclarations(declData as Declaration[])
        
// //         // Charger les employés
// //         const { data: empData, error: empError } = await supabase
// //           .from('employees')
// //           .select('id, nom, prenom, nif, salaire_brut, date_embauche, etranger')
// //           .eq('employer_id', selectedEntreprise.id)
// //           .order('nom', { ascending: true })

// //         if (empError) throw empError

// //         setEmployees(empData as Employee[])
// //       } catch (err) {
// //         console.error('Erreur chargement données entreprise:', err)
// //         setError('Erreur lors du chargement des données')
// //       } finally {
// //         setLoading(false)
// //       }
// //     }

// //     fetchEntrepriseData()
// //   }, [selectedEntreprise])

// //   // Filtrer les entreprises selon la recherche
// //   const filteredEntreprises = entreprises.filter(entreprise => 
// //     entreprise.raison_sociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //     entreprise.nif.toLowerCase().includes(searchTerm.toLowerCase())
// //   )

// //   // Valider une entreprise
// //   const validateEntreprise = async (entrepriseId: string) => {
// //     if (!user) return

// //     try {
// //       setLoading(true)
      
// //       const { error } = await supabase
// //         .from('igf_validations')
// //         .upsert({
// //           entreprise_id: entrepriseId,
// //           validated_by: user.id
// //         })

// //       if (error) throw error

// //       setValidationStatus(prev => ({
// //         ...prev,
// //         [entrepriseId]: true
// //       }))

// //       // Mettre à jour le statut des déclarations
// //       const { error: declError } = await supabase
// //         .from('declarations')
// //         .update({ statut: 'validée' })
// //         .eq('employer_id', entrepriseId)
// //         .eq('statut', 'payée')

// //       if (declError) throw declError

// //       // Recharger les déclarations
// //       if (selectedEntreprise?.id === entrepriseId) {
// //         const { data: declData } = await supabase
// //           .from('declarations')
// //           .select('*')
// //           .eq('employer_id', entrepriseId)
// //           .order('date_declaration', { ascending: false })

// //         setDeclarations(declData as Declaration[])
// //       }
// //     } catch (err) {
// //       console.error('Erreur validation entreprise:', err)
// //       setError('Erreur lors de la validation')
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // Calculer le total des impôts payés
// //   const totalTaxesPaid = declarations
// //     .filter(d => d.statut === 'payée' || d.statut === 'validée')
// //     .reduce((sum, decl) => sum + (decl.montant_paye || 0), 0)

// //   // Vérifier si toutes les déclarations sont validées
// //   const allDeclarationsValidated = declarations.length > 0 && 
// //     declarations.every(d => d.statut === 'validée')

// //   if (loading) return <LoadingSpinner />

// //   if (error) {
// //     return (
// //       <div className="max-w-4xl mx-auto p-4">
// //         <div className="bg-red-50 border-l-4 border-red-500 p-4">
// //           <div className="flex">
// //             <div className="flex-shrink-0">
// //               <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
// //                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
// //               </svg>
// //             </div>
// //             <div className="ml-3">
// //               <p className="text-sm text-red-700">{error}</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="max-w-7xl mx-auto p-4">
// //       <h1 className="text-2xl font-bold mb-6">Tableau de bord IGF</h1>
      
// //       {!selectedEntreprise ? (
// //         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
// //           <div className="p-4 border-b border-gray-200 bg-gray-50">
// //             <div className="relative">
// //               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                 <FiSearch className="text-gray-400" />
// //               </div>
// //               <input
// //                 type="text"
// //                 placeholder="Rechercher une entreprise par nom ou NIF..."
// //                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //               />
// //             </div>
// //           </div>

// //           <div className="overflow-x-auto">
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Entreprise
// //                   </th>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     NIF
// //                   </th>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Secteur
// //                   </th>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Statut
// //                   </th>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Actions
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody className="bg-white divide-y divide-gray-200">
// //                 {filteredEntreprises.map((entreprise) => (
// //                   <tr key={entreprise.id} className="hover:bg-gray-50">
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <div className="flex items-center">
// //                         {entreprise.logo_url ? (
// //                           <div className="flex-shrink-0 h-10 w-10">
// //                             <img className="h-10 w-10 rounded-full object-cover" src={entreprise.logo_url} alt="" />
// //                           </div>
// //                         ) : (
// //                           <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
// //                             <span className="text-gray-500 text-sm font-medium">
// //                               {entreprise.raison_sociale.charAt(0).toUpperCase()}
// //                             </span>
// //                           </div>
// //                         )}
// //                         <div className="ml-4">
// //                           <div className="text-sm font-medium text-gray-900">{entreprise.raison_sociale}</div>
// //                           <div className="text-sm text-gray-500">{entreprise.email}</div>
// //                         </div>
// //                       </div>
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <div className="text-sm text-gray-900">{entreprise.nif}</div>
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <div className="text-sm text-gray-500">{entreprise.secteur_activite}</div>
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       {validationStatus[entreprise.id] ? (
// //                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
// //                           <FiCheckCircle className="mr-1" /> Validée
// //                         </span>
// //                       ) : (
// //                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
// //                           <FiAlertTriangle className="mr-1" /> À valider
// //                         </span>
// //                       )}
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
// //                       <button
// //                         onClick={() => setSelectedEntreprise(entreprise)}
// //                         className="text-blue-600 hover:text-blue-900"
// //                       >
// //                         Voir détails
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       ) : (
// //         <div>
// //           <div className="flex items-center justify-between mb-6">
// //             <button
// //               onClick={() => setSelectedEntreprise(null)}
// //               className="flex items-center text-gray-600 hover:text-gray-900"
// //             >
// //               <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
// //               </svg>
// //               Retour à la liste
// //             </button>
// //             <h2 className="text-xl font-semibold">{selectedEntreprise.raison_sociale}</h2>
// //             <div>
// //               {validationStatus[selectedEntreprise.id] ? (
// //                 <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
// //                   <FiCheckCircle className="mr-1" /> Validée
// //                 </span>
// //               ) : (
// //                 <button
// //                   onClick={() => validateEntreprise(selectedEntreprise.id)}
// //                   className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
// //                 >
// //                   Valider cette entreprise
// //                 </button>
// //               )}
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
// //             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
// //               <div className="flex items-center">
// //                 <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
// //                   <FiDollarSign className="h-6 w-6" />
// //                 </div>
// //                 <div>
// //                   <p className="text-sm font-medium text-gray-500">Total impôts payés</p>
// //                   <p className="text-2xl font-semibold">
// //                     {totalTaxesPaid.toLocaleString()} {selectedEntreprise.devise}
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
// //               <div className="flex items-center">
// //                 <div className="p-3 rounded-full bg-green-50 text-green-600 mr-4">
// //                   <FiCalendar className="h-6 w-6" />
// //                 </div>
// //                 <div>
// //                   <p className="text-sm font-medium text-gray-500">Déclarations</p>
// //                   <p className="text-2xl font-semibold">{declarations.length}</p>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
// //               <div className="flex items-center">
// //                 <div className="p-3 rounded-full bg-purple-50 text-purple-600 mr-4">
// //                   <FiUser className="h-6 w-6" />
// //                 </div>
// //                 <div>
// //                   <p className="text-sm font-medium text-gray-500">Employés</p>
// //                   <p className="text-2xl font-semibold">{employees.length}</p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
// //               <div className="p-4 border-b border-gray-200 bg-gray-50">
// //                 <h3 className="font-medium">Déclarations fiscales</h3>
// //               </div>
// //               <div className="overflow-x-auto">
// //                 <table className="min-w-full divide-y divide-gray-200">
// //                   <thead className="bg-gray-50">
// //                     <tr>
// //                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Référence
// //                       </th>
// //                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Période
// //                       </th>
// //                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Montant
// //                       </th>
// //                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Statut
// //                       </th>
// //                     </tr>
// //                   </thead>
// //                   <tbody className="bg-white divide-y divide-gray-200">
// //                     {declarations.map((declaration) => (
// //                       <tr key={declaration.id}>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                           {declaration.reference_dgi}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                           {declaration.periode}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                           {declaration.montant_impot_total.toLocaleString()} {declaration.devise}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           {declaration.statut === 'validée' ? (
// //                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
// //                               Validée
// //                             </span>
// //                           ) : declaration.statut === 'payée' ? (
// //                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
// //                               Payée (en attente)
// //                             </span>
// //                           ) : (
// //                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
// //                               En attente
// //                             </span>
// //                           )}
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>

// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
// //               <div className="p-4 border-b border-gray-200 bg-gray-50">
// //                 <h3 className="font-medium">Informations financières</h3>
// //               </div>
// //               <div className="p-4">
// //                 <div className="space-y-4">
// //                   <div>
// //                     <h4 className="text-sm font-medium text-gray-500 mb-2">Validation complète</h4>
// //                     {allDeclarationsValidated ? (
// //                       <div className="flex items-center text-green-600">
// //                         <FiCheckCircle className="mr-2" />
// //                         <span>Toutes les déclarations sont validées</span>
// //                       </div>
// //                     ) : (
// //                       <div className="flex items-center text-yellow-600">
// //                         <FiAlertTriangle className="mr-2" />
// //                         <span>Certaines déclarations ne sont pas validées</span>
// //                       </div>
// //                     )}
// //                   </div>

// //                   <div>
// //                     <h4 className="text-sm font-medium text-gray-500 mb-2">Dernière déclaration</h4>
// //                     {declarations.length > 0 ? (
// //                       <p>
// //                         {new Date(declarations[0].date_declaration).toLocaleDateString()} -{' '}
// //                         {declarations[0].montant_impot_total.toLocaleString()} {declarations[0].devise}
// //                       </p>
// //                     ) : (
// //                       <p>Aucune déclaration trouvée</p>
// //                     )}
// //                   </div>

// //                   <div>
// //                     <h4 className="text-sm font-medium text-gray-500 mb-2">Masse salariale estimée</h4>
// //                     <p>
// //                       {employees.reduce((sum, emp) => sum + emp.salaire_brut, 0).toLocaleString()}{' '}
// //                       {selectedEntreprise.devise}
// //                     </p>
// //                   </div>

// //                   <div>
// //                     <h4 className="text-sm font-medium text-gray-500 mb-2">Employés étrangers</h4>
// //                     <p>
// //                       {employees.filter(emp => emp.etranger).length} / {employees.length}
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }
// 'use client'
// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { supabase } from '@/lib/supabase/supabaseClient'
// import LoadingSpinner from '@/components/Loader'
// import { FiSearch, FiAlertTriangle, FiCheckCircle, FiDollarSign, FiCalendar, FiUser, FiUsers, FiGlobe } from 'react-icons/fi'

// type Entreprise = {
//   id: string
//   raison_sociale: string
//   nif: string
//   forme_juridique: string
//   secteur_activite: string
//   date_creation: string
//   email: string
//   telephone: string
//   devise: string
//   logo_url?: string
// }

// type Declaration = {
//   id: number
//   type_impot: 'IPR' | 'IERE'
//   periode: string
//   date_declaration: string
//   reference_dgi: string
//   statut: 'en_attente' | 'validée' | 'payée'
//   base_imposable_totale: number
//   montant_impot_total: number
//   nombre_employes: number
//   devise: 'FC' | 'USD'
//   montant_paye?: number
//   date_paiement?: string
//   numero_quittance?: string
//   preuve_paiement?: string
// }

// type Employee = {
//   id: number
//   nom: string
//   prenom: string
//   nif: string
//   salaire_brut: number
//   date_embauche: string
//   etranger: boolean
//   actif: boolean
// }

// export default function IGFDashboard() {
//   const { user } = useAuth()
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [entreprises, setEntreprises] = useState<Entreprise[]>([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null)
//   const [declarations, setDeclarations] = useState<Declaration[]>([])
//   const [employees, setEmployees] = useState<Employee[]>([])
//   const [validationStatus, setValidationStatus] = useState<Record<string, boolean>>({})
//   const [activeTab, setActiveTab] = useState<'declarations' | 'employees'>('declarations')
//   const [showForeignOnly, setShowForeignOnly] = useState(false)

//   // Vérifier le rôle de l'utilisateur
//   useEffect(() => {
//     const checkRole = async () => {
//       if (!user) return
      
//       try {
//         setLoading(true)
//         const { data, error } = await supabase
//           .from('users')
//           .select('role')
//           .eq('id', user.id)
//           .single()

//         if (error) throw error

//         if (data.role !== 'igf') {
//           setError('Accès non autorisé')
//         }
//       } catch (err) {
//         console.error('Erreur vérification rôle:', err)
//         setError('Erreur de vérification des permissions')
//       } finally {
//         setLoading(false)
//       }
//     }

//     checkRole()
//   }, [user])

//   // Charger toutes les entreprises
//   useEffect(() => {
//     if (error) return

//     const fetchEntreprises = async () => {
//       try {
//         setLoading(true)
//         const { data, error } = await supabase
//           .from('entreprises')
//           .select('id, raison_sociale, nif, forme_juridique, secteur_activite, date_creation, email, telephone, devise, logo_url')
//           .order('raison_sociale', { ascending: true })

//         if (error) throw error

//         setEntreprises(data as Entreprise[])
        
//         // Charger les statuts de validation
//         const { data: validationData } = await supabase
//           .from('igf_validations')
//           .select('entreprise_id')
        
//         const statusMap = validationData?.reduce((acc, curr) => {
//           acc[curr.entreprise_id] = true
//           return acc
//         }, {} as Record<string, boolean>)

//         setValidationStatus(statusMap || {})
//       } catch (err) {
//         console.error('Erreur chargement entreprises:', err)
//         setError('Erreur lors du chargement des entreprises')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchEntreprises()
//   }, [error])

//   // Charger les données d'une entreprise sélectionnée
//   useEffect(() => {
//     if (!selectedEntreprise) return

//     const fetchEntrepriseData = async () => {
//       try {
//         setLoading(true)
        
//         // Charger les déclarations
//         const { data: declData, error: declError } = await supabase
//           .from('declarations')
//           .select('*')
//           .eq('employer_id', selectedEntreprise.id)
//           .order('date_declaration', { ascending: false })

//         if (declError) throw declError

//         setDeclarations(declData as Declaration[])
        
//         // Charger les employés
//         const { data: empData, error: empError } = await supabase
//           .from('employees')
//           .select('id, nom, prenom, nif, salaire_brut, date_embauche, etranger, actif')
//           .eq('employer_id', selectedEntreprise.id)
//           .order('nom', { ascending: true })

//         if (empError) throw empError

//         setEmployees(empData as Employee[])
//       } catch (err) {
//         console.error('Erreur chargement données entreprise:', err)
//         setError('Erreur lors du chargement des données')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchEntrepriseData()
//   }, [selectedEntreprise])

//   // Filtrer les entreprises selon la recherche
//   const filteredEntreprises = entreprises.filter(entreprise => 
//     entreprise.raison_sociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     entreprise.nif.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   // Filtrer les employés selon le filtre étranger
//   const filteredEmployees = showForeignOnly 
//     ? employees.filter(emp => emp.etranger)
//     : employees

//   // Valider une entreprise
//   const validateEntreprise = async (entrepriseId: string) => {
//     if (!user) return

//     try {
//       setLoading(true)
      
//       const { error } = await supabase
//         .from('igf_validations')
//         .upsert({
//           entreprise_id: entrepriseId,
//           validated_by: user.id
//         })

//       if (error) throw error

//       setValidationStatus(prev => ({
//         ...prev,
//         [entrepriseId]: true
//       }))

//       // Mettre à jour le statut des déclarations
//       const { error: declError } = await supabase
//         .from('declarations')
//         .update({ statut: 'validée' })
//         .eq('employer_id', entrepriseId)
//         .eq('statut', 'payée')

//       if (declError) throw declError

//       // Recharger les déclarations
//       if (selectedEntreprise?.id === entrepriseId) {
//         const { data: declData } = await supabase
//           .from('declarations')
//           .select('*')
//           .eq('employer_id', entrepriseId)
//           .order('date_declaration', { ascending: false })

//         setDeclarations(declData as Declaration[])
//       }
//     } catch (err) {
//       console.error('Erreur validation entreprise:', err)
//       setError('Erreur lors de la validation')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Calculer le total des impôts payés
//   const totalTaxesPaid = declarations
//     .filter(d => d.statut === 'payée' || d.statut === 'validée')
//     .reduce((sum, decl) => sum + (decl.montant_paye || 0), 0)

//   // Vérifier si toutes les déclarations sont validées
//   const allDeclarationsValidated = declarations.length > 0 && 
//     declarations.every(d => d.statut === 'validée')

//   if (loading) return <LoadingSpinner />

//   if (error) {
//     return (
//       <div className="max-w-4xl mx-auto p-4">
//         <div className="bg-red-50 border-l-4 border-red-500 p-4">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-red-700">{error}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Tableau de bord IGF</h1>
      
//       {!selectedEntreprise ? (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="p-4 border-b border-gray-200 bg-gray-50">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiSearch className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Rechercher une entreprise par nom ou NIF..."
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Entreprise
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     NIF
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Secteur
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Statut
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredEntreprises.map((entreprise) => (
//                   <tr key={entreprise.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         {entreprise.logo_url ? (
//                           <div className="flex-shrink-0 h-10 w-10">
//                             <img className="h-10 w-10 rounded-full object-cover" src={entreprise.logo_url} alt="" />
//                           </div>
//                         ) : (
//                           <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
//                             <span className="text-gray-500 text-sm font-medium">
//                               {entreprise.raison_sociale.charAt(0).toUpperCase()}
//                             </span>
//                           </div>
//                         )}
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{entreprise.raison_sociale}</div>
//                           <div className="text-sm text-gray-500">{entreprise.email}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{entreprise.nif}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-500">{entreprise.secteur_activite}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {validationStatus[entreprise.id] ? (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                           <FiCheckCircle className="mr-1" /> Validée
//                         </span>
//                       ) : (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                           <FiAlertTriangle className="mr-1" /> À valider
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <button
//                         onClick={() => setSelectedEntreprise(entreprise)}
//                         className="text-blue-600 hover:text-blue-900"
//                       >
//                         Voir détails
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div>
//           <div className="flex items-center justify-between mb-6">
//             <button
//               onClick={() => setSelectedEntreprise(null)}
//               className="flex items-center text-gray-600 hover:text-gray-900"
//             >
//               <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//               </svg>
//               Retour à la liste
//             </button>
//             <h2 className="text-xl font-semibold">{selectedEntreprise.raison_sociale}</h2>
//             <div>
//               {validationStatus[selectedEntreprise.id] ? (
//                 <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//                   <FiCheckCircle className="mr-1" /> Validée
//                 </span>
//               ) : (
//                 <button
//                   onClick={() => validateEntreprise(selectedEntreprise.id)}
//                   className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Valider cette entreprise
//                 </button>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//               <div className="flex items-center">
//                 <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
//                   <FiDollarSign className="h-6 w-6" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Total impôts payés</p>
//                   <p className="text-2xl font-semibold">
//                     {totalTaxesPaid.toLocaleString()} {selectedEntreprise.devise}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//               <div className="flex items-center">
//                 <div className="p-3 rounded-full bg-green-50 text-green-600 mr-4">
//                   <FiCalendar className="h-6 w-6" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Déclarations</p>
//                   <p className="text-2xl font-semibold">{declarations.length}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//               <div className="flex items-center">
//                 <div className="p-3 rounded-full bg-purple-50 text-purple-600 mr-4">
//                   <FiUser className="h-6 w-6" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Employés</p>
//                   <p className="text-2xl font-semibold">{employees.length}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Onglets */}
//           <div className="border-b border-gray-200 mb-6">
//             <nav className="-mb-px flex space-x-8">
//               <button
//                 onClick={() => setActiveTab('declarations')}
//                 className={`${activeTab === 'declarations' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
//               >
//                 <FiCalendar className="mr-2" />
//                 Déclarations
//               </button>
//               <button
//                 onClick={() => setActiveTab('employees')}
//                 className={`${activeTab === 'employees' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
//               >
//                 <FiUsers className="mr-2" />
//                 Employés
//               </button>
//             </nav>
//           </div>

//           {activeTab === 'declarations' ? (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="p-4 border-b border-gray-200 bg-gray-50">
//                   <h3 className="font-medium">Déclarations fiscales</h3>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Référence
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Période
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Montant
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Statut
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {declarations.map((declaration) => (
//                         <tr key={declaration.id}>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {declaration.reference_dgi}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {declaration.periode}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {declaration.montant_impot_total.toLocaleString()} {declaration.devise}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {declaration.statut === 'validée' ? (
//                               <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                                 Validée
//                               </span>
//                             ) : declaration.statut === 'payée' ? (
//                               <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
//                                 Payée (en attente)
//                               </span>
//                             ) : (
//                               <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                                 En attente
//                               </span>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="p-4 border-b border-gray-200 bg-gray-50">
//                   <h3 className="font-medium">Informations financières</h3>
//                 </div>
//                 <div className="p-4">
//                   <div className="space-y-4">
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-500 mb-2">Validation complète</h4>
//                       {allDeclarationsValidated ? (
//                         <div className="flex items-center text-green-600">
//                           <FiCheckCircle className="mr-2" />
//                           <span>Toutes les déclarations sont validées</span>
//                         </div>
//                       ) : (
//                         <div className="flex items-center text-yellow-600">
//                           <FiAlertTriangle className="mr-2" />
//                           <span>Certaines déclarations ne sont pas validées</span>
//                         </div>
//                       )}
//                     </div>

//                     <div>
//                       <h4 className="text-sm font-medium text-gray-500 mb-2">Dernière déclaration</h4>
//                       {declarations.length > 0 ? (
//                         <p>
//                           {new Date(declarations[0].date_declaration).toLocaleDateString()} -{' '}
//                           {declarations[0].montant_impot_total.toLocaleString()} {declarations[0].devise}
//                         </p>
//                       ) : (
//                         <p>Aucune déclaration trouvée</p>
//                       )}
//                     </div>

//                     <div>
//                       <h4 className="text-sm font-medium text-gray-500 mb-2">Masse salariale estimée</h4>
//                       <p>
//                         {employees.reduce((sum, emp) => sum + emp.salaire_brut, 0).toLocaleString()}{' '}
//                         {selectedEntreprise.devise}
//                       </p>
//                     </div>

//                     <div>
//                       <h4 className="text-sm font-medium text-gray-500 mb-2">Employés étrangers</h4>
//                       <p>
//                         {employees.filter(emp => emp.etranger).length} / {employees.length}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//               <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
//                 <h3 className="font-medium">Liste des employés</h3>
//                 <div className="flex items-center">
//                   <label htmlFor="foreign-filter" className="flex items-center cursor-pointer">
//                     <div className="relative">
//                       <input
//                         type="checkbox"
//                         id="foreign-filter"
//                         className="sr-only"
//                         checked={showForeignOnly}
//                         onChange={() => setShowForeignOnly(!showForeignOnly)}
//                       />
//                       <div className={`block w-14 h-8 rounded-full ${showForeignOnly ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
//                       <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${showForeignOnly ? 'transform translate-x-6' : ''}`}></div>
//                     </div>
//                     <div className="ml-3 text-gray-700 font-medium flex items-center">
//                       <FiGlobe className="mr-1" />
//                       Afficher les étrangers
//                     </div>
//                   </label>
//                 </div>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Nom & Prénom
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         NIF
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Salaire
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Statut
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Type
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredEmployees.length === 0 ? (
//                       <tr>
//                         <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
//                           {showForeignOnly 
//                             ? "Aucun employé étranger trouvé" 
//                             : "Aucun employé trouvé"}
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredEmployees.map((employee) => (
//                         <tr key={employee.id} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                                 <span className="text-gray-600 text-sm font-medium">
//                                   {employee.prenom.charAt(0)}{employee.nom.charAt(0)}
//                                 </span>
//                               </div>
//                               <div className="ml-4">
//                                 <div className="text-sm font-medium text-gray-900">
//                                   {employee.prenom} {employee.nom}
//                                 </div>
//                                 <div className="text-sm text-gray-500">
//                                   Embauché le {new Date(employee.date_embauche).toLocaleDateString()}
//                                 </div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm text-gray-900">
//                               {employee.nif || 'Non renseigné'}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm text-gray-900">
//                               {employee.salaire_brut.toLocaleString()} {selectedEntreprise.devise}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span
//                               className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                 employee.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                               }`}
//                             >
//                               {employee.actif ? 'Actif' : 'Inactif'}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {employee.etranger ? (
//                               <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
//                                 Étranger
//                               </span>
//                             ) : (
//                               <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
//                                 Local
//                               </span>
//                             )}
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }