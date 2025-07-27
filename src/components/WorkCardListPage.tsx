// 'use client'
// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { itravailSupabase } from '@/lib/supabase/itravailSupabaseClient'
// import LoadingSpinner from '@/components/Loader'
// import QRCode from 'react-qr-code'

// type WorkCard = {
//   id: string
//   card_number: string
//   worker_last_name: string
//   worker_first_name: string
//   worker_birth_date: string
//   worker_birth_place?: string
//   worker_nationality: string
//   worker_passport_number: string
//   worker_passport_issue_date: string
//   worker_passport_expiry_date: string
//   worker_photo_url?: string
//   enterprise_name?: string
//   enterprise_nif?: string
//   enterprise_sector?: string
//   enterprise_address?: string
//   issue_date: string
//   expiry_date: string
//   issuing_office: string
//   issuing_officer: string
//   notes?: string
//   created_at: string
// }

// export default function WorkCardsListPage() {
//   const { user } = useAuth()
//   const [workCards, setWorkCards] = useState<WorkCard[]>([])
//   const [selectedCard, setSelectedCard] = useState<WorkCard | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     fetchWorkCards()
//   }, [])

//   const fetchWorkCards = async () => {
//     try {
//       setLoading(true)
//       setError('')
      
//       const { data, error } = await itravailSupabase
//         .from('work_cards')
//         .select('*')
//         .order('created_at', { ascending: false })

//       if (error) throw error
//       setWorkCards(data || [])
//     } catch (err) {
//       console.error('Error fetching work cards:', err)
//       setError('Erreur lors du chargement des cartes de travail')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('fr-FR')
//   }

//   if (loading) return <LoadingSpinner />

//   return (
//     <div className="container mx-auto px-4 ">
//       <h1 className="text-xl font-bold mb-6">Liste des Cartes de Travail</h1>
      
//       {error && (
//         <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       <div className="overflow-x-auto scrollbar-hide bg-white rounded-lg shadow">
//         <table className="min-w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travailleur</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Émission</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {workCards.map((card) => (
//               <tr 
//                 key={card.id} 
//                 className="hover:bg-gray-50 cursor-pointer"
//                 onClick={() => setSelectedCard(card)}
//               >
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                   {card.card_number}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">
//                     {card.worker_last_name} {card.worker_first_name}
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     {card.worker_nationality}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {card.enterprise_name || 'Non spécifiée'}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {formatDate(card.issue_date)}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {formatDate(card.expiry_date)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal de détails */}
//       {selectedCard && (
//         <div className="fixed inset-0  bg-black/10 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white scrollbar-hide rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-4">
                
//                 <h2 className="text-2xl font-bold text-gray-800">
//                   Carte de Travail: {selectedCard.card_number}
//                 </h2>
//                 <button
//                   onClick={() => setSelectedCard(null)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//               <div className="flex bg-re items-center justify-between  pr-[90px] space-x-4 ">
//                   <img className='w-[90px]' src="/embleme.png"/>
//                   <img className='w-[130px]' src="/rdc.png"/>
//                 </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                 <div className="md:col-span-2">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <h3 className="text-lg font-semibold mb-2 text-gray-800">Informations Travailleur</h3>
//                       <div className="space-y-2">
//                         <p><span className="font-medium">Nom:</span> {selectedCard.worker_last_name}</p>
//                         <p><span className="font-medium">Prénom:</span> {selectedCard.worker_first_name}</p>
//                         <p><span className="font-medium">Date de naissance:</span> {formatDate(selectedCard.worker_birth_date)}</p>
//                         {selectedCard.worker_birth_place && (
//                           <p><span className="font-medium">Lieu de naissance:</span> {selectedCard.worker_birth_place}</p>
//                         )}
//                         <p><span className="font-medium">Nationalité:</span> {selectedCard.worker_nationality}</p>
//                         <p><span className="font-medium">Passeport:</span> {selectedCard.worker_passport_number}</p>
//                         <p><span className="font-medium">Délivré le:</span> {formatDate(selectedCard.worker_passport_issue_date)}</p>
//                         <p><span className="font-medium">Expire le:</span> {formatDate(selectedCard.worker_passport_expiry_date)}</p>
//                       </div>
//                     </div>

