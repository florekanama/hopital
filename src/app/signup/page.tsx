
// // 'use client'
// // import { useState } from 'react'
// // import { useAuth } from '@/context/AuthContext'
// // import { useRouter } from 'next/navigation'
// // import Link from 'next/link'

// // export default function SignUpPage() {
// //   const [nom, setNom] = useState('')
// //   const [email, setEmail] = useState('')
// //   const [password, setPassword] = useState('')
// //   const [role, setRole] = useState<'medecin' | 'patient'>('patient')
// //   const [error, setError] = useState<string | null>(null)
// //   const [success, setSuccess] = useState(false)
// //   const [loading, setLoading] = useState(false)
// //   const { signUp } = useAuth()
// //   const router = useRouter()

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()
    
// //     if (!nom || !email || !password) {
// //       setError('Veuillez remplir tous les champs')
// //       return
// //     }

// //     if (password.length < 6) {
// //       setError('Le mot de passe doit contenir au moins 6 caractères')
// //       return
// //     }

// //     setLoading(true)
// //     setError(null)
    
// //     try {
// //       const { error } = await signUp(nom, email, password, role)
      
// //       if (error) {
// //         throw error
// //       }
      
// //       setSuccess(true)
// //       setTimeout(() => router.push('/dashboard'), 2000)
// //     } catch (err: any) {
// //       console.error('SignUp error:', err)
      
// //       if (err.message.includes('User already registered')) {
// //         setError('Un compte existe déjà avec cet email')
// //       } else if (err.message.includes('Invalid email')) {
// //         setError('Email invalide')
// //       } else {
// //         setError(err.message || 'Une erreur est survenue lors de la création du compte')
// //       }
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-md w-full space-y-8">
// //         <div>
// //           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
// //             Créer un nouveau compte
// //           </h2>
// //         </div>
        
// //         {error && (
// //           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
// //             {error}
// //           </div>
// //         )}

// //         {success && (
// //           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
// //             Compte créé avec succès! Redirection en cours...
// //           </div>
// //         )}

// //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
// //           <div className="rounded-md shadow-sm space-y-4">
// //             <div>
// //               <label htmlFor="nom" className="sr-only">Nom complet</label>
// //               <input
// //                 id="nom"
// //                 name="nom"
// //                 type="text"
// //                 autoComplete="name"
// //                 required
// //                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
// //                 placeholder="Nom complet"
// //                 value={nom}
// //                 onChange={(e) => setNom(e.target.value)}
// //               />
// //             </div>
            
// //             <div>
// //               <label htmlFor="email" className="sr-only">Email</label>
// //               <input
// //                 id="email"
// //                 name="email"
// //                 type="email"
// //                 autoComplete="email"
// //                 required
// //                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
// //                 placeholder="Adresse email"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //               />
// //             </div>
            
// //             <div>
// //               <label htmlFor="password" className="sr-only">Mot de passe</label>
// //               <input
// //                 id="password"
// //                 name="password"
// //                 type="password"
// //                 autoComplete="new-password"
// //                 required
// //                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
// //                 placeholder="Mot de passe"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //               />
// //             </div>
            
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Je suis:</label>
// //               <div className="flex space-x-4">
// //                 <label className="inline-flex items-center">
// //                   <input
// //                     type="radio"
// //                     className="form-radio h-4 w-4 text-blue-600"
// //                     name="role"
// //                     value="patient"
// //                     checked={role === 'patient'}
// //                     onChange={() => setRole('patient')}
// //                   />
// //                   <span className="ml-2 text-gray-700">Patient</span>
// //                 </label>
// //                 <label className="inline-flex items-center">
// //                   <input
// //                     type="radio"
// //                     className="form-radio h-4 w-4 text-blue-600"
// //                     name="role"
// //                     value="medecin"
// //                     checked={role === 'medecin'}
// //                     onChange={() => setRole('medecin')}
// //                   />
// //                   <span className="ml-2 text-gray-700">Médecin</span>
// //                 </label>
// //               </div>
// //             </div>
// //           </div>

// //           <div>
// //             <button
// //               type="submit"
// //               disabled={loading || success}
// //               className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
// //                 loading || success ? 'opacity-75 cursor-not-allowed' : ''
// //               }`}
// //             >
// //               {loading ? 'Création en cours...' : success ? 'Compte créé!' : 'Créer un compte'}
// //             </button>
// //           </div>
// //         </form>

// //         <div className="text-center text-sm text-gray-600">
// //           <p>
// //             Vous avez déjà un compte?{' '}
// //             <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
// //               Se connecter
// //             </Link>
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// 'use client'
// import { useState } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import Image from 'next/image'

// export default function SignUpPage() {
//   const [nom, setNom] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [role, setRole] = useState<'medecin' | 'patient'>('patient')
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const { signUp } = useAuth()
//   const router = useRouter()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!nom || !email || !password) {
//       setError('Veuillez remplir tous les champs')
//       return
//     }

//     if (password.length < 6) {
//       setError('Le mot de passe doit contenir au moins 6 caractères')
//       return
//     }

//     setLoading(true)
//     setError(null)
    
//     try {
//       const { error } = await signUp(nom, email, password, role)
      
//       if (error) {
//         throw error
//       }
      
//       setSuccess(true)
//       setTimeout(() => router.push('/dashboard'), 2000)
//     } catch (err: any) {
//       console.error('SignUp error:', err)
      
//       if (err.message.includes('User already registered')) {
//         setError('Un compte existe déjà avec cet email')
//       } else if (err.message.includes('Invalid email')) {
//         setError('Email invalide')
//       } else {
//         setError(err.message || 'Une erreur est survenue lors de la création du compte')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br bo rounded-tl-full from-blue-50 to-gray-50 flex flex-col justify-center sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
      
