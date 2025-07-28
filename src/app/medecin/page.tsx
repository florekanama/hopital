
// 'use client'
// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { useRouter } from 'next/navigation'
// import { toast } from 'react-toastify'
// import { supabase } from '@/lib/supabase/client'

// export default function CompleterProfilMedecin() {
//   const { user, loading: authLoading } = useAuth()
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [specialites, setSpecialites] = useState<any[]>([])
//   const [gradesTitres, setGradesTitres] = useState<any[]>([])
//   const [langues, setLangues] = useState<any[]>([])
//   const [selectedLangues, setSelectedLangues] = useState<number[]>([])
//   const [formData, setFormData] = useState({
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

//   // Récupérer les données initiales
//   useEffect(() => {
//     if (authLoading) return

//     const fetchInitialData = async () => {
//       if (!user) {
//         router.push('/login')
//         return
//       }

//       try {
//         // Récupérer les données en parallèle
//         const [
//           { data: specialitesData, error: specialitesError },
//           { data: gradesData, error: gradesError },
//           { data: languesData, error: languesError },
//           { data: medecinInfo, error: medecinError }
//         ] = await Promise.all([
//           supabase.from('specialites').select('*'),
//           supabase.from('grades_titres').select('*'),
//           supabase.from('langues').select('*'),
//           supabase.from('medecin_infos')
//             .select('*')
//             .eq('user_id', user.id)
//             .single()
//         ])

//         if (specialitesError) throw specialitesError
//         if (gradesError) throw gradesError
//         if (languesError) throw languesError

//         setSpecialites(specialitesData || [])
//         setGradesTitres(gradesData || [])
//         setLangues(languesData || [])

//         // Si le médecin a déjà des infos
//         if (medecinInfo && !medecinError) {
//           setFormData({
//             sexe: medecinInfo.sexe || '',
//             numero_telephone: medecinInfo.numero_telephone || '',
//             nationalite: medecinInfo.nationalite || '',
//             numero_immatriculation: medecinInfo.numero_immatriculation || '',
//             specialite_id: medecinInfo.specialite_id?.toString() || '',
//             autre_specialite: medecinInfo.autre_specialite || '',
//             grade_titre_id: medecinInfo.grade_titre_id?.toString() || '',
//             annee_experience: medecinInfo.annee_experience?.toString() || '',
//             diplome: medecinInfo.diplome || '',
//             bio: medecinInfo.bio || ''
//           })

//           // Récupérer les langues du médecin
//           const { data: medecinLangues, error: languesError } = await supabase
//             .from('medecin_langues')
//             .select('langue_id')
//             .eq('medecin_id', medecinInfo.id)

//           if (!languesError && medecinLangues) {
//             setSelectedLangues(medecinLangues.map(l => l.langue_id))
//           }
//         }
//       } catch (error) {
//         console.error('Erreur lors du chargement:', error)
//         toast.error('Erreur lors du chargement des données')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchInitialData()
//   }, [user, authLoading, router])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
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
//     setSubmitting(true)

//     try {
//       if (!user) {
//         toast.error('Vous devez être connecté')
//         return
//       }

//       // Préparer les données pour la base de données
//       const medecinData = {
//         user_id: user.id,
//         sexe: formData.sexe,
//         numero_telephone: formData.numero_telephone,
//         nationalite: formData.nationalite,
//         numero_immatriculation: formData.numero_immatriculation,
//         specialite_id: formData.specialite_id ? parseInt(formData.specialite_id) : null,
//         autre_specialite: formData.autre_specialite,
//         grade_titre_id: formData.grade_titre_id ? parseInt(formData.grade_titre_id) : null,
//         annee_experience: formData.annee_experience ? parseInt(formData.annee_experience) : null,
//         diplome: formData.diplome,
//         bio: formData.bio,
//         employeur_actuel: 'Watu Wetu',
//         updated_at: new Date().toISOString()
//       }

//       // Vérifier si le médecin existe déjà
//       const { data: existingMedecin, error: fetchError } = await supabase
//         .from('medecin_infos')
//         .select('id')
//         .eq('user_id', user.id)
//         .single()

//       let medecinId: string

