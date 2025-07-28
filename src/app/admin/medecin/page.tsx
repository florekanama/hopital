'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { fr } from 'date-fns/locale'

interface Medecin {
  id: string
  user_id: string
  nom: string
  email: string
  specialite: string
  numero_telephone: string
}

interface Disponibilite {
  id: string
  jour_semaine: number
  heure_debut: string
  heure_fin: string
  lieu_id: string
  autre_lieu: string
  actif: boolean
}

interface Conge {
  id: string
  date_debut: string
  date_fin: string
  raison: string
}

export default function AdminGestionMedecins() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [medecins, setMedecins] = useState<Medecin[]>([])
  const [selectedMedecin, setSelectedMedecin] = useState<Medecin | null>(null)
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>([])
  const [conges, setConges] = useState<Conge[]>([])
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [showDispoModal, setShowDispoModal] = useState(false)
  const [showCongeModal, setShowCongeModal] = useState(false)
  const [lieuxConsultation, setLieuxConsultation] = useState<any[]>([])

  const [newDispo, setNewDispo] = useState({
    jour_semaine: 1,
    heure_debut: '08:00',
    heure_fin: '17:00',
    lieu_id: '',
    autre_lieu: '',
    actif: true
  })

  const [newConge, setNewConge] = useState({
    date_debut: '',
    date_fin: '',
    raison: ''
  })

  const joursSemaine = [
    { id: 1, nom: 'Lundi' },
    { id: 2, nom: 'Mardi' },
    { id: 3, nom: 'Mercredi' },
    { id: 4, nom: 'Jeudi' },
    { id: 5, nom: 'Vendredi' },
    { id: 6, nom: 'Samedi' },
    { id: 7, nom: 'Dimanche' }
  ]

  useEffect(() => {
    if (authLoading) return

    if (!user || user.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    fetchMedecins()
    fetchLieuxConsultation()
  }, [user, authLoading, router])

  const fetchMedecins = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('medecin_infos')
        .select(`
          id,
          user_id,
          numero_telephone,
          specialite_id,
          users:user_id(nom, email, profil_url),
          specialites:specialite_id(nom)
        `)
        .order('created_at', { ascending: true })

      if (error) throw error

      const formattedData = data.map((m: any) => ({
        id: m.id,
        user_id: m.user_id,
        nom: m.users.nom,
        email: m.users.email,
        specialite: m.specialites?.nom || 'Non spécifiée',
        numero_telephone: m.numero_telephone
      }))

      setMedecins(formattedData)
    } catch (error: any) {
      console.error('Erreur lors du chargement des médecins:', error)
      toast.error(`Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchLieuxConsultation = async () => {
    try {
      const { data, error } = await supabase
        .from('lieux_consultation')
        .select('*')

      if (error) throw error
      setLieuxConsultation(data || [])
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors du chargement des lieux: ${error.message}`)
    }
  }

  const fetchDisponibilites = async (medecinId: string) => {
    try {
      const { data, error } = await supabase
        .from('disponibilites_medecin')
        .select('*')
        .eq('medecin_id', medecinId)
        .order('jour_semaine', { ascending: true })

      if (error) throw error
      setDisponibilites(data || [])
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors du chargement des disponibilités: ${error.message}`)
    }
  }

  const fetchConges = async (medecinId: string) => {
    try {
      const { data, error } = await supabase
        .from('conges_medecin')
        .select('*')
        .eq('medecin_id', medecinId)
        .order('date_debut', { ascending: true })

      if (error) throw error
      setConges(data || [])
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors du chargement des congés: ${error.message}`)
    }
  }

  const handleSelectMedecin = (medecin: Medecin) => {
    setSelectedMedecin(medecin)
    fetchDisponibilites(medecin.id)
    fetchConges(medecin.id)
  }

  const handleSaveSelectedDates = async () => {
    if (!selectedMedecin || selectedDates.length === 0) return

    try {
      const congesToAdd = selectedDates.map(date => ({
        medecin_id: selectedMedecin.id,
        date_debut: date.toISOString().split('T')[0],
        date_fin: date.toISOString().split('T')[0],
        raison: 'Indisponibilité ponctuelle'
      }))

      const { error } = await supabase
        .from('conges_medecin')
        .insert(congesToAdd)

      if (error) throw error

      fetchConges(selectedMedecin.id)
      toast.success('Indisponibilités enregistrées avec succès')
      setSelectedDates([])
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors de l'enregistrement: ${error.message}`)
    }
  }

  const handleAddDisponibilite = async () => {
    if (!selectedMedecin) {
      toast.error('Aucun médecin sélectionné')
      return
    }

    try {
      const { error } = await supabase
        .from('disponibilites_medecin')
        .insert([{
          ...newDispo,
          medecin_id: selectedMedecin.id,
          heure_debut: `${newDispo.heure_debut}:00`,
          heure_fin: `${newDispo.heure_fin}:00`
        }])

      if (error) throw error

      fetchDisponibilites(selectedMedecin.id)
      toast.success('Disponibilité ajoutée avec succès')
      setNewDispo({
        jour_semaine: 1,
        heure_debut: '08:00',
        heure_fin: '17:00',
        lieu_id: '',
        autre_lieu: '',
        actif: true
      })
      setShowDispoModal(false)
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors de l'ajout: ${error.message}`)
    }
  }

  const handleAddConge = async () => {
    if (!selectedMedecin) {
      toast.error('Aucun médecin sélectionné')
      return
    }

    if (!newConge.date_debut || !newConge.date_fin) {
      toast.error('Veuillez sélectionner des dates valides')
      return
    }

    try {
      const { error } = await supabase
        .from('conges_medecin')
        .insert([{
          ...newConge,
          medecin_id: selectedMedecin.id
        }])

      if (error) throw error

      fetchConges(selectedMedecin.id)
      toast.success('Congé programmé avec succès')
      setNewConge({
        date_debut: '',
        date_fin: '',
        raison: ''
      })
      setShowCongeModal(false)
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors de l'ajout: ${error.message}`)
    }
  }

  const toggleDisponibilite = async (id: string, actif: boolean) => {
    try {
      const { error } = await supabase
        .from('disponibilites_medecin')
        .update({ actif: !actif })
        .eq('id', id)

      if (error) throw error

      fetchDisponibilites(selectedMedecin!.id)
      toast.success('Statut de disponibilité mis à jour')
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors de la mise à jour: ${error.message}`)
    }
  }

  const deleteDisponibilite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('disponibilites_medecin')
        .delete()
        .eq('id', id)

      if (error) throw error

      fetchDisponibilites(selectedMedecin!.id)
      toast.success('Disponibilité supprimée')
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors de la suppression: ${error.message}`)
    }
  }

  const deleteConge = async (id: string) => {
    try {
      const { error } = await supabase
        .from('conges_medecin')
        .delete()
        .eq('id', id)

      if (error) throw error

      fetchConges(selectedMedecin!.id)
      toast.success('Congé supprimé')
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors de la suppression: ${error.message}`)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Redirection vers le tableau de bord...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des médecins</h1>
          <p className="mt-2 text-lg text-gray-600">
            Liste des médecins et gestion de leurs disponibilités
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des médecins */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-1">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Liste des médecins</h2>
              
              <div className="space-y-2">
                {medecins.length === 0 ? (
                  <div className="text-center py-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-500">Aucun médecin enregistré</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {medecins.map(medecin => (
                      <li 
                        key={medecin.id} 
                        className={`py-4 px-3 hover:bg-gray-50 cursor-pointer rounded-md ${selectedMedecin?.id === medecin.id ? 'bg-blue-50 border border-blue-200' : ''}`}
                        onClick={() => handleSelectMedecin(medecin)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                              {medecin.nom.charAt(0)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{medecin.nom}</p>
                            <p className="text-sm text-gray-500 truncate">{medecin.specialite}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          
          {/* Détails du médecin sélectionné */}
          <div className="lg:col-span-2 space-y-8">
            {selectedMedecin ? (
              <>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">{selectedMedecin.nom}</h2>
                        <p className="text-gray-600">{selectedMedecin.specialite}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>{selectedMedecin.email}</p>
                        <p>{selectedMedecin.numero_telephone}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setShowDispoModal(true)}
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        Ajouter une disponibilité
                      </button>
                      
                      <button
                        onClick={() => setShowCongeModal(true)}
                        className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                      >
                        Programmer un congé
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Disponibilités du médecin */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Disponibilités hebdomadaires</h2>
                    
                    {disponibilites.length === 0 ? (
                      <div className="text-center py-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-1 text-sm text-gray-500">Aucune disponibilité enregistrée</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {disponibilites.map(dispo => {
                          const jour = joursSemaine.find(j => j.id === dispo.jour_semaine)?.nom || ''
                          const lieu = lieuxConsultation.find(l => l.id === dispo.lieu_id)?.nom || dispo.autre_lieu
                          
                          return (
                            <div key={dispo.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {jour}: {dispo.heure_debut.slice(0,5)} - {dispo.heure_fin.slice(0,5)}
                                </p>
                                <p className="text-sm text-gray-500">{lieu}</p>
                              </div>
                              
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => toggleDisponibilite(dispo.id, dispo.actif)}
                                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                                    dispo.actif 
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                  }`}
                                >
                                  {dispo.actif ? 'Actif' : 'Inactif'}
                                </button>
                                <button
                                  onClick={() => deleteDisponibilite(dispo.id)}
                                  className="px-3 py-1 rounded-md bg-red-100 text-red-800 text-sm font-medium hover:bg-red-200"
                                >
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Congés du médecin */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Congés programmés</h2>
                    
                    {conges.length === 0 ? (
                      <div className="text-center py-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                        </svg>
                        <p className="mt-1 text-sm text-gray-500">Aucun congé programmé</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {conges.map(conge => (
                          <div key={conge.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div>
                              <p className="font-medium text-gray-900">
                                {new Date(conge.date_debut).toLocaleDateString('fr-FR')} - {new Date(conge.date_fin).toLocaleDateString('fr-FR')}
                              </p>
                              {conge.raison && <p className="text-sm text-gray-500">{conge.raison}</p>}
                            </div>
                            
                            <button
                              onClick={() => deleteConge(conge.id)}
                              className="px-3 py-1 rounded-md bg-red-100 text-red-800 text-sm font-medium hover:bg-red-200"
                            >
                              Supprimer
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Calendrier des indisponibilités */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Calendrier des indisponibilités</h2>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <DayPicker
                        mode="multiple"
                        selected={selectedDates}
                        onSelect={(dates) => setSelectedDates(dates || [])}
                        locale={fr}
                        modifiers={{
                          conge: conges.flatMap(c => {
                            const start = new Date(c.date_debut)
                            const end = new Date(c.date_fin)
                            const dates = []
                            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                              dates.push(new Date(d))
                            }
                            return dates
                          })
                        }}
                        modifiersStyles={{
                          conge: { backgroundColor: '#fca5a5', color: '#b91c1c' }
                        }}
                        styles={{
                          root: { margin: '0 auto' },
                          caption: { color: '#1e40af', fontWeight: '600' },
                          day: { margin: '0.2em' },
                          cell: { borderRadius: '0.375rem' }
                        }}
                      />
                      
                      {selectedDates.length > 0 && (
                        <div className="mt-4 flex justify-between items-center">
                          <p className="text-sm text-gray-600">
                            {selectedDates.length} date{selectedDates.length > 1 ? 's' : ''} sélectionnée{selectedDates.length > 1 ? 's' : ''}
                          </p>
                          <button
                            onClick={handleSaveSelectedDates}
                            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                          >
                            Enregistrer les indisponibilités
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Sélectionnez un médecin</h3>
                <p className="mt-1 text-sm text-gray-500">Choisissez un médecin dans la liste pour voir et gérer ses disponibilités</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal pour ajouter une disponibilité */}
      {showDispoModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Ajouter une disponibilité</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
                      <select
                        value={newDispo.jour_semaine}
                        onChange={(e) => setNewDispo({...newDispo, jour_semaine: parseInt(e.target.value)})}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        {joursSemaine.map(jour => (
                          <option key={jour.id} value={jour.id}>{jour.nom}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heure début</label>
                      <input
                        type="time"
                        value={newDispo.heure_debut}
                        onChange={(e) => setNewDispo({...newDispo, heure_debut: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heure fin</label>
                      <input
                        type="time"
                        value={newDispo.heure_fin}
                        onChange={(e) => setNewDispo({...newDispo, heure_fin: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de consultation</label>
                      <select
                        value={newDispo.lieu_id}
                        onChange={(e) => setNewDispo({...newDispo, lieu_id: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Sélectionnez un lieu</option>
                        {lieuxConsultation.map(lieu => (
                          <option key={lieu.id} value={lieu.id}>{lieu.nom}</option>
                        ))}
                      </select>
                    </div>
                    
                    {newDispo.lieu_id === '' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Autre lieu</label>
                        <input
                          type="text"
                          value={newDispo.autre_lieu}
                          onChange={(e) => setNewDispo({...newDispo, autre_lieu: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Précisez le lieu"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="actif"
                      checked={newDispo.actif}
                      onChange={(e) => setNewDispo({...newDispo, actif: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="actif" className="ml-2 block text-sm text-gray-700">
                      Actif
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={handleAddDisponibilite}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowDispoModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal pour ajouter un congé */}
      {showCongeModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Programmer un congé</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                      <input
                        type="date"
                        value={newConge.date_debut}
                        onChange={(e) => setNewConge({...newConge, date_debut: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
                      <input
                        type="date"
                        value={newConge.date_fin}
                        onChange={(e) => setNewConge({...newConge, date_fin: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Raison (optionnel)</label>
                    <input
                      type="text"
                      value={newConge.raison}
                      onChange={(e) => setNewConge({...newConge, raison: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Congé annuel, Formation..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={handleAddConge}
                  disabled={!newConge.date_debut || !newConge.date_fin}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 sm:col-start-2 sm:text-sm"
                >
                  Programmer
                </button>
                <button
                  type="button"
                  onClick={() => setShowCongeModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}