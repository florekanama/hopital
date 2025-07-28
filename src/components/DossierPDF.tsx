import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer'

// Enregistrer les polices si nécessaire
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
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
    padding: 5
  },
  text: {
    fontSize: 12,
    marginBottom: 5
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: 1,
    fontSize: 10,
    textAlign: 'center'
  }
})

export const DossierPDF = ({ patient, dossier }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>DOSSIER MÉDICAL</Text>
        <Text style={styles.subtitle}>Patient: {patient.user.nom}</Text>
        <Text style={styles.text}>Date: {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations Patient</Text>
        <Text style={styles.text}>Nom: {patient.user.nom}</Text>
        {patient.date_naissance && (
          <Text style={styles.text}>
            Âge: {new Date().getFullYear() - new Date(patient.date_naissance).getFullYear()} ans
          </Text>
        )}
        {patient.groupe_sanguin && (
          <Text style={styles.text}>Groupe sanguin: {patient.groupe_sanguin}</Text>
        )}
        {patient.allergies && (
          <Text style={styles.text}>Allergies: {patient.allergies}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Symptômes</Text>
        <Text style={styles.text}>{dossier.symptomes || 'Non renseigné'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diagnostic</Text>
        <Text style={styles.text}>{dossier.diagnostic || 'Non renseigné'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Traitement</Text>
        <Text style={styles.text}>{dossier.traitement || 'Non renseigné'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Observations</Text>
        <Text style={styles.text}>{dossier.observations || 'Non renseigné'}</Text>
      </View>

      <View style={styles.footer}>
        <Text>Document généré le {new Date().toLocaleDateString()} - Confidential</Text>
      </View>
    </Page>
  </Document>
)