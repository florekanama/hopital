

'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { dgmSupabase } from '@/lib/supabase/dgmSupabaseClient'
import { supabase } from '@/lib/supabase/supabaseClient'
import { itravailSupabase } from '@/lib/supabase/itravailSupabaseClient'
import QRCode from 'react-qr-code'
import LoadingSpinner from '@/components/Loader'
import { BiSearchAlt, BiSearchAlt2 } from 'react-icons/bi'

type Worker = {
  id: string
  last_name: string
  first_name: string
  birth_date: string
  birth_place: string
  nationality: string
  passport_number: string
  passport_issue_date: string
  passport_expiry_date: string
  photo_url?: string
}

type Enterprise = {
  id: string
  raison_sociale: string
  nif: string
  secteur_activite: string
  adresse: string
}

type WorkCardFormData = {
  worker_id: string
  worker_last_name: string
  worker_first_name: string
  worker_birth_date: string
  worker_birth_place: string
  worker_nationality: string
  worker_passport_number: string
  worker_passport_issue_date: string
  worker_passport_expiry_date: string
  worker_photo_url?: string
  enterprise_id?: string
  enterprise_name: string
  enterprise_nif: string
  enterprise_sector: string
  enterprise_address: string
  issue_date: string
  expiry_date: string
  issuing_office: string
  issuing_officer: string
  notes: string
}

