
// 'use client'
// import { useState, useEffect } from 'react'
// import { supabase } from '@/lib/supabase/supabaseClient'
// import { useAuth } from '@/context/AuthContext'
// import { FiCheck, FiX, FiUser, FiBriefcase, FiShield, FiFileText, FiClock, FiMail, FiPhone, FiInfo } from 'react-icons/fi'

// interface Profile {
//   email: string
// }

// interface RoleRequestBase {
//   id: string
//   created_at: string
//   user_id: string
//   requested_role: string
//   phone_number: string
//   company_name: string | null
//   notes: string | null
//   status: 'pending' | 'approved' | 'rejected'
// }

// interface RoleRequest extends RoleRequestBase {
//   user_email: string
//   profiles?: { email: string }
// }

// export default function gestionnaireRoleRequestsPage() {
//   const { user: currentUser } = useAuth()
//   const [requests, setRequests] = useState<RoleRequest[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [pendingCount, setPendingCount] = useState(0)

//   useEffect(() => {
//     if (currentUser?.role !== 'gestionnaire') return

//     const fetchRequests = async () => {
//       try {
//         setLoading(true)
        
//         const { data, error } = await supabase
//           .from('role_requests')
//           .select(`*, profiles:user_id (email)`)
//           .order('created_at', { ascending: false })

//         if (error) throw error

//         const formattedData = data.map((req: any) => ({
//           ...req,
//           user_email: req.profiles.email
//         })) as RoleRequest[]

//         setRequests(formattedData)
//         setPendingCount(formattedData.filter(r => r.status === 'pending').length)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Erreur de chargement')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchRequests()

//     const subscription = supabase
//       .channel('role_requests_changes')
//       .on(
//         'postgres_changes',
//         { 
//           event: '*', 
//           schema: 'public', 
//           table: 'role_requests' 
//         },
//         async (payload) => {
//           try {
//             if (payload.eventType === 'INSERT') {
//               const { data } = await supabase
//                 .from('profiles')
//                 .select('email')
//                 .eq('id', payload.new.user_id)
//                 .single()

//               const newRequest = {
//                 ...payload.new,
//                 user_email: data?.email || '',
//                 company_name: payload.new.company_name || null,
//                 notes: payload.new.notes || null
//               } as RoleRequest

//               setRequests(prev => [newRequest, ...prev])
              
//               if (payload.new.status === 'pending') {
//                 setPendingCount(prev => prev + 1)
//               }
//             } 
//             else if (payload.eventType === 'UPDATE') {
//               setRequests(prev => prev.map(req => 
//                 req.id === payload.new.id ? { 
//                   ...req, 
//                   ...payload.new 
//                 } : req
//               ))

//               if (payload.old.status === 'pending' && payload.new.status !== 'pending') {
//                 setPendingCount(prev => prev - 1)
//               }
//             }
//           } catch (err) {
//             console.error('Error handling realtime update:', err)
//           }
//         }
//       )
//       .subscribe()

//     return () => {
//       supabase.removeChannel(subscription)
//     }
//   }, [currentUser])

//   const updateRequestStatus = async (requestId: string, status: 'approved' | 'rejected') => {
//     try {
//       setLoading(true)
      
//       const { error: updateError } = await supabase
//         .from('role_requests')
//         .update({ status })
//         .eq('id', requestId)

//       if (updateError) throw updateError

//       if (status === 'approved') {
//         const request = requests.find(r => r.id === requestId)
//         if (request) {
//           const { error: profileError } = await supabase
//             .from('profiles')
//             .update({ role: request.requested_role })
//             .eq('id', request.user_id)

//           if (profileError) throw profileError
//         }
//       }

//       setRequests(prev => prev.map(req => 
//         req.id === requestId ? { ...req, status } : req
//       ))
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Erreur de mise à jour')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getRoleIcon = (roleKey: string) => {
//     switch (roleKey) {
//       case 'entreprise':
//         return <FiBriefcase className="text-blue-600" size={18} />
//       case 'dgm':
//         return <FiShield className="text-emerald-600" size={18} />
//       case 'igf':
//         return <FiFileText className="text-violet-600" size={18} />
//       default:
//         return <FiUser className="text-amber-600" size={18} />
//     }
//   }

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
//             <FiClock className="mr-1" size={12} /> En attente
//           </span>
//         )
//       case 'approved':
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//             <FiCheck className="mr-1" size={12} /> Approuvé
//           </span>
//         )
//       case 'rejected':
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//             <FiX className="mr-1" size={12} /> Rejeté
//           </span>
//         )
//       default:
//         return null
//     }
//   }

//   if (currentUser?.role !== 'gestionnaire') {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="p-6 max-w-md w-full bg-white rounded-lg shadow-sm text-center">
//           <div className="text-red-500 font-medium">Accès réservé aux gestionnaireistrateurs</div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Demandes de Rôle</h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Gestion des demandes d'accès privilégié
//             </p>
//           </div>
//           <div className="mt-4 sm:mt-0 flex items-center space-x-2">
//             <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
//               {pendingCount} demande{pendingCount !== 1 ? 's' : ''} en attente
//             </span>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
//             <div className="flex items-center text-red-800">
//               <FiInfo className="mr-2 flex-shrink-0" />
//               <span className="text-sm">{error}</span>
//             </div>
//           </div>
//         )}

