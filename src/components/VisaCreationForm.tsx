

'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { dgmSupabase } from '@/lib/supabase/dgmSupabaseClient'
import QRCode from 'react-qr-code'

type VisaData = {
  id?: string
  visa_number: string
  visa_type: 'single_entry' | 'multiple_entry' | 'transit' | 'official'
  issuing_country: string
  last_name: string
  first_name: string
  birth_date: string
  issuing_place: string
  nationality: string
  passport_number: string
  passport_issue_date: string
  visa_category: 'tourist' | 'work' | 'student' | 'transit'
  expiration_date: string
  duration_of_stay: string
  genre: 'Masculin' | 'Féminin' 
  photo_url?: string
  created_at?: string
  birth_place: string,
  created_by: string
}

export default function VisaCreationForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState<VisaData>({
    visa_number: '',
    visa_type: 'single_entry',
    issuing_country: 'République Démocratique du Congo',
    last_name: '',
    first_name: '',
    birth_date: '',
    issuing_place: '',
    nationality: '',
    passport_number: '',
    passport_issue_date: '',
    visa_category: 'tourist',
    expiration_date: '',
    duration_of_stay: '30',
    genre: 'Masculin',
    birth_place: '',
    created_by: user?.id || 'system'
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [qrValue, setQrValue] = useState('')

  useEffect(() => {
    const generateVisaNumber = async () => {
      try {
        const { data, error } = await dgmSupabase
          .from('visas')
          .select('visa_number')
          .order('created_at', { ascending: false })
          .limit(1)

        if (error) throw error

        let nextNumber = '00892381'
        if (data && data.length > 0) {
          const lastNumber = data[0].visa_number
          const num = parseInt(lastNumber.match(/\d+/)?.[0] || '0', 10)
          nextNumber = (num + 1).toString().padStart(8, '0')
        }

        setFormData(prev => ({ ...prev, visa_number: nextNumber }))
        setQrValue(nextNumber)
      } catch (err) {
        console.error('Error generating visa number:', err)
        setError('Erreur lors de la génération du numéro de visa')
      }
    }

    generateVisaNumber()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'visa_number') setQrValue(value)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return setError('Vous devez être connecté')
    if (!photoFile) return setError('La photo est requise')

    try {
      setLoading(true)
      setError('')

      // Créer le visa
      const { data: visaData, error: visaError } = await dgmSupabase
        .from('visas')
        .insert({ ...formData, created_by: user.id })
        .select()
        .single()

      if (visaError) throw visaError

      // Uploader la photo
      const fileExt = photoFile.name.split('.').pop()
      const fileName = `${visaData.id}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await dgmSupabase.storage
        .from('visa_photos')
        .upload(filePath, photoFile)

      if (uploadError) throw uploadError

      // Récupérer l'URL publique
      const { data: { publicUrl } } = dgmSupabase.storage
        .from('visa_photos')
        .getPublicUrl(filePath)

      // Mettre à jour le visa avec l'URL de la photo
      await dgmSupabase
        .from('visas')
        .update({ photo_url: publicUrl })
        .eq('id', visaData.id)

      setSuccess('Visa créé avec succès!')
      setTimeout(() => setSuccess(''), 5000)

      // Réinitialiser le formulaire
      setFormData(prev => ({
        ...prev,
        last_name: '',
        first_name: '',
        birth_date: '',
        issuing_place: '',
        nationality: '',
        passport_number: '',
        passport_issue_date: '',
        visa_category: 'tourist',
        expiration_date: '',
        duration_of_stay: '30'
      }))
      setPhotoFile(null)
      setPhotoPreview(null)

      // Générer un nouveau numéro
      const nextNumber = (parseInt(formData.visa_number) + 1).toString().padStart(8, '0')
      setFormData(prev => ({ ...prev, visa_number: nextNumber }))
      setQrValue(nextNumber)

    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Création de Visa</h2>
      
      {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">{success}</div>}
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Formulaire inchangé - garde la même structure que tu avais */}
        {/* ... */}


             {/* Section Informations Visa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de Visa*
                </label>
                <input
                  type="text"
                  name="visa_number"
                  value={formData.visa_number}
                  onChange={handleChange}
                  required
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de Visa*
                </label>
                <select
                  name="visa_type"
                  value={formData.visa_type}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="single_entry">Entrée simple (1 entrée)</option>
                  <option value="multiple_entry">Multiple entrées</option>
                  <option value="transit">Transit (max 72h)</option>
                  <option value="official">Officiel/Diplomatique</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays Émetteur*
              </label>
              <input
                type="text"
                name="issuing_country"
                value={formData.issuing_country}
                onChange={handleChange}
                required
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center border border-gray-200 rounded-md p-4 bg-gray-50">
            <QRCode value={qrValue} size={128} className="mb-2" />
            <p className="text-sm text-gray-500">Code de vérification</p>
          </div>
        </div>

        {/* Section Données Personnelles */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Données Personnelles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom*
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom*
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de Naissance*
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
             <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lieu de Naissance*
            </label>
            <input
              type="text"
              name="birth_place"
              value={formData.birth_place || ''}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lieu de Délivrance*
              </label>
              <input
                type="text"
                name="issuing_place"
                value={formData.issuing_place}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
              <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Genre*
    </label>
    <select
      name="genre"
      value={formData.genre}
      onChange={handleChange}
      required
      className="w-full p-2 border border-gray-300 rounded-md"
    >
      <option value="Masculin">Masculin</option>
      <option value="Féminin">Féminin</option>
    </select>
  </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationalité*
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Section Passeport */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Passeport</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de Passeport*
              </label>
              <input
                type="text"
                name="passport_number"
                value={formData.passport_number}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="79128329C89129100P2388383F019923898"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de Délivrance*
              </label>
              <input
                type="date"
                name="passport_issue_date"
                value={formData.passport_issue_date}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Section Détails Visa */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Détails du Visa</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie*
              </label>
              <select
                name="visa_category"
                value={formData.visa_category}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="tourist">Touristique</option>
                <option value="work">Travail</option>
                <option value="student">Étudiant</option>
                <option value="transit">Transit</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d'Expiration*
              </label>
              <input
                type="date"
                name="expiration_date"
                value={formData.expiration_date}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée de Séjour*
              </label>
              <select
                name="duration_of_stay"
                value={formData.duration_of_stay}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="30">30 jours</option>
                <option value="60">60 jours</option>
                <option value="90">90 jours</option>
                <option value="180">180 jours</option>
                <option value="365">1 an</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section Photo */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Photo du Titulaire</h3>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo (format passeport)*
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500">Format: JPEG, 35x45mm, max 5MB</p>
            </div>
            
            {photoPreview && (
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 border border-gray-200 rounded-md overflow-hidden">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Aperçu</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {loading ? 'Enregistrement...' : 'Créer le Visa'}
          </button>
        </div>
      </form>
    </div>
  )
}