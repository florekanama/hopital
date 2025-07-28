// 'use client'
// import { useEffect, useState } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { supabase } from '@/lib/supabase/client'
// import { format, parseISO, addMinutes } from 'date-fns'
// import { fr } from 'date-fns/locale'
// import { toast } from 'react-toastify'

// // Composant Spinner pour les chargements
// const Spinner = ({ className = '' }: { className?: string }) => (
//   <svg
//     className={`animate-spin ${className}`}
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//   >
//     <circle
//       className="opacity-25"
//       cx="12"
//       cy="12"
//       r="10"
//       stroke="currentColor"
//       strokeWidth="4"
//     ></circle>
//     <path
//       className="opacity-75"
//       fill="currentColor"
//       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//     ></path>
//   </svg>
// )

// // Composant Icones
// const Icons = {
//   check: ({ className = '' }: { className?: string }) => (
//     <svg
//       className={className}
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M5 13l4 4L19 7"
//       />
//     </svg>
//   ),
//   user: ({ className = '' }: { className?: string }) => (
//     <svg
//       className={className}
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={1}
//         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//       />
//     </svg>
//   ),
//   arrowLeft: ({ className = '' }: { className?: string }) => (
//     <svg
//       className={className}
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M10 19l-7-7m0 0l7-7m-7 7h18"
//       />
//     </svg>
//   ),
//   trash: ({ className = '' }: { className?: string }) => (
//     <svg
//       className={className}
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//       />
//     </svg>
//   ),
//   checkCircle: ({ className = '' }: { className?: string }) => (
//     <svg
//       className={className}
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//       />
//     </svg>
//   ),
//   spinner: Spinner
// }

// // Composant Button
// const Button = ({
//   children,
//   onClick,
//   className = '',
//   variant = 'default',
//   disabled = false,
//   type = 'button'
// }: {
//   children: React.ReactNode
//   onClick?: () => void
//   className?: string
//   variant?: 'default' | 'outline' | 'destructive'
//   disabled?: boolean
//   type?: 'button' | 'submit' | 'reset'
// }) => {
//   const baseClasses = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
//   const variantClasses = {
//     default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
//     outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
//     destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
//   }

//   return (
//     <button
//       type={type}
//       onClick={onClick}
//       disabled={disabled}
//       className={`${baseClasses} ${variantClasses[variant]} ${className}`}
//     >
//       {children}
//     </button>
//   )
// }

// export default function ConfirmationRendezVous() {
//   const { user } = useAuth()
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const [loading, setLoading] = useState(true)
//   const [rendezVous, setRendezVous] = useState<any>(null)
//   const [medecin, setMedecin] = useState<any>(null)
//   const [annulationEnCours, setAnnulationEnCours] = useState(false)

//   // Récupérer l'ID du rendez-vous depuis l'URL
//   const rendezVousId = searchParams.get('id')

//   useEffect(() => {
//     if (!user) {
//       router.push('/login')
//       return
//     }

//     if (!rendezVousId) {
//       router.push('/patient/mes-rendez-vous')
//       return
//     }

//     const fetchRendezVous = async () => {
//       try {
//         setLoading(true)

//         // Récupérer les détails du rendez-vous
//         const { data: rdvData, error: rdvError } = await supabase
//           .from('rendez_vous')
//           .select(`
//             *,
//             medecin:medecin_infos(
//               *,
//               user:users(nom, prenom, email, profil_url),
//               specialite:specialites(nom)
//           `)
//           .eq('id', rendezVousId)
//           .single()

//         if (rdvError || !rdvData) throw new Error('Rendez-vous non trouvé')

//         // Vérifier que le rendez-vous appartient bien au patient connecté
//         const { data: patientData, error: patientError } = await supabase
//           .from('patient_infos')
//           .select('id')
//           .eq('user_id', user.id)
//           .single()

//         if (patientError || !patientData) throw new Error('Profil patient non trouvé')
//         if (rdvData.patient_id !== patientData.id) throw new Error('Non autorisé')

//         setRendezVous(rdvData)
//         setMedecin(rdvData.medecin)

//       } catch (error: any) {
//         console.error('Erreur:', error)
//         toast.error(error.message)
//         router.push('/patient/mes-rendez-vous')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchRendezVous()
//   }, [user, rendezVousId, router])

//   const handleAnnulation = async () => {
//     try {
//       setAnnulationEnCours(true)

//       // Mettre à jour le statut du rendez-vous
//       const { error } = await supabase
//         .from('rendez_vous')
//         .update({ statut: 'annulé' })
//         .eq('id', rendezVousId)

//       if (error) throw error

//       toast.success('Rendez-vous annulé avec succès')
//       router.push('/patient/mes-rendez-vous')

//     } catch (error: any) {
//       console.error('Erreur lors de l\'annulation:', error)
//       toast.error(`Erreur: ${error.message}`)
//     } finally {
//       setAnnulationEnCours(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Spinner className="h-12 w-12" />
//       </div>
//     )
//   }

