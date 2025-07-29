
// 'use client'
// import { useState, useEffect } from 'react'
// import { supabase } from '@/lib/supabase/client'
// import { 
//   BarChart, 
//   PieChart, 
//   Bar,
//   Pie,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
//   AreaChart,
//   Area
// } from 'recharts'
// import { useAuth } from '@/context/AuthContext'
// import Loader from '@/components/Loader'
// import { CalendarDays, Stethoscope, UserRound, Users } from 'lucide-react'

// const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6']

// export default function Statistiques() {
//   const { user } = useAuth()
//   const [loading, setLoading] = useState(true)
//   const [stats, setStats] = useState<any>(null)

//   useEffect(() => {
//     if (!user) return

//     const fetchStats = async () => {
//       try {
//         setLoading(true)
        
//         // Récupérer toutes les stats en une seule requête
//         const { data: rdvData } = await supabase
//           .from('rendez_vous')
//           .select('*')

//         const { data: medecinsData } = await supabase
//           .from('medecin_infos')
//           .select('id, specialite_id, user:users(nom)')

//         const { data: patientsData } = await supabase
//           .from('patient_infos')
//           .select('id, user:users(nom)')

//         const { data: specialitesData } = await supabase
//           .from('specialites')
//           .select('id, nom')

//         // Traitement des données
//         const rdvParMois = processRdvParMois(rdvData || [])
//         const rdvParStatut = processRdvParStatut(rdvData || [])
//         const rdvParSpecialite = processRdvParSpecialite(rdvData || [], medecinsData || [], specialitesData || [])
//         const tauxPresence = processTauxPresence(rdvData || [])
//         const patientsActifs = processPatientsActifs(rdvData || [], patientsData || [])
//         const medecinsActifs = processMedecinsActifs(rdvData || [], medecinsData || [])
//         const evolutionPresence = processEvolutionPresence(rdvData || [])

//         setStats({
//           rdvParMois,
//           rdvParStatut,
//           rdvParSpecialite,
//           tauxPresence,
//           patientsActifs,
//           medecinsActifs,
//           evolutionPresence,
//           totalRdv: rdvData?.length || 0,
//           totalMedecins: medecinsData?.length || 0,
//           totalPatients: patientsData?.length || 0
//         })

//       } catch (error) {
//         console.error('Erreur:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchStats()
//   }, [user])

//   // Fonctions de traitement des données
//   const processRdvParMois = (rdvs: any[]) => {
//     const moisMap = new Map()
//     rdvs.forEach(rdv => {
//       const date = new Date(rdv.date_heure)
//       const mois = date.toLocaleString('fr-FR', { month: 'short', year: 'numeric' })
//       moisMap.set(mois, (moisMap.get(mois) || 0) + 1)
//     })
//     return Array.from(moisMap.entries()).map(([name, count]) => ({ name, count }))
//   }

//   const processRdvParStatut = (rdvs: any[]) => {
//     const statutMap = new Map()
//     rdvs.forEach(rdv => {
//       statutMap.set(rdv.statut, (statutMap.get(rdv.statut) || 0) + 1)
//     })
//     return Array.from(statutMap.entries()).map(([name, value]) => ({ name, value }))
//   }

//   const processRdvParSpecialite = (rdvs: any[], medecins: any[], specialites: any[]) => {
//     const medecinSpecialiteMap = new Map(medecins.map(m => [m.id, m.specialite_id]))
//     const specialiteNomMap = new Map(specialites.map(s => [s.id, s.nom]))
    
//     const specialiteMap = new Map()
//     rdvs.forEach(rdv => {
//       const specialiteId = medecinSpecialiteMap.get(rdv.medecin_id)
//       if (specialiteId) {
//         const nom = specialiteNomMap.get(specialiteId) || 'Inconnue'
//         specialiteMap.set(nom, (specialiteMap.get(nom) || 0) + 1)
//       }
//     })
//     return Array.from(specialiteMap.entries()).map(([name, value]) => ({ name, value }))
//   }

