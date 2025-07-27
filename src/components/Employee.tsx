
'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase/supabaseClient'
import LoadingSpinner from '@/components/Loader'

type Employee = {
  id?: number
  nom: string
  prenom: string
  nif: string
  cnss: string
  salaire_brut: number
  date_embauche: string
  actif: boolean
  etranger: boolean
}

export default function EmployeesPage() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [newEmployee, setNewEmployee] = useState<Employee>({
    nom: '',
    prenom: '',
    nif: '',
    cnss: '',
    salaire_brut: 0,
    date_embauche: new Date().toISOString().split('T')[0],
    actif: true,
    etranger: false
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    if (!user?.id) return

    const fetchEmployees = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('employer_id', user.id)
          .order('nom', { ascending: true })

        if (error) throw error

        setEmployees(data || [])
      } catch (err) {
        console.error('Erreur chargement employés:', err)
        setError('Erreur lors du chargement des employés')
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [user?.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setNewEmployee(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'salaire_brut' ? parseFloat(value) || 0 : 
              value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    try {
      setLoading(true)
      setError('')

      if (editingId) {
        // Mise à jour
        const { error } = await supabase
          .from('employees')
          .update({ ...newEmployee })
          .eq('id', editingId)

        if (error) throw error

        setEmployees(prev => prev.map(emp => 
          emp.id === editingId ? { ...newEmployee, id: editingId } : emp
        ))
        setSuccess('Employé mis à jour avec succès')
      } else {
        // Création
        const { data, error } = await supabase
          .from('employees')
          .insert([{ ...newEmployee, employer_id: user.id }])
          .select()
          .single()

        if (error) throw error

        setEmployees(prev => [...prev, data])
        setSuccess('Employé ajouté avec succès')
      }

      // Réinitialiser le formulaire
      setNewEmployee({
        nom: '',
        prenom: '',
        nif: '',
        cnss: '',
        salaire_brut: 0,
        date_embauche: new Date().toISOString().split('T')[0],
        actif: true,
        etranger: false
      })
      setEditingId(null)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Erreur sauvegarde employé:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (employee: Employee) => {
    setNewEmployee(employee)
    setEditingId(employee.id || null)
  }

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('employees')
        .update({ actif: !currentStatus })
        .eq('id', id)

      if (error) throw error

      setEmployees(prev => prev.map(emp => 
        emp.id === id ? { ...emp, actif: !currentStatus } : emp
      ))
      setSuccess(`Employé ${!currentStatus ? 'activé' : 'désactivé'} avec succès`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Erreur changement statut:', err)
      setError('Erreur lors du changement de statut')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des employés</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gérer les informations de vos employés et distinguer les travailleurs étrangers
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
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
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulaire d'ajout/modification */}
        <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingId ? 'Modifier employé' : 'Ajouter un employé'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={newEmployee.nom}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={newEmployee.prenom}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nif" className="block text-sm font-medium text-gray-700 mb-1">
                  NIF
                </label>
                <input
                  type="text"
                  id="nif"
                  name="nif"
                  value={newEmployee.nif}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label htmlFor="cnss" className="block text-sm font-medium text-gray-700 mb-1">
                  CNSS
                </label>
                <input
                  type="text"
                  id="cnss"
                  name="cnss"
                  value={newEmployee.cnss}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>

            <div>
              <label htmlFor="salaire_brut" className="block text-sm font-medium text-gray-700 mb-1">
                Salaire brut *
              </label>
              <input
                type="number"
                id="salaire_brut"
                name="salaire_brut"
                value={newEmployee.salaire_brut}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>

            <div>
              <label htmlFor="date_embauche" className="block text-sm font-medium text-gray-700 mb-1">
                Date d'embauche *
              </label>
              <input
                type="date"
                id="date_embauche"
                name="date_embauche"
                value={newEmployee.date_embauche}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  id="actif"
                  name="actif"
                  type="checkbox"
                  checked={newEmployee.actif}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="actif" className="ml-2 block text-sm text-gray-700">
                  Actif
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="etranger"
                  name="etranger"
                  type="checkbox"
                  checked={newEmployee.etranger}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="etranger" className="ml-2 block text-sm text-gray-700">
                  Étranger
                </label>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setNewEmployee({
                      nom: '',
                      prenom: '',
                      nif: '',
                      cnss: '',
                      salaire_brut: 0,
                      date_embauche: new Date().toISOString().split('T')[0],
                      actif: true,
                      etranger: false
                    })
                    setEditingId(null)
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Liste des employés */}
        <div className="lg:col-span-8">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Liste des employés</h2>
              <p className="mt-1 text-sm text-gray-500">
                {employees.length} employé{employees.length !== 1 ? 's' : ''} enregistré{employees.length !== 1 ? 's' : ''}
              </p>
            </div>
            {employees.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun employé</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Commencez par ajouter votre premier employé.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom & Prénom
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Salaire
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 text-sm font-medium">
                                {employee.prenom.charAt(0)}{employee.nom.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {employee.prenom} {employee.nom}
                              </div>
                              <div className="text-sm text-gray-500">
                                {employee.nif || 'Aucun NIF'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {employee.salaire_brut.toLocaleString()} FC
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(employee.date_embauche).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              employee.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {employee.actif ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {employee.etranger ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                              Étranger
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Local
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => employee.id && handleToggleStatus(employee.id, employee.actif)}
                            className={employee.actif ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                          >
                            {employee.actif ? 'Désactiver' : 'Activer'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}