//   if (!rendezVous || !medecin) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-lg">Rendez-vous non trouvé</p>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         <div className="text-center mb-10">
//           <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
//             <Icons.check className="h-8 w-8 text-green-600" />
//           </div>
//           <h1 className="mt-4 text-3xl font-bold text-gray-900">Rendez-vous confirmé</h1>
//           <p className="mt-2 text-lg text-gray-600">
//             Votre rendez-vous a bien été enregistré
//           </p>
//         </div>

//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           {/* En-tête avec médecin */}
//           <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
//             <div className="flex items-center">
//               {medecin.user.profil_url ? (
//                 <img
//                   src={medecin.user.profil_url}
//                   alt={`Photo du Dr. ${medecin.user.nom}`}
//                   className="h-16 w-16 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
//                   <Icons.user className="h-8 w-8 text-gray-500" />
//                 </div>
//               )}
//               <div className="ml-4">
//                 <h2 className="text-xl font-semibold text-gray-900">
//                   Dr. {medecin.user.prenom} {medecin.user.nom}
//                 </h2>
//                 <p className="text-gray-600">{medecin.specialite?.nom}</p>
//               </div>
//             </div>
//           </div>

//           {/* Détails du rendez-vous */}
//           <div className="px-6 py-5 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Date et heure</h3>
//                 <p className="mt-1 text-lg font-semibold text-gray-900">
//                   {format(parseISO(rendezVous.date_heure), 'EEEE d MMMM yyyy', { locale: fr })}
//                 </p>
//                 <p className="text-lg font-semibold text-gray-900">
//                   {format(parseISO(rendezVous.date_heure), 'HH:mm')} -{' '}
//                   {format(addMinutes(parseISO(rendezVous.date_heure), rendezVous.duree_minutes), 'HH:mm')}
//                 </p>
//               </div>

//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Lieu de consultation</h3>
//                 <p className="mt-1 text-lg font-semibold text-gray-900">
//                   {rendezVous.lieu_id ? 
//                     (medecin.disponibilites_medecin?.find((d: any) => d.lieu_id === rendezVous.lieu_id)?.lieu?.nom || 
//                      rendezVous.autre_lieu) : 
//                     (rendezVous.autre_lieu || 'Non spécifié')}
//                 </p>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Motif</h3>
//               <p className="mt-1 text-gray-900">{rendezVous.motif || 'Non spécifié'}</p>
//             </div>

//             {rendezVous.notes && (
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Notes supplémentaires</h3>
//                 <p className="mt-1 text-gray-900">{rendezVous.notes}</p>
//               </div>
//             )}

//             <div className="border-t border-gray-200 pt-4">
//               <h3 className="text-sm font-medium text-gray-500">Statut</h3>
//               <div className="mt-2 flex items-center">
//                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                   rendezVous.statut === 'planifié' 
//                     ? 'bg-blue-100 text-blue-800' 
//                     : rendezVous.statut === 'confirmé' 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-gray-100 text-gray-800'
//                 }`}>
//                   {rendezVous.statut === 'planifié' ? 'Planifié' : 
//                    rendezVous.statut === 'confirmé' ? 'Confirmé' : 
//                    'Annulé'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
//             <Button
//               variant="outline"
//               onClick={() => router.push('/patient/mes-rendez-vous')}
//             >
//               <Icons.arrowLeft className="mr-2 h-4 w-4" />
//               Retour à mes rendez-vous
//             </Button>

//             {rendezVous.statut === 'planifié' && (
//               <Button
//                 variant="destructive"
//                 onClick={handleAnnulation}
//                 disabled={annulationEnCours}
//               >
//                 {annulationEnCours ? (
//                   <Spinner className="mr-2 h-4 w-4" />
//                 ) : (
//                   <Icons.trash className="mr-2 h-4 w-4" />
//                 )}
//                 Annuler le rendez-vous
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* Informations supplémentaires */}
//         <div className="mt-8 bg-blue-50 rounded-lg p-6">
//           <h3 className="text-lg font-medium text-blue-800">Préparation de votre consultation</h3>
//           <ul className="mt-4 space-y-3 text-blue-700">
//             <li className="flex items-start">
//               <Icons.checkCircle className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2 mt-0.5" />
//               <span>Présentez-vous 10 minutes avant l'heure du rendez-vous</span>
//             </li>
//             <li className="flex items-start">
//               <Icons.checkCircle className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2 mt-0.5" />
//               <span>Pensez à apporter votre carte vitale et pièce d'identité</span>
//             </li>
//             <li className="flex items-start">
//               <Icons.checkCircle className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2 mt-0.5" />
//               <span>Préparez vos questions et les documents nécessaires</span>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { format, parseISO, addMinutes } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'react-toastify'

