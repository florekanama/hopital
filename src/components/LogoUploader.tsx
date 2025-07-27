// 'use client'
// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { supabase } from '@/lib/supabase/supabaseClient'
// import { v4 as uuidv4 } from 'uuid'
// import LoadingSpinner from '@/components/Loader'
// import { useRouter } from 'next/navigation'

// type EntrepriseData = {
//   // Identification légale
//   raison_sociale: string
//   forme_juridique: string
//   nif: string
//   idn_rccm: string
//   num_cnss: string
//   secteur_activite: string
//   date_creation: string
//   // Coordonnées
//   adresse: string
//   ville: string
//   commune: string
//   email: string
//   telephone: string
//   site_web: string
//   // Responsable fiscal
//   responsable_nom: string
//   responsable_fonction: string
//   responsable_telephone: string
//   responsable_email: string
//   // Paramètres de déclaration
//   type_impots: string
//   frequence_declaration: string
//   devise: string
//   // Informations bancaires
//   banque_nom: string
//   banque_numero_compte: string
//   banque_iban: string
//   // Photo
//   logo_url: string | null
// }

// export default function EntrepriseDashboard() {
//   const { user } = useAuth()
//   const router = useRouter()
//   const [formData, setFormData] = useState<EntrepriseData>({
//     raison_sociale: '',
//     forme_juridique: 'SARL',
//     nif: '',
//     idn_rccm: '',
//     num_cnss: '',
//     secteur_activite: 'Services',
//     date_creation: new Date().toISOString().split('T')[0],
//     adresse: '',
//     ville: '',
//     commune: '',
//     email: user?.email || '',
//     telephone: '',
//     site_web: '',
//     responsable_nom: '',
//     responsable_fonction: '',
//     responsable_telephone: '',
//     responsable_email: '',
//     type_impots: 'Les deux',
//     frequence_declaration: 'mensuelle',
//     devise: 'FC',
//     banque_nom: '',
//     banque_numero_compte: '',
//     banque_iban: '',
//     logo_url: null
//   })

//   const legalForms = [
//   'SARL', 'SA', 'ONG', 'Organisation Internationale', 'ASBL', 
//   'GIE', 'SNC', 'SCS', 'SCA', 'SPRL', 'Autre'
// ]

// const activitySectors = [
//   'Industrie', 'Services', 'Commerce', 'Agriculture', 'Mines',
//   'Bâtiment', 'Transport', 'Banque/Finance', 'Assurance',
//   'Santé', 'Education', 'ONG', 'Autre'
// ]

// const taxTypes = ['IPR', 'IERE', 'Les deux']
// const currencies = ['FC', 'USD', 'EUR']

//   const [loading, setLoading] = useState(true)
//   const [uploading, setUploading] = useState(false)
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [editing, setEditing] = useState(false)

//   useEffect(() => {
//     if (!user?.id) return

//     const fetchEntrepriseData = async () => {
//       try {
//         setLoading(true)
//         const { data, error: fetchError } = await supabase
//           .from('entreprises')
//           .select('*')
//           .eq('id', user.id)
//           .single()

//         if (fetchError && fetchError.code !== 'PGRST116') {
//           throw fetchError
//         }

//         if (data) {
//           setFormData(data)
//           setPreviewUrl(data.logo_url)
//           setEditing(false)
//         } else {
//           setEditing(true)
//         }
//       } catch (err) {
//         console.error('Error fetching entreprise data:', err)
//         setError('Erreur lors du chargement des données')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchEntrepriseData()
//   }, [user?.id, user?.email])

//   const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || e.target.files.length === 0 || !user?.id) {
//       return
//     }

//     const file = e.target.files[0]
//     const fileExt = file.name.split('.').pop()
//     const fileName = `${uuidv4()}.${fileExt}`
//     const filePath = `${user.id}/${fileName}`

//     // Validation du fichier
//     const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
//     const validTypes = ['image/jpeg', 'image/png', 'image/jpg']

//     if (!validTypes.includes(file.type)) {
//       setError('Type de fichier non supporté. Utilisez JPEG, JPG ou PNG.')
//       return
//     }

