
// 'use client'
// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { useRouter } from 'next/navigation'
// import { toast } from 'react-toastify'
// import { supabase } from '@/lib/supabase/client'
// import { fr } from 'date-fns/locale'
// import { format, addMinutes, isBefore, isAfter, parseISO, isSameDay, eachDayOfInterval, startOfMonth, endOfMonth, isSameMonth, isToday } from 'date-fns'
// import { DayPicker } from 'react-day-picker'
// import 'react-day-picker/dist/style.css'
// import MesRendezVous from '@/app/patient/mes-rendez-vous/page'

// const LIEUX_CONSULTATION = [
//   'Cabinet privé',
//   'Clinique',
//   'Hôpital',
//   'Domicile du patient',
//   'Téléconsultation',
//   'Autre'
// ]

// const PrendreRendezVous = () => {
//   const { user, loading: authLoading } = useAuth()
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [medecins, setMedecins] = useState<any[]>([])
//   const [specialites, setSpecialites] = useState<any[]>([])
//   const [selectedMedecin, setSelectedMedecin] = useState<string>('')
//   const [selectedSpecialite, setSelectedSpecialite] = useState<string>('')
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null)
//   const [creneauxDisponibles, setCreneauxDisponibles] = useState<any[]>([])
//   const [selectedCreneau, setSelectedCreneau] = useState<string | null>(null)
//   const [rendezVousExistants, setRendezVousExistants] = useState<any[]>([])
//   const [disponibilitesMedecin, setDisponibilitesMedecin] = useState<any[]>([])
//   const [congesMedecin, setCongesMedecin] = useState<any[]>([])
//   const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
//   const [formData, setFormData] = useState({
//     motif: '',
//     notes: '',
//     lieu: 'Cabinet privé',
//     autre_lieu: ''
//   })
//   const [hasExistingAppointment, setHasExistingAppointment] = useState(false)

//   // Écouter les changements de rendez-vous en temps réel
//   useEffect(() => {
//     if (!selectedMedecin) return

//     const channel = supabase
//       .channel('rendez_vous_changes')
//       .on(
//         'postgres_changes',
//         {
//           event: '*',
//           schema: 'public',
//           table: 'rendez_vous',
//           filter: `medecin_id=eq.${selectedMedecin}`
//         },
//         (payload) => {
//           fetchRendezVousExistants()
//           checkExistingAppointment()
//         }
//       )
//       .subscribe()

//     return () => {
//       supabase.removeChannel(channel)
//     }
//   }, [selectedMedecin, selectedDate, user])

//   // Vérifier si le patient a déjà un RDV ce jour
//   const checkExistingAppointment = async () => {
//     if (!user || !selectedMedecin || !selectedDate) return

//     try {
//       const { data: patientData } = await supabase
//         .from('patient_infos')
//         .select('id')
//         .eq('user_id', user.id)
//         .single()

//       if (patientData) {
//         const startOfDay = new Date(selectedDate)
//         startOfDay.setHours(0, 0, 0, 0)
        
//         const endOfDay = new Date(selectedDate)
//         endOfDay.setHours(23, 59, 59, 999)

//         const { data: existingRdv } = await supabase
//           .from('rendez_vous')
//           .select('id')
//           .eq('medecin_id', selectedMedecin)
//           .eq('patient_id', patientData.id)
//           .gte('date_heure', startOfDay.toISOString())
//           .lte('date_heure', endOfDay.toISOString())
//           .neq('statut', 'annulé')
//           setHasExistingAppointment(!!(existingRdv && existingRdv.length > 0))

//         // setHasExistingAppointment(existingRdv && existingRdv.length > 0)
//       }
//     } catch (error) {
//       console.error("Erreur vérification RDV existant:", error)
//     }
//   }

//   // Fonction pour récupérer les rendez-vous existants
//   const fetchRendezVousExistants = async () => {
//     try {
//       const { data: rendezVousData, error: rdvError } = await supabase
//         .from('rendez_vous')
//         .select('date_heure, duree_minutes, lieu')
//         .eq('medecin_id', selectedMedecin)
//         .gte('date_heure', new Date().toISOString())
//         .neq('statut', 'annulé')

//       if (rdvError) throw rdvError
//       setRendezVousExistants(rendezVousData || [])
      
//       if (selectedDate) {
//         calculerCreneauxDisponibles()
//       }
//     } catch (error: any) {
//       console.error('Erreur:', error)
//       toast.error(`Erreur lors du chargement: ${error.message}`)
//     }
//   }

//   // Récupérer les médecins et spécialités
//   useEffect(() => {
//     if (authLoading) return

//     if (!user) {
//       router.push('/login')
//       return
//     }

//     const fetchData = async () => {
//       try {
//         setLoading(true)
        
//         // Récupérer les spécialités
//         const { data: specialitesData, error: specialitesError } = await supabase
//           .from('specialites')
//           .select('*')

//         if (specialitesError) throw specialitesError
//         setSpecialites(specialitesData || [])

//         // Récupérer tous les médecins avec leurs infos
//         const { data: medecinsData, error: medecinsError } = await supabase
//           .from('medecin_infos')
//           .select(`
//             *,
//             user:users(nom, email, profil_url),
//             specialite:specialites(nom),
//             langues:medecin_langues(langue:langues(nom)),
//             disponibilites_medecin(*)
//           `)
//           .eq('user.statut', true)

//         if (medecinsError) throw medecinsError
//         setMedecins(medecinsData || [])

//       } catch (error: any) {
//         console.error('Erreur lors du chargement:', error)
//         toast.error(`Erreur: ${error.message}`)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [user, authLoading, router])

//   // Filtrer les médecins par spécialité
//   const filteredMedecins = selectedSpecialite 
//     ? medecins.filter(m => m.specialite_id === parseInt(selectedSpecialite))
//     : medecins

//   // Récupérer les disponibilités et congés
//   useEffect(() => {
//     if (!selectedMedecin) return