//       if (existingMedecin && !fetchError) {
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

//       toast.success('Profil mis à jour avec succès')
//       router.push('/medecin/dashboard')
//     } catch (error) {
//       console.error('Erreur:', error)
//       toast.error('Erreur lors de la mise à jour du profil')
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Vous devez être connecté pour accéder à cette page</p>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Compléter votre profil médecin</h1>
      
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Sexe */}
//           <div>
//             <label className="block mb-2">Sexe</label>
//             <select
//               name="sexe"
//               value={formData.sexe}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               required
//             >
//               <option value="">Sélectionnez</option>
//               <option value="Masculin">Masculin</option>
//               <option value="Féminin">Féminin</option>
//               <option value="Autre">Autre</option>
//             </select>
//           </div>

//           {/* Numéro de téléphone */}
//           <div>
//             <label className="block mb-2">Numéro de téléphone</label>
//             <input
//               type="tel"
//               name="numero_telephone"
//               value={formData.numero_telephone}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>

//           {/* Nationalité */}
//           <div>
//             <label className="block mb-2">Nationalité</label>
//             <input
//               type="text"
//               name="nationalite"
//               value={formData.nationalite}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>

//           {/* Numéro d'immatriculation */}
//           <div>
//             <label className="block mb-2">Numéro d'immatriculation</label>
//             <input
//               type="text"
//               name="numero_immatriculation"
//               value={formData.numero_immatriculation}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>

//           {/* Spécialité */}
//           <div>
//             <label className="block mb-2">Spécialité</label>
//             <select
//               name="specialite_id"
//               value={formData.specialite_id}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               required
//             >
//               <option value="">Sélectionnez</option>
//               {specialites.map(spec => (
//                 <option key={spec.id} value={spec.id}>{spec.nom}</option>
//               ))}
//             </select>
//           </div>

//           {/* Autre spécialité (si "Autre" est sélectionné) */}
//           {formData.specialite_id && specialites.find(s => s.id === parseInt(formData.specialite_id))?.nom === 'Autre' && (
//             <div>
//               <label className="block mb-2">Précisez votre spécialité</label>
//               <input
//                 type="text"
//                 name="autre_specialite"
//                 value={formData.autre_specialite}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>
//           )}

//           {/* Grade/Titre */}
//           <div>
//             <label className="block mb-2">Grade/Titre</label>
//             <select
//               name="grade_titre_id"
//               value={formData.grade_titre_id}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               required
//             >
//               <option value="">Sélectionnez</option>
//               {gradesTitres.map(grade => (
//                 <option key={grade.id} value={grade.id}>{grade.nom}</option>
//               ))}
//             </select>
//           </div>

//           {/* Années d'expérience */}
//           <div>
//             <label className="block mb-2">Années d'expérience</label>
//             <input
//               type="number"
//               name="annee_experience"
//               value={formData.annee_experience}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               min="0"
//               required
//             />
//           </div>

//           {/* Diplôme */}
//           <div>
//             <label className="block mb-2">Diplôme</label>
//             <input
//               type="text"
//               name="diplome"
//               value={formData.diplome}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>
//         </div>

//         {/* Langues parlées */}
//         <div>
//           <label className="block mb-2">Langues parlées</label>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//             {langues.map(langue => (
//               <div key={langue.id} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id={`langue-${langue.id}`}
//                   checked={selectedLangues.includes(langue.id)}
//                   onChange={() => handleLangueChange(langue.id)}
//                   className="mr-2"
//                 />
//                 <label htmlFor={`langue-${langue.id}`}>{langue.nom}</label>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Bio */}
//         <div>
//           <label className="block mb-2">Bio (présentation)</label>
//           <textarea
//             name="bio"
//             value={formData.bio}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             rows={4}
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={submitting}
//           className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:opacity-50"
//         >
//           {submitting ? 'Enregistrement...' : 'Enregistrer'}
//         </button>
//       </form>
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

export default function RendezVousMedecin() {
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


  // Fonction pour télécharger les rendez-vous filtrés
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
          <p className="mt-2 text-lg text-gray-600">
            Gestion des rendez-vous à venir
          </p>
        </div>

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