// components/RendezVousPDF.tsx
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Enregistrer les polices
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' }
  ]
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderColor: '#cccccc',
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666666'
  },
  filters: {
    fontSize: 12,
    marginBottom: 15,
    color: '#444444'
  },
  table: {
    display: 'flex',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dddddd',
    marginBottom: 20
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd'
  },
  tableColHeader: {
    width: '20%',
    padding: 8,
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: '#dddddd'
  },
  tableCol: {
    width: '20%',
    padding: 8,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: '#dddddd'
  },
  status: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 9,
    textAlign: 'center'
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: 1,
    borderTopColor: '#cccccc',
    fontSize: 10,
    textAlign: 'center',
    color: '#666666'
  }
})

interface RendezVousPDFProps {
  rendezVous: any[]
  filters: {
    medecinId: string
    dateDebut: string
    dateFin: string
    statut: string
  }
  medecins: any[]
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return format(date, 'PPpp', { locale: fr })
}

const getStatusColor = (statut: string) => {
  switch (statut) {
    case 'confirmé':
      return { backgroundColor: '#e6ffed', color: '#22863a' }
    case 'annulé':
      return { backgroundColor: '#ffeef0', color: '#cb2431' }
    case 'terminé':
      return { backgroundColor: '#f1f8ff', color: '#0366d6' }
    case 'absent':
      return { backgroundColor: '#fff5b1', color: '#735c0f' }
    default:
      return { backgroundColor: '#f6f8fa', color: '#586069' }
  }
}

export const RendezVousPDF = ({ rendezVous, filters, medecins }: RendezVousPDFProps) => {
  const getMedecinName = (id: string) => {
    if (!id) return 'Tous les médecins'
    const medecin = medecins.find(m => m.id === id)
    return medecin ? `${medecin.nom} (${medecin.specialite})` : 'Médecin inconnu'
  }

  const formatFilterDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return format(date, 'PP', { locale: fr })
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Rapport des rendez-vous</Text>
          <Text style={styles.subtitle}>
            Généré le {format(new Date(), 'PPpp', { locale: fr })}
          </Text>
          <Text style={styles.filters}>
            Filtres appliqués: {filters.medecinId ? `Médecin: ${getMedecinName(filters.medecinId)}` : ''}
            {filters.dateDebut ? ` | À partir du: ${formatFilterDate(filters.dateDebut)}` : ''}
            {filters.dateFin ? ` | Jusqu'au: ${formatFilterDate(filters.dateFin)}` : ''}
            {filters.statut ? ` | Statut: ${filters.statut}` : ''}
            {!filters.medecinId && !filters.dateDebut && !filters.dateFin && !filters.statut ? 'Aucun filtre' : ''}
          </Text>
        </View>

        <View style={styles.table}>
          {/* En-tête du tableau */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text>Date & Heure</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Médecin</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Patient</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Motif</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Statut</Text>
            </View>
          </View>

          {/* Données du tableau */}
          {rendezVous.map((rdv) => {
            const statusStyle = getStatusColor(rdv.statut)
            return (
              <View key={rdv.id} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text>{formatDateTime(rdv.date_heure)}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{rdv.medecin.nom}</Text>
                  <Text>{rdv.medecin.specialite}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{rdv.patient.nom}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{rdv.motif || 'Non spécifié'}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={{ ...styles.status, ...statusStyle }}>
                    {rdv.statut}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>

        <View style={styles.footer}>
          <Text>Total des rendez-vous: {rendezVous.length}</Text>
          <Text>Document généré par l'application médicale - {format(new Date(), 'PP', { locale: fr })}</Text>
        </View>
      </Page>
    </Document>
  )
}