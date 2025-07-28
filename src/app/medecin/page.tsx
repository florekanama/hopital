

// 'use client'
// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { useRouter } from 'next/navigation'
// import { toast } from 'react-toastify'
// import { supabase } from '@/lib/supabase/client'
// import { format } from 'date-fns'
// import { fr } from 'date-fns/locale'
// import { EmailSenderButton } from '@/components/EmailSenderButton'

// export default function RendezVousMedecin() {
//   const { user, loading: authLoading } = useAuth()
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [rendezVous, setRendezVous] = useState<any[]>([])

//   // Lieux de consultation possibles
//   const LIEUX_CONSULTATION = [
//     'Cabinet privé',
//     'Clinique',
//     'Hôpital',
//     'Domicile du patient',
//     'Téléconsultation',
//     'Autre'
//   ]

//   // Récupérer les rendez-vous du médecin
//   useEffect(() => {
//     if (authLoading) return

//     if (!user) {
//       router.push('/login')
//       return
//     }

//     const fetchRendezVous = async () => {
//       try {
//         setLoading(true)
        
//         // Vérifier que c'est bien un médecin
//         const { data: medecinData, error: medecinError } = await supabase
//           .from('medecin_infos')
//           .select('id')
//           .eq('user_id', user.id)
//           .single()

//         if (medecinError || !medecinData) {
//           throw new Error('Profil médecin non trouvé')
//         }

//         // Récupérer les rendez-vous à venir
//         const { data, error } = await supabase
//           .from('rendez_vous')
//           .select(`
//             *,
//             patient:patient_infos(
//               user:users(nom, profil_url),
//               date_naissance
//             )
//           `)
//           .eq('medecin_id', medecinData.id)
//           .gte('date_heure', new Date().toISOString())
//           .order('date_heure', { ascending: true })

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

//   const confirmerRendezVous = async (id: string) => {
//     try {
//       setLoading(true)
//       const { error } = await supabase
//         .from('rendez_vous')
//         .update({ statut: 'confirmé' })
//         .eq('id', id)

//       if (error) throw error

//       // Mettre à jour la liste des rendez-vous
//       setRendezVous(rendezVous.map(rdv => 
//         rdv.id === id ? { ...rdv, statut: 'confirmé' } : rdv
//       ))

//       toast.success('Rendez-vous confirmé avec succès')
//     } catch (error: any) {
//       console.error('Erreur:', error)
//       toast.error(`Erreur lors de la confirmation: ${error.message}`)
//     } finally {
//       setLoading(false)
//     }
//   }

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

//   const calculerAge = (dateNaissance: string) => {
//     const today = new Date()
//     const birthDate = new Date(dateNaissance)
//     let age = today.getFullYear() - birthDate.getFullYear()
//     const m = today.getMonth() - birthDate.getMonth()
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//       age--
//     }
//     return age
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


//   // Fonction pour télécharger les rendez-vous filtrés
//   const downloadRendezVous = (statut: string) => {
//     let filteredData = rendezVous;
//     let fileName = 'rendez-vous';

//     if (statut !== 'tous') {
//       filteredData = rendezVous.filter(rdv => rdv.statut === statut);
//       fileName = `rendez-vous-${statut}`;
//     }

//     if (filteredData.length === 0) {
//       toast.info(`Aucun rendez-vous avec le statut "${statut}" à exporter`);
//       return;
//     }

//     const content = JSON.stringify(filteredData, null, 2);
//     const blob = new Blob([content], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `${fileName}-${new Date().toISOString().split('T')[0]}.json`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="text-center mb-8">
//   <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
//   <EmailSenderButton/>
//   <p className="mt-2 text-lg text-gray-600">
//     Gestion des rendez-vous à venir
//   </p>
//   <div className="mt-4 flex justify-center space-x-3">
//     <button
//       onClick={() => downloadRendezVous('planifié')}
//       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//     >
//       Télécharger Planifiés
//     </button>
//     <button
//       onClick={() => downloadRendezVous('confirmé')}
//       className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
//     >
//       Télécharger Confirmés
//     </button>
//     <button
//       onClick={() => downloadRendezVous('annulé')}
//       className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
//     >
//       Télécharger Annulés
//     </button>
//   </div>
// </div>
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
//           <p className="mt-2 text-lg text-gray-600">
//             Gestion des rendez-vous à venir
//           </p>
//         </div>