//     const fetchDisponibilitesEtRendezVous = async () => {
//       try {
//         setLoading(true)
//         setSelectedDate(null)
//         setCreneauxDisponibles([])
        
//         // Récupérer les disponibilités du médecin
//         const medecin = medecins.find(m => m.id === selectedMedecin)
//         if (medecin) {
//           setDisponibilitesMedecin(medecin.disponibilites_medecin || [])
//         }

//         await fetchRendezVousExistants()

//         // Récupérer les congés du médecin
//         const { data: congesData, error: congesError } = await supabase
//           .from('conges_medecin')
//           .select('*')
//           .eq('medecin_id', selectedMedecin)
//           .gte('date_fin', new Date().toISOString())

//         if (congesError) throw congesError
//         setCongesMedecin(congesData || [])

//       } catch (error: any) {
//         console.error('Erreur:', error)
//         toast.error(`Erreur lors du chargement: ${error.message}`)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchDisponibilitesEtRendezVous()
//   }, [selectedMedecin, medecins])

//   // Calculer les créneaux disponibles
//   const calculerCreneauxDisponibles = () => {
//     setLoading(true);
    
//     try {
//       if (!selectedDate || !selectedMedecin) {
//         setCreneauxDisponibles([]);
//         return;
//       }

//       // 1. Vérifier si le médecin est en congé ce jour
//       const estEnConge = congesMedecin.some(conge => {
//         const debut = new Date(conge.date_debut);
//         const fin = new Date(conge.date_fin);
//         return isSameDay(selectedDate, debut) || 
//                isSameDay(selectedDate, fin) ||
//                (selectedDate > debut && selectedDate < fin);
//       });

//       if (estEnConge) {
//         toast.info("Le médecin est en congé ce jour");
//         setCreneauxDisponibles([]);
//         return;
//       }

//       // 2. Trouver les disponibilités pour ce jour
//       const jourSemaine = selectedDate.getDay() || 7; // 0=dimanche -> 7=dimanche
//       const disposJour = disponibilitesMedecin.filter(d => 
//         d.jour_semaine === jourSemaine && d.actif
//       );

//       if (disposJour.length === 0) {
//         setCreneauxDisponibles([]);
//         return;
//       }

//       // 3. Générer tous les créneaux possibles
//       const tousCreneaux = disposJour.flatMap(dispo => {
//         const creneaux: any[] = [];
//         const dureeRdv = 30; // minutes
        
//         let debut = new Date(selectedDate);
//         const [heuresD, minutesD] = dispo.heure_debut.split(':').map(Number);
//         debut.setHours(heuresD, minutesD, 0, 0);

//         const fin = new Date(selectedDate);
//         const [heuresF, minutesF] = dispo.heure_fin.split(':').map(Number);
//         fin.setHours(heuresF, minutesF, 0, 0);

//         while (debut < fin) {
//           const finCreneau = new Date(debut.getTime() + dureeRdv * 60000);
          
//           if (finCreneau <= fin) {
//             creneaux.push({
//               debut: new Date(debut),
//               fin: finCreneau,
//               lieu: dispo.lieu,
//               disponible: true
//             });
//           }
//           debut = finCreneau;
//         }

//         return creneaux;
//       });

//       // 4. Filtrer les créneaux réservés
//       const creneauxDisponibles = tousCreneaux.filter(creneau => {
//         return !rendezVousExistants.some(rdv => {
//           const rdvDebut = new Date(rdv.date_heure);
//           const rdvFin = new Date(rdvDebut.getTime() + rdv.duree_minutes * 60000);
          
//           return (
//             (creneau.debut >= rdvDebut && creneau.debut < rdvFin) ||
//             (creneau.fin > rdvDebut && creneau.fin <= rdvFin) ||
//             (creneau.debut <= rdvDebut && creneau.fin >= rdvFin)
//           );
//         });
//       });

//       setCreneauxDisponibles(creneauxDisponibles.sort((a, b) => a.debut - b.debut));

//     } catch (error) {
//       console.error("Erreur calcul créneaux:", error);
//       toast.error("Erreur lors du calcul des créneaux");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!selectedDate || !selectedMedecin) return
//     calculerCreneauxDisponibles()
//     checkExistingAppointment()
//   }, [selectedDate, selectedMedecin, rendezVousExistants, disponibilitesMedecin, congesMedecin])

//   // Jours avec disponibilité
//   const getJoursAvecDisponibilite = () => {
//     if (!selectedMedecin || disponibilitesMedecin.length === 0) return []

//     const jours = eachDayOfInterval({
//       start: startOfMonth(currentMonth),
//       end: endOfMonth(currentMonth)
//     })

//     return jours.filter(jour => {
//       const jourSemaine = jour.getDay() || 7
//       return disponibilitesMedecin.some((d: any) => d.jour_semaine === jourSemaine && d.actif)
//     })
//   }

//   // Jours de congé
//   const getJoursDeConge = () => {
//     if (!selectedMedecin || congesMedecin.length === 0) return []

//     const jours = eachDayOfInterval({
//       start: startOfMonth(currentMonth),
//       end: endOfMonth(currentMonth)
//     })

//     return jours.filter(jour => {
//       return congesMedecin.some(conge => {
//         const dateDebut = new Date(conge.date_debut)
//         const dateFin = new Date(conge.date_fin)
//         return jour >= dateDebut && jour <= dateFin
//       })
//     })
//   }

//   const joursDisponibles = getJoursAvecDisponibilite()
//   const joursConge = getJoursDeConge()

//   const modifiers = {
//     disponible: joursDisponibles,
//     conge: joursConge,
//     today: isToday,
//     selected: selectedDate ? [selectedDate] : []
//   }

