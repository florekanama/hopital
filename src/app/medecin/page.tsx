

// // // // // // 'use client'
// // // // // // import { useState, useEffect } from 'react'
// // // // // // import { useAuth } from '@/context/AuthContext'
// // // // // // import { useRouter } from 'next/navigation'
// // // // // // import { toast } from 'react-toastify'
// // // // // // import { supabase } from '@/lib/supabase/client'
// // // // // // import { format } from 'date-fns'
// // // // // // import { fr } from 'date-fns/locale'
// // // // // // import { EmailSenderButton } from '@/components/EmailSenderButton'

// // // // // // export default function RendezVousMedecin() {
// // // // // //   const { user, loading: authLoading } = useAuth()
// // // // // //   const router = useRouter()
// // // // // //   const [loading, setLoading] = useState(true)
// // // // // //   const [rendezVous, setRendezVous] = useState<any[]>([])

// // // // // //   // Lieux de consultation possibles
// // // // // //   const LIEUX_CONSULTATION = [
// // // // // //     'Cabinet privé',
// // // // // //     'Clinique',
// // // // // //     'Hôpital',
// // // // // //     'Domicile du patient',
// // // // // //     'Téléconsultation',
// // // // // //     'Autre'
// // // // // //   ]

// // // // // //   // Récupérer les rendez-vous du médecin
// // // // // //   useEffect(() => {
// // // // // //     if (authLoading) return

// // // // // //     if (!user) {
// // // // // //       router.push('/login')
// // // // // //       return
// // // // // //     }

// // // // // //     const fetchRendezVous = async () => {
// // // // // //       try {
// // // // // //         setLoading(true)
        
// // // // // //         // Vérifier que c'est bien un médecin
// // // // // //         const { data: medecinData, error: medecinError } = await supabase
// // // // // //           .from('medecin_infos')
// // // // // //           .select('id')
// // // // // //           .eq('user_id', user.id)
// // // // // //           .single()

// // // // // //         if (medecinError || !medecinData) {
// // // // // //           throw new Error('Profil médecin non trouvé')
// // // // // //         }

// // // // // //         // Récupérer les rendez-vous à venir
// // // // // //         const { data, error } = await supabase
// // // // // //           .from('rendez_vous')
// // // // // //           .select(`
// // // // // //             *,
// // // // // //             patient:patient_infos(
// // // // // //               user:users(nom, profil_url),
// // // // // //               date_naissance
// // // // // //             )
// // // // // //           `)
// // // // // //           .eq('medecin_id', medecinData.id)
// // // // // //           .gte('date_heure', new Date().toISOString())
// // // // // //           .order('date_heure', { ascending: true })

// // // // // //         if (error) throw error
// // // // // //         setRendezVous(data || [])

// // // // // //       } catch (error: any) {
// // // // // //         console.error('Erreur lors du chargement:', error)
// // // // // //         toast.error(`Erreur: ${error.message}`)
// // // // // //       } finally {
// // // // // //         setLoading(false)
// // // // // //       }
// // // // // //     }

// // // // // //     fetchRendezVous()
// // // // // //   }, [user, authLoading, router])

// // // // // //   const confirmerRendezVous = async (id: string) => {
// // // // // //     try {
// // // // // //       setLoading(true)
// // // // // //       const { error } = await supabase
// // // // // //         .from('rendez_vous')
// // // // // //         .update({ statut: 'confirmé' })
// // // // // //         .eq('id', id)

// // // // // //       if (error) throw error

// // // // // //       // Mettre à jour la liste des rendez-vous
// // // // // //       setRendezVous(rendezVous.map(rdv => 
// // // // // //         rdv.id === id ? { ...rdv, statut: 'confirmé' } : rdv
// // // // // //       ))

// // // // // //       toast.success('Rendez-vous confirmé avec succès')
// // // // // //     } catch (error: any) {
// // // // // //       console.error('Erreur:', error)
// // // // // //       toast.error(`Erreur lors de la confirmation: ${error.message}`)
// // // // // //     } finally {
// // // // // //       setLoading(false)
// // // // // //     }
// // // // // //   }

// // // // // //   const annulerRendezVous = async (id: string) => {
// // // // // //     try {
// // // // // //       setLoading(true)
// // // // // //       const { error } = await supabase
// // // // // //         .from('rendez_vous')
// // // // // //         .update({ statut: 'annulé' })
// // // // // //         .eq('id', id)

// // // // // //       if (error) throw error

// // // // // //       // Mettre à jour la liste des rendez-vous
// // // // // //       setRendezVous(rendezVous.map(rdv => 
// // // // // //         rdv.id === id ? { ...rdv, statut: 'annulé' } : rdv
// // // // // //       ))

// // // // // //       toast.success('Rendez-vous annulé avec succès')
// // // // // //     } catch (error: any) {
// // // // // //       console.error('Erreur:', error)
// // // // // //       toast.error(`Erreur lors de l'annulation: ${error.message}`)
// // // // // //     } finally {
// // // // // //       setLoading(false)
// // // // // //     }
// // // // // //   }

// // // // // //   const calculerAge = (dateNaissance: string) => {
// // // // // //     const today = new Date()
// // // // // //     const birthDate = new Date(dateNaissance)
// // // // // //     let age = today.getFullYear() - birthDate.getFullYear()
// // // // // //     const m = today.getMonth() - birthDate.getMonth()
// // // // // //     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
// // // // // //       age--
// // // // // //     }
// // // // // //     return age
// // // // // //   }

// // // // // //   if (authLoading || loading) {
// // // // // //     return (
// // // // // //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// // // // // //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
// // // // // //       </div>
// // // // // //     )
// // // // // //   }

// // // // // //   if (!user) {
// // // // // //     return (
// // // // // //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// // // // // //         <p className="text-gray-600">Redirection vers la page de connexion...</p>
// // // // // //       </div>
// // // // // //     )
// // // // // //   }


// // // // // //   // Fonction pour télécharger les rendez-vous filtrés
// // // // // //   const downloadRendezVous = (statut: string) => {
// // // // // //     let filteredData = rendezVous;
// // // // // //     let fileName = 'rendez-vous';

// // // // // //     if (statut !== 'tous') {
// // // // // //       filteredData = rendezVous.filter(rdv => rdv.statut === statut);
// // // // // //       fileName = `rendez-vous-${statut}`;
// // // // // //     }

// // // // // //     if (filteredData.length === 0) {
// // // // // //       toast.info(`Aucun rendez-vous avec le statut "${statut}" à exporter`);
// // // // // //       return;
// // // // // //     }

// // // // // //     const content = JSON.stringify(filteredData, null, 2);
// // // // // //     const blob = new Blob([content], { type: 'application/json' });
// // // // // //     const url = URL.createObjectURL(blob);
// // // // // //     const link = document.createElement('a');
// // // // // //     link.href = url;
// // // // // //     link.download = `${fileName}-${new Date().toISOString().split('T')[0]}.json`;
// // // // // //     document.body.appendChild(link);
// // // // // //     link.click();
// // // // // //     document.body.removeChild(link);
// // // // // //     URL.revokeObjectURL(url);
// // // // // //   }

// // // // // //   return (
// // // // // //     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
// // // // // //       <div className="text-center mb-8">
// // // // // //   <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
// // // // // //   <EmailSenderButton/>
// // // // // //   <p className="mt-2 text-lg text-gray-600">
// // // // // //     Gestion des rendez-vous à venir
// // // // // //   </p>
// // // // // //   <div className="mt-4 flex justify-center space-x-3">
// // // // // //     <button
// // // // // //       onClick={() => downloadRendezVous('planifié')}
// // // // // //       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //     >
// // // // // //       Télécharger Planifiés
// // // // // //     </button>
// // // // // //     <button
// // // // // //       onClick={() => downloadRendezVous('confirmé')}
// // // // // //       className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
// // // // // //     >
// // // // // //       Télécharger Confirmés
// // // // // //     </button>
// // // // // //     <button
// // // // // //       onClick={() => downloadRendezVous('annulé')}
// // // // // //       className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
// // // // // //     >
// // // // // //       Télécharger Annulés
// // // // // //     </button>
// // // // // //   </div>
// // // // // // </div>
// // // // // //       <div className="max-w-4xl mx-auto">
// // // // // //         <div className="text-center mb-8">
// // // // // //           <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
// // // // // //           <p className="mt-2 text-lg text-gray-600">
// // // // // //             Gestion des rendez-vous à venir
// // // // // //           </p>
// // // // // //         </div>

// // // // // //         <div className="bg-white rounded-xl shadow-md overflow-hidden">
// // // // // //           {rendezVous.length === 0 ? (
// // // // // //             <div className="text-center p-8">
// // // // // //               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // // // // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// // // // // //               </svg>
// // // // // //               <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun rendez-vous à venir</h3>
// // // // // //               <p className="mt-1 text-sm text-gray-500">
// // // // // //                 Vous n'avez aucun rendez-vous programmé pour le moment.
// // // // // //               </p>
// // // // // //             </div>
// // // // // //           ) : (
// // // // // //             <ul className="divide-y divide-gray-200">
// // // // // //               {rendezVous.map((rdv) => (
// // // // // //                 <li key={rdv.id} className="p-4 hover:bg-gray-50">
// // // // // //                   <div className="flex items-start">
// // // // // //                     <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
// // // // // //                       {rdv.patient?.user?.profil_url ? (
// // // // // //                         <img 
// // // // // //                           src={rdv.patient.user.profil_url} 
// // // // // //                           alt="Photo du patient" 
// // // // // //                           className="h-10 w-10 rounded-full object-cover"
// // // // // //                         />
// // // // // //                       ) : (
// // // // // //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // // // // //                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
// // // // // //                         </svg>
// // // // // //                       )}
// // // // // //                     </div>
// // // // // //                     <div className="ml-4 flex-1">
// // // // // //                       <div className="flex items-center justify-between">
// // // // // //                         <div>
// // // // // //                           <h3 className="text-lg font-medium text-gray-900">
// // // // // //                             {rdv.patient?.user?.nom || 'Patient inconnu'}
// // // // // //                           </h3>
// // // // // //                           {rdv.patient?.date_naissance && (
// // // // // //                             <p className="text-sm text-gray-500">
// // // // // //                               Âge: {calculerAge(rdv.patient.date_naissance)} ans
// // // // // //                             </p>
// // // // // //                           )}
// // // // // //                         </div>
// // // // // //                         <span className={`px-2 py-1 text-xs rounded-full ${
// // // // // //                           rdv.statut === 'planifié' ? 'bg-blue-100 text-blue-800' :
// // // // // //                           rdv.statut === 'confirmé' ? 'bg-green-100 text-green-800' :
// // // // // //                           rdv.statut === 'annulé' ? 'bg-red-100 text-red-800' :
// // // // // //                           rdv.statut === 'terminé' ? 'bg-purple-100 text-purple-800' :
// // // // // //                           'bg-gray-100 text-gray-800'
// // // // // //                         }`}>
// // // // // //                           {rdv.statut}
// // // // // //                         </span>
// // // // // //                       </div>
// // // // // //                       <div className="mt-1 text-sm text-gray-600">
// // // // // //                         <p>
// // // // // //                           {format(new Date(rdv.date_heure), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
// // // // // //                         </p>
// // // // // //                         <p className="mt-1">
// // // // // //                           Lieu: {LIEUX_CONSULTATION.includes(rdv.lieu) ? rdv.lieu : 'Autre lieu'}
// // // // // //                         </p>
// // // // // //                         {rdv.motif && (
// // // // // //                           <p className="mt-1">
// // // // // //                             Motif: {rdv.motif}
// // // // // //                           </p>
// // // // // //                         )}
// // // // // //                       </div>
// // // // // //                       <div className="mt-2 flex space-x-3">
// // // // // //                         {rdv.statut === 'planifié' && (
// // // // // //                           <>
// // // // // //                             <button
// // // // // //                               onClick={() => confirmerRendezVous(rdv.id)}
// // // // // //                               className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
// // // // // //                             >
// // // // // //                               Confirmer
// // // // // //                             </button>
// // // // // //                             <button
// // // // // //                               onClick={() => annulerRendezVous(rdv.id)}
// // // // // //                               className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
// // // // // //                             >
// // // // // //                               Annuler
// // // // // //                             </button>
// // // // // //                           </>
// // // // // //                         )}
// // // // // //                       </div>
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                 </li>
// // // // // //               ))}
// // // // // //             </ul>
// // // // // //           )}
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   )
// // // // // // }