//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           {rendezVous.length === 0 ? (
//             <div className="text-center p-8">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//               <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun rendez-vous à venir</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 Vous n'avez aucun rendez-vous programmé pour le moment.
//               </p>
//             </div>
//           ) : (
//             <ul className="divide-y divide-gray-200">
//               {rendezVous.map((rdv) => (
//                 <li key={rdv.id} className="p-4 hover:bg-gray-50">
//                   <div className="flex items-start">
//                     <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                       {rdv.patient?.user?.profil_url ? (
//                         <img 
//                           src={rdv.patient.user.profil_url} 
//                           alt="Photo du patient" 
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
//                         <div>
//                           <h3 className="text-lg font-medium text-gray-900">
//                             {rdv.patient?.user?.nom || 'Patient inconnu'}
//                           </h3>
//                           {rdv.patient?.date_naissance && (
//                             <p className="text-sm text-gray-500">
//                               Âge: {calculerAge(rdv.patient.date_naissance)} ans
//                             </p>
//                           )}
//                         </div>
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
//                           Lieu: {LIEUX_CONSULTATION.includes(rdv.lieu) ? rdv.lieu : 'Autre lieu'}
//                         </p>
//                         {rdv.motif && (
//                           <p className="mt-1">
//                             Motif: {rdv.motif}
//                           </p>
//                         )}
//                       </div>
//                       <div className="mt-2 flex space-x-3">
//                         {rdv.statut === 'planifié' && (
//                           <>
//                             <button
//                               onClick={() => confirmerRendezVous(rdv.id)}
//                               className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                             >
//                               Confirmer
//                             </button>
//                             <button
//                               onClick={() => annulerRendezVous(rdv.id)}
//                               className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                             >
//                               Annuler
//                             </button>
//                           </>
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
import { EmailSenderButton } from '@/components/EmailSenderButton'
import PatientDossierModal from '@/components/PatientDossierModal'

export default function RendezVousMedecin() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [rendezVous, setRendezVous] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<{id: string, medecinId: string} | null>(null)

  // Lieux de consultation possibles
  const LIEUX_CONSULTATION = [
    'Cabinet privé',
    'Clinique',
    'Hôpital',
    'Domicile du patient',
    'Téléconsultation',
    'Autre'
  ]

  // Récupérer les rendez-vous du médecin
  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    const fetchRendezVous = async () => {
      try {
        setLoading(true)
        
        // Vérifier que c'est bien un médecin
        const { data: medecinData, error: medecinError } = await supabase
          .from('medecin_infos')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (medecinError || !medecinData) {
          throw new Error('Profil médecin non trouvé')
        }

        // Récupérer les rendez-vous à venir
        const { data, error } = await supabase
          .from('rendez_vous')
          .select(`
            *,
            patient:patient_infos(
              user:users(nom, profil_url),
              date_naissance
            )
          `)
          .eq('medecin_id', medecinData.id)
          .gte('date_heure', new Date().toISOString())
          .order('date_heure', { ascending: true })

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

  const confirmerRendezVous = async (id: string) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('rendez_vous')
        .update({ statut: 'confirmé' })
        .eq('id', id)

      if (error) throw error

      // Mettre à jour la liste des rendez-vous
      setRendezVous(rendezVous.map(rdv => 
        rdv.id === id ? { ...rdv, statut: 'confirmé' } : rdv
      ))

      toast.success('Rendez-vous confirmé avec succès')
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors de la confirmation: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

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

  const calculerAge = (dateNaissance: string) => {
    const today = new Date()
    const birthDate = new Date(dateNaissance)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const openDossierMedical = async (patientId: string) => {
    try {
      const { data: medecinData, error } = await supabase
        .from('medecin_infos')
        .select('id')
        .eq('user_id', user?.id)
        .single()

      if (error || !medecinData) throw error || new Error('Médecin non trouvé')

      setSelectedPatient({
        id: patientId,
        medecinId: medecinData.id
      })
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`)
    }
  }

  const closeDossierMedical = () => {
    setSelectedPatient(null)
  }

  const downloadRendezVous = (statut: string) => {
    let filteredData = rendezVous;
    let fileName = 'rendez-vous';

    if (statut !== 'tous') {
      filteredData = rendezVous.filter(rdv => rdv.statut === statut);
      fileName = `rendez-vous-${statut}`;
    }

    if (filteredData.length === 0) {
      toast.info(`Aucun rendez-vous avec le statut "${statut}" à exporter`);
      return;
    }

    const content = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      {selectedPatient && (
        <PatientDossierModal 
          patientId={selectedPatient.id} 
          medecinId={selectedPatient.medecinId}
          onClose={closeDossierMedical}
        />
      )}
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
        <EmailSenderButton/>
        <p className="mt-2 text-lg text-gray-600">
          Gestion des rendez-vous à venir
        </p>
        <div className="mt-4 flex justify-center space-x-3">
          <button
            onClick={() => downloadRendezVous('planifié')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Télécharger Planifiés
          </button>
          <button
            onClick={() => downloadRendezVous('confirmé')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Télécharger Confirmés
          </button>
          <button
            onClick={() => downloadRendezVous('annulé')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Télécharger Annulés
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {rendezVous.length === 0 ? (
            <div className="text-center p-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun rendez-vous à venir</h3>
              <p className="mt-1 text-sm text-gray-500">
                Vous n'avez aucun rendez-vous programmé pour le moment.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {rendezVous.map((rdv) => (
                <li key={rdv.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {rdv.patient?.user?.profil_url ? (
                        <img 
                          src={rdv.patient.user.profil_url} 
                          alt="Photo du patient" 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {rdv.patient?.user?.nom || 'Patient inconnu'}
                          </h3>
                          {rdv.patient?.date_naissance && (
                            <p className="text-sm text-gray-500">
                              Âge: {calculerAge(rdv.patient.date_naissance)} ans
                            </p>
                          )}
                        </div>
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
                          <>
                            <button
                              onClick={() => confirmerRendezVous(rdv.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => annulerRendezVous(rdv.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Annuler
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openDossierMedical(rdv.patient_id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Dossier médical
                        </button>
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