//                     <div>
//                       <h3 className="text-lg font-semibold mb-2 text-gray-800">Informations Entreprise</h3>
//                       <div className="space-y-2">
//                         {selectedCard.enterprise_name ? (
//                           <>
//                             <p><span className="font-medium">Nom:</span> {selectedCard.enterprise_name}</p>
//                             {selectedCard.enterprise_nif && (
//                               <p><span className="font-medium">NIF:</span> {selectedCard.enterprise_nif}</p>
//                             )}
//                             {selectedCard.enterprise_sector && (
//                               <p><span className="font-medium">Secteur:</span> {selectedCard.enterprise_sector}</p>
//                             )}
//                             {selectedCard.enterprise_address && (
//                               <p><span className="font-medium">Adresse:</span> {selectedCard.enterprise_address}</p>
//                             )}
//                           </>
//                         ) : (
//                           <p className="text-gray-500">Aucune entreprise associée</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-col sm:items-center items pr-[90px]">
//                   {selectedCard.worker_photo_url ? (
//                     <img 
//                       src={selectedCard.worker_photo_url} 
//                       alt={`${selectedCard.worker_last_name} ${selectedCard.worker_first_name}`}
//                       className="w-32 h-32 rounded object-cover border border-gray-200 mb-4"
//                     />
//                   ) : (
//                     <div className="w-32 h-32 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 mb-4">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                     </div>
//                   )}
//                   <QRCode 
//                     value={selectedCard.card_number} 
//                     size={128}
//                     level="H"
//                   />
//                 </div>
//               </div>

//               <div className="border-t border-gray-200 pt-4">
//                 <h3 className="text-lg font-semibold mb-2 text-gray-800">Métadonnées</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <p><span className="font-medium">Date d'émission:</span> {formatDate(selectedCard.issue_date)}</p>
//                     <p><span className="font-medium">Date d'expiration:</span> {formatDate(selectedCard.expiry_date)}</p>
//                   </div>
//                   <div>
//                     <p><span className="font-medium">Bureau émetteur:</span> {selectedCard.issuing_office}</p>
//                     <p><span className="font-medium">Agent émetteur:</span> 
//                     {selectedCard.issuing_officer}
//                     <img className='w-[130px]' src="/sig1.png"/>
//                     </p>
//                   </div>
//                   <div>
//                     <p><span className="font-medium">Créé le:</span> {formatDate(selectedCard.created_at)}</p>
//                   </div>
//                 </div>
//               </div>

//               {selectedCard.notes && (
//                 <div className="mt-4 border-t border-gray-200 pt-4">
//                   <h3 className="text-lg font-semibold mb-2 text-gray-800">Notes</h3>
//                   <p className="text-gray-700 whitespace-pre-line">{selectedCard.notes}</p>
//                 </div>
//               )}

//               {/* <div className="mt-6 flex justify-end">
//                 <button
//                   onClick={() => setSelectedCard(null)}
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//                 >
//                   Fermer
//                 </button>
//               </div> */}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { itravailSupabase } from '@/lib/supabase/itravailSupabaseClient'
import LoadingSpinner from '@/components/Loader'
import QRCode from 'react-qr-code'
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'

type WorkCard = {
  id: string
  card_number: string
  worker_last_name: string
  worker_first_name: string
  worker_birth_date: string
  worker_birth_place?: string
  worker_nationality: string
  worker_passport_number: string
  worker_passport_issue_date: string
  worker_passport_expiry_date: string
  worker_photo_url?: string
  enterprise_name?: string
  enterprise_nif?: string
  enterprise_sector?: string
  enterprise_address?: string
  issue_date: string
  expiry_date: string
  issuing_office: string
  issuing_officer: string
  notes?: string
  created_at: string
}

