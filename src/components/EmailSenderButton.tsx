// import { useState } from 'react';
// import { toast } from 'react-toastify';

// export function EmailSenderButton() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [results, setResults] = useState<any>(null);

//   const handleSendEmails = async () => {
//     setIsLoading(true);
//     setResults(null);
    
//     try {
//       const response = await fetch('/api/send-rdv-emails', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || 'Erreur inconnue');

//       setResults(data);
//       toast.success(data.message);
//     } catch (error: any) {
//       console.error('Erreur:', error);
//       toast.error(error.message || 'Erreur lors de l\'envoi des emails');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="mb-8 p-4 bg-white rounded-lg shadow">
//       <h2 className="text-xl font-semibold mb-4">Envoi des emails de rendez-vous</h2>
      
//       <button
//         onClick={handleSendEmails}
//         disabled={isLoading}
//         className={`px-4 py-2 rounded-md text-white ${
//           isLoading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
//         } transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
//       >
//         {isLoading ? (
//           <span className="flex items-center">
//             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Envoi en cours...
//           </span>
//         ) : (
//           'Envoyer les emails de confirmation/annulation'
//         )}
//       </button>

//       {results && (
//         <div className="mt-4 p-4 bg-gray-50 rounded-md">
//           <h3 className="font-medium mb-2">Résultats:</h3>
//           <p className="mb-2">{results.message}</p>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//             <div className="bg-green-50 p-3 rounded">
//               <p className="text-green-800 font-medium">
//                 Succès: {results.details.filter((r: any) => r.status === 'success').length}
//               </p>
//             </div>
//             <div className="bg-yellow-50 p-3 rounded">
//               <p className="text-yellow-800 font-medium">
//                 Ignorés: {results.details.filter((r: any) => r.status === 'skipped').length}
//               </p>
//             </div>
//             <div className="bg-red-50 p-3 rounded">
//               <p className="text-red-800 font-medium">
//                 Erreurs: {results.details.filter((r: any) => r.status === 'error').length}
//               </p>
//             </div>
//           </div>

//           <details className="mt-4">
//             <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
//               Voir les détails complets
//             </summary>
//             <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-60 border border-gray-200">
//               {JSON.stringify(results.details, null, 2)}
//             </pre>
//           </details>
//         </div>
//       )}
//     </div>
//   );
// }
'use client'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { FiSend, FiCheckCircle, FiAlertCircle, FiSkipForward, FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface EmailResult {
  status: 'success' | 'error' | 'skipped'
  email: string
  message: string
  rdvId?: string
}

interface EmailResponse {
  message: string
  details: EmailResult[]
  totalSent: number
  totalSkipped: number
  totalErrors: number
}

export function EmailSenderButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<EmailResponse | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleSendEmails = async () => {
    setIsLoading(true)
    setResults(null)
    
    try {
      const response = await fetch('/api/send-rdv-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erreur inconnue')

      setResults({
        ...data,
        totalSent: data.details.filter((r: EmailResult) => r.status === 'success').length,
        totalSkipped: data.details.filter((r: EmailResult) => r.status === 'skipped').length,
        totalErrors: data.details.filter((r: EmailResult) => r.status === 'error').length
      })
      toast.success(data.message)
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(error.message || 'Erreur lors de l\'envoi des emails')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <FiCheckCircle className="text-green-500" />
      case 'error': return <FiAlertCircle className="text-red-500" />
      case 'skipped': return <FiSkipForward className="text-yellow-500" />
      default: return null
    }
  }

  return (
    <div className="mb-8 p- bg-white rounded-xl shadow-d  border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Notifications des rendez-vous</h2>
          <p className="text-sm text-gray-500 mt-1">
            Envoi des emails de confirmation et rappels aux patients
          </p>
        </div>
        
        <button
          onClick={handleSendEmails}
          disabled={isLoading}
          className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-all ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi en cours...
            </>
          ) : (
            <>
              <FiSend className="mr-2" />
              Envoyer les notifications
            </>
          )}
        </button>
      </div>

      {results && (
        <div className="mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg text-gray-800 flex items-center">
              <FiCheckCircle className="text-green-500 mr-2" />
              {results.message}
            </h3>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              {showDetails ? (
                <>
                  <FiChevronUp className="mr-1" />
                  Masquer les détails
                </>
              ) : (
                <>
                  <FiChevronDown className="mr-1" />
                  Voir les détails
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Envoyés avec succès</p>
                  <p className="text-2xl font-bold text-green-800">{results.totalSent}</p>
                </div>
                <FiCheckCircle className="text-green-400 text-xl" />
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Notifications ignorées</p>
                  <p className="text-2xl font-bold text-yellow-800">{results.totalSkipped}</p>
                </div>
                <FiSkipForward className="text-yellow-400 text-xl" />
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Erreurs d'envoi</p>
                  <p className="text-2xl font-bold text-red-800">{results.totalErrors}</p>
                </div>
                <FiAlertCircle className="text-red-400 text-xl" />
              </div>
            </div>
          </div>

          {showDetails && (
            <div className="mt-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Rendez-vous
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.details.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(result.status)}
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              result.status === 'success' 
                                ? 'bg-green-100 text-green-800' 
                                : result.status === 'error' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {result.status === 'success' ? 'Succès' : result.status === 'error' ? 'Erreur' : 'Ignoré'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {result.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {result.rdvId || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {result.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}