// // // // // 'use client'
// // // // // import { useState, useEffect } from 'react'
// // // // // import { useAuth } from '@/context/AuthContext'
// // // // // import { useRouter } from 'next/navigation'
// // // // // import { toast } from 'react-toastify'
// // // // // import { supabase } from '@/lib/supabase/client'
// // // // // import { format } from 'date-fns'
// // // // // import { fr } from 'date-fns/locale'
// // // // // import { EmailSenderButton } from '@/components/EmailSenderButton'
// // // // // import PatientDossierModal from '@/components/PatientDossierModal'

// // // // // export default function RendezVousMedecin() {
// // // // //   const { user, loading: authLoading } = useAuth()
// // // // //   const router = useRouter()
// // // // //   const [loading, setLoading] = useState(true)
// // // // //   const [rendezVous, setRendezVous] = useState<any[]>([])
// // // // //   const [selectedPatient, setSelectedPatient] = useState<{id: string, medecinId: string} | null>(null)

// // // // //   // Lieux de consultation possibles
// // // // //   const LIEUX_CONSULTATION = [
// // // // //     'Cabinet privé',
// // // // //     'Clinique',
// // // // //     'Hôpital',
// // // // //     'Domicile du patient',
// // // // //     'Téléconsultation',
// // // // //     'Autre'
// // // // //   ]

// // // // //   // Récupérer les rendez-vous du médecin
// // // // //   useEffect(() => {
// // // // //     if (authLoading) return

// // // // //     if (!user) {
// // // // //       router.push('/login')
// // // // //       return
// // // // //     }

// // // // //     const fetchRendezVous = async () => {
// // // // //       try {
// // // // //         setLoading(true)
        
// // // // //         // Vérifier que c'est bien un médecin
// // // // //         const { data: medecinData, error: medecinError } = await supabase
// // // // //           .from('medecin_infos')
// // // // //           .select('id')
// // // // //           .eq('user_id', user.id)
// // // // //           .single()

// // // // //         if (medecinError || !medecinData) {
// // // // //           throw new Error('Profil médecin non trouvé')
// // // // //         }

// // // // //         // Récupérer les rendez-vous à venir
// // // // //         const { data, error } = await supabase
// // // // //           .from('rendez_vous')
// // // // //           .select(`
// // // // //             *,
// // // // //             patient:patient_infos(
// // // // //               user:users(nom, profil_url),
// // // // //               date_naissance
// // // // //             )
// // // // //           `)
// // // // //           .eq('medecin_id', medecinData.id)
// // // // //           .gte('date_heure', new Date().toISOString())
// // // // //           .order('date_heure', { ascending: true })

// // // // //         if (error) throw error
// // // // //         setRendezVous(data || [])

// // // // //       } catch (error: any) {
// // // // //         console.error('Erreur lors du chargement:', error)
// // // // //         toast.error(`Erreur: ${error.message}`)
// // // // //       } finally {
// // // // //         setLoading(false)
// // // // //       }
// // // // //     }

// // // // //     fetchRendezVous()
// // // // //   }, [user, authLoading, router])

// // // // //   const confirmerRendezVous = async (id: string) => {
// // // // //     try {
// // // // //       setLoading(true)
// // // // //       const { error } = await supabase
// // // // //         .from('rendez_vous')
// // // // //         .update({ statut: 'confirmé' })
// // // // //         .eq('id', id)

// // // // //       if (error) throw error

// // // // //       // Mettre à jour la liste des rendez-vous
// // // // //       setRendezVous(rendezVous.map(rdv => 
// // // // //         rdv.id === id ? { ...rdv, statut: 'confirmé' } : rdv
// // // // //       ))

// // // // //       toast.success('Rendez-vous confirmé avec succès')
// // // // //     } catch (error: any) {
// // // // //       console.error('Erreur:', error)
// // // // //       toast.error(`Erreur lors de la confirmation: ${error.message}`)
// // // // //     } finally {
// // // // //       setLoading(false)
// // // // //     }
// // // // //   }

// // // // //   const annulerRendezVous = async (id: string) => {
// // // // //     try {
// // // // //       setLoading(true)
// // // // //       const { error } = await supabase
// // // // //         .from('rendez_vous')
// // // // //         .update({ statut: 'annulé' })
// // // // //         .eq('id', id)

// // // // //       if (error) throw error

// // // // //       // Mettre à jour la liste des rendez-vous
// // // // //       setRendezVous(rendezVous.map(rdv => 
// // // // //         rdv.id === id ? { ...rdv, statut: 'annulé' } : rdv
// // // // //       ))

// // // // //       toast.success('Rendez-vous annulé avec succès')
// // // // //     } catch (error: any) {
// // // // //       console.error('Erreur:', error)
// // // // //       toast.error(`Erreur lors de l'annulation: ${error.message}`)
// // // // //     } finally {
// // // // //       setLoading(false)
// // // // //     }
// // // // //   }

// // // // //   const calculerAge = (dateNaissance: string) => {
// // // // //     const today = new Date()
// // // // //     const birthDate = new Date(dateNaissance)
// // // // //     let age = today.getFullYear() - birthDate.getFullYear()
// // // // //     const m = today.getMonth() - birthDate.getMonth()
// // // // //     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
// // // // //       age--
// // // // //     }
// // // // //     return age
// // // // //   }

// // // // //   const openDossierMedical = async (patientId: string) => {
// // // // //     try {
// // // // //       const { data: medecinData, error } = await supabase
// // // // //         .from('medecin_infos')
// // // // //         .select('id')
// // // // //         .eq('user_id', user?.id)
// // // // //         .single()

// // // // //       if (error || !medecinData) throw error || new Error('Médecin non trouvé')

// // // // //       setSelectedPatient({
// // // // //         id: patientId,
// // // // //         medecinId: medecinData.id
// // // // //       })
// // // // //     } catch (error: any) {
// // // // //       toast.error(`Erreur: ${error.message}`)
// // // // //     }
// // // // //   }

// // // // //   const closeDossierMedical = () => {
// // // // //     setSelectedPatient(null)
// // // // //   }




// // // // // const marquerPresence = async (id: string, present: boolean) => {
// // // // //   try {
// // // // //     setLoading(true)
// // // // //     const { error } = await supabase
// // // // //       .from('rendez_vous')
// // // // //       .update({ present })
// // // // //       .eq('id', id)

// // // // //     if (error) throw error

// // // // //     setRendezVous(rendezVous.map(rdv => 
// // // // //       rdv.id === id ? { ...rdv, present } : rdv
// // // // //     ))

// // // // //     toast.success(`Présence ${present ? 'marquée' : 'annulée'} avec succès`)
// // // // //   } catch (error: any) {
// // // // //     console.error('Erreur:', error)
// // // // //     toast.error(`Erreur: ${error.message}`)
// // // // //   } finally {
// // // // //     setLoading(false)
// // // // //   }
// // // // // }


// // // // //   const downloadRendezVous = (statut: string) => {
// // // // //     let filteredData = rendezVous;
// // // // //     let fileName = 'rendez-vous';

// // // // //     if (statut !== 'tous') {
// // // // //       filteredData = rendezVous.filter(rdv => rdv.statut === statut);
// // // // //       fileName = `rendez-vous-${statut}`;
// // // // //     }

// // // // //     if (filteredData.length === 0) {
// // // // //       toast.info(`Aucun rendez-vous avec le statut "${statut}" à exporter`);
// // // // //       return;
// // // // //     }

// // // // //     const content = JSON.stringify(filteredData, null, 2);
// // // // //     const blob = new Blob([content], { type: 'application/json' });
// // // // //     const url = URL.createObjectURL(blob);
// // // // //     const link = document.createElement('a');
// // // // //     link.href = url;
// // // // //     link.download = `${fileName}-${new Date().toISOString().split('T')[0]}.json`;
// // // // //     document.body.appendChild(link);
// // // // //     link.click();
// // // // //     document.body.removeChild(link);
// // // // //     URL.revokeObjectURL(url);
// // // // //   }

// // // // //   if (authLoading || loading) {
// // // // //     return (
// // // // //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// // // // //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
// // // // //       </div>
// // // // //     )
// // // // //   }

// // // // //   if (!user) {
// // // // //     return (
// // // // //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// // // // //         <p className="text-gray-600">Redirection vers la page de connexion...</p>
// // // // //       </div>
// // // // //     )
// // // // //   }

// // // // //   return (
// // // // //     <div className="min-h-screen bg-gray-50 py-8  sm:px-6 lg:px-8">
// // // // //       {selectedPatient && (
// // // // //         <PatientDossierModal 
// // // // //           patientId={selectedPatient.id} 
// // // // //           medecinId={selectedPatient.medecinId}
// // // // //           onClose={closeDossierMedical}
// // // // //         />
// // // // //       )}
      
// // // // //       <div className="text-center mb-8">
// // // // //         <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
// // // // //         <EmailSenderButton/>
// // // // //         <p className="mt-2 text-lg text-gray-600">
// // // // //           Gestion des rendez-vous à venir
// // // // //         </p>
// // // // //         {/* <div className="mt-4 flex justify-center space-x-3">
// // // // //           <button
// // // // //             onClick={() => downloadRendezVous('planifié')}
// // // // //             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //           >
// // // // //             Télécharger Planifiés
// // // // //           </button>
// // // // //           <button
// // // // //             onClick={() => downloadRendezVous('confirmé')}
// // // // //             className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
// // // // //           >
// // // // //             Télécharger Confirmés
// // // // //           </button>
// // // // //           <button
// // // // //             onClick={() => downloadRendezVous('annulé')}
// // // // //             className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
// // // // //           >
// // // // //             Télécharger Annulés
// // // // //           </button>
// // // // //         </div> */}
// // // // //       </div>