//     if (file.size > MAX_FILE_SIZE) {
//       setError('Le fichier est trop volumineux (max 5MB)')
//       return
//     }

//     try {
//       setUploading(true)
//       setError('')
      
//       // Supprimer l'ancien logo s'il existe
//       if (formData.logo_url) {
//         const oldFilePath = formData.logo_url.split('/').pop()
//         if (oldFilePath) {
//           await supabase.storage
//             .from('entreprise_logos')
//             .remove([`${user.id}/${oldFilePath}`])
//         }
//       }

//       // Uploader le nouveau fichier
//       const { error: uploadError } = await supabase.storage
//         .from('entreprise_logos')
//         .upload(filePath, file)

//       if (uploadError) throw uploadError

//       // Obtenir l'URL publique
//       const { data: { publicUrl } } = supabase.storage
//         .from('entreprise_logos')
//         .getPublicUrl(filePath)

//       // Mettre à jour le state
//       setPreviewUrl(publicUrl)
//       setFormData(prev => ({ ...prev, logo_url: publicUrl }))
      
//       // Mettre à jour dans la base de données
//       const { error: updateError } = await supabase
//         .from('entreprises')
//         .update({ logo_url: publicUrl })
//         .eq('id', user.id)

//       if (updateError) throw updateError

//       setSuccess('Logo mis à jour avec succès')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       console.error('Error uploading logo:', error)
//       setError("Erreur lors de l'upload du logo")
//     } finally {
//       setUploading(false)
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!user?.id) return

//     try {
//       setLoading(true)
//       setError('')
      
//       // Validation du NIF (9 caractères)
//       if (formData.nif.length !== 9) {
//         throw new Error('Le NIF doit contenir exactement 9 caractères')
//       }

//       const { error } = await supabase
//         .from('entreprises')
//         .upsert({
//           id: user.id,
//           ...formData,
//           email: user.email
//         })

//       if (error) throw error

//       setSuccess('Informations enregistrées avec succès!')
//       setEditing(false)
//       setTimeout(() => setSuccess(''), 5000)
//     } catch (err) {
//       console.error('Error saving entreprise data:', err)
//       setError(err instanceof Error ? err.message : "Une erreur est survenue")
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Tableau de bord Entreprise</h1>
        
//         {error && (
//           <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}
        
//         {success && (
//           <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
//             {success}
//           </div>
//         )}

//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="p-6 border-b">
//             <h2 className="text-xl font-semibold text-gray-800">
//               Informations de l'entreprise
//             </h2>
//             <p className="text-gray-600">
//               {editing ? 'Remplissez les champs obligatoires' : 'Vos informations enregistrées'}
//             </p>
//           </div>

//           {/* Section Logo */}
//           <div className="p-6 border-b">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Logo de l'entreprise</h3>
//             <div className="flex items-center gap-6">
//               <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
//                 {previewUrl ? (
//                   <img
//                     src={previewUrl}
//                     alt="Logo entreprise"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <span className="text-gray-500">Aucun logo</span>
//                 )}
//               </div>
              
//               <div>
//                 <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                   {uploading ? 'Upload en cours...' : 'Changer le logo'}
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleLogoUpload}
//                     className="hidden"
//                     disabled={uploading}
//                   />
//                 </label>
//                 <p className="mt-2 text-sm text-gray-500">
//                   PNG, JPG, JPEG (max. 5MB)
//                 </p>
//               </div>
//             </div>
//           </div>
//   {!editing ? (
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                 {/* Section Identification légale */}
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Identification légale</h3>
//                   <div className="space-y-4">
//                     <InfoField label="Raison sociale" value={formData.raison_sociale} />
//                     <InfoField label="Forme juridique" value={formData.forme_juridique} />
//                     <InfoField label="NIF" value={formData.nif} />
//                     <InfoField label="IDN/RCCM" value={formData.idn_rccm} />
//                     <InfoField label="Numéro CNSS/INSS" value={formData.num_cnss} />
//                     <InfoField label="Secteur d'activité" value={formData.secteur_activite} />
//                     <InfoField label="Date de création" value={new Date(formData.date_creation).toLocaleDateString()} />
//                   </div>
//                 </div>

