
'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import LoadingSpinner from '@/components/Loader'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiArrowRight, FiCheck, FiUpload, FiFileText, FiDollarSign, FiCalendar, FiUsers } from 'react-icons/fi'

type Declaration = {
  id?: number
  employer_id?: string
  type_impot: 'IPR' | 'IERE'
  periode: string
  date_declaration?: string
  reference_dgi?: string
  statut: 'en_attente' | 'validée' | 'payée'
  base_imposable_totale: number
  montant_impot_total: number
  nombre_employes: number
  devise: 'FC' | 'USD'
  montant_paye?: number
  date_paiement?: string
  numero_quittance?: string
  preuve_paiement?: string
}

type Employee = {
  id: number
  nom: string
  prenom: string
  nif: string
  salaire_brut: number
  etranger: boolean
  selected: boolean
}

export default function DeclarationImpots() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [declaration, setDeclaration] = useState<Declaration>({
    type_impot: 'IPR',
    periode: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    statut: 'en_attente',
    base_imposable_totale: 0,
    montant_impot_total: 0,
    nombre_employes: 0,
    devise: 'FC'
  })
  const [step, setStep] = useState<1 | 2 | 3>(1) // 1: Infos, 2: Employés, 3: Validation
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Charger les employés
  useEffect(() => {
    if (!user?.id) return

    const fetchEmployees = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('employees')
          .select('id, nom, prenom, nif, salaire_brut, etranger')
          .eq('employer_id', user.id)
          .eq('actif', true)

        if (error) throw error

        setEmployees(data.map(e => ({ ...e, selected: false })))
      } catch (err) {
        console.error('Erreur chargement employés:', err)
        setError('Erreur lors du chargement des employés')
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [user?.id])

  // Filtrer les employés selon le type d'impôt
  const filteredEmployees = () => {
    if (declaration.type_impot === 'IERE') {
      return employees.filter(emp => emp.etranger)
    }
    return employees
  }

  // Générer la référence DGI
  const generateDgiReference = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const randomNum = String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')
    return `13TA${year}${month}${day}${randomNum}`
  }

  // Calculer les montants lorsqu'on sélectionne des employés
  const calculateAmounts = (selectedEmployees: Employee[]) => {
    const baseImposable = selectedEmployees.reduce((sum, emp) => sum + emp.salaire_brut, 0)
    const impotTotal = selectedEmployees.reduce((sum, emp) => {
      let impot = 0
      if (declaration.type_impot === 'IPR') {
        impot = emp.salaire_brut * 0.15
      } else {
        impot = emp.salaire_brut * 0.05
      }
      return sum + impot
    }, 0)

    setDeclaration(prev => ({
      ...prev,
      base_imposable_totale: parseFloat(baseImposable.toFixed(2)),
      montant_impot_total: parseFloat(impotTotal.toFixed(2)),
      nombre_employes: selectedEmployees.length
    }))
  }

  // Gérer la sélection des employés
  const toggleEmployeeSelection = (id: number) => {
    const updatedEmployees = employees.map(emp => 
      emp.id === id ? { ...emp, selected: !emp.selected } : emp
    )
    setEmployees(updatedEmployees)
    calculateAmounts(updatedEmployees.filter(e => e.selected))
  }

  // Sélectionner tous les employés visibles
  const toggleSelectAll = () => {
    const visibleEmployees = filteredEmployees()
    const allSelected = visibleEmployees.every(emp => emp.selected)
    
    const updatedEmployees = employees.map(emp => {
      // Ne modifier que les employés visibles
      if (visibleEmployees.some(e => e.id === emp.id)) {
        return { ...emp, selected: !allSelected }
      }
      return emp
    })
    
    setEmployees(updatedEmployees)
    calculateAmounts(updatedEmployees.filter(e => e.selected))
  }

  // Soumettre la déclaration
  const submitDeclaration = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      setError('')

      const declarationToInsert = {
        ...declaration,
        employer_id: user.id,
        reference_dgi: generateDgiReference(),
        date_declaration: new Date().toISOString()
      }

      const { data: declarationData, error: declError } = await supabase
        .from('declarations')
        .insert(declarationToInsert)
        .select()
        .single()

      if (declError) throw declError

      const selectedEmps = employees.filter(e => e.selected)
      const details = selectedEmps.map(emp => ({
        declaration_id: declarationData.id,
        employe_id: emp.id,
        salaire_brut: emp.salaire_brut,
        base_imposable: emp.salaire_brut,
        montant_impot: declaration.type_impot === 'IPR' 
          ? emp.salaire_brut * 0.15 
          : emp.salaire_brut * 0.05,
        type_impot: declaration.type_impot
      }))

      const { error: detailsError } = await supabase
        .from('declaration_details')
        .insert(details)

      if (detailsError) throw detailsError

      setSuccess('Déclaration soumise avec succès!')
      setTimeout(() => router.push('/entreprise/declaration'), 2000)
    } catch (err) {
      console.error('Erreur soumission déclaration:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors de la soumission')
    } finally {
      setLoading(false)
    }
  }

  // Uploader la preuve de paiement
  const handlePaymentProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user?.id || !declaration.id) return

    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `paiement_${declaration.id}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    try {
      setUploading(true)

      const { error: uploadError } = await supabase.storage
        .from('declaration_paiements')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('declaration_paiements')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('declarations')
        .update({ 
          preuve_paiement: publicUrl,
          statut: 'payée',
          date_paiement: new Date().toISOString()
        })
        .eq('id', declaration.id)

      if (updateError) throw updateError

      setSuccess('Preuve de paiement enregistrée!')
      setDeclaration(prev => ({ ...prev, preuve_paiement: publicUrl, statut: 'payée' }))
    } catch (err) {
      console.error('Erreur upload preuve:', err)
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload")
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()} 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <FiArrowLeft className="text-gray-600" />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Nouvelle déclaration d'impôts</h1>
      </div>
      
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-[30%] left-[24px] right-[24px] h-1 bg-gray-200 -z-10"></div>
          <div 
            className="absolute top-[30%] left-[24px] h-1 bg-blue-600 -z-10 transition-all duration-300" 
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '91%' }}
          ></div>
          
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {step > stepNumber ? <FiCheck /> : stepNumber}
              </div>
              <span className={`mt-2 text-sm ${step >= stepNumber ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {stepNumber === 1 && 'Informations'}
                {stepNumber === 2 && 'Employés'}
                {stepNumber === 3 && 'Validation'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Étape 1: Informations de base */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
            <FiFileText className="mr-2 text-blue-600" /> Informations générales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Type d'impôt</label>
              <select
                value={declaration.type_impot}
                onChange={(e) => setDeclaration({...declaration, type_impot: e.target.value as 'IPR' | 'IERE'})}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
              >
                <option value="IPR">IPR (Impôt sur les Personnes Physiques)</option>
                <option value="IERE">IERE (Impôt Exceptionnel sur la Rémunération)</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Période (Mois/Année)</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="month"
                  value={declaration.periode}
                  onChange={(e) => setDeclaration({...declaration, periode: e.target.value})}
                  className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 border"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Devise</label>
              <select
                value={declaration.devise}
                onChange={(e) => setDeclaration({...declaration, devise: e.target.value as 'FC' | 'USD'})}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
              >
                <option value="FC">Franc Congolais (FC)</option>
                <option value="USD">Dollar USD ($)</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Suivant <FiArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Étape 2: Sélection des employés */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
            <FiUsers className="mr-2 text-blue-600" /> Sélection des employés
          </h2>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded shadow-sm">
                <p className="text-sm text-gray-500">Employés sélectionnés</p>
                <p className="text-xl font-semibold">{employees.filter(e => e.selected).length}</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <p className="text-sm text-gray-500">Base imposable totale</p>
                <p className="text-xl font-semibold">
                  {declaration.base_imposable_totale.toLocaleString()} {declaration.devise}
                </p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <p className="text-sm text-gray-500">Montant impôt total</p>
                <p className="text-xl font-semibold text-blue-600">
                  {declaration.montant_impot_total.toLocaleString()} {declaration.devise}
                </p>
              </div>
            </div>
          </div>

          {declaration.type_impot === 'IERE' && (
            <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Pour l'IERE, seuls les employés étrangers sont sélectionnables.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-700">
              {filteredEmployees().length} employé{filteredEmployees().length !== 1 ? 's' : ''} disponible{filteredEmployees().length !== 1 ? 's' : ''}
            </h3>
            <button
              onClick={toggleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {filteredEmployees().every(emp => emp.selected) ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sélection
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom & Prénom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIF
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salaire brut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Impôt estimé
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees().map(emp => (
                  <tr key={emp.id} className={emp.selected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={emp.selected}
                        onChange={() => toggleEmployeeSelection(emp.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{emp.prenom} {emp.nom}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{emp.nif || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{emp.salaire_brut.toLocaleString()} {declaration.devise}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {(declaration.type_impot === 'IPR' 
                          ? emp.salaire_brut * 0.15 
                          : emp.salaire_brut * 0.05).toLocaleString()} {declaration.devise}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {emp.etranger ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Étranger
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Local
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiArrowLeft className="mr-2" /> Retour
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={employees.filter(e => e.selected).length === 0}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${employees.filter(e => e.selected).length === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
            
              <span className="inline-flex sm:hidden items-center">Valider <FiArrowRight className="ml-2" /></span>
              <span className="hidden sm:flex items-center ">Valider la selection<FiArrowRight className="ml-2" /></span>
            </button>
          </div>
        </div>
      )}

      {/* Étape 3: Validation et paiement */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
            <FiCheck className="mr-2 text-blue-600" /> Validation et paiement
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium text-lg mb-4 text-gray-800 border-b pb-2">Récapitulatif</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type d'impôt:</span>
                  <span className="font-medium">{declaration.type_impot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Période:</span>
                  <span className="font-medium">{declaration.periode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre d'employés:</span>
                  <span className="font-medium">{declaration.nombre_employes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base imposable totale:</span>
                  <span className="font-medium">{declaration.base_imposable_totale.toLocaleString()} {declaration.devise}</span>
                </div>
                <div className="pt-4 border-t mt-2">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-800 font-semibold">Montant total:</span>
                    <span className="text-blue-600 font-bold">{declaration.montant_impot_total.toLocaleString()} {declaration.devise}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4 text-gray-800 border-b pb-2">Preuve de paiement</h3>
              {declaration.preuve_paiement ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-green-800">Paiement enregistré</span>
                  </div>
                  <div className="mt-3">
                    <a 
                      href={declaration.preuve_paiement} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <FiFileText className="mr-1" /> Voir la preuve de paiement
                    </a>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex justify-center">
                    <FiUpload className="h-10 w-10 text-gray-400" />
                  </div>
                  <label htmlFor="file-upload" className="mt-2 cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-800 font-medium">Uploader la quittance</span>
                    <span className="block text-xs text-gray-500 mt-1">PDF, JPG ou PNG (max 5MB)</span>
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handlePaymentProofUpload}
                    disabled={uploading}
                    className="sr-only"
                  />
                  {uploading && (
                    <div className="mt-4 text-sm text-gray-500">
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        En cours d'upload...
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiArrowLeft className="mr-2" /> Retour
            </button>
            <button
              onClick={submitDeclaration}
              disabled={loading || uploading}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${loading || uploading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  En cours...
                </>
              ) : (
                <>
                 <span className="inline-flex sm:hidden items-center"> <FiCheck className="mr-2" />Soumetre </span>
              <span className="hidden sm:flex items-center "><FiCheck className="mr-2" />Soumettre la déclaration </span>
           
                   
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}