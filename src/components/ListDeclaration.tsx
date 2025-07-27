
'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase/supabaseClient'
import LoadingSpinner from '@/components/Loader'

type Declaration = {
  id: number
  employer_id: string
  type_impot: 'IPR' | 'IERE'
  periode: string
  date_declaration: string
  reference_dgi: string
  statut: 'en_attente' | 'validée' | 'payée'
  base_imposable_totale: number
  montant_impot_total: number
  nombre_employes: number
  devise: 'FC' | 'USD'
  montant_paye?: number
  date_paiement?: string
  numero_quittance?: string
  preuve_paiement?: string
  created_at: string
  updated_at: string
}

type EmployeeDetail = {
  id: number
  nom: string
  prenom: string
  nif: string
  salaire_brut: number
  base_imposable: number
  montant_impot: number
  type_impot: 'IPR' | 'IERE'
}

export default function DeclarationsPage() {
  const { user } = useAuth()
  const [declarations, setDeclarations] = useState<Declaration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [selectedDeclaration, setSelectedDeclaration] = useState<Declaration | null>(null)
  const [employeesDetails, setEmployeesDetails] = useState<EmployeeDetail[]>([])
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentData, setPaymentData] = useState({
    montant: 0,
    date: new Date().toISOString().split('T')[0],
    numeroQuittance: '',
    file: null as File | null
  })

  useEffect(() => {
    if (!user?.id) return

    const fetchDeclarations = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('declarations')
          .select(`
            id,
            type_impot,
            periode,
            date_declaration,
            reference_dgi,
            statut,
            base_imposable_totale,
            montant_impot_total,
            nombre_employes,
            devise,
            montant_paye,
            date_paiement,
            numero_quittance,
            preuve_paiement,
            created_at,
            updated_at
          `)
          .eq('employer_id', user.id)
          .order('date_declaration', { ascending: false })

        if (error) throw error

        setDeclarations(data as Declaration[])
      } catch (err) {
        console.error('Erreur chargement déclarations:', err)
        setError('Erreur lors du chargement des déclarations')
      } finally {
        setLoading(false)
      }
    }

    fetchDeclarations()
  }, [user?.id, success])

  const fetchDeclarationDetails = async (declarationId: number) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('declaration_details')
        .select(`
          id,
          employe_id,
          salaire_brut,
          base_imposable,
          montant_impot,
          type_impot,
          employees (id, nom, prenom, nif)
        `)
        .eq('declaration_id', declarationId)

      if (error) throw error

      const formattedData = data?.map((item: any) => ({
        id: item.employees.id,
        nom: item.employees.nom,
        prenom: item.employees.prenom,
        nif: item.employees.nif,
        salaire_brut: item.salaire_brut,
        base_imposable: item.base_imposable,
        montant_impot: item.montant_impot,
        type_impot: item.type_impot
      })) || []

      setEmployeesDetails(formattedData)
    } catch (err) {
      console.error('Erreur chargement détails:', err)
      setError('Erreur lors du chargement des détails')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDeclaration || !paymentData.file) {
      setError('Veuillez uploader une preuve de paiement')
      return
    }

    try {
      setLoading(true)
      setError('')

      const fileExt = paymentData.file.name.split('.').pop()
      const fileName = `paiement_${selectedDeclaration.id}.${fileExt}`
      const filePath = `${user?.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('declaration_paiements')
        .upload(filePath, paymentData.file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('declaration_paiements')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('declarations')
        .update({ 
          statut: 'payée',
          montant_paye: paymentData.montant,
          date_paiement: paymentData.date,
          numero_quittance: paymentData.numeroQuittance,
          preuve_paiement: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedDeclaration.id)

      if (updateError) throw updateError

      setSuccess('Paiement enregistré avec succès! En attente de validation par l\'administration.')
      setPaymentModalOpen(false)
      setSelectedDeclaration(null)
      setPaymentData({
        montant: 0,
        date: new Date().toISOString().split('T')[0],
        numeroQuittance: '',
        file: null
      })
    } catch (err) {
      console.error('Erreur enregistrement paiement:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement')
    } finally {
      setLoading(false)
    }
  }

  const downloadFile = async (fileUrl: string) => {
    const fileName = fileUrl.split('/').pop() || 'preuve_paiement'
    const filePath = fileUrl.split('/').slice(-2).join('/')
    
    const { data, error } = await supabase.storage
      .from('declaration_paiements')
      .download(filePath)

    if (error) {
      console.error('Erreur téléchargement:', error)
      setError('Erreur lors du téléchargement')
      return
    }

    const url = window.URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentData(prev => ({
      ...prev,
      [name]: name === 'montant' ? parseFloat(value) || 0 : value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentData({...paymentData, file: e.target.files[0]})
    }
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'payée': return 'bg-green-100 text-green-800'
      case 'validée': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-6xl  mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Mes Déclarations</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          {success}
        </div>
      )}

      {declarations.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">Aucune déclaration trouvée</p>
        </div>
      ) : (
        <div className="bg-white scrollbar-hide rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="min-w-full divide-y  divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Référence</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Période</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Montant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y  divide-gray-200">
                {declarations.map(decl => (
                  <tr key={decl.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {decl.reference_dgi}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {decl.type_impot}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {decl.periode}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {decl.montant_impot_total.toLocaleString()} {decl.devise}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(decl.statut)}`}>
                        {decl.statut === 'payée' ? 'Payée (En attente de validation)' : decl.statut}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelectedDeclaration(decl)
                          fetchDeclarationDetails(decl.id)
                        }}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Détails
                      </button>
                      {decl.statut === 'en_attente' && (
                        <button
                          onClick={() => {
                            setSelectedDeclaration(decl)
                            setPaymentModalOpen(true)
                          }}
                          className="text-green-600 hover:text-green-800 hover:underline"
                        >
                          Payer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de détails */}
      {selectedDeclaration && (
        <div className="fixed inset-0  bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white scrollbar-hide rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-2">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Déclaration {selectedDeclaration.reference_dgi}
                </h2>
                <button 
                  onClick={() => setSelectedDeclaration(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500">Type d'impôt</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeclaration.type_impot}</p>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500">Période</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeclaration.periode}</p>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500">Date de déclaration</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedDeclaration.date_declaration).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500">Statut</h3>
                    <p className="mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedDeclaration.statut)}`}>
                        {selectedDeclaration.statut === 'payée' ? 'Payée (En attente de validation)' : selectedDeclaration.statut}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500">Montant total</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedDeclaration.montant_impot_total.toLocaleString()} {selectedDeclaration.devise}
                    </p>
                  </div>
                  {selectedDeclaration.statut === 'payée' && (
                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-500">Date de paiement</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedDeclaration.date_paiement ? new Date(selectedDeclaration.date_paiement).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {selectedDeclaration.statut === 'payée' && (
                <div className="mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Détails de paiement</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Montant payé</p>
                      <p className="text-sm font-medium">
                        {selectedDeclaration.montant_paye?.toLocaleString()} {selectedDeclaration.devise}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Numéro de quittance</p>
                      <p className="text-sm font-medium">
                        {selectedDeclaration.numero_quittance || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Preuve de paiement</p>
                      {selectedDeclaration.preuve_paiement && (
                        <button
                          onClick={() => downloadFile(selectedDeclaration.preuve_paiement!)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Télécharger
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Récapitulatif</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Base imposable</p>
                    <p className="text-sm font-medium">
                      {selectedDeclaration.base_imposable_totale.toLocaleString()} {selectedDeclaration.devise}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Montant impôt</p>
                    <p className="text-sm font-medium">
                      {selectedDeclaration.montant_impot_total.toLocaleString()} {selectedDeclaration.devise}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Nombre d'employés</p>
                    <p className="text-sm font-medium">{selectedDeclaration.nombre_employes}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700">Employés concernés</h3>
                  <span className="text-xs text-gray-500">
                    {employeesDetails.length} employé(s)
                  </span>
                </div>
                
                {employeesDetails.length > 0 ? (
                  <div className="overflow-x-auto border scrollbar-hide border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nom</th>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">NIF</th>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Salaire brut</th>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Montant impôt</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {employeesDetails.map((emp) => (
                          <tr key={emp.id}>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-900">
                              {emp.prenom} {emp.nom}
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">
                              {emp.nif || '-'}
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">
                              {emp.salaire_brut.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">
                              {emp.montant_impot.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Aucun employé trouvé</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de paiement */}
      {paymentModalOpen && selectedDeclaration && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <form onSubmit={handlePaymentSubmit}>
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Enregistrement du paiement</h2>
                  <button 
                    type="button"
                    onClick={() => {
                      setPaymentModalOpen(false)
                      setPaymentData({
                        montant: 0,
                        date: new Date().toISOString().split('T')[0],
                        numeroQuittance: '',
                        file: null
                      })
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant payé *</label>
                    <input
                      type="number"
                      name="montant"
                      value={paymentData.montant}
                      onChange={handlePaymentChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de paiement *</label>
                    <input
                      type="date"
                      name="date"
                      value={paymentData.date}
                      onChange={handlePaymentChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de quittance</label>
                    <input
                      type="text"
                      name="numeroQuittance"
                      value={paymentData.numeroQuittance}
                      onChange={handlePaymentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preuve de paiement *</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <div className="flex flex-col sm:flex-row text-sm text-gray-600 items-center justify-center">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Uploader un fichier</span>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleFileChange}
                              required
                              className="sr-only"
                            />
                          </label>
                          <p className="sm:pl-1">ou glisser-déposer</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, JPG, PNG jusqu'à 5MB
                        </p>
                        {paymentData.file && (
                          <p className="text-xs text-green-600 mt-2">
                            {paymentData.file.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick={() => setPaymentModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                  >
                    {loading ? 'Enregistrement...' : 'Confirmer le paiement'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}