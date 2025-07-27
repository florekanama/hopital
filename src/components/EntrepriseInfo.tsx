// 'use client'
// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { supabase } from '@/lib/supabase/supabaseClient'
// import { v4 as uuidv4 } from 'uuid'
// import LoadingSpinner from '@/components/Loader'

// // Types pour les enums
// type LegalForm = 'SARL' | 'SA' | 'ONG' | 'Organisation Internationale' | 'ASBL' | 'GIE' | 'SNC' | 'SCS' | 'SCA' | 'SPRL' | 'Autre'
// type ActivitySector = 'Industrie' | 'Services' | 'Commerce' | 'Agriculture' | 'Mines' | 'Bâtiment' | 'Transport' | 'Banque/Finance' | 'Assurance' | 'Santé' | 'Education' | 'ONG' | 'Autre'
// type TaxType = 'IPR' | 'IERE' | 'Les deux'
// type Currency = 'FC' | 'USD' | 'EUR'

// type EntrepriseData = {
//   raison_sociale: string
//   forme_juridique: LegalForm
//   nif: string
//   idn_rccm: string
//   num_cnss: string
//   secteur_activite: ActivitySector
//   date_creation: string
//   adresse: string
//   ville: string
//   commune: string
//   email: string
//   telephone: string
//   site_web: string
//   responsable_nom: string
//   responsable_fonction: string
//   responsable_telephone: string
//   responsable_email: string
//   type_impots: TaxType
//   frequence_declaration: string
//   devise: Currency
//   banque_nom: string
//   banque_numero_compte: string
//   banque_iban: string
//   logo_url: string | null
// }

// const legalForms: LegalForm[] = ['SARL', 'SA', 'ONG', 'Organisation Internationale', 'ASBL', 'GIE', 'SNC', 'SCS', 'SCA', 'SPRL', 'Autre']
// const activitySectors: ActivitySector[] = ['Industrie', 'Services', 'Commerce', 'Agriculture', 'Mines', 'Bâtiment', 'Transport', 'Banque/Finance', 'Assurance', 'Santé', 'Education', 'ONG', 'Autre']
// const taxTypes: TaxType[] = ['IPR', 'IERE', 'Les deux']
// const currencies: Currency[] = ['FC', 'USD', 'EUR']

// export default function EntrepriseInfo() {
//   const { user } = useAuth()
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
//     if (!e.target.files || e.target.files.length === 0 || !user?.id) return;

//     const file = e.target.files[0];
//     const fileExt = file.name.split('.').pop();
//     const fileName = `${uuidv4()}.${fileExt}`;
//     const filePath = `${user.id}/${fileName}`;

//     try {
//       setUploading(true);

//       if (formData.logo_url) {
//         const oldFileName = formData.logo_url.split('/').pop();
//         await supabase.storage
//           .from('entreprise_logos')
//           .remove([`${user.id}/${oldFileName}`]);
//       }

//       const { error: uploadError } = await supabase.storage
//         .from('entreprise_logos')
//         .upload(filePath, file, {
//           cacheControl: '3600',
//           upsert: false
//         });

//       if (uploadError) throw uploadError;

//       const { data: { publicUrl } } = supabase.storage
//         .from('entreprise_logos')
//         .getPublicUrl(filePath);

//       const { error: dbError } = await supabase
//         .from('entreprises')
//         .update({ logo_url: publicUrl })
//         .eq('id', user.id);

//       if (dbError) throw dbError;

//       setPreviewUrl(publicUrl);
//       setSuccess('Logo mis à jour !');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (error) {
//       console.error('Erreur:', error);
//       setError("Erreur lors de l'upload du logo");
//     } finally {
//       setUploading(false);
//     }
//   };

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
      