// // // // //       <div className="max-w-4xl mx-auto">
// // // // //         <div className="bg-white rounded-xl shadow-md overflow-hidden">
// // // // //           {rendezVous.length === 0 ? (
// // // // //             <div className="text-center p-8">
// // // // //               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // // // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// // // // //               </svg>
// // // // //               <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun rendez-vous à venir</h3>
// // // // //               <p className="mt-1 text-sm text-gray-500">
// // // // //                 Vous n'avez aucun rendez-vous programmé pour le moment.
// // // // //               </p>
// // // // //             </div>
// // // // //           ) : (
// // // // //             <ul className="divide-y divide-gray-200">
// // // // //               {rendezVous.map((rdv) => (
// // // // //                 <li key={rdv.id} className="p-4 hover:bg-gray-50">
// // // // //                   <div className="flex items-start">
// // // // //                     <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
// // // // //                       {rdv.patient?.user?.profil_url ? (
// // // // //                         <img 
// // // // //                           src={rdv.patient.user.profil_url} 
// // // // //                           alt="Photo du patient" 
// // // // //                           className="h-10 w-10 rounded-full object-cover"
// // // // //                         />
// // // // //                       ) : (
// // // // //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // // // //                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
// // // // //                         </svg>
// // // // //                       )}
// // // // //                     </div>
// // // // //                     <div className="ml-4 flex-1">
// // // // //                       <div className="flex items-center justify-between">
// // // // //                         <div>
// // // // //                           <h3 className="text-lg font-medium text-gray-900">
// // // // //                             {rdv.patient?.user?.nom || 'Patient inconnu'}
// // // // //                           </h3>
// // // // //                           {rdv.patient?.date_naissance && (
// // // // //                             <p className="text-sm text-gray-500">
// // // // //                               Âge: {calculerAge(rdv.patient.date_naissance)} ans
// // // // //                             </p>
// // // // //                           )}
// // // // //                         </div>
// // // // //                         <span className={`px-2 py-1 text-xs rounded-full ${
// // // // //                           rdv.statut === 'planifié' ? 'bg-blue-100 text-blue-800' :
// // // // //                           rdv.statut === 'confirmé' ? 'bg-green-100 text-green-800' :
// // // // //                           rdv.statut === 'annulé' ? 'bg-red-100 text-red-800' :
// // // // //                           rdv.statut === 'terminé' ? 'bg-purple-100 text-purple-800' :
// // // // //                           'bg-gray-100 text-gray-800'
// // // // //                         }`}>
// // // // //                           {rdv.statut}
// // // // //                         </span>
// // // // //                       </div>
// // // // //                       <div className="mt-1 text-sm text-gray-600">
// // // // //                         <p>
// // // // //                           {format(new Date(rdv.date_heure), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
// // // // //                         </p>
// // // // //                         <p className="mt-1">
// // // // //                           Lieu: {LIEUX_CONSULTATION.includes(rdv.lieu) ? rdv.lieu : 'Autre lieu'}
// // // // //                         </p>
// // // // //                         {rdv.motif && (
// // // // //                           <p className="mt-1">
// // // // //                             Motif: {rdv.motif}
// // // // //                           </p>
// // // // //                         )}
// // // // //                       </div>
// // // // //                       <div className="mt-2 flex space-x-3">
// // // // //                         {rdv.statut === 'planifié' && (
// // // // //                           <>
// // // // //                             <button
// // // // //                               onClick={() => confirmerRendezVous(rdv.id)}
// // // // //                               className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
// // // // //                             >
// // // // //                               Confirmer
// // // // //                             </button>
// // // // //                             <button
// // // // //                               onClick={() => annulerRendezVous(rdv.id)}
// // // // //                               className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
// // // // //                             >
// // // // //                               Annuler
// // // // //                             </button>
// // // // //                           </>
// // // // //                         )}
// // // // //                         <button
// // // // //                           onClick={() => openDossierMedical(rdv.patient_id)}
// // // // //                           className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
// // // // //                         >
// // // // //                           Dossier médical
// // // // //                         </button>
// // // // //                         <button
// // // // //   onClick={() => marquerPresence(rdv.id, !rdv.present)}
// // // // //   className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md ${
// // // // //     rdv.present 
// // // // //       ? 'bg-green-100 text-green-800 hover:bg-green-200' 
// // // // //       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
// // // // //   }`}
// // // // // >
// // // // //   {rdv.present ? '✓ Présent' : 'Marquer présent'}
// // // // // </button>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 </li>
// // // // //               ))}
// // // // //             </ul>
// // // // //           )}
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   )
// // // // // }
// // // // 'use client'
// // // // import { useState, useEffect } from 'react'
// // // // import { useAuth } from '@/context/AuthContext'
// // // // import { useRouter } from 'next/navigation'
// // // // import { toast } from 'react-toastify'
// // // // import { supabase } from '@/lib/supabase/client'
// // // // import { format, isBefore } from 'date-fns'
// // // // import { fr } from 'date-fns/locale'
// // // // import { EmailSenderButton } from '@/components/EmailSenderButton'
// // // // import PatientDossierModal from '@/components/PatientDossierModal'

// // // // // Définition des statuts possibles
// // // // const RDV_STATUS = {
// // // //   PLANNED: 'planifié',
// // // //   CONFIRMED: 'confirmé',
// // // //   CANCELLED: 'annulé',
// // // //   COMPLETED: 'effectué',
// // // //   MISSED: 'absent'
// // // // }

// // // // export default function RendezVousMedecin() {
// // // //   const { user, loading: authLoading } = useAuth()
// // // //   const router = useRouter()
// // // //   const [loading, setLoading] = useState(true)
// // // //   const [rendezVous, setRendezVous] = useState<any[]>([])
// // // //   const [selectedPatient, setSelectedPatient] = useState<{id: string, medecinId: string} | null>(null)

// // // //   const fetchRendezVous = async () => {
// // // //     try {
// // // //       setLoading(true)
      
// // // //       // Vérifier que c'est bien un médecin
// // // //       const { data: medecinData, error: medecinError } = await supabase
// // // //         .from('medecin_infos')
// // // //         .select('id')
// // // //         .eq('user_id', user?.id)
// // // //         .single()

// // // //       if (medecinError || !medecinData) {
// // // //         throw new Error('Profil médecin non trouvé')
// // // //       }

// // // //       // Récupérer les rendez-vous
// // // //       const { data, error } = await supabase
// // // //         .from('rendez_vous')
// // // //         .select(`
// // // //           *,
// // // //           patient:patient_infos(
// // // //             user:users(nom, profil_url),
// // // //             date_naissance
// // // //           )
// // // //         `)
// // // //         .eq('medecin_id', medecinData.id)
// // // //         .order('date_heure', { ascending: true })

// // // //       if (error) throw error
// // // //       setRendezVous(data || [])

// // // //     } catch (error: any) {
// // // //       console.error('Erreur lors du chargement:', error)
// // // //       toast.error(`Erreur: ${error.message}`)
// // // //     } finally {
// // // //       setLoading(false)
// // // //     }
// // // //   }

// // // //   useEffect(() => {
// // // //     if (authLoading) return
// // // //     if (!user) {
// // // //       router.push('/login')
// // // //       return
// // // //     }
// // // //     fetchRendezVous()
// // // //   }, [user, authLoading, router])

// // // //   const updateRdvStatus = async (id: string, newStatus: string, present: boolean | null = null) => {
// // // //     try {
// // // //       setLoading(true)
      
// // // //       const updates: any = { 
// // // //         statut: newStatus,
// // // //         date_verification: new Date().toISOString()
// // // //       }
      
// // // //       if (present !== null) {
// // // //         updates.present = present
// // // //       }

// // // //       const { error } = await supabase
// // // //         .from('rendez_vous')
// // // //         .update(updates)
// // // //         .eq('id', id)

// // // //       if (error) throw error

// // // //       setRendezVous(prev => prev.map(rdv => 
// // // //         rdv.id === id ? { ...rdv, ...updates } : rdv
// // // //       ))

// // // //       toast.success(`Statut mis à jour: ${newStatus}`)
// // // //     } catch (error: any) {
// // // //       console.error('Erreur:', error)
// // // //       toast.error(`Erreur: ${error.message}`)
// // // //     } finally {
// // // //       setLoading(false)
// // // //     }
// // // //   }

// // // //   const calculerAge = (dateNaissance: string) => {
// // // //     const today = new Date()
// // // //     const birthDate = new Date(dateNaissance)
// // // //     let age = today.getFullYear() - birthDate.getFullYear()
// // // //     const m = today.getMonth() - birthDate.getMonth()
// // // //     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
// // // //       age--
// // // //     }
// // // //     return age
// // // //   }

// // // //   const openDossierMedical = async (patientId: string) => {
// // // //     try {
// // // //       const { data: medecinData, error } = await supabase
// // // //         .from('medecin_infos')
// // // //         .select('id')
// // // //         .eq('user_id', user?.id)
// // // //         .single()

// // // //       if (error || !medecinData) throw error || new Error('Médecin non trouvé')

// // // //       setSelectedPatient({
// // // //         id: patientId,
// // // //         medecinId: medecinData.id
// // // //       })
// // // //     } catch (error: any) {
// // // //       toast.error(`Erreur: ${error.message}`)
// // // //     }
// // // //   }

// // // //   const closeDossierMedical = () => {
// // // //     setSelectedPatient(null)
// // // //   }

// // // //   const getStatusColor = (status: string) => {
// // // //     switch (status) {
// // // //       case RDV_STATUS.PLANNED: return 'bg-blue-100 text-blue-800'
// // // //       case RDV_STATUS.CONFIRMED: return 'bg-green-100 text-green-800'
// // // //       case RDV_STATUS.CANCELLED: return 'bg-red-100 text-red-800'
// // // //       case RDV_STATUS.COMPLETED: return 'bg-purple-100 text-purple-800'
// // // //       case RDV_STATUS.MISSED: return 'bg-orange-100 text-orange-800'
// // // //       default: return 'bg-gray-100 text-gray-800'
// // // //     }
// // // //   }

// // // //   const isPastAppointment = (date: string) => {
// // // //     return isBefore(new Date(date), new Date())
// // // //   }

// // // //   if (authLoading || loading) {
// // // //     return (
// // // //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// // // //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   if (!user) {
// // // //     return (
// // // //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// // // //         <p className="text-gray-600">Redirection vers la page de connexion...</p>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-50 py-8 sm:px-6 lg:px-8">
// // // //       {selectedPatient && (
// // // //         <PatientDossierModal 
// // // //           patientId={selectedPatient.id} 
// // // //           medecinId={selectedPatient.medecinId}
// // // //           onClose={closeDossierMedical}
// // // //         />
// // // //       )}
      
// // // //       <div className="text-center mb-8">
// // // //         <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
// // // //         <EmailSenderButton/>
// // // //         <p className="mt-2 text-lg text-gray-600">
// // // //           Gestion des rendez-vous
// // // //         </p>
// // // //       </div>

// // // //       <div className="max-w-4xl mx-auto">
// // // //         <div className="bg-white rounded-xl shadow-md overflow-hidden">
// // // //           {rendezVous.length === 0 ? (
// // // //             <div className="text-center p-8">
// // // //               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// // // //               </svg>
// // // //               <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun rendez-vous</h3>
// // // //               <p className="mt-1 text-sm text-gray-500">
// // // //                 Vous n'avez aucun rendez-vous programmé.
// // // //               </p>
// // // //             </div>
// // // //           ) : (
// // // //             <ul className="divide-y divide-gray-200">
// // // //               {rendezVous.map((rdv) => {
// // // //                 const isPast = isPastAppointment(rdv.date_heure)
// // // //                 const canMarkPresence = isPast && rdv.statut === RDV_STATUS.CONFIRMED
                
