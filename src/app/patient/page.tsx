
// 'use client'
// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { useRouter } from 'next/navigation'
// import { toast } from 'react-toastify'
// import { supabase } from '@/lib/supabase/client'

// export default function CompleterProfilPatient() {
//   const { user, loading: authLoading } = useAuth()
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [formData, setFormData] = useState({
//     sexe: '',
//     date_naissance: '',
//     groupe_sanguin: '',
//     allergies: '',
//     antecedents_medicaux: ''
//   })

//   useEffect(() => {
//     if (authLoading) return

//     if (!user) {
//       router.push('/login')
//       return
//     }

//     const fetchPatientInfo = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('patient_infos')
//           .select('*')
//           .eq('user_id', user.id)
//           .single()

//         if (error && !error.message.includes('No rows found')) throw error

//         if (data) {
//           setFormData({
//             sexe: data.sexe || '',
//             date_naissance: data.date_naissance ? new Date(data.date_naissance).toISOString().split('T')[0] : '',
//             groupe_sanguin: data.groupe_sanguin || '',
//             allergies: data.allergies || '',
//             antecedents_medicaux: data.antecedents_medicaux || ''
//           })
//         }
//       } catch (error) {
//         toast.error('Erreur lors du chargement des données')
//         console.error(error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchPatientInfo()
//   }, [user, authLoading, router])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setSubmitting(true)

//     try {
//       if (!user) {
//         throw new Error('Utilisateur non connecté')
//       }

//       // Formatage des données pour la base de données
//       const dataToSave = {
//         ...formData,
//         user_id: user.id,
//         date_naissance: formData.date_naissance || null
//       }

//       // Vérification si l'utilisateur a déjà des infos patient
//       const { data: existingData } = await supabase
//         .from('patient_infos')
//         .select('id')
//         .eq('user_id', user.id)
//         .single()

//       if (existingData) {
//         // Mise à jour des données existantes
//         const { error } = await supabase
//           .from('patient_infos')
//           .update(dataToSave)
//           .eq('user_id', user.id)

//         if (error) throw error
//       } else {
//         // Création de nouvelles données
//         const { error } = await supabase
//           .from('patient_infos')
//           .insert(dataToSave)

//         if (error) throw error
//       }

//       toast.success('Profil mis à jour avec succès')
//       router.push('/patient/dashboard')
//     } catch (error) {
//       toast.error('Erreur lors de la mise à jour du profil')
//       console.error(error)
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
//         <p>Redirection en cours...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Compléter votre profil patient</h1>
      
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

//           {/* Date de naissance */}
//           <div>
//             <label className="block mb-2">Date de naissance</label>
//             <input
//               type="date"
//               name="date_naissance"
//               value={formData.date_naissance}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>

//           {/* Groupe sanguin */}
//           <div>
//             <label className="block mb-2">Groupe sanguin</label>
//             <select
//               name="groupe_sanguin"
//               value={formData.groupe_sanguin}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//             >
//               <option value="">Inconnu</option>
//               <option value="A+">A+</option>
//               <option value="A-">A-</option>
//               <option value="B+">B+</option>
//               <option value="B-">B-</option>
//               <option value="AB+">AB+</option>
//               <option value="AB-">AB-</option>
//               <option value="O+">O+</option>
//               <option value="O-">O-</option>
//             </select>
//           </div>
//         </div>

//         {/* Allergies */}
//         <div>
//           <label className="block mb-2">Allergies (séparées par des virgules)</label>
//           <textarea
//             name="allergies"
//             value={formData.allergies}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             rows={2}
//             placeholder="Ex: Penicilline, Arachides, Pollen..."
//           />
//         </div>

//         {/* Antécédents médicaux */}
//         <div>
//           <label className="block mb-2">Antécédents médicaux</label>
//           <textarea
//             name="antecedents_medicaux"
//             value={formData.antecedents_medicaux}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             rows={4}
//             placeholder="Décrivez vos antécédents médicaux (maladies chroniques, opérations, etc.)"
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

export default function CompleterProfilPatient() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    sexe: '',
    date_naissance: '',
    groupe_sanguin: '',
    allergies: '',
    antecedents_medicaux: ''
  })

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    const fetchPatientInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('patient_infos')
          .select('*')
          .eq('user_id', user.id)
          .single()

        // "No rows found" est une erreur normale si le patient n'a pas encore de profil
        if (error && !error.message.includes('No rows found')) {
          throw error
        }

        if (data) {
          setFormData({
            sexe: data.sexe || '',
            date_naissance: data.date_naissance ? new Date(data.date_naissance).toISOString().split('T')[0] : '',
            groupe_sanguin: data.groupe_sanguin || '',
            allergies: data.allergies || '',
            antecedents_medicaux: data.antecedents_medicaux || ''
          })
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement:', error)
        toast.error(`Erreur lors du chargement des données: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchPatientInfo()
  }, [user, authLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (!user) {
        toast.error('Vous devez être connecté')
        return
      }

      // Préparer les données pour la base de données
      const patientData = {
        user_id: user.id,
        sexe: formData.sexe,
        date_naissance: formData.date_naissance || null,
        groupe_sanguin: formData.groupe_sanguin || null,
        allergies: formData.allergies || null,
        antecedents_medicaux: formData.antecedents_medicaux || null,
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
      router.push('/patient/dashboard')
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error)
      toast.error(`Erreur lors de la mise à jour: ${error.message}`)
    } finally {
      setSubmitting(false)
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Compléter votre profil patient</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sexe */}
          <div>
            <label className="block mb-2">Sexe</label>
            <select
              name="sexe"
              value={formData.sexe}
              onChange={handleChange}
              className="w-full p-2 border rounded"
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
            <label className="block mb-2">Date de naissance</label>
            <input
              type="date"
              name="date_naissance"
              value={formData.date_naissance}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              max={new Date().toISOString().split('T')[0]} // Empêche les dates futures
              required
            />
          </div>

          {/* Groupe sanguin */}
          <div>
            <label className="block mb-2">Groupe sanguin</label>
            <select
              name="groupe_sanguin"
              value={formData.groupe_sanguin}
              onChange={handleChange}
              className="w-full p-2 border rounded"
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
          <label className="block mb-2">Allergies (séparées par des virgules)</label>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Ex: Penicilline, Arachides, Pollen..."
          />
        </div>

        {/* Antécédents médicaux */}
        <div>
          <label className="block mb-2">Antécédents médicaux</label>
          <textarea
            name="antecedents_medicaux"
            value={formData.antecedents_medicaux}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={5}
            placeholder="Décrivez vos antécédents médicaux (maladies chroniques, opérations, etc.)"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enregistrement...
            </span>
          ) : 'Enregistrer'}
        </button>
      </form>
    </div>
  )
}