//         {loading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//             {requests.length === 0 ? (
//               <div className="text-center py-12">
//                 <div className="text-gray-400 mb-2">Aucune demande trouvée</div>
//                 <p className="text-sm text-gray-500">Toutes les nouvelles demandes apparaîtront ici</p>
//               </div>
//             ) : (
//               <ul className="divide-y divide-gray-200">
//                 {requests.map((request) => (
//                   <li key={request.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
//                     <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
//                       <div className="flex items-start space-x-4">
//                         <div className={`p-3 rounded-lg ${
//                           request.status === 'pending' ? 'bg-amber-50' : 
//                           request.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
//                         }`}>
//                           {getRoleIcon(request.requested_role)}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center space-x-2">
//                             <h3 className="text-sm font-medium text-gray-900 capitalize">
//                               {request.requested_role}
//                             </h3>
//                             {getStatusBadge(request.status)}
//                           </div>
//                           <div className="mt-2 space-y-1 text-sm text-gray-600">
//                             <div className="flex items-center">
//                               <FiMail className="mr-2 text-gray-400 flex-shrink-0" size={14} />
//                               <span>{request.user_email}</span>
//                             </div>
//                             <div className="flex items-center">
//                               <FiPhone className="mr-2 text-gray-400 flex-shrink-0" size={14} />
//                               <span>{request.phone_number}</span>
//                             </div>
//                             {request.company_name && (
//                               <div className="flex items-center">
//                                 <FiBriefcase className="mr-2 text-gray-400 flex-shrink-0" size={14} />
//                                 <span>{request.company_name}</span>
//                               </div>
//                             )}
//                           </div>
//                           {request.notes && (
//                             <div className="mt-2 text-sm text-gray-500">
//                               <div className="flex">
//                                 <FiInfo className="mr-2 text-gray-400 flex-shrink-0 mt-0.5" size={14} />
//                                 <span>{request.notes}</span>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="mt-4 sm:mt-0 flex flex-col sm:items-end space-y-2">
//                         <div className="text-xs text-gray-400 flex items-center">
//                           <FiClock className="mr-1" size={12} />
//                           {new Date(request.created_at).toLocaleDateString('fr-FR', {
//                             day: 'numeric',
//                             month: 'short',
//                             year: 'numeric'
//                           })}
//                         </div>
//                         {request.status === 'pending' && (
//                           <div className="flex space-x-2 mt-2">
//                             <button
//                               onClick={() => updateRequestStatus(request.id, 'approved')}
//                               className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
//                               disabled={loading}
//                             >
//                               <FiCheck className="mr-1" size={14} /> Approuver
//                             </button>
//                             <button
//                               onClick={() => updateRequestStatus(request.id, 'rejected')}
//                               className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
//                               disabled={loading}
//                             >
//                               <FiX className="mr-1" size={14} /> Rejeter
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/supabaseClient'
import { useAuth } from '@/context/AuthContext'
import { FiCheck, FiX, FiUser, FiBriefcase, FiShield, FiFileText, FiClock, FiMail, FiPhone, FiInfo } from 'react-icons/fi'

interface Profile {
  email: string
}

interface RoleRequestBase {
  id: string
  created_at: string
  user_id: string
  requested_role: string
  phone_number: string
  company_name: string | null
  notes: string | null
  status: 'pending' | 'approved' | 'rejected'
}

interface RoleRequest extends RoleRequestBase {
  user_email: string
  profiles?: { email: string }
}

const ITEMS_PER_PAGE = 8