// // // //                 return (
// // // //                   <li key={rdv.id} className="p-4 hover:bg-gray-50">
// // // //                     <div className="flex items-start">
// // // //                       <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
// // // //                         {rdv.patient?.user?.profil_url ? (
// // // //                           <img 
// // // //                             src={rdv.patient.user.profil_url} 
// // // //                             alt="Photo du patient" 
// // // //                             className="h-10 w-10 rounded-full object-cover"
// // // //                           />
// // // //                         ) : (
// // // //                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // // //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
// // // //                           </svg>
// // // //                         )}
// // // //                       </div>
// // // //                       <div className="ml-4 flex-1">
// // // //                         <div className="flex items-center justify-between">
// // // //                           <div>
// // // //                             <h3 className="text-lg font-medium text-gray-900">
// // // //                               {rdv.patient?.user?.nom || 'Patient inconnu'}
// // // //                             </h3>
// // // //                             {rdv.patient?.date_naissance && (
// // // //                               <p className="text-sm text-gray-500">
// // // //                                 Âge: {calculerAge(rdv.patient.date_naissance)} ans
// // // //                               </p>
// // // //                             )}
// // // //                           </div>
// // // //                           <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(rdv.statut)}`}>
// // // //                             {rdv.statut}
// // // //                           </span>
// // // //                         </div>
// // // //                         <div className="mt-1 text-sm text-gray-600">
// // // //                           <p>
// // // //                             {format(new Date(rdv.date_heure), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
// // // //                             {isPast && ' (Passé)'}
// // // //                           </p>
// // // //                           <p className="mt-1">
// // // //                             Lieu: {rdv.lieu || 'Non spécifié'}
// // // //                           </p>
// // // //                           {rdv.motif && (
// // // //                             <p className="mt-1">
// // // //                               Motif: {rdv.motif}
// // // //                             </p>
// // // //                           )}
// // // //                         </div>
// // // //                         <div className="mt-2 flex flex-wrap gap-2">
// // // //                           {rdv.statut === RDV_STATUS.PLANNED && (
// // // //                             <>
// // // //                               <button
// // // //                                 onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.CONFIRMED)}
// // // //                                 className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-green-100 text-green-800 hover:bg-green-200"
// // // //                               >
// // // //                                 Confirmer
// // // //                               </button>
// // // //                               <button
// // // //                                 onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.CANCELLED)}
// // // //                                 className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-red-100 text-red-800 hover:bg-red-200"
// // // //                               >
// // // //                                 Annuler
// // // //                               </button>
// // // //                             </>
// // // //                           )}

// // // //                           {canMarkPresence && (
// // // //                             <>
// // // //                               <button
// // // //                                 onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.COMPLETED, true)}
// // // //                                 className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-purple-100 text-purple-800 hover:bg-purple-200"
// // // //                               >
// // // //                                 Marquer comme effectué
// // // //                               </button>
// // // //                               <button
// // // //                                 onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.MISSED, false)}
// // // //                                 className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-orange-100 text-orange-800 hover:bg-orange-200"
// // // //                               >
// // // //                                 Patient absent
// // // //                               </button>
// // // //                             </>
// // // //                           )}

// // // //                           <button
// // // //                             onClick={() => openDossierMedical(rdv.patient_id)}
// // // //                             className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200"
// // // //                           >
// // // //                             Dossier médical
// // // //                           </button>
// // // //                         </div>
// // // //                       </div>
// // // //                     </div>
// // // //                   </li>
// // // //                 )
// // // //               })}
// // // //             </ul>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }


// // // // 'use client'
// // // // import { useState, useEffect } from 'react'
// // // // import { useAuth } from '@/context/AuthContext'
// // // // import { useRouter } from 'next/navigation'
// // // // import { toast } from 'react-toastify'
// // // // import { supabase } from '@/lib/supabase/client'
// // // // import { format, isBefore } from 'date-fns'
// // // // import { fr } from 'date-fns/locale'
// // // // import { EmailSenderButton } from '@/components/EmailSenderButton'
// // // // import PatientDossierModal from '@/components/PatientDossierModal'

// // // // // Définition des statuts possibles
// // // // const RDV_STATUS = {
// // // //   PLANNED: 'planifié',
// // // //   CONFIRMED: 'confirmé',
// // // //   CANCELLED: 'annulé',
// // // //   COMPLETED: 'effectué',
// // // //   MISSED: 'absent'
// // // // }

// // // // export default function RendezVousMedecin() {
// // // //   const { user, loading: authLoading } = useAuth()
// // // //   const router = useRouter()
// // // //   const [loading, setLoading] = useState(true)
// // // //   const [rendezVous, setRendezVous] = useState<any[]>([])
// // // //   const [selectedPatient, setSelectedPatient] = useState<{id: string, medecinId: string} | null>(null)
// // // //   const [medecinId, setMedecinId] = useState<string | null>(null)

// // // //   const fetchMedecinId = async () => {
// // // //     try {
// // // //       const { data, error } = await supabase
// // // //         .from('medecin_infos')
// // // //         .select('id')
// // // //         .eq('user_id', user?.id)
// // // //         .single()

// // // //       if (error || !data) {
// // // //         throw error || new Error('Profil médecin non trouvé')
// // // //       }

// // // //       setMedecinId(data.id)
// // // //       return data.id
// // // //     } catch (error) {
// // // //       console.error('Erreur:', error)
// // // //       throw error
// // // //     }
// // // //   }

// // // //   const fetchRendezVous = async () => {
// // // //     try {
// // // //       setLoading(true)
      
// // // //       const medecinId = await fetchMedecinId()

// // // //       // Récupérer les rendez-vous
// // // //       const { data, error } = await supabase
// // // //         .from('rendez_vous')
// // // //         .select(`
// // // //           *,
// // // //           patient:patient_infos(
// // // //             id,
// // // //             user:users(nom, profil_url),
// // // //             date_naissance
// // // //           ),
// // // //           medecin:medecin_infos(
// // // //             id
// // // //           )
// // // //         `)
// // // //         .eq('medecin_id', medecinId)
// // // //         .order('date_heure', { ascending: true })

// // // //       if (error) throw error
// // // //       setRendezVous(data || [])

// // // //     } catch (error: any) {
// // // //       console.error('Erreur lors du chargement:', error)
// // // //       toast.error(`Erreur: ${error.message}`)
// // // //     } finally {
// // // //       setLoading(false)
// // // //     }
// // // //   }

// // // //   useEffect(() => {
// // // //     if (authLoading) return
// // // //     if (!user) {
// // // //       router.push('/login')
// // // //       return
// // // //     }
// // // //     fetchRendezVous()
// // // //   }, [user, authLoading, router])

// // // //   // const updateRdvStatus = async (id: string, newStatus: string) => {
// // // //   //   try {
// // // //   //     setLoading(true)
      
// // // //   //     const { error } = await supabase
// // // //   //       .from('rendez_vous')
// // // //   //       .update({ 
// // // //   //         statut: newStatus,
// // // //   //         updated_at: new Date().toISOString()
// // // //   //       })
// // // //   //       .eq('id', id)

// // // //   //     if (error) throw error

// // // //   //     setRendezVous(prev => prev.map(rdv => 
// // // //   //       rdv.id === id ? { ...rdv, statut: newStatus } : rdv
// // // //   //     ))

// // // //   //     toast.success(`Statut mis à jour: ${newStatus}`)
// // // //   //   } catch (error: any) {
// // // //   //     console.error('Erreur:', error)
// // // //   //     toast.error(`Erreur: ${error.message}`)
// // // //   //   } finally {
// // // //   //     setLoading(false)
// // // //   //     fetchRendezVous() // Rafraîchir les données
// // // //   //   }
// // // //   // }
// // // // const updateRdvStatus = async (id: string, newStatus: string, present: boolean | null = null) => {
// // // //   try {
// // // //     setLoading(true);
    
// // // //     const updates: any = { 
// // // //       statut: newStatus,
// // // //       updated_at: new Date().toISOString()
// // // //     };
    
// // // //     // Gestion spécifique de la présence
// // // //     if (newStatus === RDV_STATUS.COMPLETED) {
// // // //       updates.present = true;
// // // //     } else if (newStatus === RDV_STATUS.MISSED) {
// // // //       updates.present = false;
// // // //     }
    
// // // //     // Si present est explicitement passé
// // // //     if (present !== null) {
// // // //       updates.present = present;
// // // //     }

// // // //     const { error } = await supabase
// // // //       .from('rendez_vous')
// // // //       .update(updates)
// // // //       .eq('id', id);

// // // //     if (error) throw error;

// // // //     setRendezVous(prev => prev.map(rdv => 
// // // //       rdv.id === id ? { ...rdv, ...updates } : rdv
// // // //     ));

// // // //     toast.success(`Statut mis à jour: ${newStatus}`);
// // // //   } catch (error: any) {
// // // //     console.error('Erreur:', error);
// // // //     toast.error(`Erreur: ${error.message}`);
// // // //   } finally {
// // // //     setLoading(false);
// // // //   }
// // // // };
// // // //   const calculerAge = (dateNaissance: string) => {
// // // //     const today = new Date()
// // // //     const birthDate = new Date(dateNaissance)
// // // //     let age = today.getFullYear() - birthDate.getFullYear()
// // // //     const m = today.getMonth() - birthDate.getMonth()
// // // //     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
// // // //       age--
// // // //     }
// // // //     return age
// // // //   }

// // // //   const openDossierMedical = async (patientId: string) => {
// // // //     try {
// // // //       if (!medecinId) {
// // // //         const id = await fetchMedecinId()
// // // //         setMedecinId(id)
// // // //       }

// // // //       setSelectedPatient({
// // // //         id: patientId,
// // // //         medecinId: medecinId!
// // // //       })
// // // //     } catch (error: any) {
// // // //       toast.error(`Erreur: ${error.message}`)
// // // //     }
// // // //   }

// // // //   const closeDossierMedical = () => {
// // // //     setSelectedPatient(null)
// // // //   }

// // // //   const getStatusColor = (status: string) => {
// // // //     switch (status) {
// // // //       case RDV_STATUS.PLANNED: return 'bg-blue-100 text-blue-800'
// // // //       case RDV_STATUS.CONFIRMED: return 'bg-green-100 text-green-800'
// // // //       case RDV_STATUS.CANCELLED: return 'bg-red-100 text-red-800'
// // // //       case RDV_STATUS.COMPLETED: return 'bg-purple-100 text-purple-800'
// // // //       case RDV_STATUS.MISSED: return 'bg-orange-100 text-orange-800'
// // // //       default: return 'bg-gray-100 text-gray-800'
// // // //     }
// // // //   }

// // // //   const isPastAppointment = (date: string) => {
// // // //     return isBefore(new Date(date), new Date())
// // // //   }

// // // //   if (authLoading || loading) {
// // // //     return (
// // // //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// // // //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   if (!user) {
// // // //     return (
// // // //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// // // //         <p className="text-gray-600">Redirection vers la page de connexion...</p>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-50 py-8 sm:px-6 lg:px-8">
// // // //       {selectedPatient && (
// // // //         <PatientDossierModal 
// // // //           patientId={selectedPatient.id} 
// // // //           medecinId={selectedPatient.medecinId}
// // // //           onClose={closeDossierMedical}
// // // //         />
// // // //       )}
      
// // // //       <div className="text-center mb-8">
// // // //         <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
// // // //         <EmailSenderButton/>
// // // //         <p className="mt-2 text-lg text-gray-600">
// // // //           Gestion des rendez-vous
// // // //         </p>
// // // //       </div>

// // // //       <div className="max-w-4xl mx-auto">
// // // //         <div className="bg-white rounded-xl shadow-md overflow-hidden">
// // // //           {rendezVous.length === 0 ? (
// // // //             <div className="text-center p-8">
// // // //               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// // // //               </svg>
// // // //               <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun rendez-vous</h3>
// // // //               <p className="mt-1 text-sm text-gray-500">
// // // //                 Vous n'avez aucun rendez-vous programmé.
// // // //               </p>
// // // //             </div>
// // // //           ) : (
// // // //             <ul className="divide-y divide-gray-200">
// // // //               {rendezVous.map((rdv) => {
// // // //                 const isPast = isPastAppointment(rdv.date_heure)
// // // //                 const canMarkPresence = isPast && rdv.statut === RDV_STATUS.CONFIRMED
                
