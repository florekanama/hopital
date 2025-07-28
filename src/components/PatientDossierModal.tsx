'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { DossierPDF } from '@/components/DossierPDF'

interface PatientDossierModalProps {
  patientId: string
  medecinId: string
  onClose: () => void
}

export default function PatientDossierModal({ patientId, medecinId, onClose }: PatientDossierModalProps) {
  const [loading, setLoading] = useState(true)
  const [patient, setPatient] = useState<any>(null)
  const [rendezVous, setRendezVous] = useState<any[]>([])
  const [dossier, setDossier] = useState<any>(null)
  const [formData, setFormData] = useState({
    symptomes: '',
    diagnostic: '',
    traitement: '',
    observations: ''
  })

  // Charger les données du patient et son historique
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Récupérer les infos du patient
        const { data: patientData, error: patientError } = await supabase
          .from('patient_infos')
          .select(`
            *,
            user:users(nom, email, profil_url)
          `)
          .eq('id', patientId)
          .single()

        if (patientError) throw patientError
        setPatient(patientData)

        // Récupérer les rendez-vous avec ce patient
        const { data: rdvData, error: rdvError } = await supabase
          .from('rendez_vous')
          .select('*')
          .eq('medecin_id', medecinId)
          .eq('patient_id', patientId)
          .order('date_heure', { ascending: false })

        if (rdvError) throw rdvError
        setRendezVous(rdvData || [])

        // Charger le dernier dossier médical s'il existe
        const { data: dossierData, error: dossierError } = await supabase
          .from('dossiers_medicaux')
          .select('*')
          .eq('patient_id', patientId)
          .order('date_consultation', { ascending: false })
          .limit(1)

        if (dossierError) throw dossierError

        if (dossierData?.length > 0) {
          setDossier(dossierData[0])
          setFormData({
            symptomes: dossierData[0].symptomes || '',
            diagnostic: dossierData[0].diagnostic || '',
            traitement: dossierData[0].traitement || '',
            observations: dossierData[0].observations || ''
          })
        }

      } catch (error: any) {
        toast.error(`Erreur: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [patientId, medecinId])

  const saveDossier = async () => {
    try {
      setLoading(true)
      
      if (dossier) {
        // Mettre à jour le dossier existant
        const { error } = await supabase
          .from('dossiers_medicaux')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', dossier.id)

        if (error) throw error
      } else {
        // Créer un nouveau dossier
        const { error } = await supabase
          .from('dossiers_medicaux')
          .insert({
            patient_id: patientId,
            medecin_id: medecinId,
            ...formData
          })

        if (error) throw error
      }

      toast.success('Dossier médical enregistré')
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xl bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">Dossier Médical</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            {patient?.user?.profil_url ? (
              <img 
                src={patient.user.profil_url} 
                alt="Photo du patient" 
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">{patient?.user?.nom}</h1>
              <p className="text-gray-600">{patient?.user?.email}</p>
              {patient?.date_naissance && (
                <p className="text-sm">Âge: {new Date().getFullYear() - new Date(patient.date_naissance).getFullYear()} ans</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Symptômes</label>
            <textarea
              value={formData.symptomes}
              onChange={(e) => setFormData({...formData, symptomes: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnostic</label>
            <textarea
              value={formData.diagnostic}
              onChange={(e) => setFormData({...formData, diagnostic: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Traitement</label>
            <textarea
              value={formData.traitement}
              onChange={(e) => setFormData({...formData, traitement: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
            <textarea
              value={formData.observations}
              onChange={(e) => setFormData({...formData, observations: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={saveDossier}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>

            {dossier && (
              <PDFDownloadLink
                document={<DossierPDF patient={patient} dossier={formData} />}
                fileName={`dossier-${patient.user.nom}-${format(new Date(), 'yyyy-MM-dd')}.pdf`}
              >
                {({ loading }) => (
                  <button
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-400"
                  >
                    {loading ? 'Génération...' : 'Télécharger PDF'}
                  </button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3">Historique des consultations</h2>
          {rendezVous.length === 0 ? (
            <p className="text-gray-500">Aucun rendez-vous passé</p>
          ) : (
            <div className="space-y-3">
              {rendezVous.map(rdv => (
                <div key={rdv.id} className="border-b pb-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium">
                      {format(new Date(rdv.date_heure), 'PPPPp', { locale: fr })}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded ${
                      rdv.statut === 'terminé' ? 'bg-green-100 text-green-800' : 
                      rdv.statut === 'annulé' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {rdv.statut}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{rdv.motif}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}