//   const modifiersStyles = {
//     disponible: {
//       border: '2px solid #10B981',
//       backgroundColor: '#ECFDF5'
//     },
//     conge: {
//       backgroundColor: '#FEE2E2',
//       color: '#DC2626',
//       textDecoration: 'line-through'
//     },
//     today: {
//       fontWeight: 'bold',
//       color: '#3B82F6'
//     },
//     selected: {
//       backgroundColor: '#3B82F6',
//       color: 'white'
//     }
//   }

//   const handleMonthChange = (date: Date) => {
//     setCurrentMonth(date)
//   }

//   const handleDayClick = (date: Date) => {
//     if (hasExistingAppointment) {
//       toast.warning('Vous avez déjà un rendez-vous avec ce médecin aujourd\'hui')
//       return
//     }

//     const estEnConge = congesMedecin.some(conge => {
//       const dateDebut = new Date(conge.date_debut)
//       const dateFin = new Date(conge.date_fin)
//       return date >= dateDebut && date <= dateFin
//     })

//     if (estEnConge) {
//       toast.info('Le médecin est en congé ce jour')
//       return
//     }

//     const jourSemaine = date.getDay() || 7
//     const hasDispo = disponibilitesMedecin.some((d: any) => d.jour_semaine === jourSemaine && d.actif)
    
//     if (hasDispo) {
//       setSelectedDate(date)
//     } else {
//       toast.info('Le médecin n\'a pas de disponibilité ce jour')
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setSubmitting(true)

//     try {
//       if (!user || !selectedMedecin || !selectedCreneau || !selectedDate) {
//         toast.error('Veuillez compléter toutes les informations')
//         return
//       }

//       // Vérifier le profil patient
//       const { data: patientData, error: patientError } = await supabase
//         .from('patient_infos')
//         .select('id')
//         .eq('user_id', user.id)
//         .single()

//       if (patientError || !patientData) {
//         throw new Error('Veuillez compléter votre profil patient avant de prendre rendez-vous')
//       }

//       // Vérifier si le patient a déjà un RDV ce jour avec ce médecin
//       const startOfDay = new Date(selectedDate)
//       startOfDay.setHours(0, 0, 0, 0)
      
//       const endOfDay = new Date(selectedDate)
//       endOfDay.setHours(23, 59, 59, 999)

//       const { data: existingRdv, error: rdvError } = await supabase
//         .from('rendez_vous')
//         .select('id')
//         .eq('medecin_id', selectedMedecin)
//         .eq('patient_id', patientData.id)
//         .gte('date_heure', startOfDay.toISOString())
//         .lte('date_heure', endOfDay.toISOString())
//         .neq('statut', 'annulé')

//       if (rdvError) throw rdvError
//       if (existingRdv && existingRdv.length > 0) {
//         throw new Error('Vous avez déjà un rendez-vous avec ce médecin aujourd\'hui')
//       }

//       // Vérifier que le créneau est toujours disponible
//       const creneau = creneauxDisponibles.find(c => c.debut.toISOString() === selectedCreneau)
//       if (!creneau || !creneau.disponible) {
//         throw new Error('Ce créneau n\'est plus disponible. Veuillez en choisir un autre.')
//       }

//       // Créer le rendez-vous
//       const { error } = await supabase
//         .from('rendez_vous')
//         .insert([{
//           medecin_id: selectedMedecin,
//           patient_id: patientData.id,
//           date_heure: selectedCreneau,
//           duree_minutes: 30,
//           statut: 'planifié',
//           lieu: formData.lieu === 'Autre' ? formData.autre_lieu : formData.lieu,
//           motif: formData.motif,
//           notes: formData.notes
//         }])

//       if (error) throw error

//       toast.success('Rendez-vous enregistré avec succès')
//       router.push('/patient/mes-rendez-vous')
//     } catch (error: any) {
//       console.error('Erreur:', error)
//       toast.error(`Erreur lors de la prise de rendez-vous: ${error.message}`)
      
//       if (error.message.includes('plus disponible')) {
//         calculerCreneauxDisponibles()
//       }
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-0">
//         <p className="text-gray-600">Redirection vers la page de connexion...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6 bg-red-00">
//       <h2 className="text-xl px-2 text-center mt-2 font-bold text-gray-800">Prendre un nouveau rendez-vous</h2>
      
//       <div className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
//             <select
//               value={selectedSpecialite}
//               onChange={(e) => {
//                 setSelectedSpecialite(e.target.value)
//                 setSelectedMedecin('')
//               }}
//               className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Toutes les spécialités</option>
//               {specialites.map(spec => (
//                 <option key={spec.id} value={spec.id}>{spec.nom}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Médecin</label>
//             <select
//               value={selectedMedecin}
//               onChange={(e) => setSelectedMedecin(e.target.value)}
//               disabled={!selectedSpecialite && filteredMedecins.length === 0}
//               className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
//             >
//               <option value="">Sélectionnez un médecin</option>
//               {filteredMedecins.map(medecin => (
//                 <option key={medecin.id} value={medecin.id}>
//                   {medecin.user.nom} - {medecin.specialite?.nom}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {selectedMedecin && (
//           <div className="mt-4 p-4 bg-blue-0 rounded-lg">
//             <div className="flex items-start">
//               {medecins.find(m => m.id === selectedMedecin)?.user?.profil_url ? (
//                 <img 
//                   src={medecins.find(m => m.id === selectedMedecin).user.profil_url} 
//                   alt="Photo de profil" 
//                   className="h-16 w-16 rounded-full object-cover mr-4"
//                 />
//               ) : (
//                 <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 </div>
//               )}
//               <div>
//                 <h3 className="font-medium text-gray-900">
//                   Dr. {medecins.find(m => m.id === selectedMedecin)?.user?.nom}
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   {medecins.find(m => m.id === selectedMedecin)?.specialite?.nom}
//                 </p>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Langues: {medecins.find(m => m.id === selectedMedecin)?.langues?.map((l: any) => l.langue.nom).join(', ') || 'Non spécifié'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Étape 2 : Sélection de la date */}
//       {selectedMedecin && (
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-gray-800">Choisissez une date</h3>
          