export default function WorkInspectionPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [enterpriseSearchTerm, setEnterpriseSearchTerm] = useState('')
  const [workers, setWorkers] = useState<Worker[]>([])
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null)
  const [formData, setFormData] = useState<WorkCardFormData>({
    worker_id: '',
    worker_last_name: '',
    worker_first_name: '',
    worker_birth_date: '',
    worker_birth_place: '',
    worker_nationality: '',
    worker_passport_number: '',
    worker_passport_issue_date: '',
    worker_passport_expiry_date: '',
    enterprise_id: '',
    enterprise_name: '',
    enterprise_nif: '',
    enterprise_sector: '',
    enterprise_address: '',
    issue_date: new Date().toISOString().split('T')[0],
    expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    issuing_office: 'Inspection du Travail - Kinshasa',
    issuing_officer: user?.email || '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [enterpriseLoading, setEnterpriseLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [cardNumber, setCardNumber] = useState('')

  const generateCardNumber = () => {
    const now = new Date();
    const datePart = now.getFullYear() + 
                     String(now.getMonth() + 1).padStart(2, '0') + 
                     String(now.getDate()).padStart(2, '0');
    const timePart = String(now.getHours()).padStart(2, '0') + 
                     String(now.getMinutes()).padStart(2, '0') + 
                     String(now.getSeconds()).padStart(2, '0');
    return `CART-${datePart}-${timePart}`;
  };

  useEffect(() => {
    setCardNumber(generateCardNumber());
  }, []);

  const searchWorkers = async () => {
    if (!searchTerm.trim()) return

    try {
      setSearchLoading(true)
      setError('')

      const { data, error } = await dgmSupabase
        .from('visas')
        .select(`
          id,
          last_name,
          first_name,
          birth_date,
          birth_place,
          nationality,
          passport_number,
          passport_issue_date,
          expiration_date,
          photo_url,
          validate
        `)
        .eq('validate', true) // Seulement les visas validés
        .or(
          `last_name.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,passport_number.ilike.%${searchTerm}%`
        )
        .limit(10)

      if (error) {
        console.error('DGM Supabase error details:', error);
        throw new Error(`Erreur DGM: ${error.message}`);
      }

      const workersData = data?.map((worker) => ({
        id: worker.id,
        last_name: worker.last_name,
        first_name: worker.first_name,
        birth_date: worker.birth_date,
        birth_place: worker.birth_place || '', // Ajout du lieu de naissance
        nationality: worker.nationality,
        passport_number: worker.passport_number,
        passport_issue_date: worker.passport_issue_date,
        passport_expiry_date: worker.expiration_date,
        photo_url: worker.photo_url
      })) as Worker[]

      setWorkers(workersData || [])
      
      if (workersData?.length === 0) {
        setError('Aucun visa validé trouvé pour cette recherche')
      }
    } catch (err) {
      console.error('Erreur lors de la recherche des travailleurs:', err)
      setError(
        err instanceof Error 
          ? err.message 
          : 'Une erreur est survenue lors de la recherche dans la base DGM'
      )
    } finally {
      setSearchLoading(false)
    }
  }

  const searchEnterprises = async () => {
    if (!enterpriseSearchTerm.trim()) return
    
    try {
      setEnterpriseLoading(true)
      setError('')
      
      const { data, error } = await supabase
        .from('entreprises')
        .select('id, raison_sociale, nif, secteur_activite, adresse')
        .or(`raison_sociale.ilike.%${enterpriseSearchTerm}%,nif.ilike.%${enterpriseSearchTerm}%`)
        .limit(10)
        
      if (error) {
        console.error('DGI Supabase error details:', error);
        throw new Error(`Erreur DGI: ${error.message}`);
      }
      
      setEnterprises(data || [])
    } catch (err) {
      console.error('Enterprise search error:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche dans la base DGI')
    } finally {
      setEnterpriseLoading(false)
    }
  }

  const selectWorker = (worker: Worker) => {
    setSelectedWorker(worker)
    setFormData(prev => ({
      ...prev,
      worker_id: worker.id,
      worker_last_name: worker.last_name,
      worker_first_name: worker.first_name,
      worker_birth_date: worker.birth_date,
      worker_birth_place: worker.birth_place, // Autocomplétion du lieu de naissance
      worker_nationality: worker.nationality,
      worker_passport_number: worker.passport_number,
      worker_passport_issue_date: worker.passport_issue_date,
      worker_passport_expiry_date: worker.passport_expiry_date,
      worker_photo_url: worker.photo_url
    }))
    setWorkers([])
    setSearchTerm('')
  }

  const selectEnterprise = (enterprise: Enterprise) => {
    setSelectedEnterprise(enterprise)
    setFormData(prev => ({
      ...prev,
      enterprise_id: enterprise.id,
      enterprise_name: enterprise.raison_sociale,
      enterprise_nif: enterprise.nif,
      enterprise_sector: enterprise.secteur_activite,
      enterprise_address: enterprise.adresse
    }))
    setEnterprises([])
    setEnterpriseSearchTerm('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setError('')
    setSuccess('')
    
    if (!user?.id) {
      return setError('Vous devez être connecté pour effectuer cette action');
    }
    
    if (!formData.worker_id) {
      return setError('Veuillez sélectionner un travailleur');
    }
    
    if (!formData.enterprise_name) {
      return setError('Veuillez sélectionner une entreprise');
    }
    
    try {
      setLoading(true)
      
      const workCardData = {
        ...formData,
        card_number: cardNumber,
        worker_visa_id: formData.worker_id,
        enterprise_id: formData.enterprise_id,
        created_by: user.id,
        updated_at: new Date().toISOString()
      }
      
      const { data, error } = await itravailSupabase
        .from('work_cards')
        .insert(workCardData)
        .select()
        .single()
        
      if (error) {
        console.error('Supabase insertion error details:', error);
        throw new Error(`Erreur Supabase: ${error.message} (${error.code})`);
      }
      
      setSuccess('Carte de travail créée avec succès!')
      
      // Réinitialisation
      setFormData({
        worker_id: '',
        worker_last_name: '',
        worker_first_name: '',
        worker_birth_date: '',
        worker_birth_place: '',
        worker_nationality: '',
        worker_passport_number: '',
        worker_passport_issue_date: '',
        worker_passport_expiry_date: '',
        enterprise_id: '',
        enterprise_name: '',
        enterprise_nif: '',
        enterprise_sector: '',
        enterprise_address: '',
        issue_date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        issuing_office: 'Inspection du Travail - Kinshasa',
        issuing_officer: user?.email || '',
        notes: ''
      })
      setSelectedWorker(null)
      setSelectedEnterprise(null)
      setCardNumber(generateCardNumber())
      
    } catch (err: any) {
      console.error('Full error creating work card:', err);
      
      let errorMessage = 'Erreur lors de la création de la carte';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Inspection du Travail - Cartes de Travail</h2>
      
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>{success}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Erreur:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section gauche - Recherche et sélection */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recherche travailleur */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Rechercher un travailleur (DGM)</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom, prénom ou numéro de passeport"
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={searchWorkers}
                disabled={searchLoading}
                className="px-2 py-2 size-[36px] grid place-content-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-400"
              >
                {searchLoading ? '...' : <BiSearchAlt2/>}
              </button>
            </div>
            
            {searchLoading && (
              <div className="mt-3 flex justify-center">
                <LoadingSpinner />
              </div>
            )}
            
            {workers.length > 0 && (
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                {workers.map(worker => (
                  <div 
                    key={worker.id}
                    onClick={() => selectWorker(worker)}
                    className="p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <p className="font-medium">{worker.last_name} {worker.first_name}</p>
                    <p className="text-sm text-gray-600">Passeport: {worker.passport_number}</p>
                    <p className="text-sm text-gray-600">Nationalité: {worker.nationality}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Travailleur sélectionné */}
          {selectedWorker && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Travailleur sélectionné</h3>
              <div className="flex items-start gap-3">
                {selectedWorker.photo_url ? (
                  <img 
                    src={selectedWorker.photo_url} 
                    alt={`${selectedWorker.last_name} ${selectedWorker.first_name}`}
                    className="w-16 h-16 rounded object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="font-medium">{selectedWorker.last_name} {selectedWorker.first_name}</p>
                  <p className="text-sm text-gray-600">Né le: {new Date(selectedWorker.birth_date).toLocaleDateString('fr-FR')}</p>
                  <p className="text-sm text-gray-600">Lieu de naissance: {selectedWorker.birth_place}</p>
                  <p className="text-sm text-gray-600">Passeport: {selectedWorker.passport_number}</p>
                  <p className="text-sm text-gray-600">Nationalité: {selectedWorker.nationality}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Recherche entreprise */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Rechercher une entreprise (DGI)</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={enterpriseSearchTerm}
                onChange={(e) => setEnterpriseSearchTerm(e.target.value)}
                placeholder="Raison sociale ou NIF"
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={searchEnterprises}
                disabled={enterpriseLoading}
                className="px-4 py-2 size-[36px] grid place-content-center bg-gray-500 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-400"
              >
                {enterpriseLoading ? '...' : <BiSearchAlt/>}
              </button>
            </div>
            
            {enterpriseLoading && (
              <div className="mt-3 flex justify-center">
                <LoadingSpinner />
              </div>
            )}
            
            {enterprises.length > 0 && (
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                {enterprises.map(enterprise => (
                  <div 
                    key={enterprise.id}
                    onClick={() => selectEnterprise(enterprise)}
                    className="p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <p className="font-medium">{enterprise.raison_sociale}</p>
                    <p className="text-sm text-gray-600">NIF: {enterprise.nif}</p>
                    <p className="text-sm text-gray-600">Secteur: {enterprise.secteur_activite}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Entreprise sélectionnée */}
          {selectedEnterprise && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Entreprise sélectionnée</h3>
              <div>
                <p className="font-medium">{selectedEnterprise.raison_sociale}</p>
                <p className="text-sm text-gray-600">NIF: {selectedEnterprise.nif}</p>
                <p className="text-sm text-gray-600">Secteur: {selectedEnterprise.secteur_activite}</p>
                <p className="text-sm text-gray-600">Adresse: {selectedEnterprise.adresse}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Section droite - Formulaire de création */}
        <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Carte de Travail</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de carte*
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                
                <div className="flex items-center justify-center">
                  <QRCode value={cardNumber} size={100} />
                </div>
              </div>
            </div>
            
            {/* Section travailleur */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Informations du Travailleur</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom*
                  </label>
                  <input
                    type="text"
                    name="worker_last_name"
                    value={formData.worker_last_name}
                    onChange={(e) => setFormData({...formData, worker_last_name: e.target.value})}
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
                    name="worker_first_name"
                    value={formData.worker_first_name}
                    onChange={(e) => setFormData({...formData, worker_first_name: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de naissance*
                  </label>
                  <input
                    type="date"
                    name="worker_birth_date"
                    value={formData.worker_birth_date}
                    onChange={(e) => setFormData({...formData, worker_birth_date: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lieu de naissance
                  </label>
                  <input
                    type="text"
                    name="worker_birth_place"
                    value={formData.worker_birth_place}
                    onChange={(e) => setFormData({...formData, worker_birth_place: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nationalité*
                  </label>
                  <input
                    type="text"
                    name="worker_nationality"
                    value={formData.worker_nationality}
                    onChange={(e) => setFormData({...formData, worker_nationality: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de passeport*
                  </label>
                  <input
                    type="text"
                    name="worker_passport_number"
                    value={formData.worker_passport_number}
                    onChange={(e) => setFormData({...formData, worker_passport_number: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date délivrance passeport*
                  </label>
                  <input
                    type="date"
                    name="worker_passport_issue_date"
                    value={formData.worker_passport_issue_date}
                    onChange={(e) => setFormData({...formData, worker_passport_issue_date: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date expiration passeport*
                  </label>
                  <input
                    type="date"
                    name="worker_passport_expiry_date"
                    value={formData.worker_passport_expiry_date}
                    onChange={(e) => setFormData({...formData, worker_passport_expiry_date: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            
            {/* Section entreprise */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Informations de l'Entreprise</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raison sociale*
                  </label>
                  <input
                    type="text"
                    name="enterprise_name"
                    value={formData.enterprise_name}
                    onChange={(e) => setFormData({...formData, enterprise_name: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIF*
                  </label>
                  <input
                    type="text"
                    name="enterprise_nif"
                    value={formData.enterprise_nif}
                    onChange={(e) => setFormData({...formData, enterprise_nif: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secteur d'activité*
                  </label>
                  <input
                    type="text"
                    name="enterprise_sector"
                    value={formData.enterprise_sector}
                    onChange={(e) => setFormData({...formData, enterprise_sector: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse*
                  </label>
                  <input
                    type="text"
                    name="enterprise_address"
                    value={formData.enterprise_address}
                    onChange={(e) => setFormData({...formData, enterprise_address: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            
            {/* Section administration */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Informations Administratives</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de délivrance*
                  </label>
                  <input
                    type="date"
                    name="issue_date"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date d'expiration*
                  </label>
                  <input
                    type="date"
                    name="expiry_date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bureau émetteur*
                  </label>
                  <input
                    type="text"
                    name="issuing_office"
                    value={formData.issuing_office}
                    onChange={(e) => setFormData({...formData, issuing_office: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agent émetteur*
                  </label>
                  <input
                    type="text"
                    name="issuing_officer"
                    value={formData.issuing_officer}
                    onChange={(e) => setFormData({...formData, issuing_officer: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
            
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                {loading ? 'Enregistrement...' : 'Créer la Carte de Travail'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