//   const processTauxPresence = (rdvs: any[]) => {
//     const termineRdvs = rdvs.filter(rdv => rdv.statut === 'terminé')
//     const presentCount = termineRdvs.filter(rdv => rdv.present).length
//     return [
//       { name: 'Présents', value: presentCount },
//       { name: 'Absents', value: termineRdvs.length - presentCount }
//     ]
//   }

//   const processEvolutionPresence = (rdvs: any[]) => {
//     const termineRdvs = rdvs.filter(rdv => rdv.statut === 'terminé')
//     const moisMap = new Map()
    
//     termineRdvs.forEach(rdv => {
//       const date = new Date(rdv.date_heure)
//       const mois = date.toLocaleString('fr-FR', { month: 'short', year: 'numeric' })
      
//       if (!moisMap.has(mois)) {
//         moisMap.set(mois, { present: 0, absent: 0 })
//       }
      
//       if (rdv.present) {
//         moisMap.get(mois).present++
//       } else {
//         moisMap.get(mois).absent++
//       }
//     })
    
//     return Array.from(moisMap.entries()).map(([name, {present, absent}]) => ({
//       name,
//       présent: present,
//       absent: absent
//     }))
//   }

//   const processPatientsActifs = (rdvs: any[], patients: any[]) => {
//     const patientCountMap = new Map()
//     rdvs.forEach(rdv => {
//       patientCountMap.set(rdv.patient_id, (patientCountMap.get(rdv.patient_id) || 0) + 1)
//     })
    
//     return Array.from(patientCountMap.entries())
//       .map(([id, count]) => ({
//         id,
//         nom: patients.find(p => p.id === id)?.user?.nom || 'Inconnu',
//         count
//       }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5)
//   }

//   const processMedecinsActifs = (rdvs: any[], medecins: any[]) => {
//     const medecinCountMap = new Map()
//     rdvs.forEach(rdv => {
//       medecinCountMap.set(rdv.medecin_id, (medecinCountMap.get(rdv.medecin_id) || 0) + 1)
//     })
    
//     return Array.from(medecinCountMap.entries())
//       .map(([id, count]) => ({
//         id,
//         nom: medecins.find(m => m.id === id)?.user?.nom || 'Inconnu',
//         count
//       }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5)
//   }

//   if (loading) return <Loader />

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Tableau de Bord Statistique</h1>
        
//         {/* Cartes de résumé */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//           <SummaryCard 
//             title="Total Rendez-vous" 
//             value={stats?.totalRdv || 0} 
//             icon={<CalendarDays className="w-5 h-5" />}
//           />
//           <SummaryCard 
//             title="Médecins" 
//             value={stats?.totalMedecins || 0} 
//             icon={<Stethoscope className="w-5 h-5" />}
//           />
//           <SummaryCard 
//             title="Patients" 
//             value={stats?.totalPatients || 0} 
//             icon={<Users className="w-5 h-5" />}
//           />
//         </div>

//         {/* Visualisations */}
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <ChartSection title="Rendez-vous par mois">
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={stats?.rdvParMois}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                     <YAxis tick={{ fontSize: 12 }} />
//                     <Tooltip />
//                     <Area 
//                       type="monotone" 
//                       dataKey="count" 
//                       stroke="#3b82f6" 
//                       fill="#93c5fd" 
//                       name="Nombre de RDV" 
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             </ChartSection>

//             <ChartSection title="Répartition par statut">
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={stats?.rdvParStatut}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       outerRadius={80}
//                       dataKey="value"
//                       nameKey="name"
//                       label={({ name, percent = 0}) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {stats?.rdvParStatut.map((entry: any, index: number) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend layout="vertical" align="right" verticalAlign="middle" />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </ChartSection>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <ChartSection title="Taux de présence">
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={stats?.tauxPresence}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       outerRadius={80}
//                       dataKey="value"
//                       nameKey="name"
//                       label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {stats?.tauxPresence.map((entry: any, index: number) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </ChartSection>