//           {hasExistingAppointment && (
//             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-yellow-700">
//                     Vous avez déjà un rendez-vous avec ce médecin aujourd'hui. Vous ne pouvez pas prendre plusieurs rendez-vous le même jour.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           <div className="borde  scale-[95%] border-gray rounded-lg p-1 translate-x-[-3px]">
//             <DayPicker
//               mode="single"
//               selected={selectedDate || undefined}
//               onSelect={(date) => date && handleDayClick(date)}
//               month={currentMonth}
//               onMonthChange={handleMonthChange}
//               locale={fr}
//               modifiers={modifiers}
//               modifiersStyles={modifiersStyles}
//               disabled={{ before: new Date() }}
//               styles={{
//                 root: { margin: '0 auto' },
//                 caption: { color: '#1e40af', fontWeight: '600' },
//                 day: { margin: '0.2em', borderRadius: '0.375rem' },
//                 cell: { borderRadius: '0.375rem' }
//               }}
//             />
//           </div>

//           {selectedDate && (
//             <div className="mt-2 text-sm text-gray-600">
//               Vous avez sélectionné le {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Étape 3 : Sélection du créneau */}
//       {selectedDate && creneauxDisponibles.length > 0 && !hasExistingAppointment && (
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-gray-800">Choisissez un créneau</h3>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
//             {creneauxDisponibles.map((creneau, index) => (
//               <button
//                 key={index}
//                 type="button"
//                 onClick={() => setSelectedCreneau(creneau.debut.toISOString())}
//                 className={`p-3 border rounded-md text-center transition-colors ${
//                   !creneau.disponible 
//                     ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
//                     : selectedCreneau === creneau.debut.toISOString()
//                       ? 'bg-blue-100 border-blue-500 text-blue-800'
//                       : 'border-gray-200 hover:bg-gray-50'
//                 }`}
//                 disabled={!creneau.disponible || hasExistingAppointment}
//               >
//                 <div className="font-medium">
//                   {format(creneau.debut, 'HH:mm')} - {format(creneau.fin, 'HH:mm')}
//                 </div>
//                 <div className="text-sm text-gray-600 mt-1">
//                   {creneau.lieu}
//                 </div>
//                 {!creneau.disponible && (
//                   <div className="text-xs text-red-500 mt-1">Déjà réservé</div>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Étape 4 : Détails du rendez-vous */}
//       {selectedCreneau && !hasExistingAppointment && (
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-gray-800">Détails du rendez-vous</h3>
          
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Motif de la consultation</label>
//               <input
//                 type="text"
//                 name="motif"
//                 value={formData.motif}
//                 onChange={(e) => setFormData({...formData, motif: e.target.value})}
//                 className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Notes supplémentaires (optionnel)</label>
//               <textarea
//                 name="notes"
//                 value={formData.notes}
//                 onChange={(e) => setFormData({...formData, notes: e.target.value})}
//                 rows={3}
//                 className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de consultation</label>
//                 <select
//                   value={formData.lieu}
//                   onChange={(e) => setFormData({...formData, lieu: e.target.value})}
//                   className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   {LIEUX_CONSULTATION.map((lieu, index) => (
//                     <option key={index} value={lieu}>{lieu}</option>
//                   ))}
//                 </select>
//               </div>
              
//               {formData.lieu === 'Autre' && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Précisez le lieu</label>
//                   <input
//                     type="text"
//                     value={formData.autre_lieu}
//                     onChange={(e) => setFormData({...formData, autre_lieu: e.target.value})}
//                     className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Entrez le lieu de consultation"
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={submitting || hasExistingAppointment}
//                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200 flex justify-center items-center"
//               >
//                 {submitting ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Enregistrement en cours...
//                   </>
//                 ) : 'Confirmer le rendez-vous'}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {selectedMedecin && selectedDate && creneauxDisponibles.length === 0 && !loading && (
//         <div className="text-center py-8 bg-yellow-50 rounded-lg">
//           <svg className="mx-auto h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           <h3 className="mt-2 text-lg font-medium text-yellow-800">
//             {hasExistingAppointment ? 'Vous avez déjà un rendez-vous aujourd\'hui' : 'Aucun créneau disponible'}
//           </h3>
//           <p className="mt-1 text-sm text-yellow-700">
//             {hasExistingAppointment 
//               ? 'Vous ne pouvez pas prendre plusieurs rendez-vous le même jour avec le même médecin.'
//               : 'Le médecin n\'a pas de disponibilité pour cette date ou tous les créneaux sont déjà réservés.'}
//           </p>
//           <button
//             type="button"
//             onClick={() => setSelectedDate(null)}
//             className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
//           >
//             Choisir une autre date
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// export default function PatientRendezVousPage() {
//   const [activeTab, setActiveTab] = useState<'prendre' | 'mes-rendez-vous'>('prendre')

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Gestion des rendez-vous</h1>
//           <p className="mt-2 text-lg text-gray-600">
//             Prenez un nouveau rendez-vous ou consultez vos rendez-vous à venir
//           </p>
//         </div>

//         {/* Onglets de navigation - style similaire au premier composant */}
//         <div className="flex justify-center mb-8">
//           <div className="flex rounded-lg bg-gray-100 p-1">
//             <button
//               onClick={() => setActiveTab('prendre')}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
//                 activeTab === 'prendre'
//                   ? 'bg-white shadow-sm text-blue-600'
//                   : 'text-gray-600 hover:text-gray-800'
//               }`}
//             >
//               Prendre rendez-vous
//             </button>
//             <button
//               onClick={() => setActiveTab('mes-rendez-vous')}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
//                 activeTab === 'mes-rendez-vous'
//                   ? 'bg-white shadow-sm text-blue-600'
//                   : 'text-gray-600 hover:text-gray-800'
//               }`}
//             >
//               Mes rendez-vous
//             </button>
//           </div>
//         </div>