// // // //                 return (
// // // //                   <li key={rdv.id} className="p-4 hover:bg-gray-50">
// // // //                     <div className="flex items-start">
// // // //                       <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
// // // //                         {rdv.patient?.user?.profil_url ? (
// // // //                           <img 
// // // //                             src={rdv.patient.user.profil_url} 
// // // //                             alt="Photo du patient" 
// // // //                             className="h-10 w-10 rounded-full object-cover"
// // // //                           />
// // // //                         ) : (
// // // //                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // // //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
// // // //                           </svg>
// // // //                         )}
// // // //                       </div>
// // // //                       <div className="ml-4 flex-1">
// // // //                         <div className="flex items-center justify-between">
// // // //                           <div>
// // // //                             <h3 className="text-lg font-medium text-gray-900">
// // // //                               {rdv.patient?.user?.nom || 'Patient inconnu'}
// // // //                             </h3>
// // // //                             {rdv.patient?.date_naissance && (
// // // //                               <p className="text-sm text-gray-500">
// // // //                                 Âge: {calculerAge(rdv.patient.date_naissance)} ans
// // // //                               </p>
// // // //                             )}
// // // //                           </div>
// // // //                           <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(rdv.statut)}`}>
// // // //                             {rdv.statut}
// // // //                           </span>
// // // //                         </div>
// // // //                         <div className="mt-1 text-sm text-gray-600">
// // // //                           <p>
// // // //                             {format(new Date(rdv.date_heure), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
// // // //                             {isPast && ' (Passé)'}
// // // //                           </p>
// // // //                           <p className="mt-1">
// // // //                             Lieu: {rdv.lieu || 'Non spécifié'}
// // // //                           </p>
// // // //                           {rdv.motif && (
// // // //                             <p className="mt-1">
// // // //                               Motif: {rdv.motif}
// // // //                             </p>
// // // //                           )}
// // // //                         </div>
// // // //                         <div className="mt-2 flex flex-wrap gap-2">
// // // //                           {rdv.statut === RDV_STATUS.PLANNED && (
// // // //                             <>
// // // //                               <button
// // // //                                 onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.CONFIRMED)}
// // // //                                 className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-green-100 text-green-800 hover:bg-green-200"
// // // //                               >
// // // //                                 Confirmer
// // // //                               </button>
// // // //                               <button
// // // //                                 onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.CANCELLED)}
// // // //                                 className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-red-100 text-red-800 hover:bg-red-200"
// // // //                               >
// // // //                                 Annuler
// // // //                               </button>
// // // //                             </>
// // // //                           )}

// // // //                           {/* {canMarkPresence && (
// // // //                             <>
// // // //                               <button
// // // //                                 onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.COMPLETED)}
// // // //                                 className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-purple-100 text-purple-800 hover:bg-purple-200"
// // // //                               >
// // // //                                 Marquer comme effectué
// // // //                               </button>
// // // //                               <button
// // // //                                 onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.MISSED)}
// // // //                                 className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-orange-100 text-orange-800 hover:bg-orange-200"
// // // //                               >
// // // //                                 Patient absent
// // // //                               </button>
// // // //                             </>
// // // //                           )} */}

// // // //                           {canMarkPresence && (
// // // //   <>
// // // //     <button
// // // //       onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.COMPLETED, true)}
// // // //       className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-purple-100 text-purple-800 hover:bg-purple-200"
// // // //     >
// // // //       Patient présent
// // // //     </button>
// // // //     <button
// // // //       onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.MISSED, false)}
// // // //       className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-orange-100 text-orange-800 hover:bg-orange-200"
// // // //     >
// // // //       Patient absent
// // // //     </button>
// // // //   </>
// // // // )}

// // // //                           <button
// // // //                             onClick={() => openDossierMedical(rdv.patient.id)}
// // // //                             className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200"
// // // //                           >
// // // //                             Dossier médical
// // // //                           </button>
// // // //                         </div>
// // // //                       </div>
// // // //                     </div>
// // // //                   </li>
// // // //                 )
// // // //               })}
// // // //             </ul>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }
// // // 'use client'
// // // import { useState, useEffect } from 'react'
// // // import { useAuth } from '@/context/AuthContext'
// // // import { useRouter } from 'next/navigation'
// // // import { toast } from 'react-toastify'
// // // import { supabase } from '@/lib/supabase/client'
// // // import { format, isBefore } from 'date-fns'
// // // import { fr } from 'date-fns/locale'
// // // import { EmailSenderButton } from '@/components/EmailSenderButton'
// // // import PatientDossierModal from '@/components/PatientDossierModal'

// // // // Définition des statuts possibles
// // // const RDV_STATUS = {
// // //   PLANNED: 'planifié',
// // //   CONFIRMED: 'confirmé',
// // //   CANCELLED: 'annulé',
// // //   COMPLETED: 'effectué',
// // //   MISSED: 'absent',
// // //   TERMINATED: 'terminé'
// // // }

// // // export default function RendezVousMedecin() {
// // //   const { user, loading: authLoading } = useAuth()
// // //   const router = useRouter()
// // //   const [loading, setLoading] = useState(true)
// // //   const [rendezVous, setRendezVous] = useState<any[]>([])
// // //   const [selectedPatient, setSelectedPatient] = useState<{id: string, medecinId: string} | null>(null)
// // //   const [medecinId, setMedecinId] = useState<string | null>(null)

// // //   const fetchMedecinId = async () => {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from('medecin_infos')
// // //         .select('id')
// // //         .eq('user_id', user?.id)
// // //         .single()

// // //       if (error || !data) {
// // //         throw error || new Error('Profil médecin non trouvé')
// // //       }

// // //       setMedecinId(data.id)
// // //       return data.id
// // //     } catch (error) {
// // //       console.error('Erreur:', error)
// // //       throw error
// // //     }
// // //   }

// // //   const fetchRendezVous = async () => {
// // //     try {
// // //       setLoading(true)
      
// // //       const medecinId = await fetchMedecinId()

// // //       // Récupérer les rendez-vous
// // //       const { data, error } = await supabase
// // //         .from('rendez_vous')
// // //         .select(`
// // //           *,
// // //           patient:patient_infos(
// // //             id,
// // //             user:users(nom, profil_url),
// // //             date_naissance
// // //           ),
// // //           medecin:medecin_infos(
// // //             id
// // //           )
// // //         `)
// // //         .eq('medecin_id', medecinId)
// // //         .order('date_heure', { ascending: true })

// // //       if (error) throw error
// // //       setRendezVous(data || [])