export default function GestionnaireRoleRequestsPage() {
  const { user: currentUser } = useAuth()
  const [requests, setRequests] = useState<RoleRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingCount, setPendingCount] = useState(0)
  const [approvedCount, setApprovedCount] = useState(0)
  const [rejectedCount, setRejectedCount] = useState(0)
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (currentUser?.role !== 'gestionnaire') return

    const fetchRequests = async () => {
      try {
        setLoading(true)
        
        const { data, error } = await supabase
          .from('role_requests')
          .select(`*, profiles:user_id (email)`)
          .order('created_at', { ascending: false })

        if (error) throw error

        const formattedData = data.map((req: any) => ({
          ...req,
          user_email: req.profiles.email
        })) as RoleRequest[]

        setRequests(formattedData)
        updateCounts(formattedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }

    const updateCounts = (data: RoleRequest[]) => {
      setPendingCount(data.filter(r => r.status === 'pending').length)
      setApprovedCount(data.filter(r => r.status === 'approved').length)
      setRejectedCount(data.filter(r => r.status === 'rejected').length)
    }

    fetchRequests()

    const subscription = supabase
      .channel('role_requests_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'role_requests' 
        },
        async (payload) => {
          try {
            if (payload.eventType === 'INSERT') {
              const { data } = await supabase
                .from('profiles')
                .select('email')
                .eq('id', payload.new.user_id)
                .single()

              const newRequest = {
                ...payload.new,
                user_email: data?.email || '',
                company_name: payload.new.company_name || null,
                notes: payload.new.notes || null
              } as RoleRequest

              setRequests(prev => [newRequest, ...prev])
              updateCounts([newRequest, ...requests])
            } 
            else if (payload.eventType === 'UPDATE') {
              setRequests(prev => prev.map(req => 
                req.id === payload.new.id ? { 
                  ...req, 
                  ...payload.new 
                } : req
              ))
              updateCounts(requests.map(req => 
                req.id === payload.new.id ? { ...req, ...payload.new } : req
              ))
            }
          } catch (err) {
            console.error('Error handling realtime update:', err)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [currentUser])

  const updateRequestStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      setLoading(true)
      
      const { error: updateError } = await supabase
        .from('role_requests')
        .update({ status })
        .eq('id', requestId)

      if (updateError) throw updateError

      if (status === 'approved') {
        const request = requests.find(r => r.id === requestId)
        if (request) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ role: request.requested_role })
            .eq('id', request.user_id)

          if (profileError) throw profileError
        }
      }

      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status } : req
      ))
      
      // Update counts
      if (status === 'approved') {
        setPendingCount(prev => prev - 1)
        setApprovedCount(prev => prev + 1)
      } else {
        setPendingCount(prev => prev - 1)
        setRejectedCount(prev => prev + 1)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (roleKey: string) => {
    switch (roleKey) {
      case 'entreprise':
        return <FiBriefcase className="text-blue-500" size={18} />
      case 'dgm':
        return <FiShield className="text-emerald-500" size={18} />
      case 'igf':
        return <FiFileText className="text-violet-500" size={18} />
      default:
        return <FiUser className="text-amber-500" size={18} />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
            <FiClock className="mr-1" size={12} /> En attente
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
            <FiCheck className="mr-1" size={12} /> Approuvé
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
            <FiX className="mr-1" size={12} /> Rejeté
          </span>
        )
      default:
        return null
    }
  }

  const filteredRequests = requests.filter(request => request.status === activeTab)
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (currentUser?.role !== 'gestionnaire') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-md w-full bg-white rounded-lg shadow-sm text-center">
          <div className="text-red-500 font-medium">Accès réservé aux gestionnaires</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50  ">
      <div className="max-w-5xl mx-3">
        <div className="">
          {/* <h1 className="text-2xl font-bold text-gray-900">Demandes de Rôle</h1> */}
          <p className="my-2 text-gray-500">
            Gestion des demandes d'accès privilégié
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center text-red-600">
              <FiInfo className="mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => {
                  setActiveTab('pending')
                  setCurrentPage(1)
                }}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                En attente
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {pendingCount}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('approved')
                  setCurrentPage(1)
                }}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'approved' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Approuvées
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {approvedCount}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('rejected')
                  setCurrentPage(1)
                }}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'rejected' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Rejetées
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {rejectedCount}
                </span>
              </button>
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">Aucune demande {activeTab === 'pending' ? 'en attente' : activeTab === 'approved' ? 'approuvée' : 'rejetée'}</div>
                <p className="text-sm text-gray-500">Les nouvelles demandes apparaîtront ici</p>
              </div>
            ) : (
              <>
                <ul className="divide-y divide-gray-200">
                  {paginatedRequests.map((request) => (
                    <li key={request.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="mt-1">
                            {getRoleIcon(request.requested_role)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-sm font-medium text-gray-900 capitalize">
                                {request.requested_role}
                              </h3>
                              {getStatusBadge(request.status)}
                            </div>
                            <div className="mt-3 space-y-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <FiMail className="mr-2 text-gray-400 flex-shrink-0" size={14} />
                                <span>{request.user_email}</span>
                              </div>
                              <div className="flex items-center">
                                <FiPhone className="mr-2 text-gray-400 flex-shrink-0" size={14} />
                                <span>{request.phone_number}</span>
                              </div>
                              {request.company_name && (
                                <div className="flex items-center">
                                  <FiBriefcase className="mr-2 text-gray-400 flex-shrink-0" size={14} />
                                  <span>{request.company_name}</span>
                                </div>
                              )}
                            </div>
                            {request.notes && (
                              <div className="mt-3 text-sm text-gray-500">
                                <div className="flex">
                                  <FiInfo className="mr-2 text-gray-400 flex-shrink-0 mt-0.5" size={14} />
                                  <span>{request.notes}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0 flex flex-col md:items-end space-y-3">
                          <div className="text-xs text-gray-400 flex items-center">
                            <FiClock className="mr-1" size={12} />
                            {new Date(request.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          {request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateRequestStatus(request.id, 'approved')}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                disabled={loading}
                              >
                                <FiCheck className="mr-1" size={14} /> Approuver
                              </button>
                              <button
                                onClick={() => updateRequestStatus(request.id, 'rejected')}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                disabled={loading}
                              >
                                <FiX className="mr-1" size={14} /> Rejeter
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Page {currentPage} sur {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Précédent
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                      Suivant
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}