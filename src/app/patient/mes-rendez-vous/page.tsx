// 'use client'
// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { useRouter } from 'next/navigation'
// import { toast } from 'react-toastify'
// import { supabase } from '@/lib/supabase/client'
// import { format } from 'date-fns'
// import { fr } from 'date-fns/locale'

// export default function MesRendezVous() {
//   const { user, loading: authLoading } = useAuth()
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [rendezVous, setRendezVous] = useState<any[]>([])

//   // Récupérer les rendez-vous de l'utilisateur
//   useEffect(() => {
//     if (authLoading) return

//     if (!user) {
//       router.push('/login')
//       return
//     }

//     const fetchRendezVous = async () => {
//       try {
//         setLoading(true)
        
//         // Vérifier si c'est un patient ou un médecin
//         const { data: userData, error: userError } = await supabase
//           .from('users')
//           .select('role')
//           .eq('id', user.id)
//           .single()

//         if (userError) throw userError

//         let query = supabase
//           .from('rendez_vous')
//           .select(`
//             *,
//             medecin:medecin_infos(
//               user:users(nom, profil_url),
//             patient:patient_infos(
//               user:users(nom, profil_url)
//           `)
//           .order('date_heure', { ascending: true })

//         if (userData.role === 'patient') {
//           query = query.eq('patient_id', user.id)
//         } else if (userData.role === 'medecin') {
//           query = query.eq('medecin_id', user.id)
//         } else {
//           return
//         }

//         const { data, error } = await query

//         if (error) throw error
//         setRendezVous(data || [])

//       } catch (error: any) {
//         console.error('Erreur lors du chargement:', error)
//         toast.error(`Erreur: ${error.message}`)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchRendezVous()
//   }, [user, authLoading, router])

//   const annulerRendezVous = async (id: string) => {
//     try {
//       setLoading(true)
//       const { error } = await supabase
//         .from('rendez_vous')
//         .update({ statut: 'annulé' })
//         .eq('id', id)

//       if (error) throw error

//       // Mettre à jour la liste des rendez-vous
//       setRendezVous(rendezVous.map(rdv => 
//         rdv.id === id ? { ...rdv, statut: 'annulé' } : rdv
//       ))

//       toast.success('Rendez-vous annulé avec succès')
//     } catch (error: any) {
//       console.error('Erreur:', error)
//       toast.error(`Erreur lors de l'annulation: ${error.message}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <p className="text-gray-600">Redirection vers la page de connexion...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
//           <p className="mt-2 text-lg text-gray-600">
//             Consultez et gérez vos rendez-vous à venir
//           </p>
//         </div>