//                 {/* Section Coordonnées */}
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Coordonnées</h3>
//                   <div className="space-y-4">
//                     <InfoField label="Adresse" value={formData.adresse} />
//                     <InfoField label="Ville" value={formData.ville} />
//                     <InfoField label="Commune" value={formData.commune} />
//                     <InfoField label="Email" value={formData.email} />
//                     <InfoField label="Téléphone" value={formData.telephone} />
//                     <InfoField label="Site web" value={formData.site_web || 'Non renseigné'} />
//                   </div>
//                 </div>

//                 {/* Section Responsable fiscal */}
//                 <div className="md:col-span-2">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Responsable fiscal</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <InfoField label="Nom complet" value={formData.responsable_nom} />
//                     <InfoField label="Fonction" value={formData.responsable_fonction} />
//                     <InfoField label="Téléphone" value={formData.responsable_telephone} />
//                     <InfoField label="Email" value={formData.responsable_email} />
//                   </div>
//                 </div>

//                 {/* Section Paramètres de déclaration */}
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres de déclaration</h3>
//                   <div className="space-y-4">
//                     <InfoField label="Type d'impôts" value={formData.type_impots} />
//                     <InfoField label="Fréquence déclarative" value={formData.frequence_declaration} />
//                     <InfoField label="Devise" value={formData.devise} />
//                   </div>
//                 </div>

//                 {/* Section Informations bancaires */}
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Informations bancaires</h3>
//                   <div className="space-y-4">
//                     <InfoField label="Banque" value={formData.banque_nom || 'Non renseigné'} />
//                     <InfoField label="Numéro de compte" value={formData.banque_numero_compte || 'Non renseigné'} />
//                     <InfoField label="IBAN/Numéro local" value={formData.banque_iban || 'Non renseigné'} />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end">
//                 <button
//                   onClick={() => setEditing(true)}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Modifier les informations
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="p-6">
//               <div className="space-y-8">
//                 {/* Section Identification légale */}
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Identification légale</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <FormField
//                       label="Raison sociale *"
//                       name="raison_sociale"
//                       value={formData.raison_sociale}
//                       onChange={handleChange}
//                       required
//                     />
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Forme juridique *
//                       </label>
//                       <select
//                         name="forme_juridique"
//                         value={formData.forme_juridique}
//                         onChange={handleChange}
//                         required
//                         className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//                       >
//                         {legalForms.map(form => (
//                           <option key={form} value={form}>{form}</option>
//                         ))}
//                       </select>
//                     </div>
                    
//                     <FormField
//                       label="NIF (9 caractères) *"
//                       name="nif"
//                       value={formData.nif}
//                       onChange={handleChange}
//                       required
//                       pattern="[0-9]{9}"
//                       title="Doit contenir exactement 9 chiffres"
//                     />
                    
//                     <FormField
//                       label="IDN ou RCCM *"
//                       name="idn_rccm"
//                       value={formData.idn_rccm}
//                       onChange={handleChange}
//                       required
//                     />
                    
//                     <FormField
//                       label="Numéro CNSS/INSS *"
//                       name="num_cnss"
//                       value={formData.num_cnss}
//                       onChange={handleChange}
//                       required
//                     />
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Secteur d'activité *
//                       </label>
//                       <select
//                         name="secteur_activite"
//                         value={formData.secteur_activite}
//                         onChange={handleChange}
//                         required
//                         className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//                       >
//                         {activitySectors.map(sector => (
//                           <option key={sector} value={sector}>{sector}</option>
//                         ))}
//                       </select>
//                     </div>
                    
//                     <FormField
//                       label="Date de création *"
//                       name="date_creation"
//                       type="date"
//                       value={formData.date_creation}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Section Coordonnées */}
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Coordonnées</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <FormField
//                       label="Adresse complète *"
//                       name="adresse"
//                       value={formData.adresse}
//                       onChange={handleChange}
//                       required
//                     />
                    