//       </div>

//       <div className="sm:mx-auto sm:w-full p-2 sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10 border border-gray-100">
//             <Image
//             src="/watu.jpg"
//             alt="Logo du système hospitalier"
//             width={50}
//             height={50}
//             className="object-contain mx-auto mb-5"
//             priority
//           />
//           <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
//             Créer un nouveau compte
//           </h2>

//           {error && (
//             <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-start">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-red-800">Erreur d'inscription</h3>
//                 <div className="mt-1 text-sm text-red-700">
//                   <p>{error}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {success && (
//             <div className="mb-4 p-4 bg-green-50 rounded-lg flex items-start">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-green-800">Succès!</h3>
//                 <div className="mt-1 text-sm text-green-700">
//                   <p>Compte créé avec succès! Redirection en cours...</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
//                 Nom complet
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg
//                     className="h-5 w-5 text-gray-400"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <input
//                   id="nom"
//                   name="nom"
//                   type="text"
//                   autoComplete="name"
//                   required
//                   className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 sm:text-sm"
//                   placeholder="Votre nom complet"
//                   value={nom}
//                   onChange={(e) => setNom(e.target.value)}
//                   disabled={loading || success}
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Adresse email
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg
//                     className="h-5 w-5 text-gray-400"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                     <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                   </svg>
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 sm:text-sm"
//                   placeholder="email@exemple.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   disabled={loading || success}
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Mot de passe
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg
//                     className="h-5 w-5 text-gray-400"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="new-password"
//                   required
//                   className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 sm:text-sm"
//                   placeholder="•••••••• (min. 6 caractères)"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   disabled={loading || success}
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Je suis:
//               </label>
//               <div className="flex space-x-6">
//                 <label className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                     name="role"
//                     value="patient"
//                     checked={role === 'patient'}
//                     onChange={() => setRole('patient')}
//                     disabled={loading || success}
//                   />
//                   <span className="ml-2 text-gray-700">Patient</span>
//                 </label>
//                 <label className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                     name="role"
//                     value="medecin"
//                     checked={role === 'medecin'}
//                     onChange={() => setRole('medecin')}
//                     disabled={loading || success}
//                   />
//                   <span className="ml-2 text-gray-700">Médecin</span>
//                 </label>
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={loading || success}
//                 className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
//                   loading || success ? 'opacity-75 cursor-not-allowed' : ''
//                 }`}
//               >
//                 {loading ? (
//                   <>
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Création en cours...
//                   </>
//                 ) : success ? (
//                   'Compte créé avec succès!'
//                 ) : (
//                   'Créer un compte'
//                 )}
//               </button>
//             </div>
//           </form>

//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">
//                   Vous avez déjà un compte?
//                 </span>
//               </div>
//             </div>

//             <div className="mt-6">
//               <Link
//                 href="/login"
//                 className={`w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
//                   loading ? 'pointer-events-none opacity-75' : ''
//                 }`}
//               >
//                 Se connecter
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

  
//     </div>
//   )
// }
'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function SignUpPage() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'medecin' | 'patient'>('patient')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nom || !email || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const { error } = await signUp(nom, email, password, role)
      
      if (error) {
        throw error
      }
      
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (err: any) {
      console.error('SignUp error:', err)
      
      if (err.message.includes('User already registered')) {
        setError('Un compte existe déjà avec cet email')
      } else if (err.message.includes('Invalid email')) {
        setError('Email invalide')
      } else {
        setError(err.message || 'Une erreur est survenue lors de la création du compte')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100 transform transition-all hover:shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 relative mb-4">
              <Image
                src="/watu.jpg"
                alt="Logo du système hospitalier"
                width={80}
                height={80}
                className="object-contain rounded-full border-2 border-blue-100 p-1"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Créer un compte</h1>
            <p className="text-gray-600 text-sm mt-1">Rejoignez notre plateforme médicale</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start border border-red-100 animate-fade-in">
              <div className="flex-shrink-0 pt-0.5">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur d'inscription</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-start border border-green-100 animate-fade-in">
              <div className="flex-shrink-0 pt-0.5">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Succès!</h3>
                <div className="mt-1 text-sm text-green-700">
                  <p>Compte créé avec succès! Redirection en cours...</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 
                </div>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  autoComplete="name"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 sm:text-sm transition-all duration-150"
                  placeholder="Votre nom complet"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  disabled={loading || success}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 sm:text-sm transition-all duration-150"
                  placeholder="email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || success}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 sm:text-sm transition-all duration-150"
                  placeholder="•••••••• (min. 6 caractères)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || success}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Je suis:
              </label>
              <div className="flex space-x-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    name="role"
                    value="patient"
                    checked={role === 'patient'}
                    onChange={() => setRole('patient')}
                    disabled={loading || success}
                  />
                  <span className="ml-2 text-gray-700">Patient</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    name="role"
                    value="medecin"
                    checked={role === 'medecin'}
                    onChange={() => setRole('medecin')}
                    disabled={loading || success}
                  />
                  <span className="ml-2 text-gray-700">Médecin</span>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || success}
                className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                  loading || success ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-md'
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Création en cours...
                  </>
                ) : success ? (
                  'Compte créé avec succès!'
                ) : (
                  'Créer un compte'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Vous avez déjà un compte?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className={`w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                  loading || success ? 'pointer-events-none opacity-75' : 'hover:shadow-md'
                }`}
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}