//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           {rendezVous.length === 0 ? (
//             <div className="text-center p-8">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//               <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun rendez-vous</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 Vous n'avez aucun rendez-vous programmé pour le moment.
//               </p>
//               <div className="mt-6">
//                 <button
//                   onClick={() => router.push('/prendre-rendez-vous')}
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Prendre un rendez-vous
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <ul className="divide-y divide-gray-200">
//               {rendezVous.map((rdv) => (
//                 <li key={rdv.id} className="p-4 hover:bg-gray-50">
//                   <div className="flex items-start">
//                     <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                       {rdv.medecin?.user?.profil_url ? (
//                         <img 
//                           src={rdv.medecin.user.profil_url} 
//                           alt="Photo du médecin" 
//                           className="h-10 w-10 rounded-full object-cover"
//                         />
//                       ) : (
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                         </svg>
//                       )}
//                     </div>
//                     <div className="ml-4 flex-1">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-lg font-medium text-gray-900">
//                           {user.role === 'patient' 
//                             ? `Dr. ${rdv.medecin?.user?.nom || 'Médecin inconnu'}`
//                             : `Patient: ${rdv.patient?.user?.nom || 'Patient inconnu'}`}
//                         </h3>
//                         <span className={`px-2 py-1 text-xs rounded-full ${
//                           rdv.statut === 'planifié' ? 'bg-blue-100 text-blue-800' :
//                           rdv.statut === 'confirmé' ? 'bg-green-100 text-green-800' :
//                           rdv.statut === 'annulé' ? 'bg-red-100 text-red-800' :
//                           rdv.statut === 'terminé' ? 'bg-purple-100 text-purple-800' :
//                           'bg-gray-100 text-gray-800'
//                         }`}>
//                           {rdv.statut}
//                         </span>
//                       </div>
//                       <div className="mt-1 text-sm text-gray-600">
//                         <p>
//                           {format(new Date(rdv.date_heure), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
//                         </p>
//                         <p className="mt-1">
//                           Lieu: {rdv.lieu}
//                         </p>
//                         {rdv.motif && (
//                           <p className="mt-1">
//                             Motif: {rdv.motif}
//                           </p>
//                         )}
//                       </div>
//                       <div className="mt-2 flex space-x-3">
//                         {rdv.statut === 'planifié' && (
//                           <button
//                             onClick={() => annulerRendezVous(rdv.id)}
//                             className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                           >
//                             Annuler
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function MesRendezVous() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [rendezVous, setRendezVous] = useState<any[]>([])

  // Lieux de consultation possibles
  const LIEUX_CONSULTATION = [
    'Cabinet privé',
    'Clinique',
    'Hôpital',
    'Domicile du patient',
    'Téléconsultation',
    'Autre'
  ]

  // Récupérer les rendez-vous de l'utilisateur
  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    const fetchRendezVous = async () => {
      try {
        setLoading(true)
        
        // Vérifier si c'est un patient ou un médecin
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (userError) throw userError

        let query = supabase
          .from('rendez_vous')
          .select(`
            *,
            medecin:medecin_infos(
              user:users(nom, profil_url),
              specialite:specialites(nom)
            ),
            patient:patient_infos(
              user:users(nom, profil_url)
            )
          `)
          .order('date_heure', { ascending: true })

        if (userData.role === 'patient') {
          // Pour un patient, on joint les infos du médecin
          const { data: patientData, error: patientError } = await supabase
            .from('patient_infos')
            .select('id')
            .eq('user_id', user.id)
            .single()

          if (patientError || !patientData) throw new Error('Profil patient non trouvé')

          query = query.eq('patient_id', patientData.id)
        } else if (userData.role === 'medecin') {
          // Pour un médecin, on joint les infos du patient
          const { data: medecinData, error: medecinError } = await supabase
            .from('medecin_infos')
            .select('id')
            .eq('user_id', user.id)
            .single()

          if (medecinError || !medecinData) throw new Error('Profil médecin non trouvé')

          query = query.eq('medecin_id', medecinData.id)
        } else {
          return
        }

        const { data, error } = await query

        if (error) throw error
        setRendezVous(data || [])

      } catch (error: any) {
        console.error('Erreur lors du chargement:', error)
        toast.error(`Erreur: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchRendezVous()
  }, [user, authLoading, router])

  const annulerRendezVous = async (id: string) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('rendez_vous')
        .update({ statut: 'annulé' })
        .eq('id', id)

      if (error) throw error

      // Mettre à jour la liste des rendez-vous
      setRendezVous(rendezVous.map(rdv => 
        rdv.id === id ? { ...rdv, statut: 'annulé' } : rdv
      ))

      toast.success('Rendez-vous annulé avec succès')
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors de l'annulation: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Redirection vers la page de connexion...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
          <p className="mt-2 text-lg text-gray-600">
            Consultez et gérez vos rendez-vous à venir
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {rendezVous.length === 0 ? (
            <div className="text-center p-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun rendez-vous</h3>
              <p className="mt-1 text-sm text-gray-500">
                Vous n'avez aucun rendez-vous programmé pour le moment.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/prendre-rendez-vous')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Prendre un rendez-vous
                </button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {rendezVous.map((rdv) => (
                <li key={rdv.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {user.role === 'patient' ? (
                        rdv.medecin?.user?.profil_url ? (
                          <img 
                            src={rdv.medecin.user.profil_url} 
                            alt="Photo du médecin" 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )
                      ) : (
                        rdv.patient?.user?.profil_url ? (
                          <img 
                            src={rdv.patient.user.profil_url} 
                            alt="Photo du patient" 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {user.role === 'patient' 
                            ? `Dr. ${rdv.medecin?.user?.nom || 'Médecin inconnu'}`
                            : `Patient: ${rdv.patient?.user?.nom || 'Patient inconnu'}`}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          rdv.statut === 'planifié' ? 'bg-blue-100 text-blue-800' :
                          rdv.statut === 'confirmé' ? 'bg-green-100 text-green-800' :
                          rdv.statut === 'annulé' ? 'bg-red-100 text-red-800' :
                          rdv.statut === 'terminé' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {rdv.statut}
                        </span>
                      </div>
                      {user.role === 'patient' && rdv.medecin?.specialite?.nom && (
                        <p className="text-sm text-gray-500">
                          Spécialité: {rdv.medecin.specialite.nom}
                        </p>
                      )}
                      <div className="mt-1 text-sm text-gray-600">
                        <p>
                          {format(new Date(rdv.date_heure), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
                        </p>
                        <p className="mt-1">
                          Lieu: {LIEUX_CONSULTATION.includes(rdv.lieu) ? rdv.lieu : 'Autre lieu'}
                        </p>
                        {rdv.motif && (
                          <p className="mt-1">
                            Motif: {rdv.motif}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 flex space-x-3">
                        {rdv.statut === 'planifié' && (
                          <button
                            onClick={() => annulerRendezVous(rdv.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}