// // //     } catch (error: any) {
// // //       console.error('Erreur lors du chargement:', error)
// // //       toast.error(`Erreur: ${error.message}`)
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   useEffect(() => {
// // //     if (authLoading) return
// // //     if (!user) {
// // //       router.push('/login')
// // //       return
// // //     }
// // //     fetchRendezVous()
// // //   }, [user, authLoading, router])

// // //   const updateRdvStatus = async (id: string, newStatus: string, present: boolean | null = null) => {
// // //     try {
// // //       setLoading(true);
      
// // //       const updates: any = { 
// // //         statut: newStatus,
// // //         updated_at: new Date().toISOString()
// // //       };
      
// // //       // Gestion spécifique de la présence
// // //       if (newStatus === RDV_STATUS.COMPLETED) {
// // //         updates.present = true;
// // //       } else if (newStatus === RDV_STATUS.MISSED) {
// // //         updates.present = false;
// // //       }
      
// // //       // Si present est explicitement passé
// // //       if (present !== null) {
// // //         updates.present = present;
// // //       }

// // //       const { error } = await supabase
// // //         .from('rendez_vous')
// // //         .update(updates)
// // //         .eq('id', id);

// // //       if (error) throw error;

// // //       setRendezVous(prev => prev.map(rdv => 
// // //         rdv.id === id ? { ...rdv, ...updates } : rdv
// // //       ));

// // //       toast.success(`Statut mis à jour: ${newStatus}`);
// // //       fetchRendezVous(); // Rafraîchir les données après mise à jour
// // //     } catch (error: any) {
// // //       console.error('Erreur:', error);
// // //       toast.error(`Erreur: ${error.message}`);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const calculerAge = (dateNaissance: string) => {
// // //     const today = new Date()
// // //     const birthDate = new Date(dateNaissance)
// // //     let age = today.getFullYear() - birthDate.getFullYear()
// // //     const m = today.getMonth() - birthDate.getMonth()
// // //     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
// // //       age--
// // //     }
// // //     return age
// // //   }

// // //   const openDossierMedical = async (patientId: string) => {
// // //     try {
// // //       if (!medecinId) {
// // //         const id = await fetchMedecinId()
// // //         setMedecinId(id)
// // //       }

// // //       setSelectedPatient({
// // //         id: patientId,
// // //         medecinId: medecinId!
// // //       })
// // //     } catch (error: any) {
// // //       toast.error(`Erreur: ${error.message}`)
// // //     }
// // //   }

// // //   const closeDossierMedical = () => {
// // //     setSelectedPatient(null)
// // //   }

// // //   const getStatusColor = (status: string) => {
// // //     switch (status) {
// // //       case RDV_STATUS.PLANNED: return 'bg-blue-100 text-blue-800'
// // //       case RDV_STATUS.CONFIRMED: return 'bg-green-100 text-green-800'
// // //       case RDV_STATUS.CANCELLED: return 'bg-red-100 text-red-800'
// // //       case RDV_STATUS.COMPLETED: return 'bg-purple-100 text-purple-800'
// // //       case RDV_STATUS.MISSED: return 'bg-orange-100 text-orange-800'
// // //       default: return 'bg-gray-100 text-gray-800'
// // //     }
// // //   }

// // //   const isPastAppointment = (date: string) => {
// // //     return isBefore(new Date(date), new Date())
// // //   }

// // //   const shouldShowPresenceButtons = (rdv: any) => {
// // //     const isPast = isPastAppointment(rdv.date_heure);
// // //     const isConfirmed = rdv.statut === RDV_STATUS.CONFIRMED;
// // //     const isNotCompleted = rdv.statut !== RDV_STATUS.COMPLETED && rdv.statut !== RDV_STATUS.MISSED;
    
// // //     return isPast && isConfirmed && isNotCompleted;
// // //   }

// // //   if (authLoading || loading) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// // //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
// // //       </div>
// // //     )
// // //   }

// // //   if (!user) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// // //         <p className="text-gray-600">Redirection vers la page de connexion...</p>
// // //       </div>
// // //     )
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-gray-50 py-8 sm:px-6 lg:px-8">
// // //       {selectedPatient && (
// // //         <PatientDossierModal 
// // //           patientId={selectedPatient.id} 
// // //           medecinId={selectedPatient.medecinId}
// // //           onClose={closeDossierMedical}
// // //         />
// // //       )}
      
// // //       <div className="text-center mb-8">
// // //         <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
// // //         <EmailSenderButton/>
// // //         <p className="mt-2 text-lg text-gray-600">
// // //           Gestion des rendez-vous
// // //         </p>
// // //       </div>

// // //       <div className="max-w-4xl mx-auto">
// // //         <div className="bg-white rounded-xl shadow-md overflow-hidden">
// // //           {rendezVous.length === 0 ? (
// // //             <div className="text-center p-8">
// // //               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// // //               </svg>
// // //               <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun rendez-vous</h3>
// // //               <p className="mt-1 text-sm text-gray-500">
// // //                 Vous n'avez aucun rendez-vous programmé.
// // //               </p>
// // //             </div>
// // //           ) : (
// // //             <ul className="divide-y divide-gray-200">
// // //               {rendezVous.map((rdv) => (
// // //                 <li key={rdv.id} className="p-4 hover:bg-gray-50">
// // //                   <div className="flex items-start">
// // //                     <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
// // //                       {rdv.patient?.user?.profil_url ? (
// // //                         <img 
// // //                           src={rdv.patient.user.profil_url} 
// // //                           alt="Photo du patient" 
// // //                           className="h-10 w-10 rounded-full object-cover"
// // //                         />
// // //                       ) : (
// // //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // //                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
// // //                         </svg>
// // //                       )}
// // //                     </div>
// // //                     <div className="ml-4 flex-1">
// // //                       <div className="flex items-center justify-between">
// // //                         <div>
// // //                           <h3 className="text-lg font-medium text-gray-900">
// // //                             {rdv.patient?.user?.nom || 'Patient inconnu'}
// // //                           </h3>
// // //                           {rdv.patient?.date_naissance && (
// // //                             <p className="text-sm text-gray-500">
// // //                               Âge: {calculerAge(rdv.patient.date_naissance)} ans
// // //                             </p>
// // //                           )}
// // //                         </div>
// // //                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(rdv.statut)}`}>
// // //                           {rdv.statut}
// // //                         </span>
// // //                       </div>
// // //                       <div className="mt-1 text-sm text-gray-600">
// // //                         <p>
// // //                           {format(new Date(rdv.date_heure), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
// // //                           {isPastAppointment(rdv.date_heure) && ' (Passé)'}
// // //                         </p>
// // //                         <p className="mt-1">
// // //                           Lieu: {rdv.lieu || 'Non spécifié'}
// // //                         </p>
// // //                         {rdv.motif && (
// // //                           <p className="mt-1">
// // //                             Motif: {rdv.motif}
// // //                           </p>
// // //                         )}
// // //                       </div>
// // //                       <div className="mt-2 flex flex-wrap gap-2">
// // //                         {rdv.statut === RDV_STATUS.PLANNED && (
// // //                           <>
// // //                             <button
// // //                               onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.CONFIRMED)}
// // //                               className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-green-100 text-green-800 hover:bg-green-200"
// // //                             >
// // //                               Confirmer
// // //                             </button>
// // //                             <button
// // //                               onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.CANCELLED)}
// // //                               className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-red-100 text-red-800 hover:bg-red-200"
// // //                             >
// // //                               Annuler
// // //                             </button>
// // //                           </>
// // //                         )}

// // //                         {shouldShowPresenceButtons(rdv) && (
// // //                           <>
// // //                             <button
// // //                               onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.COMPLETED, true)}
// // //                               className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-purple-100 text-purple-800 hover:bg-purple-200"
// // //                             >
// // //                               Patient présent
// // //                             </button>
// // //                             <button
// // //                               onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.MISSED, false)}
// // //                               className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-orange-100 text-orange-800 hover:bg-orange-200"
// // //                             >
// // //                               Patient absent
// // //                             </button>
// // //                           </>
// // //                         )}

// // //                         <button
// // //                           onClick={() => openDossierMedical(rdv.patient.id)}
// // //                           className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200"
// // //                         >
// // //                           Dossier médical
// // //                         </button>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </li>
// // //               ))}
// // //             </ul>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }


// // 'use client'
// // import { useState, useEffect } from 'react'
// // import { useAuth } from '@/context/AuthContext'
// // import { useRouter } from 'next/navigation'
// // import { toast } from 'react-toastify'
// // import { supabase } from '@/lib/supabase/client'
// // import { format, isBefore } from 'date-fns'
// // import { fr } from 'date-fns/locale'
// // import { EmailSenderButton } from '@/components/EmailSenderButton'
// // import PatientDossierModal from '@/components/PatientDossierModal'

// // // Définition des statuts possibles
// // const RDV_STATUS = {
// //   PLANNED: 'planifié',
// //   CONFIRMED: 'confirmé',
// //   CANCELLED: 'annulé',
// //   COMPLETED: 'effectué',
// //   MISSED: 'absent'
// // }

// // export default function RendezVousMedecin() {
// //   const { user, loading: authLoading } = useAuth()
// //   const router = useRouter()
// //   const [loading, setLoading] = useState(true)
// //   const [rendezVous, setRendezVous] = useState<any[]>([])
// //   const [selectedPatient, setSelectedPatient] = useState<{id: string, medecinId: string} | null>(null)
// //   const [medecinId, setMedecinId] = useState<string | null>(null)

// //   const fetchMedecinId = async () => {
// //     try {
// //       const { data, error } = await supabase
// //         .from('medecin_infos')
// //         .select('id')
// //         .eq('user_id', user?.id)
// //         .single()

// //       if (error || !data) {
// //         throw error || new Error('Profil médecin non trouvé')
// //       }

// //       setMedecinId(data.id)
// //       return data.id
// //     } catch (error) {
// //       console.error('Erreur:', error)
// //       throw error
// //     }
// //   }

// //   const fetchRendezVous = async () => {
// //     try {
// //       setLoading(true)
      
// //       const medecinId = await fetchMedecinId()

// //       // Récupérer les rendez-vous
// //       const { data, error } = await supabase
// //         .from('rendez_vous')
// //         .select(`
// //           *,
// //           patient:patient_infos(
// //             id,
// //             user:users(nom, profil_url),
// //             date_naissance
// //           ),
// //           medecin:medecin_infos(
// //             id
// //           )
// //         `)
// //         .eq('medecin_id', medecinId)
// //         .order('date_heure', { ascending: true })

// //       if (error) throw error
      
// //       // Mapper les données pour s'assurer que le statut est cohérent avec la présence
// //       const formattedData = data?.map(rdv => {
// //         let statut = rdv.statut
// //         // Si le rendez-vous est marqué comme terminé mais sans présence définie
// //         if (statut === 'terminé') {
// //           statut = rdv.present ? RDV_STATUS.COMPLETED : RDV_STATUS.MISSED
// //         }
// //         return { ...rdv, statut }
// //       }) || []

// //       setRendezVous(formattedData)

// //     } catch (error: any) {
// //       console.error('Erreur lors du chargement:', error)
// //       toast.error(`Erreur: ${error.message}`)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   useEffect(() => {
// //     if (authLoading) return
// //     if (!user) {
// //       router.push('/login')
// //       return
// //     }
// //     fetchRendezVous()
// //   }, [user, authLoading, router])

// //   const updateRdvStatus = async (id: string, newStatus: string) => {
// //     try {
// //       setLoading(true)
      
// //       let updates: any = { 
// //         statut: newStatus,
// //         updated_at: new Date().toISOString()
// //       }

// //       // Gestion spécifique des statuts liés à la présence
// //       if (newStatus === RDV_STATUS.COMPLETED) {
// //         updates.present = true
// //       } else if (newStatus === RDV_STATUS.MISSED) {
// //         updates.present = false
// //       }

// //       const { error } = await supabase
// //         .from('rendez_vous')
// //         .update(updates)
// //         .eq('id', id)

// //       if (error) throw error

// //       setRendezVous(prev => prev.map(rdv => 
// //         rdv.id === id ? { ...rdv, ...updates } : rdv
// //       ))

// //       toast.success(`Statut mis à jour: ${newStatus}`)
// //     } catch (error: any) {
// //       console.error('Erreur:', error)
// //       toast.error(`Erreur: ${error.message}`)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const calculerAge = (dateNaissance: string) => {
// //     const today = new Date()
// //     const birthDate = new Date(dateNaissance)
// //     let age = today.getFullYear() - birthDate.getFullYear()
// //     const m = today.getMonth() - birthDate.getMonth()
// //     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
// //       age--
// //     }
// //     return age
// //   }

// //   const openDossierMedical = async (patientId: string) => {
// //     try {
// //       if (!medecinId) {
// //         const id = await fetchMedecinId()
// //         setMedecinId(id)
// //       }

// //       setSelectedPatient({
// //         id: patientId,
// //         medecinId: medecinId!
// //       })
// //     } catch (error: any) {
// //       toast.error(`Erreur: ${error.message}`)
// //     }
// //   }

// //   const closeDossierMedical = () => {
// //     setSelectedPatient(null)
// //   }

// //   const getStatusColor = (status: string) => {
// //     switch (status) {
// //       case RDV_STATUS.PLANNED: return 'bg-blue-100 text-blue-800'
// //       case RDV_STATUS.CONFIRMED: return 'bg-green-100 text-green-800'
// //       case RDV_STATUS.CANCELLED: return 'bg-red-100 text-red-800'
// //       case RDV_STATUS.COMPLETED: return 'bg-purple-100 text-purple-800'
// //       case RDV_STATUS.MISSED: return 'bg-orange-100 text-orange-800'
// //       default: return 'bg-gray-100 text-gray-800'
// //     }
// //   }

// //   const isPastAppointment = (date: string) => {
// //     return isBefore(new Date(date), new Date())
// //   }

// //   const shouldShowPresenceButtons = (rdv: any) => {
// //     const isPast = isPastAppointment(rdv.date_heure)
// //     const isConfirmed = rdv.statut === RDV_STATUS.CONFIRMED
// //     const isNotCompleted = rdv.statut !== RDV_STATUS.COMPLETED && rdv.statut !== RDV_STATUS.MISSED
    
// //     return isPast && isConfirmed && isNotCompleted
// //   }

// //   if (authLoading || loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
// //       </div>
// //     )
// //   }

// //   if (!user) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //         <p className="text-gray-600">Redirection vers la page de connexion...</p>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-8 sm:px-6 lg:px-8">
// //       {selectedPatient && (
// //         <PatientDossierModal 
// //           patientId={selectedPatient.id} 
// //           medecinId={selectedPatient.medecinId}
// //           onClose={closeDossierMedical}
// //         />
// //       )}
      
// //       <div className="text-center mb-8">
// //         <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
// //         <EmailSenderButton/>
// //         <p className="mt-2 text-lg text-gray-600">
// //           Gestion des rendez-vous
// //         </p>
// //       </div>

// //       <div className="max-w-4xl mx-auto">
// //         <div className="bg-white rounded-xl shadow-md overflow-hidden">
// //           {rendezVous.length === 0 ? (
// //             <div className="text-center p-8">
// //               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// //               </svg>
// //               <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun rendez-vous</h3>
// //               <p className="mt-1 text-sm text-gray-500">
// //                 Vous n'avez aucun rendez-vous programmé.
// //               </p>
// //             </div>
// //           ) : (
// //             <ul className="divide-y divide-gray-200">
// //               {rendezVous.map((rdv) => (
// //                 <li key={rdv.id} className="p-4 hover:bg-gray-50">
// //                   <div className="flex items-start">
// //                     <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
// //                       {rdv.patient?.user?.profil_url ? (
// //                         <img 
// //                           src={rdv.patient.user.profil_url} 
// //                           alt="Photo du patient" 
// //                           className="h-10 w-10 rounded-full object-cover"
// //                         />
// //                       ) : (
// //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
// //                         </svg>
// //                       )}
// //                     </div>
// //                     <div className="ml-4 flex-1">
// //                       <div className="flex items-center justify-between">
// //                         <div>
// //                           <h3 className="text-lg font-medium text-gray-900">
// //                             {rdv.patient?.user?.nom || 'Patient inconnu'}
// //                           </h3>
// //                           {rdv.patient?.date_naissance && (
// //                             <p className="text-sm text-gray-500">
// //                               Âge: {calculerAge(rdv.patient.date_naissance)} ans
// //                             </p>
// //                           )}
// //                         </div>
// //                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(rdv.statut)}`}>
// //                           {rdv.statut}
// //                         </span>
// //                       </div>
// //                       <div className="mt-1 text-sm text-gray-600">
// //                         <p>
// //                           {format(new Date(rdv.date_heure), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
// //                           {isPastAppointment(rdv.date_heure) && ' (Passé)'}
// //                         </p>
// //                         <p className="mt-1">
// //                           Lieu: {rdv.lieu || 'Non spécifié'}
// //                         </p>
// //                         {rdv.motif && (
// //                           <p className="mt-1">
// //                             Motif: {rdv.motif}
// //                           </p>
// //                         )}
// //                       </div>
// //                       <div className="mt-2 flex flex-wrap gap-2">
// //                         {rdv.statut === RDV_STATUS.PLANNED && (
// //                           <>
// //                             <button
// //                               onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.CONFIRMED)}
// //                               className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-green-100 text-green-800 hover:bg-green-200"
// //                             >
// //                               Confirmer
// //                             </button>
// //                             <button
// //                               onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.CANCELLED)}
// //                               className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-red-100 text-red-800 hover:bg-red-200"
// //                             >
// //                               Annuler
// //                             </button>
// //                           </>
// //                         )}

// //                         {shouldShowPresenceButtons(rdv) && (
// //                           <>
// //                             <button
// //                               onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.COMPLETED)}
// //                               className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-purple-100 text-purple-800 hover:bg-purple-200"
// //                             >
// //                               Patient présent
// //                             </button>
// //                             <button
// //                               onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.MISSED)}
// //                               className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-orange-100 text-orange-800 hover:bg-orange-200"
// //                             >
// //                               Patient absent
// //                             </button>
// //                           </>
// //                         )}

// //                         <button
// //                           onClick={() => openDossierMedical(rdv.patient.id)}
// //                           className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200"
// //                         >
// //                           Dossier médical
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </li>
// //               ))}
// //             </ul>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }



// 'use client'
// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { useRouter } from 'next/navigation'
// import { toast } from 'react-toastify'
// import { supabase } from '@/lib/supabase/client'
// import { format, isBefore } from 'date-fns'
// import { fr } from 'date-fns/locale'
// import { EmailSenderButton } from '@/components/EmailSenderButton'
// import PatientDossierModal from '@/components/PatientDossierModal'

// const RDV_STATUS = {
//   PLANNED: 'planifié',
//   CONFIRMED: 'confirmé',
//   CANCELLED: 'annulé',
//   COMPLETED: 'effectué',
//   MISSED: 'absent',
//   TERMINATED: 'terminé'
// }

// export default function RendezVousMedecin() {
//   const { user, loading: authLoading } = useAuth()
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [rendezVous, setRendezVous] = useState<any[]>([])
//   const [selectedPatient, setSelectedPatient] = useState<{id: string, medecinId: string} | null>(null)
//   const [medecinId, setMedecinId] = useState<string | null>(null)

//   const fetchMedecinId = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('medecin_infos')
//         .select('id')
//         .eq('user_id', user?.id)
//         .single()

//       if (error || !data) {
//         throw error || new Error('Profil médecin non trouvé')
//       }
//       setMedecinId(data.id)
//       return data.id
//     } catch (error) {
//       console.error('Erreur:', error)
//       throw error
//     }
//   }

//   const fetchRendezVous = async () => {
//     try {
//       setLoading(true)
//       const medecinId = await fetchMedecinId()

//       const { data, error } = await supabase
//         .from('rendez_vous')
//         .select(`
//           *,
//           patient:patient_infos(
//             id,
//             user:users(nom, profil_url),
//             date_naissance
//           ),
//           medecin:medecin_infos(
//             id
//           )
//         `)
//         .eq('medecin_id', medecinId)
//         .order('date_heure', { ascending: true })

//       if (error) throw error
      
//       // Normaliser les statuts pour le frontend
//       const normalizedData = data?.map(rdv => {
//         let statut = rdv.statut
//         if (rdv.statut === 'terminé') {
//           statut = rdv.present ? 'effectué' : 'absent'
//         }
//         return { ...rdv, statut }
//       }) || []

//       setRendezVous(normalizedData)
//     } catch (error: any) {
//       console.error('Erreur:', error)
//       toast.error(`Erreur: ${error.message}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (authLoading) return
//     if (!user) {
//       router.push('/login')
//       return
//     }
//     fetchRendezVous()
//   }, [user, authLoading, router])

//   const updateRdvStatus = async (id: string, newStatus: string, present: boolean | null = null) => {
//     try {
//       setLoading(true)
      
//       // Déterminer le statut pour la base de données
//       let dbStatus = newStatus === RDV_STATUS.COMPLETED || newStatus === RDV_STATUS.MISSED 
//         ? RDV_STATUS.TERMINATED 
//         : newStatus

//       const updates: any = { 
//         statut: dbStatus,
//         updated_at: new Date().toISOString()
//       }

//       if (present !== null) {
//         updates.present = present
//       }

//       const { error } = await supabase
//         .from('rendez_vous')
//         .update(updates)
//         .eq('id', id)

//       if (error) throw error

//       // Mise à jour locale avec le statut frontend
//       setRendezVous(prev => prev.map(rdv => 
//         rdv.id === id ? { 
//           ...rdv, 
//           statut: newStatus,
//           present,
//           updated_at: updates.updated_at
//         } : rdv
//       ))

//       toast.success(`Statut mis à jour: ${newStatus}`)
//     } catch (error: any) {
//       console.error('Erreur:', error)
//       toast.error(`Erreur: ${error.message}`)
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

//   const openDossierMedical = async (patientId: string) => {
//     try {
//       if (!medecinId) {
//         const id = await fetchMedecinId()
//         setMedecinId(id)
//       }
//       setSelectedPatient({
//         id: patientId,
//         medecinId: medecinId!
//       })
//     } catch (error: any) {
//       toast.error(`Erreur: ${error.message}`)
//     }
//   }

//   const closeDossierMedical = () => {
//     setSelectedPatient(null)
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case RDV_STATUS.PLANNED: return 'bg-blue-100 text-blue-800'
//       case RDV_STATUS.CONFIRMED: return 'bg-green-100 text-green-800'
//       case RDV_STATUS.CANCELLED: return 'bg-red-100 text-red-800'
//       case RDV_STATUS.COMPLETED: return 'bg-purple-100 text-purple-800'
//       case RDV_STATUS.MISSED: return 'bg-orange-100 text-orange-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const isPastAppointment = (date: string) => {
//     return isBefore(new Date(date), new Date())
//   }

//   const shouldShowPresenceButtons = (rdv: any) => {
//     const isPast = isPastAppointment(rdv.date_heure)
//     const isNotCompleted = ![RDV_STATUS.COMPLETED, RDV_STATUS.MISSED, RDV_STATUS.CANCELLED].includes(rdv.statut)
//     return isPast && isNotCompleted
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
//     <div className="min-h-screen bg-gray-50 py-8 sm:px-6 lg:px-8">
//       {selectedPatient && (
//         <PatientDossierModal 
//           patientId={selectedPatient.id} 
//           medecinId={selectedPatient.medecinId}
//           onClose={closeDossierMedical}
//         />
//       )}
      
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
//         <EmailSenderButton/>
//         <p className="mt-2 text-lg text-gray-600">Gestion des rendez-vous</p>
//       </div>

//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           {rendezVous.length === 0 ? (
//             <div className="text-center p-8">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//               <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun rendez-vous</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 Vous n'avez aucun rendez-vous programmé.
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
//                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(rdv.statut)}`}>
//                           {rdv.statut}
//                         </span>
//                       </div>
//                       <div className="mt-1 text-sm text-gray-600">
//                         <p>
//                           {format(new Date(rdv.date_heure), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
//                           {isPastAppointment(rdv.date_heure) && ' (Passé)'}
//                         </p>
//                         <p className="mt-1">Lieu: {rdv.lieu || 'Non spécifié'}</p>
//                         {rdv.motif && <p className="mt-1">Motif: {rdv.motif}</p>}
//                       </div>
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         {rdv.statut === RDV_STATUS.PLANNED && (
//                           <>
//                             <button
//                               onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.CONFIRMED)}
//                               className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-green-100 text-green-800 hover:bg-green-200"
//                               disabled={loading}
//                             >
//                               Confirmer
//                             </button>
//                             <button
//                               onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.CANCELLED)}
//                               className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-red-100 text-red-800 hover:bg-red-200"
//                               disabled={loading}
//                             >
//                               Annuler
//                             </button>
//                           </>
//                         )}

//                         {shouldShowPresenceButtons(rdv) && (
//                           <>
//                             <button
//                               onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.COMPLETED, true)}
//                               className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-purple-100 text-purple-800 hover:bg-purple-200"
//                               disabled={loading}
//                             >
//                               Patient présent
//                             </button>
//                             <button
//                               onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.MISSED, false)}
//                               className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-orange-100 text-orange-800 hover:bg-orange-200"
//                               disabled={loading}
//                             >
//                               Patient absent
//                             </button>
//                           </>
//                         )}

//                         <button
//                           onClick={() => openDossierMedical(rdv.patient.id)}
//                           className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200"
//                           disabled={loading}
//                         >
//                           Dossier médical
//                         </button>
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

// 'use client'
// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { useRouter } from 'next/navigation'
// import { toast } from 'react-toastify'
// import { supabase } from '@/lib/supabase/client'
// import { format, isBefore, isToday } from 'date-fns'
// import { fr } from 'date-fns/locale'
// import { EmailSenderButton } from '@/components/EmailSenderButton'
// import PatientDossierModal from '@/components/PatientDossierModal'

// const RDV_STATUS = {
//   PLANNED: 'planifié',
//   CONFIRMED: 'confirmé',
//   CANCELLED: 'annulé',
//   COMPLETED: 'effectué',
//   MISSED: 'absent'
// }

// export default function RendezVousMedecin() {
//   const { user, loading: authLoading } = useAuth()
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [rendezVous, setRendezVous] = useState<any[]>([])
//   const [selectedPatient, setSelectedPatient] = useState<{id: string, medecinId: string} | null>(null)
//   const [medecinId, setMedecinId] = useState<string | null>(null)

//   const fetchMedecinId = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('medecin_infos')
//         .select('id')
//         .eq('user_id', user?.id)
//         .single()

//       if (error || !data) {
//         throw error || new Error('Profil médecin non trouvé')
//       }
//       setMedecinId(data.id)
//       return data.id
//     } catch (error) {
//       console.error('Erreur:', error)
//       throw error
//     }
//   }

//   const fetchRendezVous = async () => {
//     try {
//       setLoading(true)
//       const medecinId = await fetchMedecinId()

//       const { data, error } = await supabase
//         .from('rendez_vous')
//         .select(`
//           *,
//           patient:patient_infos(
//             id,
//             user:users(nom, profil_url),
//             date_naissance
//           ),
//           medecin:medecin_infos(
//             id
//           )
//         `)
//         .eq('medecin_id', medecinId)
//         .order('date_heure', { ascending: true })

//       if (error) throw error
      
//       setRendezVous(data || [])
//     } catch (error: any) {
//       console.error('Erreur:', error)
//       toast.error(`Erreur: ${error.message}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (authLoading) return
//     if (!user) {
//       router.push('/login')
//       return
//     }
//     fetchRendezVous()
//   }, [user, authLoading, router])

//   // const updateRdvStatus = async (id: string, newStatus: string) => {
//   //   try {
//   //     setLoading(true)
      
//   //     const { error } = await supabase
//   //       .from('rendez_vous')
//   //       .update({ 
//   //         statut: newStatus,
//   //         updated_at: new Date().toISOString()
//   //       })
//   //       .eq('id', id)

//   //     if (error) throw error

//   //     setRendezVous(prev => prev.map(rdv => 
//   //       rdv.id === id ? { 
//   //         ...rdv, 
//   //         statut: newStatus,
//   //         updated_at: new Date().toISOString()
//   //       } : rdv
//   //     ))

//   //     toast.success(`Statut mis à jour: ${newStatus}`)
//   //   } catch (error: any) {
//   //     console.error('Erreur:', error)
//   //     toast.error(`Erreur: ${error.message}`)
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }
//   const updateRdvStatus = async (id: string, newStatus: string) => {
//   try {
//     setLoading(true);
    
//     // Debug: Afficher les données avant envoi
//     console.log('Updating RDV:', { id, newStatus });
    
//     const { data, error } = await supabase
//       .from('rendez_vous')
//       .update({ 
//         statut: newStatus,
//         updated_at: new Date().toISOString()
//       })
//       .eq('id', id)
//       .select(); // Ajout de .select() pour voir la réponse

//     if (error) {
//       console.error('Supabase error details:', error);
//       throw error;
//     }

//     // Debug: Afficher la réponse
//     console.log('Update response:', data);

//     setRendezVous(prev => prev.map(rdv => 
//       rdv.id === id ? { 
//         ...rdv, 
//         statut: newStatus.toLowerCase(),
//         updated_at: new Date().toISOString()
//       } : rdv
//     ));

//     toast.success(`Statut mis à jour: ${newStatus}`);
//   } catch (error: any) {
//     console.error('Full error:', error);
//     toast.error(`Échec de la mise à jour: ${error.message || 'Erreur inconnue'}`);
//   } finally {
//     setLoading(false);
//   }
// };

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

//   const openDossierMedical = async (patientId: string) => {
//     try {
//       if (!medecinId) {
//         const id = await fetchMedecinId()
//         setMedecinId(id)
//       }
//       setSelectedPatient({
//         id: patientId,
//         medecinId: medecinId!
//       })
//     } catch (error: any) {
//       toast.error(`Erreur: ${error.message}`)
//     }
//   }

//   const closeDossierMedical = () => {
//     setSelectedPatient(null)
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case RDV_STATUS.PLANNED: return 'bg-blue-100 text-blue-800'
//       case RDV_STATUS.CONFIRMED: return 'bg-green-100 text-green-800'
//       case RDV_STATUS.CANCELLED: return 'bg-red-100 text-red-800'
//       case RDV_STATUS.COMPLETED: return 'bg-purple-100 text-purple-800'
//       case RDV_STATUS.MISSED: return 'bg-orange-100 text-orange-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const isPastOrToday = (date: string) => {
//     const rdvDate = new Date(date)
//     const today = new Date()
//     return isBefore(rdvDate, today) || isToday(rdvDate)
//   }

//  const shouldShowPresenceButtons = (rdv: any) => {
//   try {
//     const now = new Date();
//     const rdvDate = new Date(rdv.date_heure);
//     const isPastOrToday = rdvDate <= now;
    
//     // Vérification plus robuste du statut
//     const isConfirmed = rdv.statut?.toLowerCase() === RDV_STATUS.CONFIRMED.toLowerCase();
//     const isNotTerminated = ![RDV_STATUS.COMPLETED, RDV_STATUS.MISSED].includes(
//       rdv.statut?.toLowerCase()
//     );
    
//     console.log('Debug:', {
//       id: rdv.id,
//       isPastOrToday,
//       isConfirmed,
//       isNotTerminated,
//       statut: rdv.statut
//     });
    
//     return isPastOrToday && isConfirmed && isNotTerminated;
//   } catch (error) {
//     console.error('Error in shouldShowPresenceButtons:', error);
//     return false;
//   }
// };

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
//     <div className="min-h-screen bg-gray-50 py-8 sm:px-6 lg:px-8">
//       {selectedPatient && (
//         <PatientDossierModal 
//           patientId={selectedPatient.id} 
//           medecinId={selectedPatient.medecinId}
//           onClose={closeDossierMedical}
//         />
//       )}
      
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
//         <EmailSenderButton/>
//         <p className="mt-2 text-lg text-gray-600">Gestion des rendez-vous</p>
//       </div>

//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           {rendezVous.length === 0 ? (
//             <div className="text-center p-8">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//               <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun rendez-vous</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 Vous n'avez aucun rendez-vous programmé.
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
//                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(rdv.statut)}`}>
//                           {rdv.statut}
//                         </span>
//                       </div>
//                       <div className="mt-1 text-sm text-gray-600">
//                         <p>
//                           {format(new Date(rdv.date_heure), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
//                           {isPastOrToday(rdv.date_heure) && ' (Passé ou aujourd\'hui)'}
//                         </p>
//                         <p className="mt-1">Lieu: {rdv.lieu || 'Non spécifié'}</p>
//                         {rdv.motif && <p className="mt-1">Motif: {rdv.motif}</p>}
//                       </div>
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         {rdv.statut === RDV_STATUS.PLANNED && (
//                           <>
//                             <button
//                               onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.CONFIRMED)}
//                               className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-green-100 text-green-800 hover:bg-green-200"
//                               disabled={loading}
//                             >
//                               Confirmer
//                             </button>
//                             <button
//                               onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.CANCELLED)}
//                               className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-red-100 text-red-800 hover:bg-red-200"
//                               disabled={loading}
//                             >
//                               Annuler
//                             </button>
//                           </>
//                         )}

//                         {shouldShowPresenceButtons(rdv) && (
//                           <>
//                             <button
//                               onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.COMPLETED)}
//                               className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-purple-100 text-purple-800 hover:bg-purple-200"
//                               disabled={loading}
//                             >
//                               Patient présent
//                             </button>
//                             <button
//                               onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.MISSED)}
//                               className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-orange-100 text-orange-800 hover:bg-orange-200"
//                               disabled={loading}
//                             >
//                               Patient absent
//                             </button>
//                           </>
//                         )}

//                         <button
//                           onClick={() => openDossierMedical(rdv.patient.id)}
//                           className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200"
//                           disabled={loading}
//                         >
//                           Dossier médical
//                         </button>
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
import { format, isBefore } from 'date-fns'
import { fr } from 'date-fns/locale'
import { EmailSenderButton } from '@/components/EmailSenderButton'
import PatientDossierModal from '@/components/PatientDossierModal'
import { CheckCircle2, XCircle, CalendarDays, User, Clock, Check, X } from 'lucide-react'

const RDV_STATUS = {
  PLANNED: 'planifié',
  CONFIRMED: 'confirmé',
  CANCELLED: 'annulé',
  TERMINATED: 'terminé'
}

export default function RendezVousMedecin() {
  const { user} = useAuth()
  const router = useRouter()
  // const [loading, setLoading] = useState(true)
  const [rendezVous, setRendezVous] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<{id: string, medecinId: string} | null>(null)
  const [medecinId, setMedecinId] = useState<string | null>(null)

  const fetchMedecinId = async () => {
    try {
      const { data, error } = await supabase
        .from('medecin_infos')
        .select('id')
        .eq('user_id', user?.id)
        .single()

      if (error || !data) {
        throw error || new Error('Profil médecin non trouvé')
      }

      setMedecinId(data.id)
      return data.id
    } catch (error) {
      console.error('Erreur:', error)
      throw error
    }
  }

  const fetchRendezVous = async () => {
    try {
      
      const medecinId = await fetchMedecinId()

      const { data, error } = await supabase
        .from('rendez_vous')
        .select(`
          *,
          patient:patient_infos(
            id,
            user:users(nom, profil_url),
            date_naissance
          ),
          medecin:medecin_infos(
            id
          )
        `)
        .eq('medecin_id', medecinId)
        .order('date_heure', { ascending: true })

      if (error) throw error
      
      setRendezVous(data || [])

    } catch (error: any) {
      console.error('Erreur lors du chargement:', error)
      toast.error(`Erreur: ${error.message}`)
    
    }
  }

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchRendezVous()
  }, [user,router])

  const updateRdvStatus = async (id: string, newStatus: string, present: boolean | null = null) => {
    try {
    
      
      const updates: any = { 
        statut: newStatus,
        updated_at: new Date().toISOString()
      }

      if (present !== null) {
        updates.present = present
      }

      const { error } = await supabase
        .from('rendez_vous')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      setRendezVous(prev => prev.map(rdv => 
        rdv.id === id ? { ...rdv, ...updates } : rdv
      ))

      toast.success(`Statut mis à jour: ${newStatus}`)
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur: ${error.message}`)
    } finally {
  
    }
  }

  const markAsPresent = async (id: string) => {
    await updateRdvStatus(id, RDV_STATUS.TERMINATED, true)
  }

  const markAsAbsent = async (id: string) => {
    await updateRdvStatus(id, RDV_STATUS.TERMINATED, false)
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
      if (!medecinId) {
        const id = await fetchMedecinId()
        setMedecinId(id)
      }

      setSelectedPatient({
        id: patientId,
        medecinId: medecinId!
      })
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`)
    }
  }

  const closeDossierMedical = () => {
    setSelectedPatient(null)
  }

  const getStatusColor = (status: string, present?: boolean) => {
    if (status === RDV_STATUS.TERMINATED) {
      return present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }
    
    switch (status) {
      case RDV_STATUS.PLANNED: return 'bg-blue-100 text-blue-800'
      case RDV_STATUS.CONFIRMED: return 'bg-amber-100 text-amber-800'
      case RDV_STATUS.CANCELLED: return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string, present?: boolean) => {
    if (status === RDV_STATUS.TERMINATED) {
      return present ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />
    }
    
    switch (status) {
      case RDV_STATUS.PLANNED: return <CalendarDays className="w-4 h-4" />
      case RDV_STATUS.CONFIRMED: return <CheckCircle2 className="w-4 h-4" />
      case RDV_STATUS.CANCELLED: return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const isPastAppointment = (date: string) => {
    return isBefore(new Date(date), new Date())
  }

  const shouldShowPresenceButtons = (rdv: any) => {
    return (
      rdv.statut === RDV_STATUS.CONFIRMED && 
      isPastAppointment(rdv.date_heure) &&
      rdv.statut !== RDV_STATUS.CANCELLED
    )
  }

 

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:px-6 lg:px-8">
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
          Gestion des rendez-vous
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {rendezVous.length === 0 ? (
            <div className="text-center p-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun rendez-vous</h3>
              <p className="mt-1 text-sm text-gray-500">
                Vous n'avez aucun rendez-vous programmé.
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
                        <User className="h-6 w-6 text-gray-500" />
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
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rdv.statut, rdv.present)}`}>
                          {getStatusIcon(rdv.statut, rdv.present)}
                          <span className="ml-1">
                            {rdv.statut === RDV_STATUS.TERMINATED 
                              ? (rdv.present ? 'Effectué' : 'Absent') 
                              : rdv.statut}
                          </span>
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        <p>
                          {format(new Date(rdv.date_heure), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
                          {isPastAppointment(rdv.date_heure) && ' (Passé)'}
                        </p>
                        <p className="mt-1">
                          Lieu: {rdv.lieu || 'Non spécifié'}
                        </p>
                        {rdv.motif && (
                          <p className="mt-1">
                            Motif: {rdv.motif}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {rdv.statut === RDV_STATUS.PLANNED && (
                          <>
                            <button
                              onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.CONFIRMED)}
                              className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-amber-100 text-amber-800 hover:bg-amber-200"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => updateRdvStatus(rdv.id, RDV_STATUS.CANCELLED)}
                              className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
                            >
                              Annuler
                            </button>
                          </>
                        )}

                        {shouldShowPresenceButtons(rdv) && (
                          <>
                            <button
                              onClick={() => markAsPresent(rdv.id)}
                              className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-green-100 text-green-800 hover:bg-green-200"
                            >
                              Patient présent
                            </button>
                            <button
                              onClick={() => markAsAbsent(rdv.id)}
                              className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-red-100 text-red-800 hover:bg-red-200"
                            >
                              Patient absent
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => openDossierMedical(rdv.patient.id)}
                          className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200"
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