//                     <FormField
//                       label="Ville *"
//                       name="ville"
//                       value={formData.ville}
//                       onChange={handleChange}
//                       required
//                     />
                    
//                     <FormField
//                       label="Commune *"
//                       name="commune"
//                       value={formData.commune}
//                       onChange={handleChange}
//                       required
//                     />
                    
//                     <FormField
//                       label="Email officiel *"
//                       name="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                     />
                    
//                     <FormField
//                       label="Téléphone *"
//                       name="telephone"
//                       value={formData.telephone}
//                       onChange={handleChange}
//                       required
//                     />
                    
//                     <FormField
//                       label="Site web"
//                       name="site_web"
//                       value={formData.site_web}
//                       onChange={handleChange}
//                       type="url"
//                     />
//                   </div>
//                 </div>

//                 {/* Section Responsable fiscal */}
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Responsable fiscal</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <FormField
//                       label="Nom complet *"
//                       name="responsable_nom"
//                       value={formData.responsable_nom}
//                       onChange={handleChange}
//                       required
//                     />
                    
//                     <FormField
//                       label="Fonction *"
//                       name="responsable_fonction"
//                       value={formData.responsable_fonction}
//                       onChange={handleChange}
//                       required
//                     />
                    
//                     <FormField
//                       label="Téléphone *"
//                       name="responsable_telephone"
//                       value={formData.responsable_telephone}
//                       onChange={handleChange}
//                       required
//                     />
                    
//                     <FormField
//                       label="Email *"
//                       name="responsable_email"
//                       type="email"
//                       value={formData.responsable_email}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Section Paramètres de déclaration */}
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres de déclaration</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Type d'impôts *
//                       </label>
//                       <select
//                         name="type_impots"
//                         value={formData.type_impots}
//                         onChange={handleChange}
//                         required
//                         className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//                       >
//                         {taxTypes.map(type => (
//                           <option key={type} value={type}>{type}</option>
//                         ))}
//                       </select>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Fréquence déclarative *
//                       </label>
//                       <input
//                         type="text"
//                         name="frequence_declaration"
//                         value={formData.frequence_declaration}
//                         onChange={handleChange}
//                         required
//                         className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Devise *
//                       </label>
//                       <select
//                         name="devise"
//                         value={formData.devise}
//                         onChange={handleChange}
//                         required
//                         className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//                       >
//                         {currencies.map(currency => (
//                           <option key={currency} value={currency}>{currency}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Section Informations bancaires */}
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Informations bancaires (optionnelles)</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <FormField
//                       label="Banque"
//                       name="banque_nom"
//                       value={formData.banque_nom}
//                       onChange={handleChange}
//                     />
                    
//                     <FormField
//                       label="Numéro de compte"
//                       name="banque_numero_compte"
//                       value={formData.banque_numero_compte}
//                       onChange={handleChange}
//                     />
                    
//                     <FormField
//                       label="IBAN/Numéro local"
//                       name="banque_iban"
//                       value={formData.banque_iban}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-4 mt-8">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setEditing(false)
//                     setError('')
//                   }}
//                   className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
//                 >
//                   {loading ? 'Enregistrement...' : 'Enregistrer les informations'}
//                 </button>
//               </div>
//             </form>
//           )}
//           {/* Le reste de votre formulaire... */}
//           {/* ... (gardez le reste de votre formulaire existant) ... */}
//         </div>
//       </div>
//     </div>
//   )
// }

// // Composants helper (à garder depuis votre code existant)
// function InfoField({ label, value }: { label: string; value: string }) {
//   return (
//     <div>
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className="font-medium text-gray-900">{value || 'Non renseigné'}</p>
//     </div>
//   )
// }

// function FormField({
//   label,
//   name,
//   value,
//   onChange,
//   type = 'text',
//   required = false,
//   pattern,
//   title
// }: {
//   label: string
//   name: string
//   value: string
//   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
//   type?: string
//   required?: boolean
//   pattern?: string
//   title?: string
// }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {label}
//       </label>
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         required={required}
//         pattern={pattern}
//         title={title}
//         className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//       />
//     </div>
//   )
// }