export default function WorkCardsListPage() {
  const { user } = useAuth()
  const [workCards, setWorkCards] = useState<WorkCard[]>([])
  const [filteredCards, setFilteredCards] = useState<WorkCard[]>([])
  const [selectedCard, setSelectedCard] = useState<WorkCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchWorkCards()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCards(workCards)
    } else {
      const filtered = workCards.filter(card =>
        card.card_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.worker_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.worker_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.enterprise_name && card.enterprise_name.toLowerCase().includes(searchTerm.toLowerCase())))
      setFilteredCards(filtered)
    }
  }, [searchTerm, workCards])

  const fetchWorkCards = async () => {
    try {
      setLoading(true)
      setError('')
      
      const { data, error } = await itravailSupabase
        .from('work_cards')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setWorkCards(data || [])
      setFilteredCards(data || [])
    } catch (err) {
      console.error('Error fetching work cards:', err)
      setError('Erreur lors du chargement des cartes de travail')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }



// Function to replace lab() colors with rgb()
const replaceLabColors = (element: HTMLElement | Document) => {
  const elements = element.querySelectorAll('*') as NodeListOf<HTMLElement>
  elements.forEach((el) => {
    const styles = window.getComputedStyle(el)
      const color = styles.color
      const bgColor = styles.backgroundColor
      
      if (color.includes('lab(')) {
        el.style.color = '#333333' // Default fallback
      }
      if (bgColor.includes('lab(')) {
        el.style.backgroundColor = '#ffffff' // Default fallback
      }
    })
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-xl font-bold mb-6">Liste des Cartes de Travail</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher par numéro, nom, prénom ou entreprise..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-3.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travailleur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Émission</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <tr 
                  key={card.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedCard(card)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {card.card_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {card.worker_last_name} {card.worker_first_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {card.worker_nationality}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {card.enterprise_name || 'Non spécifiée'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(card.issue_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(card.expiry_date)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucune carte trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de détails */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div id="card-modal-content" className="bg-white scrollbar-hide rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCard.card_number}
                </h2>
                <div className="flex space-x-2">
                 
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex bg-re items-center justify-between pr-[90px] space-x-4">
                <img className='w-[90px]' src="/embleme.png" alt="Emblème"/>
                <img className='w-[130px]' src="/rdc.png" alt="RDC"/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">Informations Travailleur</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium">Nom:</span> {selectedCard.worker_last_name}</p>
                        <p><span className="font-medium">Prénom:</span> {selectedCard.worker_first_name}</p>
                        <p><span className="font-medium">Date de naissance:</span> {formatDate(selectedCard.worker_birth_date)}</p>
                        {selectedCard.worker_birth_place && (
                          <p><span className="font-medium">Lieu de naissance:</span> {selectedCard.worker_birth_place}</p>
                        )}
                        <p><span className="font-medium">Nationalité:</span> {selectedCard.worker_nationality}</p>
                        <p><span className="font-medium">Passeport:</span> {selectedCard.worker_passport_number}</p>
                        <p><span className="font-medium">Délivré le:</span> {formatDate(selectedCard.worker_passport_issue_date)}</p>
                        <p><span className="font-medium">Expire le:</span> {formatDate(selectedCard.worker_passport_expiry_date)}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">Informations Entreprise</h3>
                      <div className="space-y-2">
                        {selectedCard.enterprise_name ? (
                          <>
                            <p><span className="font-medium">Nom:</span> {selectedCard.enterprise_name}</p>
                            {selectedCard.enterprise_nif && (
                              <p><span className="font-medium">NIF:</span> {selectedCard.enterprise_nif}</p>
                            )}
                            {selectedCard.enterprise_sector && (
                              <p><span className="font-medium">Secteur:</span> {selectedCard.enterprise_sector}</p>
                            )}
                            {selectedCard.enterprise_address && (
                              <p><span className="font-medium">Adresse:</span> {selectedCard.enterprise_address}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500">Aucune entreprise associée</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-center items pr-[90px]">
                  {selectedCard.worker_photo_url ? (
                    <img 
                      src={selectedCard.worker_photo_url} 
                      alt={`${selectedCard.worker_last_name} ${selectedCard.worker_first_name}`}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mb-4"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div className="mt-4 border-2 p-2 rounded-lg border-gray-300 bg-gray">
                    <QRCode 
                      value={selectedCard.card_number} 
                      size={100}
                      level="H"
                    />
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">Scanne pour vérifier l'authenticité</p>
                  {/* <QRCode 
                    value={selectedCard.card_number} 
                    size={100}
                    level="H"
                  /> */}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Métadonnées</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p><span className="font-medium">Date d'émission:</span> {formatDate(selectedCard.issue_date)}</p>
                    <p><span className="font-medium">Date d'expiration:</span> {formatDate(selectedCard.expiry_date)}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Bureau émetteur:</span> {selectedCard.issuing_office}</p>
                    <p><span className="font-medium">Agent émetteur:</span> 
                    {selectedCard.issuing_officer}
                    <img className='w-[130px]' src="/sig1.png" alt="Signature"/>
                    </p>
                  </div>
                  <div>
                    <p><span className="font-medium">Créé le:</span> {formatDate(selectedCard.created_at)}</p>
                  </div>
                </div>
              </div>

              {selectedCard.notes && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Notes</h3>
                  <p className="text-gray-700 whitespace-pre-line">{selectedCard.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}