//       if (!formData.raison_sociale || !formData.nif || !formData.idn_rccm || !formData.num_cnss) {
//         throw new Error('Veuillez remplir tous les champs obligatoires')
//       }

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
//       <div className="flex items-center justify-center bg-gray-50">
//         <LoadingSpinner />
//       </div>
//     )
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//       {/* Header */}
//       <div className="p-6 border-b border-gray-100">
//         <h2 className="text-xl font-light text-gray-800">
//           Informations de l'entreprise
//         </h2>
//         <p className="text-gray-500 mt-1">
//           {editing ? 'Mettez à jour vos informations' : 'Vos informations enregistrées'}
//         </p>
//       </div>

//       {/* Logo Section */}
//       <div className="p-6 border-b border-gray-100">
//         <h3 className="text-lg font-normal text-gray-800 mb-4">Logo</h3>
//         <div className="flex flex-col sm:flex-row items-center gap-6">
//           <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
//             {previewUrl ? (
//               <img
//                 src={previewUrl}
//                 alt="Logo entreprise"
//                 className="w-full h-full object-cover"
//                 onError={() => setPreviewUrl(null)}
//               />
//             ) : (
//               <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//             )}
//             {uploading && (
//               <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
//                 <LoadingSpinner  />
//               </div>
//             )}
//           </div>
          
//           <div className="flex-1">
//             <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-normal rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors">
//               {uploading ? 'Envoi en cours...' : previewUrl ? 'Changer le logo' : 'Ajouter un logo'}
//               <input
//                 type="file"
//                 accept="image/jpeg, image/png, image/jpg, image/webp"
//                 onChange={handleLogoUpload}
//                 className="hidden"
//                 disabled={uploading}
//               />
//             </label>
//             <p className="mt-2 text-xs text-gray-500">
//               JPEG, PNG ou WEBP (max. 5MB)
//             </p>
//           </div>
//         </div>
//       </div>

//       {!editing ? (
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* View Mode Sections */}
//             <Section title="Identification légale">
//               <InfoField label="Raison sociale" value={formData.raison_sociale} />
//               <InfoField label="Forme juridique" value={formData.forme_juridique} />
//               <InfoField label="NIF" value={formData.nif} />
//               <InfoField label="IDN/RCCM" value={formData.idn_rccm} />
//               <InfoField label="Numéro CNSS" value={formData.num_cnss} />
//               <InfoField label="Secteur d'activité" value={formData.secteur_activite} />
//               <InfoField 
//                 label="Date de création" 
//                 value={new Date(formData.date_creation).toLocaleDateString('fr-FR')} 
//               />
//             </Section>

//             <Section title="Coordonnées">
//               <InfoField label="Adresse" value={formData.adresse} />
//               <InfoField label="Ville" value={formData.ville} />
//               <InfoField label="Commune" value={formData.commune} />
//               <InfoField label="Email" value={formData.email} />
//               <InfoField label="Téléphone" value={formData.telephone} />
//               <InfoField label="Site web" value={formData.site_web || '-'} />
//             </Section>

//             <Section title="Responsable fiscal" fullWidth>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <InfoField label="Nom complet" value={formData.responsable_nom} />
//                 <InfoField label="Fonction" value={formData.responsable_fonction} />
//                 <InfoField label="Téléphone" value={formData.responsable_telephone} />
//                 <InfoField label="Email" value={formData.responsable_email} />
//               </div>
//             </Section>

//             <Section title="Paramètres fiscaux">
//               <InfoField label="Type d'impôts" value={formData.type_impots} />
//               <InfoField label="Fréquence" value={formData.frequence_declaration} />
//               <InfoField label="Devise" value={formData.devise} />
//             </Section>

//             <Section title="Informations bancaires">
//               <InfoField label="Banque" value={formData.banque_nom || '-'} />
//               <InfoField label="Numéro de compte" value={formData.banque_numero_compte || '-'} />
//               <InfoField label="IBAN" value={formData.banque_iban || '-'} />
//             </Section>
//           </div>