//             <ChartSection title="Évolution des présences">
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={stats?.evolutionPresence}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                     <YAxis tick={{ fontSize: 12 }} />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="présent" fill="#10b981" name="Présents" radius={[4, 4, 0, 0]} />
//                     <Bar dataKey="absent" fill="#ef4444" name="Absents" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </ChartSection>
//           </div>

//           <ChartSection title="Rendez-vous par spécialité">
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={stats?.rdvParSpecialite}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip />
//                   <Bar 
//                     dataKey="value" 
//                     fill="#8b5cf6" 
//                     name="Nombre de RDV" 
//                     radius={[4, 4, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </ChartSection>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <ChartSection title="Top 5 patients actifs">
//               <div className="space-y-3">
//                 {stats?.patientsActifs.map((patient: any, index: number) => (
//                   <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div className="flex items-center space-x-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
//                         <UserRound className="w-4 h-4" />
//                       </div>
//                       <span className="font-medium text-gray-800">{patient.nom}</span>
//                     </div>
//                     <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
//                       {patient.count} RDV
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </ChartSection>

//             <ChartSection title="Top 5 médecins actifs">
//               <div className="space-y-3">
//                 {stats?.medecinsActifs.map((medecin: any, index: number) => (
//                   <div key={medecin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div className="flex items-center space-x-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
//                         <Stethoscope className="w-4 h-4" />
//                       </div>
//                       <span className="font-medium text-gray-800">{medecin.nom}</span>
//                     </div>
//                     <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
//                       {medecin.count} RDV
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </ChartSection>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Composants utilitaires
// function ChartSection({ title, children }: { title: string; children: React.ReactNode }) {
//   return (
//     <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
//       <h2 className="text-lg font-semibold mb-3 text-gray-800">{title}</h2>
//       {children}
//     </div>
//   )
// }

