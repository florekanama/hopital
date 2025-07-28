// // // // app/profile/page.tsx
// // // 'use client'
// // // import { useAuth } from '@/context/AuthContext'
// // // import { useState } from 'react'
// // // import Image from 'next/image'
// // // import { useRouter } from 'next/navigation'

// // // export default function ProfilePage() {
// // //   const { user, updateProfile, uploadProfileImage } = useAuth()
// // //   const router = useRouter()
// // //   const [formData, setFormData] = useState({
// // //     nom: user?.nom || '',
// // //     email: user?.email || '',
// // //   })
// // //   const [imagePreview, setImagePreview] = useState(user?.profil_url || '')
// // //   const [loading, setLoading] = useState(false)
// // //   const [success, setSuccess] = useState(false)

// // //   if (!user) {
// // //     router.push('/login')
// // //     return null
// // //   }

// // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const { name, value } = e.target
// // //     setFormData(prev => ({ ...prev, [name]: value }))
// // //   }

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault()
// // //     setLoading(true)
// // //     try {
// // //       const updated = await updateProfile(formData)
// // //       if (updated) {
// // //         setSuccess(true)
// // //         setTimeout(() => setSuccess(false), 3000)
// // //       }
// // //     } catch (error) {
// // //       console.error('Erreur:', error)
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     if (e.target.files && e.target.files[0]) {
// // //       const file = e.target.files[0]
      
// // //       const reader = new FileReader()
// // //       reader.onloadend = () => {
// // //         setImagePreview(reader.result as string)
// // //       }
// // //       reader.readAsDataURL(file)
      
// // //       await uploadProfileImage(file)
// // //     }
// // //   }

// // //   return (
// // //     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// // //       <div className="bg-white  rounded-lg overflow-hidden">
// // //         {/* Header avec fond coloré */}
// // //         <div className="bg-gradient-to-r rounded-2xl from-blue-600 to-teal-500 px-6 py-8">
// // //           <div className="flex flex-col sm:flex-row items-center justify-between">
// // //             <h1 className="text-2xl font-bold text-white">Mon Profil</h1>
// // //             <span className="mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-medium bg text-gray-100">
// // //               {user.role === 'admin' ? 'Administrateur' : 
// // //                user.role === 'medecin' ? 'Médecin' : 'Patient'}
// // //             </span>
// // //           </div>
// // //         </div>

// // //         {/* Contenu principal */}
// // //         <div className="px-6 py-8">
// // //           <div className="flex flex-col md:flex-row gap-8">
// // //             {/* Colonne gauche - Photo de profil */}
// // //             <div className="md:w-1/3 flex flex-col items-center">
// // //               <div className="relative group">
// // //                 <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
// // //                   {imagePreview ? (
// // //                     <Image
// // //                       src={imagePreview}
// // //                       alt={`Photo de ${user.nom}`}
// // //                       width={160}
// // //                       height={160}
// // //                       className="object-cover w-full h-full"
// // //                     />
// // //                   ) : (
// // //                     <div className="bg-gray-200 w-full h-full flex items-center justify-center">
// // //                       <svg
// // //                         className="h-20 w-20 text-gray-400"
// // //                         fill="currentColor"
// // //                         viewBox="0 0 20 20"
// // //                       >
// // //                         <path
// // //                           fillRule="evenodd"
// // //                           d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
// // //                           clipRule="evenodd"
// // //                         />
// // //                       </svg>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //                 <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer group-hover:bg-blue-100 transition-colors">
// // //                   <input
// // //                     type="file"
// // //                     accept="image/*"
// // //                     onChange={handleImageChange}
// // //                     className="hidden"
// // //                     disabled={loading}
// // //                   />
// // //                   <svg
// // //                     className="w-5 h-5 text-gray-700 group-hover:text-blue-600"
// // //                     fill="none"
// // //                     stroke="currentColor"
// // //                     viewBox="0 0 24 24"
// // //                   >
// // //                     <path
// // //                       strokeLinecap="round"
// // //                       strokeLinejoin="round"
// // //                       strokeWidth={2}
// // //                       d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
// // //                     />
// // //                     <path
// // //                       strokeLinecap="round"
// // //                       strokeLinejoin="round"
// // //                       strokeWidth={2}
// // //                       d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
// // //                     />
// // //                   </svg>
// // //                 </label>
// // //               </div>

// // //               <div className="mt-6 text-center">
// // //                 <h2 className="text-xl font-bold text-gray-900">{user.nom}</h2>
// // //                 <p className="text-gray-600">{user.email}</p>
// // //                 <p className="mt-1 text-sm text-gray-500">
// // //                   Membre depuis {new Date(user.date_creation).toLocaleDateString('fr-FR')}
// // //                 </p>
// // //               </div>
// // //             </div>

// // //             {/* Colonne droite - Formulaire */}
// // //             <div className="md:w-2/3">
// // //               <form onSubmit={handleSubmit} className="space-y-6">
// // //                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
// // //                   <div>
// // //                     <label
// // //                       htmlFor="nom"
// // //                       className="block text-sm font-medium text-gray-700"
// // //                     >
// // //                       Nom complet
// // //                     </label>
// // //                     <input
// // //                       type="text"
// // //                       name="nom"
// // //                       id="nom"
// // //                       value={formData.nom}
// // //                       onChange={handleChange}
// // //                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   <div>
// // //                     <label
// // //                       htmlFor="email"
// // //                       className="block text-sm font-medium text-gray-700"
// // //                     >
// // //                       Adresse email
// // //                     </label>
// // //                     <input
// // //                       type="email"
// // //                       name="email"
// // //                       id="email"
// // //                       value={formData.email}
// // //                       onChange={handleChange}
// // //                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// // //                       disabled={loading}
// // //                     />
// // //                   </div>
// // //                 </div>

// // //                 <div className="pt-4">
// // //                   <div className="flex justify-end gap-3">
// // //                     <button
// // //                       type="button"
// // //                       onClick={() => router.back()}
// // //                       className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
// // //                       disabled={loading}
// // //                     >
// // //                       Annuler
// // //                     </button>
// // //                     <button
// // //                       type="submit"
// // //                       disabled={loading}
// // //                       className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
// // //                         loading ? 'opacity-75 cursor-not-allowed' : ''
// // //                       }`}
// // //                     >
// // //                       {loading ? (
// // //                         <>
// // //                           <svg
// // //                             className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
// // //                             xmlns="http://www.w3.org/2000/svg"
// // //                             fill="none"
// // //                             viewBox="0 0 24 24"
// // //                           >
// // //                             <circle
// // //                               className="opacity-25"
// // //                               cx="12"
// // //                               cy="12"
// // //                               r="10"
// // //                               stroke="currentColor"
// // //                               strokeWidth="4"
// // //                             ></circle>
// // //                             <path
// // //                               className="opacity-75"
// // //                               fill="currentColor"
// // //                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
// // //                             ></path>
// // //                           </svg>
// // //                           Enregistrement...
// // //                         </>
// // //                       ) : (
// // //                         'Enregistrer les modifications'
// // //                       )}
// // //                     </button>
// // //                   </div>
// // //                 </div>

// // //                 {success && (
// // //                   <div className="rounded-md bg-green-50 p-4">
// // //                     <div className="flex">
// // //                       <div className="flex-shrink-0">
// // //                         <svg
// // //                           className="h-5 w-5 text-green-400"
// // //                           viewBox="0 0 20 20"
// // //                           fill="currentColor"
// // //                         >
// // //                           <path
// // //                             fillRule="evenodd"
// // //                             d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
// // //                             clipRule="evenodd"
// // //                           />
// // //                         </svg>
// // //                       </div>
// // //                       <div className="ml-3">
// // //                         <p className="text-sm font-medium text-green-800">
// // //                           Votre profil a été mis à jour avec succès
// // //                         </p>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 )}
// // //               </form>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }




// 'use client'
// import { useAuth } from '@/context/AuthContext'
// import { useState, useEffect } from 'react'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase/client'
// import { toast } from 'react-toastify'

// export default function ProfilePage() {
//   const { user, updateProfile, uploadProfileImage } = useAuth()
//   const router = useRouter()
//   const [formData, setFormData] = useState({
//     nom: user?.nom || '',
//     email: user?.email || '',
//   })
//   const [medecinFormData, setMedecinFormData] = useState({
//     sexe: '',
//     numero_telephone: '',
//     nationalite: '',
//     numero_immatriculation: '',
//     specialite_id: '',
//     autre_specialite: '',
//     grade_titre_id: '',
//     annee_experience: '',
//     diplome: '',
//     bio: ''
//   })
//   const [patientFormData, setPatientFormData] = useState({
//     sexe: '',
//     date_naissance: '',
//     groupe_sanguin: '',
//     allergies: '',
//     antecedents_medicaux: ''
//   })
//   const [specialites, setSpecialites] = useState<any[]>([])
//   const [gradesTitres, setGradesTitres] = useState<any[]>([])
//   const [langues, setLangues] = useState<any[]>([])
//   const [selectedLangues, setSelectedLangues] = useState<number[]>([])
//   const [imagePreview, setImagePreview] = useState(user?.profil_url || '')
//   const [loading, setLoading] = useState(false)
//   const [medecinLoading, setMedecinLoading] = useState(false)
//   const [patientLoading, setPatientLoading] = useState(false)
//   const [success, setSuccess] = useState(false)
//   const [activeTab, setActiveTab] = useState('general')

//   useEffect(() => {
//     if (!user) {
//       router.push('/login')
//       return
//     }

//     // Charger les données spécifiques selon le rôle
//     if (user.role === 'medecin') {
//       fetchMedecinData()
//     } else if (user.role === 'patient') {
//       fetchPatientData()
//     }
//   }, [user, router])

//   const fetchMedecinData = async () => {
//     setMedecinLoading(true)
//     try {
//       // Récupérer les données en parallèle
//       const [
//         { data: specialitesData },
//         { data: gradesData },
//         { data: languesData },
//         { data: medecinInfo }
//       ] = await Promise.all([
//         supabase.from('specialites').select('*'),
//         supabase.from('grades_titres').select('*'),
//         supabase.from('langues').select('*'),
//         supabase.from('medecin_infos')
//           .select('*')
//           .eq('user_id', user?.id)
//           .single()
//       ])

//       setSpecialites(specialitesData || [])
//       setGradesTitres(gradesData || [])
//       setLangues(languesData || [])

//       if (medecinInfo) {
//         setMedecinFormData({
//           sexe: medecinInfo.sexe || '',
//           numero_telephone: medecinInfo.numero_telephone || '',
//           nationalite: medecinInfo.nationalite || '',
//           numero_immatriculation: medecinInfo.numero_immatriculation || '',
//           specialite_id: medecinInfo.specialite_id?.toString() || '',
//           autre_specialite: medecinInfo.autre_specialite || '',
//           grade_titre_id: medecinInfo.grade_titre_id?.toString() || '',
//           annee_experience: medecinInfo.annee_experience?.toString() || '',
//           diplome: medecinInfo.diplome || '',
//           bio: medecinInfo.bio || ''
//         })

//         // Récupérer les langues du médecin
//         const { data: medecinLangues } = await supabase
//           .from('medecin_langues')
//           .select('langue_id')
//           .eq('medecin_id', medecinInfo.id)

//         if (medecinLangues) {
//           setSelectedLangues(medecinLangues.map(l => l.langue_id))
//         }
//       }
//     } catch (error) {
//       console.error('Erreur lors du chargement des données médecin:', error)
//       toast.error('Erreur lors du chargement des données médecin')
//     } finally {
//       setMedecinLoading(false)
//     }
//   }

//   const fetchPatientData = async () => {
//     setPatientLoading(true)
//     try {
//       const { data: patientInfo, error } = await supabase
//         .from('patient_infos')
//         .select('*')
//         .eq('user_id', user?.id)
//         .single()

//       if (error && !error.message.includes('No rows found')) {
//         throw error
//       }

//       if (patientInfo) {
//         setPatientFormData({
//           sexe: patientInfo.sexe || '',
//           date_naissance: patientInfo.date_naissance ? new Date(patientInfo.date_naissance).toISOString().split('T')[0] : '',
//           groupe_sanguin: patientInfo.groupe_sanguin || '',
//           allergies: patientInfo.allergies || '',
//           antecedents_medicaux: patientInfo.antecedents_medicaux || ''
//         })
//       }
//     } catch (error) {
//       console.error('Erreur lors du chargement des données patient:', error)
//       toast.error('Erreur lors du chargement des données patient')
//     } finally {
//       setPatientLoading(false)
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleMedecinChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setMedecinFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setPatientFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleLangueChange = (langueId: number) => {
//     setSelectedLangues(prev =>
//       prev.includes(langueId)
//         ? prev.filter(id => id !== langueId)
//         : [...prev, langueId]
//     )
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     try {
//       const updated = await updateProfile(formData)
//       if (updated) {
//         setSuccess(true)
//         setTimeout(() => setSuccess(false), 3000)
//       }
//     } catch (error) {
//       console.error('Erreur:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleMedecinSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       if (!user) {
//         toast.error('Vous devez être connecté')
//         return
//       }

//       // Préparer les données pour la base de données
//       const medecinData = {
//         user_id: user.id,
//         sexe: medecinFormData.sexe,
//         numero_telephone: medecinFormData.numero_telephone,
//         nationalite: medecinFormData.nationalite,
//         numero_immatriculation: medecinFormData.numero_immatriculation,
//         specialite_id: medecinFormData.specialite_id ? parseInt(medecinFormData.specialite_id) : null,
//         autre_specialite: medecinFormData.autre_specialite,
//         grade_titre_id: medecinFormData.grade_titre_id ? parseInt(medecinFormData.grade_titre_id) : null,
//         annee_experience: medecinFormData.annee_experience ? parseInt(medecinFormData.annee_experience) : null,
//         diplome: medecinFormData.diplome,
//         bio: medecinFormData.bio,
//         employeur_actuel: 'Watu Wetu',
//         updated_at: new Date().toISOString()
//       }

//       // Vérifier si le médecin existe déjà
//       const { data: existingMedecin } = await supabase
//         .from('medecin_infos')
//         .select('id')
//         .eq('user_id', user.id)
//         .single()

//       let medecinId: string

//       if (existingMedecin) {
//         // Mise à jour
//         const { error: updateError } = await supabase
//           .from('medecin_infos')
//           .update(medecinData)
//           .eq('id', existingMedecin.id)

//         if (updateError) throw updateError
//         medecinId = existingMedecin.id
//       } else {
//         // Création
//         const { data: newMedecin, error: insertError } = await supabase
//           .from('medecin_infos')
//           .insert(medecinData)
//           .select()
//           .single()

//         if (insertError) throw insertError
//         medecinId = newMedecin.id
//       }

//       // Gestion des langues
//       // 1. Supprimer toutes les langues existantes
//       const { error: deleteError } = await supabase
//         .from('medecin_langues')
//         .delete()
//         .eq('medecin_id', medecinId)

//       if (deleteError) throw deleteError

//       // 2. Ajouter les nouvelles langues sélectionnées
//       if (selectedLangues.length > 0) {
//         const languesToInsert = selectedLangues.map(langue_id => ({
//           medecin_id: medecinId,
//           langue_id
//         }))

//         const { error: insertLanguesError } = await supabase
//           .from('medecin_langues')
//           .insert(languesToInsert)

//         if (insertLanguesError) throw insertLanguesError
//       }

//       toast.success('Profil médecin mis à jour avec succès')
//       setSuccess(true)
//       setTimeout(() => setSuccess(false), 3000)
//     } catch (error) {
//       console.error('Erreur:', error)
//       toast.error('Erreur lors de la mise à jour du profil médecin')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePatientSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       if (!user) {
//         toast.error('Vous devez être connecté')
//         return
//       }

//       // Préparer les données pour la base de données
//       const patientData = {
//         user_id: user.id,
//         sexe: patientFormData.sexe,
//         date_naissance: patientFormData.date_naissance || null,
//         groupe_sanguin: patientFormData.groupe_sanguin || null,
//         allergies: patientFormData.allergies || null,
//         antecedents_medicaux: patientFormData.antecedents_medicaux || null,
//         updated_at: new Date().toISOString()
//       }

//       // Vérifier si le patient existe déjà
//       const { data: existingPatient, error: fetchError } = await supabase
//         .from('patient_infos')
//         .select('id')
//         .eq('user_id', user.id)
//         .single()

//       if (existingPatient && !fetchError) {
//         // Mise à jour
//         const { error: updateError } = await supabase
//           .from('patient_infos')
//           .update(patientData)
//           .eq('id', existingPatient.id)

//         if (updateError) throw updateError
//       } else {
//         // Création
//         const { error: insertError } = await supabase
//           .from('patient_infos')
//           .insert(patientData)

//         if (insertError) throw insertError
//       }

//       toast.success('Profil patient mis à jour avec succès')
//       setSuccess(true)
//       setTimeout(() => setSuccess(false), 3000)
//     } catch (error) {
//       console.error('Erreur:', error)
//       toast.error('Erreur lors de la mise à jour du profil patient')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0]
      
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string)
//       }
//       reader.readAsDataURL(file)
      
//       await uploadProfileImage(file)
//     }
//   }

//   if (!user) {
//     return null
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="bg-white rounded-lg overflow-hidden">
//         {/* Header avec fond coloré */}
//         <div className="bg-gradient-to-r rounded-2xl from-blue-600 to-teal-500 px-6 py-8">
//           <div className="flex flex-col sm:flex-row items-center justify-between">
//             <h1 className="text-2xl font-bold text-white">Mon Profil</h1>
//             <span className="mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-medium bg text-gray-100">
//               {user.role === 'admin' ? 'Administrateur' : 
//                user.role === 'medecin' ? 'Médecin' : 'Patient'}
//             </span>
//           </div>
//         </div>

//         {/* Contenu principal */}
//         <div className="px-6 py-8">
//           <div className="flex flex-col md:flex-row gap-8">
//             {/* Colonne gauche - Photo de profil */}
//             <div className="md:w-1/3 flex flex-col items-center">
//               <div className="relative group">
//                 <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
//                   {imagePreview ? (
//                     <Image
//                       src={imagePreview}
//                       alt={`Photo de ${user.nom}`}
//                       width={160}
//                       height={160}
//                       className="object-cover w-full h-full"
//                     />
//                   ) : (
//                     <div className="bg-gray-200 w-full h-full flex items-center justify-center">
//                       <svg
//                         className="h-20 w-20 text-gray-400"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                   )}
//                 </div>
//                 <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer group-hover:bg-blue-100 transition-colors">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="hidden"
//                     disabled={loading}
//                   />
//                   <svg
//                     className="w-5 h-5 text-gray-700 group-hover:text-blue-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                   </svg>
//                 </label>
//               </div>

//               <div className="mt-6 text-center">
//                 <h2 className="text-xl font-bold text-gray-900">{user.nom}</h2>
//                 <p className="text-gray-600">{user.email}</p>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Membre depuis {new Date(user.date_creation).toLocaleDateString('fr-FR')}
//                 </p>
//               </div>

//               {/* Onglets pour les médecins et patients */}
//               {(user.role === 'medecin' || user.role === 'patient') && (
//                 <div className="mt-6 w-full">
//                   <div className="border-b border-gray-200">
//                     <nav className="-mb-px flex space-x-8">
//                       <button
//                         onClick={() => setActiveTab('general')}
//                         className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
//                           activeTab === 'general'
//                             ? 'border-blue-500 text-blue-600'
//                             : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                         }`}
//                       >
//                         Informations générales
//                       </button>
//                       <button
//                         onClick={() => setActiveTab(user.role)}
//                         className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
//                           activeTab === user.role
//                             ? 'border-blue-500 text-blue-600'
//                             : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                         }`}
//                       >
//                         {user.role === 'medecin' ? 'Informations médicales' : 'Informations santé'}
//                       </button>
//                     </nav>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Colonne droite - Formulaire */}
//             <div className="md:w-2/3">
//               {activeTab === 'general' ? (
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//                     <div>
//                       <label
//                         htmlFor="nom"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Nom complet
//                       </label>
//                       <input
//                         type="text"
//                         name="nom"
//                         id="nom"
//                         value={formData.nom}
//                         onChange={handleChange}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         disabled={loading}
//                       />
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="email"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Adresse email
//                       </label>
//                       <input
//                         type="email"
//                         name="email"
//                         id="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         disabled={loading}
//                       />
//                     </div>
//                   </div>

//                   <div className="pt-4">
//                     <div className="flex justify-end gap-3">
//                       <button
//                         type="button"
//                         onClick={() => router.back()}
//                         className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         disabled={loading}
//                       >
//                         Annuler
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={loading}
//                         className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                           loading ? 'opacity-75 cursor-not-allowed' : ''
//                         }`}
//                       >
//                         {loading ? (
//                           <>
//                             <svg
//                               className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                               ></circle>
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                               ></path>
//                             </svg>
//                             Enregistrement...
//                           </>
//                         ) : (
//                           'Enregistrer les modifications'
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {success && (
//                     <div className="rounded-md bg-green-50 p-4">
//                       <div className="flex">
//                         <div className="flex-shrink-0">
//                           <svg
//                             className="h-5 w-5 text-green-400"
//                             viewBox="0 0 20 20"
//                             fill="currentColor"
//                           >
//                             <path
//                               fillRule="evenodd"
//                               d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                               clipRule="evenodd"
//                             />
//                           </svg>
//                         </div>
//                         <div className="ml-3">
//                           <p className="text-sm font-medium text-green-800">
//                             Votre profil a été mis à jour avec succès
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </form>
//               ) : user.role === 'medecin' ? (
//                 <form onSubmit={handleMedecinSubmit} className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Sexe */}
//                     <div>
//                       <label className="block mb-2 text-sm font-medium text-gray-700">Sexe</label>
//                       <select
//                         name="sexe"
//                         value={medecinFormData.sexe}
//                         onChange={handleMedecinChange}
//                         className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         required
//                       >
//                         <option value="">Sélectionnez</option>
//                         <option value="Masculin">Masculin</option>
//                         <option value="Féminin">Féminin</option>
//                         <option value="Autre">Autre</option>
//                       </select>
//                     </div>

//                     {/* Numéro de téléphone */}
//                     <div>
//                       <label className="block mb-2 text-sm font-medium text-gray-700">Numéro de téléphone</label>
//                       <input
//                         type="tel"
//                         name="numero_telephone"
//                         value={medecinFormData.numero_telephone}
//                         onChange={handleMedecinChange}
//                         className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         required
//                       />
//                     </div>

//                     {/* Nationalité */}
//                     <div>
//                       <label className="block mb-2 text-sm font-medium text-gray-700">Nationalité</label>
//                       <input
//                         type="text"
//                         name="nationalite"
//                         value={medecinFormData.nationalite}
//                         onChange={handleMedecinChange}
//                         className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         required
//                       />
//                     </div>

//                     {/* Numéro d'immatriculation */}
//                     <div>
//                       <label className="block mb-2 text-sm font-medium text-gray-700">Numéro d'immatriculation</label>
//                       <input
//                         type="text"
//                         name="numero_immatriculation"
//                         value={medecinFormData.numero_immatriculation}
//                         onChange={handleMedecinChange}
//                         className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         required
//                       />
//                     </div>

//                     {/* Spécialité */}
//                     <div>
//                       <label className="block mb-2 text-sm font-medium text-gray-700">Spécialité</label>
//                       <select
//                         name="specialite_id"
//                         value={medecinFormData.specialite_id}
//                         onChange={handleMedecinChange}
//                         className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         required
//                       >
//                         <option value="">Sélectionnez</option>
//                         {specialites.map(spec => (
//                           <option key={spec.id} value={spec.id}>{spec.nom}</option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Autre spécialité (si "Autre" est sélectionné) */}
//                     {medecinFormData.specialite_id && specialites.find(s => s.id === parseInt(medecinFormData.specialite_id))?.nom === 'Autre' && (
//                       <div>
//                         <label className="block mb-2 text-sm font-medium text-gray-700">Précisez votre spécialité</label>
//                         <input
//                           type="text"
//                           name="autre_specialite"
//                           value={medecinFormData.autre_specialite}
//                           onChange={handleMedecinChange}
//                           className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                           required
//                         />
//                       </div>
//                     )}

//                     {/* Grade/Titre */}
//                     <div>
//                       <label className="block mb-2 text-sm font-medium text-gray-700">Grade/Titre</label>
//                       <select
//                         name="grade_titre_id"
//                         value={medecinFormData.grade_titre_id}
//                         onChange={handleMedecinChange}
//                         className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         required
//                       >
//                         <option value="">Sélectionnez</option>
//                         {gradesTitres.map(grade => (
//                           <option key={grade.id} value={grade.id}>{grade.nom}</option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Années d'expérience */}
//                     <div>
//                       <label className="block mb-2 text-sm font-medium text-gray-700">Années d'expérience</label>
//                       <input
//                         type="number"
//                         name="annee_experience"
//                         value={medecinFormData.annee_experience}
//                         onChange={handleMedecinChange}
//                         className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         min="0"
//                         required
//                       />
//                     </div>

//                     {/* Diplôme */}
//                     <div>
//                       <label className="block mb-2 text-sm font-medium text-gray-700">Diplôme</label>
//                       <input
//                         type="text"
//                         name="diplome"
//                         value={medecinFormData.diplome}
//                         onChange={handleMedecinChange}
//                         className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         required
//                       />
//                     </div>
//                   </div>

//                   {/* Langues parlées */}
//                   <div>
//                     <label className="block mb-2 text-sm font-medium text-gray-700">Langues parlées</label>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//                       {langues.map(langue => (
//                         <div key={langue.id} className="flex items-center">
//                           <input
//                             type="checkbox"
//                             id={`langue-${langue.id}`}
//                             checked={selectedLangues.includes(langue.id)}
//                             onChange={() => handleLangueChange(langue.id)}
//                             className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                           />
//                           <label htmlFor={`langue-${langue.id}`} className="text-sm text-gray-700">
//                             {langue.nom}
//                           </label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Bio */}
//                   <div>
//                     <label className="block mb-2 text-sm font-medium text-gray-700">Bio (présentation)</label>
//                     <textarea
//                       name="bio"
//                       value={medecinFormData.bio}
//                       onChange={handleMedecinChange}
//                       className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       rows={4}
//                       required
//                     />
//                   </div>

//                   <div className="pt-4">
//                     <div className="flex justify-end gap-3">
//                       <button
//                         type="button"
//                         onClick={() => setActiveTab('general')}
//                         className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         disabled={loading}
//                       >
//                         Retour
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={loading}
//                         className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                           loading ? 'opacity-75 cursor-not-allowed' : ''
//                         }`}
//                       >
//                         {loading ? (
//                           <>
//                             <svg
//                               className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                               ></circle>
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                               ></path>
//                             </svg>
//                             Enregistrement...
//                           </>
//                         ) : (
//                           'Enregistrer les modifications'
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {success && (
//                     <div className="rounded-md bg-green-50 p-4">
//                       <div className="flex">
//                         <div className="flex-shrink-0">
//                           <svg
//                             className="h-5 w-5 text-green-400"
//                             viewBox="0 0 20 20"
//                             fill="currentColor"
//                           >
//                             <path
//                               fillRule="evenodd"
//                               d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                               clipRule="evenodd"
//                             />
//                           </svg>
//                         </div>
//                         <div className="ml-3">
//                           <p className="text-sm font-medium text-green-800">
//                             Votre profil médecin a été mis à jour avec succès
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </form>
//               ) : (
//                 // Formulaire pour les patients
//                 <form onSubmit={handlePatientSubmit} className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Sexe */}
//                     <div>
//                       <label className="block mb-2 text-sm font-medium text-gray-700">Sexe</label>
//                       <select
//                         name="sexe"
//                         value={patientFormData.sexe}
//                         onChange={handlePatientChange}
//                         className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         required
//                       >
//                         <option value="">Sélectionnez</option>
//                         <option value="Masculin">Masculin</option>
//                         <option value="Féminin">Féminin</option>
//                         <option value="Autre">Autre</option>
//                       </select>
//                     </div>

//                     {/* Date de naissance */}
//                     <div>
//                       <label className="block mb-2 text-sm font-medium text-gray-700">Date de naissance</label>
//                       <input
//                         type="date"
//                         name="date_naissance"
//                         value={patientFormData.date_naissance}
//                         onChange={handlePatientChange}
//                         className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         max={new Date().toISOString().split('T')[0]} // Empêche les dates futures
//                         required
//                       />
//                     </div>

//                     {/* Groupe sanguin */}
//                     <div>
//                       <label className="block mb-2 text-sm font-medium text-gray-700">Groupe sanguin</label>
//                       <select
//                         name="groupe_sanguin"
//                         value={patientFormData.groupe_sanguin}
//                         onChange={handlePatientChange}
//                         className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       >
//                         <option value="">Inconnu</option>
//                         <option value="A+">A+</option>
//                         <option value="A-">A-</option>
//                         <option value="B+">B+</option>
//                         <option value="B-">B-</option>
//                         <option value="AB+">AB+</option>
//                         <option value="AB-">AB-</option>
//                         <option value="O+">O+</option>
//                         <option value="O-">O-</option>
//                       </select>
//                     </div>
//                   </div>

//                   {/* Allergies */}
//                   <div>
//                     <label className="block mb-2 text-sm font-medium text-gray-700">
//                       Allergies (séparées par des virgules)
//                     </label>
//                     <textarea
//                       name="allergies"
//                       value={patientFormData.allergies}
//                       onChange={handlePatientChange}
//                       className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       rows={3}
//                       placeholder="Ex: Penicilline, Arachides, Pollen..."
//                     />
//                   </div>

//                   {/* Antécédents médicaux */}
//                   <div>
//                     <label className="block mb-2 text-sm font-medium text-gray-700">
//                       Antécédents médicaux
//                     </label>
//                     <textarea
//                       name="antecedents_medicaux"
//                       value={patientFormData.antecedents_medicaux}
//                       onChange={handlePatientChange}
//                       className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       rows={5}
//                       placeholder="Décrivez vos antécédents médicaux (maladies chroniques, opérations, etc.)"
//                     />
//                   </div>

//                   <div className="pt-4">
//                     <div className="flex justify-end gap-3">
//                       <button
//                         type="button"
//                         onClick={() => setActiveTab('general')}
//                         className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         disabled={loading}
//                       >
//                         Retour
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={loading}
//                         className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                           loading ? 'opacity-75 cursor-not-allowed' : ''
//                         }`}
//                       >
//                         {loading ? (
//                           <>
//                             <svg
//                               className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                               ></circle>
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                               ></path>
//                             </svg>
//                             Enregistrement...
//                           </>
//                         ) : (
//                           'Enregistrer les modifications'
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {success && (
//                     <div className="rounded-md bg-green-50 p-4">
//                       <div className="flex">
//                         <div className="flex-shrink-0">
//                           <svg
//                             className="h-5 w-5 text-green-400"
//                             viewBox="0 0 20 20"
//                             fill="currentColor"
//                           >
//                             <path
//                               fillRule="evenodd"
//                               d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                               clipRule="evenodd"
//                             />
//                           </svg>
//                         </div>
//                         <div className="ml-3">
//                           <p className="text-sm font-medium text-green-800">
//                             Votre profil patient a été mis à jour avec succès
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'
import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'react-toastify'

export default function ProfilePage() {
  const { user, updateProfile, uploadProfileImage } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    email: user?.email || '',
  })
  const [medecinFormData, setMedecinFormData] = useState({
    sexe: '',
    numero_telephone: '',
    nationalite: '',
    numero_immatriculation: '',
    specialite_id: '',
    autre_specialite: '',
    grade_titre_id: '',
    annee_experience: '',
    diplome: '',
    bio: ''
  })
  const [patientFormData, setPatientFormData] = useState({
    sexe: '',
    date_naissance: '',
    groupe_sanguin: '',
    allergies: '',
    antecedents_medicaux: ''
  })
  const [specialites, setSpecialites] = useState<any[]>([])
  const [gradesTitres, setGradesTitres] = useState<any[]>([])
  const [langues, setLangues] = useState<any[]>([])
  const [selectedLangues, setSelectedLangues] = useState<number[]>([])
  const [imagePreview, setImagePreview] = useState(user?.profil_url || '')
  const [loading, setLoading] = useState(false)
  const [medecinLoading, setMedecinLoading] = useState(false)
  const [patientLoading, setPatientLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    // Charger les données spécifiques selon le rôle
    if (user.role === 'medecin') {
      fetchMedecinData()
    } else if (user.role === 'patient') {
      fetchPatientData()
    }
  }, [user, router])

  const fetchMedecinData = async () => {
    setMedecinLoading(true)
    try {
      // Récupérer les données en parallèle
      const [
        { data: specialitesData },
        { data: gradesData },
        { data: languesData },
        { data: medecinInfo }
      ] = await Promise.all([
        supabase.from('specialites').select('*'),
        supabase.from('grades_titres').select('*'),
        supabase.from('langues').select('*'),
        supabase.from('medecin_infos')
          .select('*')
          .eq('user_id', user?.id)
          .single()
      ])

      setSpecialites(specialitesData || [])
      setGradesTitres(gradesData || [])
      setLangues(languesData || [])

      if (medecinInfo) {
        setMedecinFormData({
          sexe: medecinInfo.sexe || '',
          numero_telephone: medecinInfo.numero_telephone || '',
          nationalite: medecinInfo.nationalite || '',
          numero_immatriculation: medecinInfo.numero_immatriculation || '',
          specialite_id: medecinInfo.specialite_id?.toString() || '',
          autre_specialite: medecinInfo.autre_specialite || '',
          grade_titre_id: medecinInfo.grade_titre_id?.toString() || '',
          annee_experience: medecinInfo.annee_experience?.toString() || '',
          diplome: medecinInfo.diplome || '',
          bio: medecinInfo.bio || ''
        })

        // Récupérer les langues du médecin
        const { data: medecinLangues } = await supabase
          .from('medecin_langues')
          .select('langue_id')
          .eq('medecin_id', medecinInfo.id)

        if (medecinLangues) {
          setSelectedLangues(medecinLangues.map(l => l.langue_id))
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données médecin:', error)
      toast.error('Erreur lors du chargement des données médecin')
    } finally {
      setMedecinLoading(false)
    }
  }

  const fetchPatientData = async () => {
    setPatientLoading(true)
    try {
      const { data: patientInfo, error } = await supabase
        .from('patient_infos')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (error && !error.message.includes('No rows found')) {
        throw error
      }

      if (patientInfo) {
        setPatientFormData({
          sexe: patientInfo.sexe || '',
          date_naissance: patientInfo.date_naissance ? new Date(patientInfo.date_naissance).toISOString().split('T')[0] : '',
          groupe_sanguin: patientInfo.groupe_sanguin || '',
          allergies: patientInfo.allergies || '',
          antecedents_medicaux: patientInfo.antecedents_medicaux || ''
        })
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données patient:', error)
      toast.error('Erreur lors du chargement des données patient')
    } finally {
      setPatientLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMedecinChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMedecinFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPatientFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLangueChange = (langueId: number) => {
    setSelectedLangues(prev =>
      prev.includes(langueId)
        ? prev.filter(id => id !== langueId)
        : [...prev, langueId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await updateProfile(formData)
      if (updated) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMedecinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!user) {
        toast.error('Vous devez être connecté')
        return
      }

      // Préparer les données pour la base de données
      const medecinData = {
        user_id: user.id,
        sexe: medecinFormData.sexe,
        numero_telephone: medecinFormData.numero_telephone,
        nationalite: medecinFormData.nationalite,
        numero_immatriculation: medecinFormData.numero_immatriculation,
        specialite_id: medecinFormData.specialite_id ? parseInt(medecinFormData.specialite_id) : null,
        autre_specialite: medecinFormData.autre_specialite,
        grade_titre_id: medecinFormData.grade_titre_id ? parseInt(medecinFormData.grade_titre_id) : null,
        annee_experience: medecinFormData.annee_experience ? parseInt(medecinFormData.annee_experience) : null,
        diplome: medecinFormData.diplome,
        bio: medecinFormData.bio,
        employeur_actuel: 'Watu Wetu',
        updated_at: new Date().toISOString()
      }

      // Vérifier si le médecin existe déjà
      const { data: existingMedecin } = await supabase
        .from('medecin_infos')
        .select('id')
        .eq('user_id', user.id)
        .single()

      let medecinId: string

      if (existingMedecin) {
        // Mise à jour
        const { error: updateError } = await supabase
          .from('medecin_infos')
          .update(medecinData)
          .eq('id', existingMedecin.id)

        if (updateError) throw updateError
        medecinId = existingMedecin.id
      } else {
        // Création
        const { data: newMedecin, error: insertError } = await supabase
          .from('medecin_infos')
          .insert(medecinData)
          .select()
          .single()

        if (insertError) throw insertError
        medecinId = newMedecin.id
      }

      // Gestion des langues
      // 1. Supprimer toutes les langues existantes
      const { error: deleteError } = await supabase
        .from('medecin_langues')
        .delete()
        .eq('medecin_id', medecinId)

      if (deleteError) throw deleteError

      // 2. Ajouter les nouvelles langues sélectionnées
      if (selectedLangues.length > 0) {
        const languesToInsert = selectedLangues.map(langue_id => ({
          medecin_id: medecinId,
          langue_id
        }))

        const { error: insertLanguesError } = await supabase
          .from('medecin_langues')
          .insert(languesToInsert)

        if (insertLanguesError) throw insertLanguesError
      }

      toast.success('Profil médecin mis à jour avec succès')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la mise à jour du profil médecin')
    } finally {
      setLoading(false)
    }
  }

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!user) {
        toast.error('Vous devez être connecté')
        return
      }

      // Préparer les données pour la base de données
      const patientData = {
        user_id: user.id,
        sexe: patientFormData.sexe,
        date_naissance: patientFormData.date_naissance || null,
        groupe_sanguin: patientFormData.groupe_sanguin || null,
        allergies: patientFormData.allergies || null,
        antecedents_medicaux: patientFormData.antecedents_medicaux || null,
        updated_at: new Date().toISOString()
      }

      // Vérifier si le patient existe déjà
      const { data: existingPatient, error: fetchError } = await supabase
        .from('patient_infos')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existingPatient && !fetchError) {
        // Mise à jour
        const { error: updateError } = await supabase
          .from('patient_infos')
          .update(patientData)
          .eq('id', existingPatient.id)

        if (updateError) throw updateError
      } else {
        // Création
        const { error: insertError } = await supabase
          .from('patient_infos')
          .insert(patientData)

        if (insertError) throw insertError
      }

      toast.success('Profil patient mis à jour avec succès')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la mise à jour du profil patient')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      await uploadProfileImage(file)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg overflow-hidden shadow">
        {/* Header avec fond coloré */}
        <div className="bg-gradient-to-r rounded-t-lg from-blue-600 to-teal-500 px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Mon Profil</h1>
            <span className="mt-2 sm:mt-0 px-3 py-1 rounded-full text-lg font-medium  text-white">
             Compte {user.role === 'admin' ? 'Administrateur' : 
               user.role === 'medecin' ? 'Médecin' : 'Patient'}
            </span>
          </div>
        </div>

        {/* Onglets pour les médecins et patients */}
        {(user.role === 'medecin' || user.role === 'patient') && (
          <div className="border-b border-gray-200 px-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('general')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'general'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Informations générales
              </button>
              <button
                onClick={() => setActiveTab(user.role)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === user.role
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {user.role === 'medecin' ? 'Informations médicales' : 'Informations santé'}
              </button>
            </nav>
          </div>
        )}

        {/* Contenu principal */}
        <div className="px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Colonne gauche - Photo de profil */}
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt={`Photo de ${user.nom}`}
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                      <svg
                        className="h-20 w-20 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer group-hover:bg-blue-100 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <svg
                    className="w-5 h-5 text-gray-700 group-hover:text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
              </div>

              <div className="mt-6 text-center">
                <h2 className="text-xl font-bold text-gray-900">{user.nom}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="mt-1 text-sm text-gray-500">
                  Membre depuis {new Date(user.date_creation).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            {/* Colonne droite - Formulaire */}
            <div className="md:w-2/3">
              {activeTab === 'general' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="nom"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nom complet
                      </label>
                      <input
                        type="text"
                        name="nom"
                        id="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Adresse email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          loading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                            Enregistrement...
                          </>
                        ) : (
                          'Enregistrer les modifications'
                        )}
                      </button>
                    </div>
                  </div>

                  {success && (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">
                            Votre profil a été mis à jour avec succès
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              ) : user.role === 'medecin' ? (
                <form onSubmit={handleMedecinSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sexe */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Sexe</label>
                      <select
                        name="sexe"
                        value={medecinFormData.sexe}
                        onChange={handleMedecinChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Sélectionnez</option>
                        <option value="Masculin">Masculin</option>
                        <option value="Féminin">Féminin</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>

                    {/* Numéro de téléphone */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Numéro de téléphone</label>
                      <input
                        type="tel"
                        name="numero_telephone"
                        value={medecinFormData.numero_telephone}
                        onChange={handleMedecinChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    {/* Nationalité */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Nationalité</label>
                      <input
                        type="text"
                        name="nationalite"
                        value={medecinFormData.nationalite}
                        onChange={handleMedecinChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    {/* Numéro d'immatriculation */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Numéro d'immatriculation</label>
                      <input
                        type="text"
                        name="numero_immatriculation"
                        value={medecinFormData.numero_immatriculation}
                        onChange={handleMedecinChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    {/* Spécialité */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Spécialité</label>
                      <select
                        name="specialite_id"
                        value={medecinFormData.specialite_id}
                        onChange={handleMedecinChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Sélectionnez</option>
                        {specialites.map(spec => (
                          <option key={spec.id} value={spec.id}>{spec.nom}</option>
                        ))}
                      </select>
                    </div>

                    {/* Autre spécialité (si "Autre" est sélectionné) */}
                    {medecinFormData.specialite_id && specialites.find(s => s.id === parseInt(medecinFormData.specialite_id))?.nom === 'Autre' && (
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Précisez votre spécialité</label>
                        <input
                          type="text"
                          name="autre_specialite"
                          value={medecinFormData.autre_specialite}
                          onChange={handleMedecinChange}
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                    )}

                    {/* Grade/Titre */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Grade/Titre</label>
                      <select
                        name="grade_titre_id"
                        value={medecinFormData.grade_titre_id}
                        onChange={handleMedecinChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Sélectionnez</option>
                        {gradesTitres.map(grade => (
                          <option key={grade.id} value={grade.id}>{grade.nom}</option>
                        ))}
                      </select>
                    </div>

                    {/* Années d'expérience */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Années d'expérience</label>
                      <input
                        type="number"
                        name="annee_experience"
                        value={medecinFormData.annee_experience}
                        onChange={handleMedecinChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        min="0"
                        required
                      />
                    </div>

                    {/* Diplôme */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Diplôme</label>
                      <input
                        type="text"
                        name="diplome"
                        value={medecinFormData.diplome}
                        onChange={handleMedecinChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Langues parlées */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Langues parlées</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {langues.map(langue => (
                        <div key={langue.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`langue-${langue.id}`}
                            checked={selectedLangues.includes(langue.id)}
                            onChange={() => handleLangueChange(langue.id)}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`langue-${langue.id}`} className="text-sm text-gray-700">
                            {langue.nom}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Bio (présentation)</label>
                    <textarea
                      name="bio"
                      value={medecinFormData.bio}
                      onChange={handleMedecinChange}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('general')}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading}
                      >
                        Retour
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          loading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                            Enregistrement...
                          </>
                        ) : (
                          'Enregistrer les modifications'
                        )}
                      </button>
                    </div>
                  </div>

                  {success && (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">
                            Votre profil médecin a été mis à jour avec succès
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              ) : (
                // Formulaire pour les patients
                <form onSubmit={handlePatientSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sexe */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Sexe</label>
                      <select
                        name="sexe"
                        value={patientFormData.sexe}
                        onChange={handlePatientChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Sélectionnez</option>
                        <option value="Masculin">Masculin</option>
                        <option value="Féminin">Féminin</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>

                    {/* Date de naissance */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Date de naissance</label>
                      <input
                        type="date"
                        name="date_naissance"
                        value={patientFormData.date_naissance}
                        onChange={handlePatientChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        max={new Date().toISOString().split('T')[0]} // Empêche les dates futures
                        required
                      />
                    </div>

                    {/* Groupe sanguin */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Groupe sanguin</label>
                      <select
                        name="groupe_sanguin"
                        value={patientFormData.groupe_sanguin}
                        onChange={handlePatientChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Inconnu</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  {/* Allergies */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Allergies (séparées par des virgules)
                    </label>
                    <textarea
                      name="allergies"
                      value={patientFormData.allergies}
                      onChange={handlePatientChange}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      rows={3}
                      placeholder="Ex: Penicilline, Arachides, Pollen..."
                    />
                  </div>

                  {/* Antécédents médicaux */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Antécédents médicaux
                    </label>
                    <textarea
                      name="antecedents_medicaux"
                      value={patientFormData.antecedents_medicaux}
                      onChange={handlePatientChange}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      rows={5}
                      placeholder="Décrivez vos antécédents médicaux (maladies chroniques, opérations, etc.)"
                    />
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('general')}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading}
                      >
                        Retour
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          loading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                            Enregistrement...
                          </>
                        ) : (
                          'Enregistrer les modifications'
                        )}
                      </button>
                    </div>
                  </div>

                  {success && (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">
                            Votre profil patient a été mis à jour avec succès
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}