//           <div className="mt-8 flex justify-end">
//             <button
//               onClick={() => setEditing(true)}
//               className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
//             >
//               Modifier
//             </button>
//           </div>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="p-6">
//           <div className="space-y-8">
//             {/* Edit Mode Sections */}
//             <Section title="Identification légale">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   label="Raison sociale *"
//                   name="raison_sociale"
//                   value={formData.raison_sociale}
//                   onChange={handleChange}
//                   required
//                 />
                
//                 <SelectField
//                   label="Forme juridique *"
//                   name="forme_juridique"
//                   value={formData.forme_juridique}
//                   onChange={handleChange}
//                   options={legalForms}
//                   required
//                 />
                
//                 <FormField
//                   label="NIF (9 chiffres) *"
//                   name="nif"
//                   value={formData.nif}
//                   onChange={handleChange}
//                   required
//                   pattern="[0-9]{9}"
//                 />
                
//                 <FormField
//                   label="IDN/RCCM *"
//                   name="idn_rccm"
//                   value={formData.idn_rccm}
//                   onChange={handleChange}
//                   required
//                 />
                
//                 <FormField
//                   label="Numéro CNSS *"
//                   name="num_cnss"
//                   value={formData.num_cnss}
//                   onChange={handleChange}
//                   required
//                 />
                
//                 <SelectField
//                   label="Secteur d'activité *"
//                   name="secteur_activite"
//                   value={formData.secteur_activite}
//                   onChange={handleChange}
//                   options={activitySectors}
//                   required
//                 />
                
//                 <FormField
//                   label="Date de création *"
//                   name="date_creation"
//                   type="date"
//                   value={formData.date_creation}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </Section>

//             <Section title="Coordonnées">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   label="Adresse *"
//                   name="adresse"
//                   value={formData.adresse}
//                   onChange={handleChange}
//                   required
//                 />
                
//                 <FormField
//                   label="Ville *"
//                   name="ville"
//                   value={formData.ville}
//                   onChange={handleChange}
//                   required
//                 />
                
//                 <FormField
//                   label="Commune *"
//                   name="commune"
//                   value={formData.commune}
//                   onChange={handleChange}
//                   required
//                 />
                
//                 <FormField
//                   label="Email *"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
                
//                 <FormField
//                   label="Téléphone *"
//                   name="telephone"
//                   value={formData.telephone}
//                   onChange={handleChange}
//                   required
//                 />
                
//                 <FormField
//                   label="Site web"
//                   name="site_web"
//                   value={formData.site_web}
//                   onChange={handleChange}
//                   type="url"
//                 />
//               </div>
//             </Section>

//             <Section title="Responsable fiscal" fullWidth>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   label="Nom complet *"
//                   name="responsable_nom"
//                   value={formData.responsable_nom}
//                   onChange={handleChange}
//                   required
//                 />
                
//                 <FormField
//                   label="Fonction *"
//                   name="responsable_fonction"
//                   value={formData.responsable_fonction}
//                   onChange={handleChange}
//                   required
//                 />
                
//                 <FormField
//                   label="Téléphone *"
//                   name="responsable_telephone"
//                   value={formData.responsable_telephone}
//                   onChange={handleChange}
//                   required
//                 />
                
//                 <FormField
//                   label="Email *"
//                   name="responsable_email"
//                   type="email"
//                   value={formData.responsable_email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </Section>

//             <Section title="Paramètres fiscaux">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <SelectField
//                   label="Type d'impôts *"
//                   name="type_impots"
//                   value={formData.type_impots}
//                   onChange={handleChange}
//                   options={taxTypes}
//                   required
//                 />
                
//                 <FormField
//                   label="Fréquence *"
//                   name="frequence_declaration"
//                   value={formData.frequence_declaration}
//                   onChange={handleChange}
//                   required
//                 />
                
//                 <SelectField
//                   label="Devise *"
//                   name="devise"
//                   value={formData.devise}
//                   onChange={handleChange}
//                   options={currencies}
//                   required
//                 />
//               </div>
//             </Section>

//             <Section title="Informations bancaires">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <FormField
//                   label="Banque"
//                   name="banque_nom"
//                   value={formData.banque_nom}
//                   onChange={handleChange}
//                 />
                