// function SummaryCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
//   return (
//     <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-500">{title}</p>
//           <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
//         </div>
//         <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
//           {icon}
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { 
  BarChart, 
  PieChart, 
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import { useAuth } from '@/context/AuthContext'
import Loader from '@/components/Loader'
import { 
  CalendarDays, 
  Stethoscope, 
  UserRound, 
  Users, 
  CheckCircle2, 
  XCircle,
  ClipboardList,
  Activity
} from 'lucide-react'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6']

export default function Statistiques() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (!user) return

    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Récupération des données
        const { data: rdvData } = await supabase
          .from('rendez_vous')
          .select('*')

        const { data: medecinsData } = await supabase
          .from('medecin_infos')
          .select('id, specialite_id, user:users(nom)')

        const { data: patientsData } = await supabase
          .from('patient_infos')
          .select('id, user:users(nom)')

        const { data: specialitesData } = await supabase
          .from('specialites')
          .select('id, nom')

        // Traitement des données
        const termineRdvs = rdvData?.filter(rdv => rdv.statut === 'terminé') || []
        const presentCount = termineRdvs.filter(rdv => rdv.present).length
        const tauxPresence = (presentCount / (termineRdvs.length || 1)) * 100

        setStats({
          rdvParMois: processRdvParMois(rdvData || []),
          rdvParStatut: processRdvParStatut(rdvData || []),
          rdvParSpecialite: processRdvParSpecialite(rdvData || [], medecinsData || [], specialitesData || []),
          statsPresence: processStatsPresence(rdvData || []),
          evolutionPresence: processEvolutionPresence(rdvData || []),
          patientsActifs: processPatientsActifs(rdvData || [], patientsData || []),
          medecinsActifs: processMedecinsActifs(rdvData || [], medecinsData || []),
          totalRdv: rdvData?.length || 0,
          totalMedecins: medecinsData?.length || 0,
          totalPatients: patientsData?.length || 0,
          totalTermines: termineRdvs.length,
          totalPresents: presentCount,
          totalAbsents: termineRdvs.length - presentCount,
          tauxPresence
        })

      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user])

  // Fonctions de traitement des données
  const processRdvParMois = (rdvs: any[]) => {
    const moisMap = new Map()
    rdvs.forEach(rdv => {
      const date = new Date(rdv.date_heure)
      const mois = date.toLocaleString('fr-FR', { month: 'short', year: 'numeric' })
      moisMap.set(mois, (moisMap.get(mois) || 0) + 1)
    })
    return Array.from(moisMap.entries()).map(([name, count]) => ({ name, count }))
  }

  const processRdvParStatut = (rdvs: any[]) => {
    const statutMap = new Map()
    rdvs.forEach(rdv => {
      statutMap.set(rdv.statut, (statutMap.get(rdv.statut) || 0) + 1)
    })
    return Array.from(statutMap.entries()).map(([name, value]) => ({ name, value }))
  }

  const processRdvParSpecialite = (rdvs: any[], medecins: any[], specialites: any[]) => {
    const medecinSpecialiteMap = new Map(medecins.map(m => [m.id, m.specialite_id]))
    const specialiteNomMap = new Map(specialites.map(s => [s.id, s.nom]))
    
    const specialiteMap = new Map()
    rdvs.forEach(rdv => {
      const specialiteId = medecinSpecialiteMap.get(rdv.medecin_id)
      if (specialiteId) {
        const nom = specialiteNomMap.get(specialiteId) || 'Inconnue'
        specialiteMap.set(nom, (specialiteMap.get(nom) || 0) + 1)
      }
    })
    return Array.from(specialiteMap.entries()).map(([name, value]) => ({ name, value }))
  }

  const processStatsPresence = (rdvs: any[]) => {
    const termineRdvs = rdvs.filter(rdv => rdv.statut === 'terminé')
    const presentCount = termineRdvs.filter(rdv => rdv.present).length
    return [
      { name: 'Présents', value: presentCount },
      { name: 'Absents', value: termineRdvs.length - presentCount }
    ]
  }

  const processEvolutionPresence = (rdvs: any[]) => {
    const termineRdvs = rdvs.filter(rdv => rdv.statut === 'terminé')
    const moisMap = new Map()
    
    termineRdvs.forEach(rdv => {
      const date = new Date(rdv.date_heure)
      const mois = date.toLocaleString('fr-FR', { month: 'short', year: 'numeric' })
      
      if (!moisMap.has(mois)) {
        moisMap.set(mois, { present: 0, absent: 0 })
      }
      
      if (rdv.present) {
        moisMap.get(mois).present++
      } else {
        moisMap.get(mois).absent++
      }
    })
    
    return Array.from(moisMap.entries()).map(([name, {present, absent}]) => ({
      name,
      Présents: present,
      Absents: absent,
      Taux: present / (present + absent || 1) * 100
    }))
  }

  const processPatientsActifs = (rdvs: any[], patients: any[]) => {
    const patientCountMap = new Map()
    rdvs.forEach(rdv => {
      patientCountMap.set(rdv.patient_id, (patientCountMap.get(rdv.patient_id) || 0) + 1)
    })
    
    return Array.from(patientCountMap.entries())
      .map(([id, count]) => ({
        id,
        nom: patients.find(p => p.id === id)?.user?.nom || 'Inconnu',
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const processMedecinsActifs = (rdvs: any[], medecins: any[]) => {
    const medecinCountMap = new Map()
    rdvs.forEach(rdv => {
      medecinCountMap.set(rdv.medecin_id, (medecinCountMap.get(rdv.medecin_id) || 0) + 1)
    })
    
    return Array.from(medecinCountMap.entries())
      .map(([id, count]) => ({
        id,
        nom: medecins.find(m => m.id === id)?.user?.nom || 'Inconnu',
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Tableau de Bord Statistique</h1>
        
        {/* Cartes de résumé */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard 
            title="Total Rendez-vous" 
            value={stats?.totalRdv || 0} 
            icon={<CalendarDays className="w-5 h-5" />}
          />
          <SummaryCard 
            title="Médecins" 
            value={stats?.totalMedecins || 0} 
            icon={<Stethoscope className="w-5 h-5" />}
          />
          <SummaryCard 
            title="Patients" 
            value={stats?.totalPatients || 0} 
            icon={<Users className="w-5 h-5" />}
          />
          <SummaryCard 
            title="Taux de présence" 
            value={`${stats?.tauxPresence?.toFixed(1) || 0}%`} 
            icon={<Activity className="w-5 h-5" />}
            color={stats?.tauxPresence > 70 ? 'text-green-600' : stats?.tauxPresence > 50 ? 'text-amber-600' : 'text-red-600'}
          />
        </div>

        {/* Section Présence */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5" /> Statistiques de Présence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <PresenceCard 
              title="Rendez-vous terminés"
              value={stats?.totalTermines || 0}
              icon={<CheckCircle2 className="w-5 h-5" />}
            />
            <PresenceCard 
              title="Patients présents"
              value={stats?.totalPresents || 0}
              icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
              variant="success"
            />
            <PresenceCard 
              title="Patients absents"
              value={stats?.totalAbsents || 0}
              icon={<XCircle className="w-5 h-5 text-red-600" />}
              variant="danger"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSection title="Répartition présence/absence">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.statsPresence}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent =0  }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartSection>

            <ChartSection title="Évolution du taux de présence">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.evolutionPresence}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value: number, name: string) => 
                        name === 'Taux' ? [`${value.toFixed(1)}%`, 'Taux de présence'] : [value, name]
                      }
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="Taux" 
                      stroke="#3b82f6" 
                      fill="#93c5fd"
                      name="Taux de présence"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartSection>
          </div>
        </div>

        {/* Autres statistiques */}
        <div className="space-y-6">
          <ChartSection title="Rendez-vous par mois">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.rdvParMois}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    fill="#8b5cf6" 
                    name="Nombre de RDV"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSection title="Répartition par statut">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.rdvParStatut}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent =0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats?.rdvParStatut.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartSection>

            <ChartSection title="Rendez-vous par spécialité">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.rdvParSpecialite}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="value" 
                      fill="#10b981" 
                      name="Nombre de RDV"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartSection>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSection title="Top 5 patients actifs">
              <div className="space-y-3">
                {stats?.patientsActifs.map((patient: any, index: number) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                        <UserRound className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-800">{patient.nom}</span>
                    </div>
                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                      {patient.count} RDV
                    </span>
                  </div>
                ))}
              </div>
            </ChartSection>

            <ChartSection title="Top 5 médecins actifs">
              <div className="space-y-3">
                {stats?.medecinsActifs.map((medecin: any, index: number) => (
                  <div key={medecin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-800">{medecin.nom}</span>
                    </div>
                    <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                      {medecin.count} RDV
                    </span>
                  </div>
                ))}
              </div>
            </ChartSection>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composants utilitaires
function ChartSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">{title}</h2>
      {children}
    </div>
  )
}

function SummaryCard({ 
  title, 
  value, 
  icon,
  color = 'text-gray-900'
}: { 
  title: string
  value: number | string
  icon: React.ReactNode
  color?: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  )
}

function PresenceCard({ 
  title, 
  value, 
  icon, 
  variant = 'default' 
}: { 
  title: string
  value: number | string
  icon: React.ReactNode
  variant?: 'default' | 'success' | 'danger'
}) {
  const variantClasses = {
    default: 'bg-white border-gray-200 text-gray-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    danger: 'bg-red-50 border-red-200 text-red-900'
  }

  const iconClasses = {
    default: 'bg-white text-gray-600',
    success: 'bg-green-100 text-green-600',
    danger: 'bg-red-100 text-red-600'
  }

  return (
    <div className={`rounded-lg border p-4 ${variantClasses[variant]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${iconClasses[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}