//         {/* Contenu des onglets */}
//         <div className="bg-white rounded-xl hadow-md overflow-hidden">
//           <div className="p-">
//             {activeTab === 'prendre' ? <PrendreRendezVous /> : <MesRendezVous />}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { supabase } from '@/lib/supabase/client'
import { fr } from 'date-fns/locale'
import { format, addMinutes, isBefore, isAfter, parseISO, isSameDay, eachDayOfInterval, startOfMonth, endOfMonth, isSameMonth, isToday } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import MesRendezVous from '@/app/patient/mes-rendez-vous/page'

const LIEUX_CONSULTATION = [
  'Cabinet privé',
  'Clinique',
  'Hôpital',
  'Domicile du patient',
  'Téléconsultation',
  'Autre'
]

const PrendreRendezVous = () => {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [medecins, setMedecins] = useState<any[]>([])
  const [specialites, setSpecialites] = useState<any[]>([])
  const [selectedMedecin, setSelectedMedecin] = useState<string>('')
  const [selectedSpecialite, setSelectedSpecialite] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [creneauxDisponibles, setCreneauxDisponibles] = useState<any[]>([])
  const [selectedCreneau, setSelectedCreneau] = useState<string | null>(null)
  const [rendezVousExistants, setRendezVousExistants] = useState<any[]>([])
  const [disponibilitesMedecin, setDisponibilitesMedecin] = useState<any[]>([])
  const [congesMedecin, setCongesMedecin] = useState<any[]>([])
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [formData, setFormData] = useState({
    motif: '',
    notes: '',
    lieu: 'Cabinet privé',
    autre_lieu: ''
  })
  const [hasExistingAppointment, setHasExistingAppointment] = useState(false)
  const [activeStep, setActiveStep] = useState<number>(1)

  // Écouter les changements de rendez-vous en temps réel
  useEffect(() => {
    if (!selectedMedecin) return

    const channel = supabase
      .channel('rendez_vous_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rendez_vous',
          filter: `medecin_id=eq.${selectedMedecin}`
        },
        (payload) => {
          fetchRendezVousExistants()
          checkExistingAppointment()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedMedecin, selectedDate, user])

  // Vérifier si le patient a déjà un RDV ce jour
  const checkExistingAppointment = async () => {
    if (!user || !selectedMedecin || !selectedDate) return

    try {
      const { data: patientData } = await supabase
        .from('patient_infos')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (patientData) {
        const startOfDay = new Date(selectedDate)
        startOfDay.setHours(0, 0, 0, 0)
        
        const endOfDay = new Date(selectedDate)
        endOfDay.setHours(23, 59, 59, 999)

        const { data: existingRdv } = await supabase
          .from('rendez_vous')
          .select('id')
          .eq('medecin_id', selectedMedecin)
          .eq('patient_id', patientData.id)
          .gte('date_heure', startOfDay.toISOString())
          .lte('date_heure', endOfDay.toISOString())
          .neq('statut', 'annulé')
        
        setHasExistingAppointment(!!(existingRdv && existingRdv.length > 0))
      }
    } catch (error) {
      console.error("Erreur vérification RDV existant:", error)
    }
  }

  // Fonction pour récupérer les rendez-vous existants
  const fetchRendezVousExistants = async () => {
    try {
      const { data: rendezVousData, error: rdvError } = await supabase
        .from('rendez_vous')
        .select('date_heure, duree_minutes, lieu')
        .eq('medecin_id', selectedMedecin)
        .gte('date_heure', new Date().toISOString())
        .neq('statut', 'annulé')

      if (rdvError) throw rdvError
      setRendezVousExistants(rendezVousData || [])
      
      if (selectedDate) {
        calculerCreneauxDisponibles()
      }
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors du chargement: ${error.message}`)
    }
  }

  // Récupérer les médecins et spécialités
  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Récupérer les spécialités
        const { data: specialitesData, error: specialitesError } = await supabase
          .from('specialites')
          .select('*')

        if (specialitesError) throw specialitesError
        setSpecialites(specialitesData || [])

        // Récupérer tous les médecins avec leurs infos
        const { data: medecinsData, error: medecinsError } = await supabase
          .from('medecin_infos')
          .select(`
            *,
            user:users(nom, email, profil_url),
            specialite:specialites(nom),
            langues:medecin_langues(langue:langues(nom)),
            disponibilites_medecin(*)
          `)
          .eq('user.statut', true)

        if (medecinsError) throw medecinsError
        setMedecins(medecinsData || [])

      } catch (error: any) {
        console.error('Erreur lors du chargement:', error)
        toast.error(`Erreur: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, authLoading, router])

  // Filtrer les médecins par spécialité
  const filteredMedecins = selectedSpecialite 
    ? medecins.filter(m => m.specialite_id === parseInt(selectedSpecialite))
    : medecins

  // Récupérer les disponibilités et congés
  useEffect(() => {
    if (!selectedMedecin) return

    const fetchDisponibilitesEtRendezVous = async () => {
      try {
        setLoading(true)
        setSelectedDate(null)
        setCreneauxDisponibles([])
        setActiveStep(2) // Passer à l'étape 2 après sélection du médecin
        
        // Récupérer les disponibilités du médecin
        const medecin = medecins.find(m => m.id === selectedMedecin)
        if (medecin) {
          setDisponibilitesMedecin(medecin.disponibilites_medecin || [])
        }

        await fetchRendezVousExistants()

        // Récupérer les congés du médecin
        const { data: congesData, error: congesError } = await supabase
          .from('conges_medecin')
          .select('*')
          .eq('medecin_id', selectedMedecin)
          .gte('date_fin', new Date().toISOString())

        if (congesError) throw congesError
        setCongesMedecin(congesData || [])

      } catch (error: any) {
        console.error('Erreur:', error)
        toast.error(`Erreur lors du chargement: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchDisponibilitesEtRendezVous()
  }, [selectedMedecin, medecins])

  // Calculer les créneaux disponibles
  const calculerCreneauxDisponibles = () => {
    setLoading(true);
    
    try {
      if (!selectedDate || !selectedMedecin) {
        setCreneauxDisponibles([]);
        return;
      }

      // 1. Vérifier si le médecin est en congé ce jour
      const estEnConge = congesMedecin.some(conge => {
        const debut = new Date(conge.date_debut);
        const fin = new Date(conge.date_fin);
        return isSameDay(selectedDate, debut) || 
               isSameDay(selectedDate, fin) ||
               (selectedDate > debut && selectedDate < fin);
      });

      if (estEnConge) {
        toast.info("Le médecin est en congé ce jour");
        setCreneauxDisponibles([]);
        return;
      }

      // 2. Trouver les disponibilités pour ce jour
      const jourSemaine = selectedDate.getDay() || 7; // 0=dimanche -> 7=dimanche
      const disposJour = disponibilitesMedecin.filter(d => 
        d.jour_semaine === jourSemaine && d.actif
      );

      if (disposJour.length === 0) {
        setCreneauxDisponibles([]);
        return;
      }

      // 3. Générer tous les créneaux possibles
      const tousCreneaux = disposJour.flatMap(dispo => {
        const creneaux: any[] = [];
        const dureeRdv = 30; // minutes
        
        let debut = new Date(selectedDate);
        const [heuresD, minutesD] = dispo.heure_debut.split(':').map(Number);
        debut.setHours(heuresD, minutesD, 0, 0);

        const fin = new Date(selectedDate);
        const [heuresF, minutesF] = dispo.heure_fin.split(':').map(Number);
        fin.setHours(heuresF, minutesF, 0, 0);

        while (debut < fin) {
          const finCreneau = new Date(debut.getTime() + dureeRdv * 60000);
          
          if (finCreneau <= fin) {
            creneaux.push({
              debut: new Date(debut),
              fin: finCreneau,
              lieu: dispo.lieu,
              disponible: true
            });
          }
          debut = finCreneau;
        }

        return creneaux;
      });

      // 4. Filtrer les créneaux réservés
      const creneauxDisponibles = tousCreneaux.filter(creneau => {
        return !rendezVousExistants.some(rdv => {
          const rdvDebut = new Date(rdv.date_heure);
          const rdvFin = new Date(rdvDebut.getTime() + rdv.duree_minutes * 60000);
          
          return (
            (creneau.debut >= rdvDebut && creneau.debut < rdvFin) ||
            (creneau.fin > rdvDebut && creneau.fin <= rdvFin) ||
            (creneau.debut <= rdvDebut && creneau.fin >= rdvFin)
          );
        });
      });

      setCreneauxDisponibles(creneauxDisponibles.sort((a, b) => a.debut - b.debut));
      setActiveStep(3) // Passer à l'étape 3 après calcul des créneaux

    } catch (error) {
      console.error("Erreur calcul créneaux:", error);
      toast.error("Erreur lors du calcul des créneaux");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedDate || !selectedMedecin) return
    calculerCreneauxDisponibles()
    checkExistingAppointment()
  }, [selectedDate, selectedMedecin, rendezVousExistants, disponibilitesMedecin, congesMedecin])

  // Jours avec disponibilité
  const getJoursAvecDisponibilite = () => {
    if (!selectedMedecin || disponibilitesMedecin.length === 0) return []

    const jours = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    })

    return jours.filter(jour => {
      const jourSemaine = jour.getDay() || 7
      return disponibilitesMedecin.some((d: any) => d.jour_semaine === jourSemaine && d.actif)
    })
  }

  // Jours de congé
  const getJoursDeConge = () => {
    if (!selectedMedecin || congesMedecin.length === 0) return []

    const jours = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    })

    return jours.filter(jour => {
      return congesMedecin.some(conge => {
        const dateDebut = new Date(conge.date_debut)
        const dateFin = new Date(conge.date_fin)
        return jour >= dateDebut && jour <= dateFin
      })
    })
  }

  const joursDisponibles = getJoursAvecDisponibilite()
  const joursConge = getJoursDeConge()

  const modifiers = {
    disponible: joursDisponibles,
    conge: joursConge,
    today: isToday,
    selected: selectedDate ? [selectedDate] : []
  }

  const modifiersStyles = {
    disponible: {
      border: '2px solid #10B981',
      backgroundColor: '#ECFDF5'
    },
    conge: {
      backgroundColor: '#FEE2E2',
      color: '#DC2626',
      textDecoration: 'line-through'
    },
    today: {
      fontWeight: 'bold',
      color: '#3B82F6'
    },
    selected: {
      backgroundColor: '#3B82F6',
      color: 'white'
    }
  }

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date)
  }

  const handleDayClick = (date: Date) => {
    if (hasExistingAppointment) {
      toast.warning('Vous avez déjà un rendez-vous avec ce médecin aujourd\'hui')
      return
    }

    const estEnConge = congesMedecin.some(conge => {
      const dateDebut = new Date(conge.date_debut)
      const dateFin = new Date(conge.date_fin)
      return date >= dateDebut && date <= dateFin
    })

    if (estEnConge) {
      toast.info('Le médecin est en congé ce jour')
      return
    }

    const jourSemaine = date.getDay() || 7
    const hasDispo = disponibilitesMedecin.some((d: any) => d.jour_semaine === jourSemaine && d.actif)
    
    if (hasDispo) {
      setSelectedDate(date)
    } else {
      toast.info('Le médecin n\'a pas de disponibilité ce jour')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (!user || !selectedMedecin || !selectedCreneau || !selectedDate) {
        toast.error('Veuillez compléter toutes les informations')
        return
      }

      // Vérifier le profil patient
      const { data: patientData, error: patientError } = await supabase
        .from('patient_infos')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (patientError || !patientData) {
        throw new Error('Veuillez compléter votre profil patient avant de prendre rendez-vous')
      }

      // Vérifier si le patient a déjà un RDV ce jour avec ce médecin
      const startOfDay = new Date(selectedDate)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(selectedDate)
      endOfDay.setHours(23, 59, 59, 999)

      const { data: existingRdv, error: rdvError } = await supabase
        .from('rendez_vous')
        .select('id')
        .eq('medecin_id', selectedMedecin)
        .eq('patient_id', patientData.id)
        .gte('date_heure', startOfDay.toISOString())
        .lte('date_heure', endOfDay.toISOString())
        .neq('statut', 'annulé')

      if (rdvError) throw rdvError
      if (existingRdv && existingRdv.length > 0) {
        throw new Error('Vous avez déjà un rendez-vous avec ce médecin aujourd\'hui')
      }

      // Vérifier que le créneau est toujours disponible
      const creneau = creneauxDisponibles.find(c => c.debut.toISOString() === selectedCreneau)
      if (!creneau || !creneau.disponible) {
        throw new Error('Ce créneau n\'est plus disponible. Veuillez en choisir un autre.')
      }

      // Créer le rendez-vous
      const { error } = await supabase
        .from('rendez_vous')
        .insert([{
          medecin_id: selectedMedecin,
          patient_id: patientData.id,
          date_heure: selectedCreneau,
          duree_minutes: 30,
          statut: 'planifié',
          lieu: formData.lieu === 'Autre' ? formData.autre_lieu : formData.lieu,
          motif: formData.motif,
          notes: formData.notes
        }])

      if (error) throw error

      toast.success('Rendez-vous enregistré avec succès')
      // router.push('/patient/mes-rendez-vous')
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors de la prise de rendez-vous: ${error.message}`)
      
      if (error.message.includes('plus disponible')) {
        calculerCreneauxDisponibles()
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Redirection vers la page de connexion...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-1 md:p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Prendre un nouveau rendez-vous</h2>
      
      {/* Stepper */}
      <div className="mb-8">
        <ol className="flex items-center w-full">
          <li className={`flex items-center ${activeStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
            <span className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= 1 ? 'bg-blue-100' : 'bg-gray-100'} mr-2`}>
              1
            </span>
            <span className={`font-medium ${activeStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
              <span className='hidden sm:inline-block'> Choix du médecin</span>
              </span>
            {activeStep > 1 && (
              <svg className="w-5 h-5 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </li>
          <li className={`flex items-center ml-4 ${activeStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
            <span className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= 2 ? 'bg-blue-100' : 'bg-gray-100'} mr-2`}>
              2
            </span>
            <span className={`font-medium ${activeStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              
           
               <span className='hidden sm:inline-block'> Choix de la date</span>
              </span>
            {activeStep > 2 && (
              <svg className="w-5 h-5 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </li>
          <li className={`flex items-center ml-4 ${activeStep >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
            <span className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= 3 ? 'bg-blue-100' : 'bg-gray-100'} mr-2`}>
              3
            </span>
            <span className={`font-medium ${activeStep >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
               <span className='hidden sm:inline-block'> Choix du créneau</span>
              </span>
            {activeStep > 3 && (
              <svg className="w-5 h-5 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </li>
          <li className={`flex items-center ml-4 ${activeStep >= 4 ? 'text-blue-600' : 'text-gray-500'}`}>
            <span className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= 4 ? 'bg-blue-100' : 'bg-gray-100'} mr-2`}>
              4
            </span>
            <span className={`font-medium ${activeStep >= 4 ? 'text-blue-600' : 'text-gray-500'}`}>
               <span className='hidden sm:inline-block'> Confirmation</span>
              </span>
          </li>
        </ol>
      </div>

      {/* Étape 1 : Choix du médecin */}
      {activeStep === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Spécialité</label>
              <select
                value={selectedSpecialite}
                onChange={(e) => {
                  setSelectedSpecialite(e.target.value)
                  setSelectedMedecin('')
                }}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">Toutes les spécialités</option>
                {specialites.map(spec => (
                  <option key={spec.id} value={spec.id}>{spec.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Médecin</label>
              <select
                value={selectedMedecin}
                onChange={(e) => setSelectedMedecin(e.target.value)}
                disabled={!selectedSpecialite && filteredMedecins.length === 0}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 transition duration-200"
              >
                <option value="">Sélectionnez un médecin</option>
                {filteredMedecins.map(medecin => (
                  <option key={medecin.id} value={medecin.id}>
                    Dr. {medecin.user.nom} - {medecin.specialite?.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedMedecin && (
            <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-start space-x-4">
                {medecins.find(m => m.id === selectedMedecin)?.user?.profil_url ? (
                  <img 
                    src={medecins.find(m => m.id === selectedMedecin).user.profil_url} 
                    alt="Photo de profil" 
                    className="h-20 w-20 rounded-full object-cover border-2 border-white shadow"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-white shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Dr. {medecins.find(m => m.id === selectedMedecin)?.user?.nom}
                  </h3>
                  <p className="text-blue-600 font-medium">
                    {medecins.find(m => m.id === selectedMedecin)?.specialite?.nom}
                  </p>
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="flex items-center">
                      <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {medecins.find(m => m.id === selectedMedecin)?.telephone || 'Non renseigné'}
                    </p>
                    <p className="flex items-center mt-1">
                      <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {medecins.find(m => m.id === selectedMedecin)?.user?.email}
                    </p>
                    <p className="flex items-start mt-1">
                      <svg className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Langues: {medecins.find(m => m.id === selectedMedecin)?.langues?.map((l: any) => l.langue.nom).join(', ') || 'Non spécifié'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  disabled={!selectedMedecin}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Étape 2 : Sélection de la date */}
      {activeStep === 2 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </button>
            <h3 className="text-lg font-semibold text-gray-800">Choisissez une date</h3>
            <div></div> {/* Empty div for spacing */}
          </div>
          
          {hasExistingAppointment && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Vous avez déjà un rendez-vous avec ce médecin aujourd'hui. Vous ne pouvez pas prendre plusieurs rendez-vous le même jour.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <DayPicker
              mode="single"
              selected={selectedDate || undefined}
              onSelect={(date) => date && handleDayClick(date)}
              month={currentMonth}
              onMonthChange={handleMonthChange}
              locale={fr}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              disabled={{ before: new Date() }}
              styles={{
                root: { margin: '0 auto' },
                caption: { color: '#1e40af', fontWeight: '600' },
                day: { margin: '0.2em', borderRadius: '0.5rem' },
                cell: { borderRadius: '0.5rem' }
              }}
            />
          </div>

          {selectedDate && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                <span className="font-medium">Date sélectionnée:</span> {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </div>
              <button
                type="button"
                onClick={() => {
                  calculerCreneauxDisponibles()
                  setActiveStep(3)
                }}
                disabled={!selectedDate || hasExistingAppointment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
              >
                Voir les créneaux disponibles
              </button>
            </div>
          )}
        </div>
      )}

      {/* Étape 3 : Sélection du créneau */}
      {activeStep === 3 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </button>
            <h3 className="text-lg font-semibold text-gray-800">Choisissez un créneau</h3>
            <div></div> {/* Empty div for spacing */}
          </div>
          
          {selectedDate && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700">
                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </p>
            </div>
          )}
          
          {creneauxDisponibles.length > 0 && !hasExistingAppointment ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {creneauxDisponibles.map((creneau, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setSelectedCreneau(creneau.debut.toISOString())
                    setActiveStep(4)
                  }}
                  className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                    !creneau.disponible 
                      ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                      : selectedCreneau === creneau.debut.toISOString()
                        ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm'
                  }`}
                  disabled={!creneau.disponible || hasExistingAppointment}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">
                        {format(creneau.debut, 'HH:mm')} - {format(creneau.fin, 'HH:mm')}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {creneau.lieu}
                      </div>
                    </div>
                    {!creneau.disponible ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Réservé
                      </span>
                    ) : (
                      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {hasExistingAppointment ? 'Vous avez déjà un rendez-vous aujourd\'hui' : 'Aucun créneau disponible'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {hasExistingAppointment 
                  ? 'Vous ne pouvez pas prendre plusieurs rendez-vous le même jour avec le même médecin.'
                  : 'Le médecin n\'a pas de disponibilité pour cette date ou tous les créneaux sont déjà réservés.'}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Choisir une autre date
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Étape 4 : Détails du rendez-vous */}
      {activeStep === 4 && selectedCreneau && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </button>
            <h3 className="text-lg font-semibold text-gray-800">Confirmez votre rendez-vous</h3>
            <div></div> {/* Empty div for spacing */}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Informations du médecin</h4>
                <div className="flex items-start space-x-4">
                  {medecins.find(m => m.id === selectedMedecin)?.user?.profil_url ? (
                    <img 
                      src={medecins.find(m => m.id === selectedMedecin).user.profil_url} 
                      alt="Photo de profil" 
                      className="h-16 w-16 rounded-full object-cover border-2 border-white shadow"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-white shadow">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">Dr. {medecins.find(m => m.id === selectedMedecin)?.user?.nom}</p>
                    <p className="text-sm text-gray-600">{medecins.find(m => m.id === selectedMedecin)?.specialite?.nom}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Détails du rendez-vous</h4>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Date:</span> {selectedDate && format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Horaire:</span> {selectedCreneau && format(new Date(selectedCreneau), 'HH:mm')} - {selectedCreneau && format(addMinutes(new Date(selectedCreneau), 30), 'HH:mm')}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Lieu:</span> {creneauxDisponibles.find(c => c.debut.toISOString() === selectedCreneau)?.lieu}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Motif de la consultation *</label>
              <input
                type="text"
                name="motif"
                value={formData.motif}
                onChange={(e) => setFormData({...formData, motif: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Ex: Consultation de routine, douleurs, etc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes supplémentaires (optionnel)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Informations supplémentaires que vous souhaitez partager avec le médecin"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lieu de consultation</label>
                <select
                  value={formData.lieu}
                  onChange={(e) => setFormData({...formData, lieu: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                >
                  {LIEUX_CONSULTATION.map((lieu, index) => (
                    <option key={index} value={lieu}>{lieu}</option>
                  ))}
                </select>
              </div>
              
              {formData.lieu === 'Autre' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Précisez le lieu *</label>
                  <input
                    type="text"
                    value={formData.autre_lieu}
                    onChange={(e) => setFormData({...formData, autre_lieu: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Entrez le lieu de consultation"
                    required={formData.lieu === 'Autre'}
                  />
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={submitting || hasExistingAppointment}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-200 flex items-center"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : <>
                <span className='sm:hidden inline-block'>Confirmer </span>
                <span className='hidden sm:inline-block'>Confirmer le rendez-vous</span>
                
                </>}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default function PatientRendezVousPage() {
  const [activeTab, setActiveTab] = useState<'prendre' | 'mes-rendez-vous'>('prendre')

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des rendez-vous</h1>
          <p className="mt-2 text-lg text-gray-600">
            Prenez un nouveau rendez-vous ou consultez vos rendez-vous à venir
          </p>
        </div>

        {/* Onglets de navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('prendre')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'prendre'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Prendre rendez-vous
            </button>
            <button
              onClick={() => setActiveTab('mes-rendez-vous')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'mes-rendez-vous'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Mes rendez-vous
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-2">
            {activeTab === 'prendre' ? <PrendreRendezVous /> : <MesRendezVous />}
          </div>
        </div>
      </div>
    </div>
  )
}