export default function ConfirmationRendezVous() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [rendezVous, setRendezVous] = useState<any>(null)
  const [medecin, setMedecin] = useState<any>(null)
  const [annulationEnCours, setAnnulationEnCours] = useState(false)

  // Récupérer l'ID du rendez-vous depuis l'URL
  const rendezVousId = searchParams.get('id')

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    if (!rendezVousId) {
      router.push('/patient/mes-rendez-vous')
      return
    }

    const fetchRendezVous = async () => {
      try {
        setLoading(true)

        // Récupérer le profil patient
        const { data: patientData, error: patientError } = await supabase
          .from('patient_infos')
          .select('id')
          .eq('user_id', user.id)
          .single()

        // "No rows found" est une erreur normale si le patient n'a pas encore de profil
        if (patientError && !patientError.message.includes('No rows found')) {
          throw patientError
        }

        if (!patientData) {
          toast.error('Vous devez compléter votre profil patient avant de voir vos rendez-vous')
          router.push('/patient/completer-profil')
          return
        }

        // Récupérer les détails du rendez-vous
        const { data: rdvData, error: rdvError } = await supabase
          .from('rendez_vous')
          .select(`
            *,
            medecin:medecin_id (
              *,
              user:user_id (
                nom,
                prenom,
                email,
                profil_url
              ),
              specialite:specialite_id (
                nom
              )
            ),
            lieu:lieu_id (
              nom
            )
          `)
          .eq('id', rendezVousId)
          .single()

        if (rdvError || !rdvData) throw new Error('Rendez-vous non trouvé')
        if (rdvData.patient_id !== patientData.id) throw new Error('Non autorisé')

        setRendezVous(rdvData)
        setMedecin(rdvData.medecin)

      } catch (error: any) {
        console.error('Erreur:', error)
        toast.error(error.message)
        router.push('/patient/mes-rendez-vous')
      } finally {
        setLoading(false)
      }
    }

    fetchRendezVous()
  }, [user, authLoading, rendezVousId, router])

  const handleAnnulation = async () => {
    try {
      setAnnulationEnCours(true)

      const { error } = await supabase
        .from('rendez_vous')
        .update({ statut: 'annulé' })
        .eq('id', rendezVousId)

      if (error) throw error

      toast.success('Rendez-vous annulé avec succès')
      router.push('/patient/mes-rendez-vous')

    } catch (error: any) {
      console.error('Erreur lors de l\'annulation:', error)
      toast.error(`Erreur: ${error.message}`)
    } finally {
      setAnnulationEnCours(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirection vers la page de connexion...</p>
      </div>
    )
  }

  if (!rendezVous || !medecin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Rendez-vous non trouvé</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Rendez-vous confirmé</h1>
          <p className="mt-2 text-lg text-gray-600">
            Votre rendez-vous a bien été enregistré
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* En-tête avec médecin */}
          <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
            <div className="flex items-center">
              {medecin.user.profil_url ? (
                <img
                  src={medecin.user.profil_url}
                  alt={`Photo du Dr. ${medecin.user.nom}`}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Dr. {medecin.user.prenom} {medecin.user.nom}
                </h2>
                <p className="text-gray-600">{medecin.specialite?.nom}</p>
              </div>
            </div>
          </div>

          {/* Détails du rendez-vous */}
          <div className="px-6 py-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date et heure</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {format(parseISO(rendezVous.date_heure), 'EEEE d MMMM yyyy', { locale: fr })}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {format(parseISO(rendezVous.date_heure), 'HH:mm')} -{' '}
                  {format(addMinutes(parseISO(rendezVous.date_heure), rendezVous.duree_minutes || 30), 'HH:mm')}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Lieu de consultation</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {rendezVous.lieu ? rendezVous.lieu.nom : rendezVous.autre_lieu || 'Non spécifié'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Motif</h3>
              <p className="mt-1 text-gray-900">{rendezVous.motif || 'Non spécifié'}</p>
            </div>

            {rendezVous.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Notes supplémentaires</h3>
                <p className="mt-1 text-gray-900">{rendezVous.notes}</p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-500">Statut</h3>
              <div className="mt-2 flex items-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  rendezVous.statut === 'planifié' 
                    ? 'bg-blue-100 text-blue-800' 
                    : rendezVous.statut === 'confirmé' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {rendezVous.statut === 'planifié' ? 'Planifié' : 
                   rendezVous.statut === 'confirmé' ? 'Confirmé' : 
                   'Annulé'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={() => router.push('/patient/mes-rendez-vous')}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg
                className="mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Retour à mes rendez-vous
            </button>

            {rendezVous.statut === 'planifié' && (
              <button
                onClick={handleAnnulation}
                disabled={annulationEnCours}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {annulationEnCours ? (
                  <svg
                    className="animate-spin mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
                Annuler le rendez-vous
              </button>
            )}
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800">Préparation de votre consultation</h3>
          <ul className="mt-4 space-y-3 text-blue-700">
            <li className="flex items-start">
              <svg
                className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Présentez-vous 10 minutes avant l'heure du rendez-vous</span>
            </li>
            <li className="flex items-start">
              <svg
                className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Pensez à apporter votre carte vitale et pièce d'identité</span>
            </li>
            <li className="flex items-start">
              <svg
                className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Préparez vos questions et les documents nécessaires</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}