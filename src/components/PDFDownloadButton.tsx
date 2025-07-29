'use client'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { RendezVousPDF } from '@/components/RendezVousPDF'

export default function PDFDownloadButton({ rendezVous, filters, medecins }: any) {
  return (
    <PDFDownloadLink
      document={<RendezVousPDF 
        rendezVous={rendezVous} 
        filters={filters} 
        medecins={medecins} 
      />}
      fileName={`rendez-vous_${new Date().toISOString().split('T')[0]}.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) => (
        <button
          className={`px-4 py-2 text-white rounded-md transition-colors ${
            loading ? 'bg-green-500 cursor-wait' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Génération PDF...' : 'Télécharger PDF'}
        </button>
      )}
    </PDFDownloadLink>
  )
}