//                 <FormField
//                   label="Numéro de compte"
//                   name="banque_numero_compte"
//                   value={formData.banque_numero_compte}
//                   onChange={handleChange}
//                 />
                
//                 <FormField
//                   label="IBAN"
//                   name="banque_iban"
//                   value={formData.banque_iban}
//                   onChange={handleChange}
//                 />
//               </div>
//             </Section>
//           </div>

//           <div className="mt-8 flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={() => {
//                 setEditing(false)
//                 setError('')
//               }}
//               className="px-5 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
//             >
//               Annuler
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
//             >
//               {loading ? 'Enregistrement...' : 'Enregistrer'}
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   )
// }

// // Helper Components
// function Section({
//   title,
//   children,
//   fullWidth = false
// }: {
//   title: string
//   children: React.ReactNode
//   fullWidth?: boolean
// }) {
//   return (
//     <div className={fullWidth ? 'md:col-span-2' : ''}>
//       <h3 className="text-lg font-normal text-gray-800 mb-4">{title}</h3>
//       <div className="space-y-4">
//         {children}
//       </div>
//     </div>
//   )
// }

// function InfoField({ label, value }: { label: string; value: string }) {
//   return (
//     <div>
//       <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
//       <p className="text-gray-800 mt-1">{value || '-'}</p>
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
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
//   type?: string
//   required?: boolean
//   pattern?: string
//   title?: string
// }) {
//   return (
//     <div>
//       <label className="block text-sm text-gray-700 mb-1">
//         {label}
//         {required && <span className="text-red-500 ml-1">*</span>}
//       </label>
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         required={required}
//         pattern={pattern}
//         title={title}
//         className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
//       />
//     </div>
//   )
// }

// function SelectField<T extends string>({
//   label,
//   name,
//   value,
//   onChange,
//   options,
//   required = false
// }: {
//   label: string
//   name: string
//   value: T
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
//   options: T[]
//   required?: boolean
// }) {
//   return (
//     <div>
//       <label className="block text-sm text-gray-700 mb-1">
//         {label}
//         {required && <span className="text-red-500 ml-1">*</span>}
//       </label>
//       <select
//         name={name}
//         value={value}
//         onChange={onChange}
//         required={required}
//         className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
//       >
//         {options.map(option => (
//           <option key={option} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//     </div>
//   )
// }
'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import LoadingSpinner from '@/components/Loader'
import { BiEdit, BiEditAlt } from 'react-icons/bi'

// Types pour les enums
type LegalForm = 'SARL' | 'SA' | 'ONG' | 'Organisation Internationale' | 'ASBL' | 'GIE' | 'SNC' | 'SCS' | 'SCA' | 'SPRL' | 'Autre'
type ActivitySector = 'Industrie' | 'Services' | 'Commerce' | 'Agriculture' | 'Mines' | 'Bâtiment' | 'Transport' | 'Banque/Finance' | 'Assurance' | 'Santé' | 'Education' | 'ONG' | 'Autre'
type TaxType = 'IPR' | 'IERE' | 'Les deux'
type Currency = 'FC' | 'USD' | 'EUR'

type EntrepriseData = {
  raison_sociale: string
  forme_juridique: LegalForm
  nif: string
  idn_rccm: string
  num_cnss: string
  secteur_activite: ActivitySector
  date_creation: string
  adresse: string
  ville: string
  commune: string
  email: string
  telephone: string
  site_web: string
  responsable_nom: string
  responsable_fonction: string
  responsable_telephone: string
  responsable_email: string
  type_impots: TaxType
  frequence_declaration: string
  devise: Currency
  banque_nom: string
  banque_numero_compte: string
  banque_iban: string
  logo_url: string | null
}

const legalForms: LegalForm[] = ['SARL', 'SA', 'ONG', 'Organisation Internationale', 'ASBL', 'GIE', 'SNC', 'SCS', 'SCA', 'SPRL', 'Autre']
const activitySectors: ActivitySector[] = ['Industrie', 'Services', 'Commerce', 'Agriculture', 'Mines', 'Bâtiment', 'Transport', 'Banque/Finance', 'Assurance', 'Santé', 'Education', 'ONG', 'Autre']
const taxTypes: TaxType[] = ['IPR', 'IERE', 'Les deux']
const currencies: Currency[] = ['FC', 'USD', 'EUR']

export default function EntrepriseInfo() {
  const { user } = useAuth()
  const [formData, setFormData] = useState<EntrepriseData>({
    raison_sociale: '',
    forme_juridique: 'SARL',
    nif: '',
    idn_rccm: '',
    num_cnss: '',
    secteur_activite: 'Services',
    date_creation: new Date().toISOString().split('T')[0],
    adresse: '',
    ville: '',
    commune: '',
    email: user?.email || '',
    telephone: '',
    site_web: '',
    responsable_nom: '',
    responsable_fonction: '',
    responsable_telephone: '',
    responsable_email: '',
    type_impots: 'Les deux',
    frequence_declaration: 'mensuelle',
    devise: 'FC',
    banque_nom: '',
    banque_numero_compte: '',
    banque_iban: '',
    logo_url: null
  })
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editing, setEditing] = useState(false)
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    if (!user?.id) return

    const fetchEntrepriseData = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('entreprises')
          .select('*')
          .eq('id', user.id)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError
        }

        if (data) {
          setFormData(data)
          setPreviewUrl(data.logo_url)
          setHasData(true)
          setEditing(false)
        } else {
          setEditing(true)
          setHasData(false)
        }
      } catch (err) {
        console.error('Error fetching entreprise data:', err)
        setError('Erreur lors du chargement des données')
      } finally {
        setLoading(false)
      }
    }

    fetchEntrepriseData()
  }, [user?.id, user?.email])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user?.id) return;

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    try {
      setUploading(true);

      if (formData.logo_url) {
        const oldFileName = formData.logo_url.split('/').pop();
        await supabase.storage
          .from('entreprise_logos')
          .remove([`${user.id}/${oldFileName}`]);
      }

      const { error: uploadError } = await supabase.storage
        .from('entreprise_logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('entreprise_logos')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('entreprises')
        .update({ logo_url: publicUrl })
        .eq('id', user.id);

      if (dbError) throw dbError;

      setPreviewUrl(publicUrl);
      setFormData(prev => ({ ...prev, logo_url: publicUrl }))
      setSuccess('Logo mis à jour !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erreur:', error);
      setError("Erreur lors de l'upload du logo");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'nif') {
      const formattedValue = value.replace(/\D/g, '')
        .slice(0, 9)
        .replace(/(\d{3})(?=\d)/g, '$1-')
        .replace(/-$/g, '');
        
      setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0, 9) }))
      return
    }
    
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    try {
      setLoading(true)
      setError('')
      
      if (!formData.raison_sociale || !formData.nif || !formData.idn_rccm || !formData.num_cnss) {
        throw new Error('Veuillez remplir tous les champs obligatoires')
      }

      if (formData.nif.length !== 9) {
        throw new Error('Le NIF doit contenir exactement 9 chiffres')
      }

      const { error } = await supabase
        .from('entreprises')
        .upsert({
          id: user.id,
          ...formData,
          email: user.email
        })

      if (error) throw error

      setSuccess('Informations enregistrées avec succès!')
      setHasData(true)
      setEditing(false)
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      console.error('Error saving entreprise data:', err)
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border  md:px-[67px] border-gray-200 overflow-hidden">
      {/* Header avec logo et nom alignés en haut */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Logo entreprise"
              className="w-full h-full object-cover"
              onError={() => setPreviewUrl(null)}
            />
          ) : (
            <svg className="w-8 h-8 text-gray-400 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">
            {hasData ? formData.raison_sociale : 'Profil Entreprise'}
          </h2>
          <p className="text-gray-600 text-sm">
            {editing ? 'Mettez à jour vos informations' : hasData ?  formData.email  : 'Complétez votre profil entreprise'}
          </p>
        </div>
        
        {!editing && hasData && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 inline-flex iit items-center gap-2 py-2 text-sm bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
          >
            Modifier <BiEditAlt/>
          </button>
        )}
      </div>

      {!hasData && !editing ? (
        <div className="p-6 text-center">
          <div className="max-w-md mx-auto">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune information d'entreprise</h3>
            <p className="mt-1 text-sm text-gray-500">Vous n'avez pas encore enregistré les informations de votre entreprise.</p>
            <div className="mt-6">
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none"
              >
                Créer le profil
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Section Logo - cachée en mode visualisation */}
          {editing && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Logo</h3>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Logo entreprise"
                      className="w-full h-full object-cover"
                      onError={() => setPreviewUrl(null)}
                    />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <label className={`cursor-pointer inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md ${uploading ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-700 hover:bg-gray-50'} transition-colors`}>
                    {uploading ? 'Envoi en cours...' : previewUrl ? 'Changer le logo' : 'Ajouter un logo'}
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/jpg, image/webp"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    JPEG, PNG ou WEBP (max. 5MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {!editing ? (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section title="Identification légale">
                  <InfoField label="Raison sociale" value={formData.raison_sociale} />
                  <InfoField label="Forme juridique" value={formData.forme_juridique} />
                  <InfoField label="NIF" value={formData.nif.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3')} />
                  <InfoField label="IDN/RCCM" value={formData.idn_rccm} />
                  <InfoField label="Numéro CNSS" value={formData.num_cnss} />
                  <InfoField label="Secteur d'activité" value={formData.secteur_activite} />
                  <InfoField 
                    label="Date de création" 
                    value={new Date(formData.date_creation).toLocaleDateString('fr-FR')} 
                  />
                </Section>

                <Section title="Coordonnées">
                  <InfoField label="Adresse" value={formData.adresse} />
                  <InfoField label="Ville" value={formData.ville} />
                  <InfoField label="Commune" value={formData.commune} />
                  <InfoField label="Email" value={formData.email} />
                  <InfoField label="Téléphone" value={formData.telephone} />
                  <InfoField label="Site web" value={formData.site_web || '-'} />
                </Section>

                <Section title="Responsable fiscal" fullWidth>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField label="Nom complet" value={formData.responsable_nom} />
                    <InfoField label="Fonction" value={formData.responsable_fonction} />
                    <InfoField label="Téléphone" value={formData.responsable_telephone} />
                    <InfoField label="Email" value={formData.responsable_email} />
                  </div>
                </Section>

                <Section title="Paramètres fiscaux">
                  <InfoField label="Type d'impôts" value={formData.type_impots} />
                  <InfoField label="Fréquence" value={formData.frequence_declaration} />
                  <InfoField label="Devise" value={formData.devise} />
                </Section>

                <Section title="Informations bancaires">
                  <InfoField label="Banque" value={formData.banque_nom || '-'} />
                  <InfoField label="Numéro de compte" value={formData.banque_numero_compte || '-'} />
                  <InfoField label="IBAN" value={formData.banque_iban || '-'} />
                </Section>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200 text-sm">
                  {success}
                </div>
              )}
              
              <div className="space-y-6">
                <Section title="Identification légale">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      label="Raison sociale *"
                      name="raison_sociale"
                      value={formData.raison_sociale}
                      onChange={handleChange}
                      required
                    />
                    
                    <SelectField
                      label="Forme juridique *"
                      name="forme_juridique"
                      value={formData.forme_juridique}
                      onChange={handleChange}
                      options={legalForms}
                      required
                    />
                    
                    <FormField
                      label="NIF *"
                      name="nif"
                      value={formData.nif.replace(/(\d{3})(?=\d)/g, '$1-')}
                      onChange={handleChange}
                      required
                      maxLength={11}
                      pattern="\d{3}-\d{3}-\d{3}"
                      title="Format: 123-456-789"
                    />
                    
                    <FormField
                      label="IDN/RCCM *"
                      name="idn_rccm"
                      value={formData.idn_rccm}
                      onChange={handleChange}
                      required
                    />
                    
                    <FormField
                      label="Numéro CNSS *"
                      name="num_cnss"
                      value={formData.num_cnss}
                      onChange={handleChange}
                      required
                    />
                    
                    <SelectField
                      label="Secteur d'activité *"
                      name="secteur_activite"
                      value={formData.secteur_activite}
                      onChange={handleChange}
                      options={activitySectors}
                      required
                    />
                    
                    <FormField
                      label="Date de création *"
                      name="date_creation"
                      type="date"
                      value={formData.date_creation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </Section>

                <Section title="Coordonnées">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      label="Adresse *"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      required
                    />
                    
                    <FormField
                      label="Ville *"
                      name="ville"
                      value={formData.ville}
                      onChange={handleChange}
                      required
                    />
                    
                    <FormField
                      label="Commune *"
                      name="commune"
                      value={formData.commune}
                      onChange={handleChange}
                      required
                    />
                    
                    <FormField
                      label="Email *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    
                    <FormField
                      label="Téléphone *"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                    />
                    
                    <FormField
                      label="Site web"
                      name="site_web"
                      value={formData.site_web}
                      onChange={handleChange}
                      type="url"
                    />
                  </div>
                </Section>

                <Section title="Responsable fiscal" fullWidth>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      label="Nom complet *"
                      name="responsable_nom"
                      value={formData.responsable_nom}
                      onChange={handleChange}
                      required
                    />
                    
                    <FormField
                      label="Fonction *"
                      name="responsable_fonction"
                      value={formData.responsable_fonction}
                      onChange={handleChange}
                      required
                    />
                    
                    <FormField
                      label="Téléphone *"
                      name="responsable_telephone"
                      value={formData.responsable_telephone}
                      onChange={handleChange}
                      required
                    />
                    
                    <FormField
                      label="Email *"
                      name="responsable_email"
                      type="email"
                      value={formData.responsable_email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </Section>

                <Section title="Paramètres fiscaux">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <SelectField
                      label="Type d'impôts *"
                      name="type_impots"
                      value={formData.type_impots}
                      onChange={handleChange}
                      options={taxTypes}
                      required
                    />
                    
                    <FormField
                      label="Fréquence *"
                      name="frequence_declaration"
                      value={formData.frequence_declaration}
                      onChange={handleChange}
                      required
                    />
                    
                    <SelectField
                      label="Devise *"
                      name="devise"
                      value={formData.devise}
                      onChange={handleChange}
                      options={currencies}
                      required
                    />
                  </div>
                </Section>

                <Section title="Informations bancaires">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <FormField
                      label="Banque"
                      name="banque_nom"
                      value={formData.banque_nom}
                      onChange={handleChange}
                    />
                    
                    <FormField
                      label="Numéro de compte"
                      name="banque_numero_compte"
                      value={formData.banque_numero_compte}
                      onChange={handleChange}
                    />
                    
                    <FormField
                      label="IBAN"
                      name="banque_iban"
                      value={formData.banque_iban}
                      onChange={handleChange}
                    />
                  </div>
                </Section>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false)
                    setError('')
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  )
}

// Helper Components
function Section({
  title,
  children,
  fullWidth = false
}: {
  title: string
  children: React.ReactNode
  fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <h3 className="text-base font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-1.5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-gray-800 mt-1 font-normal">{value || '-'}</p>
    </div>
  )
}

function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  pattern,
  title,
  maxLength
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
  pattern?: string
  title?: string
  maxLength?: number
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        pattern={pattern}
        title={title}
        maxLength={maxLength}
        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
      />
    </div>
  )
}

function SelectField<T extends string>({
  label,
  name,
  value,
  onChange,
  options,
  required = false
}: {
  label: string
  name: string
  value: T
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: T[]
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}