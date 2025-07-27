'use client'
import { FiX, FiPrinter, FiDownload } from 'react-icons/fi'
import QRCode from 'react-qr-code'
import Image from 'next/image'

type Visa = {
  id: string
  visa_number: string
  visa_type: 'single_entry' | 'multiple_entry' | 'transit' | 'official'
  issuing_country: string
  last_name: string
  first_name: string
  birth_date: string
  birth_place: string
  issuing_place: string
  nationality: string
  passport_number: string
  passport_issue_date: string
  visa_category: 'tourist' | 'work' | 'student' | 'transit'
  expiration_date: string
  duration_of_stay: string
  genre: 'Masculin' | 'Féminin'
  photo_url: string | null
  created_at: string
  created_by?: string
  validate?: boolean // Optionnel si vous utilisez cette propriété
}

type VisaDetailModalProps = {
  visa: Visa
  isOpen: boolean
  onClose: () => void
}

const VisaDetailModal = ({ visa, isOpen, onClose }: VisaDetailModalProps) => {
  if (!isOpen || !visa) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const getVisaTypeLabel = (type: string) => {
    switch(type) {
      case 'single_entry': return 'Entrée simple'
      case 'multiple_entry': return 'Multiples entrées'
      case 'transit': return 'Transit'
      case 'official': return 'Officiel/Diplomatique'
      default: return type
    }
  }

  const getVisaCategoryLabel = (category: string) => {
    switch(category) {
      case 'tourist': return 'Touristique'
      case 'work': return 'Travail'
      case 'student': return 'Étudiant'
      case 'transit': return 'Transit'
      default: return category
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center backdrop-blur-lg justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-S BGBA " onClick={onClose}></div>
        </div>

        {/* Modal container */}
        <div className="inline-block align-bottom w-[90%] bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className=''>
<img className='w-[130px]' src="/rdc.png"/>

                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Visa #{visa.visa_number}
                </h3>
                <p className="text-sm text-gray-500">
                  Créé le {formatDate(visa.created_at)}
                </p>
              </div>
              <div className="flex space-x-3">
                <button className="p-1 text-gray-400 hover:text-gray-500">
                  <FiPrinter className="h-5 w-5" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-500">
                  <FiDownload className="h-5 w-5" />
                </button>
                <button 
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>
              {/* <div className="flex bg-re items-center justify-between   ">
                  <img className='w-[130px]' src="/rdc.png"/>
                  <img className='w-[90px] hidden' src="/embleme.png"/>
                </div> */}
            {/* Content */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left column */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Informations personnelles</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nom</p>
                      <p className="text-base font-medium">{visa.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prénom</p>
                      <p className="text-base font-medium">{visa.first_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date de naissance</p>
                      <p className="text-base font-medium">{formatDate(visa.birth_date)}</p>
                    </div>
                    <div>
                    <p className="text-sm text-gray-500">Lieu de naissance</p>
                    <p className="text-base font-medium">{visa.birth_place}</p>
                    </div>
                      <div>
                      <p className="text-sm text-gray-500">Genre</p>
                      <p className="text-base font-medium">{visa.genre}</p>
                      </div>
                    <div>
                      <p className="text-sm text-gray-500">Nationalité</p>
                      <p className="text-base font-medium">{visa.nationality}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Informations passeport</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Numéro de passeport</p>
                      <p className="text-base font-medium">{visa.passport_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date de délivrance</p>
                      <p className="text-base font-medium">{formatDate(visa.passport_issue_date)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Détails du visa</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Type de visa</p>
                      <p className="text-base font-medium">{getVisaTypeLabel(visa.visa_type)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Catégorie</p>
                      <p className="text-base font-medium">{getVisaCategoryLabel(visa.visa_category)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pays émetteur</p>
                      <p className="text-base font-medium">{visa.issuing_country}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lieu de délivrance</p>
                      <p className="text-base font-medium">{visa.issuing_place}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date d'expiration</p>
                      <p className="text-base font-medium">{formatDate(visa.expiration_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Durée de séjour</p>
                      <p className="text-base font-medium">{visa.duration_of_stay} jours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Photo</h4>
                  {visa.photo_url ? (
                    <div className="w-full h-48 bg-gray-100 rounded-md overflow-hidden relative">
                      <Image
                        src={visa.photo_url}
                        alt={`${visa.last_name} ${visa.first_name}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                      Photo non disponible
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Code de vérification</h4>
                  <div className="flex justify-center p-4 bg-white rounded-md border border-gray-200">
                    <QRCode 
                      value={visa.visa_number} 
                      size={128}
                    />
                  </div>
                  <p className="mt-2 text-xs text-center text-gray-500">
                    Scanner ce code pour vérifier l'authenticité du visa
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {/* <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Fermer
            </button> */}
            <p className='text-sm text-gray-500 italic text-center'>Visa Octoyer par L'ambassade de la République Démocratique du Congo à {visa.issuing_place} </p>
            <div>

            <img src='/sig2.png' className='w-[100px] mx-auto' />
            <p className='font-bold text-center'> Peter John </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisaDetailModal