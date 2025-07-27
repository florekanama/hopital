// 'use client'

// import { useState } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase/supabaseClient'

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState('')
//   const [message, setMessage] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const { user } = useAuth()
//   const router = useRouter()

//   if (user) {
//     router.push('/dashboard')
//     return (
//       <div className="max-w-md mx-auto mt-10">
//         <div>Redirection vers le tableau de bord...</div>
//       </div>
//     )
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     setMessage('')

//     try {
//       const { error } = await supabase.auth.resetPasswordForEmail(email, {
//         redirectTo: `${window.location.origin}/update-password`,
//       })

//       if (error) {
//         throw error
//       }

//       setMessage('Un email de réinitialisation a été envoyé. Vérifiez votre boîte de réception.')
//     } catch (err) {
//     //   setError(err.message || 'Une erreur est survenue lors de l\'envoi de l\'email.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-6 text-center">Mot de passe oublié</h1>
      
//       {message && (
//         <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
//           {message}
//         </div>
//       )}
      
//       {error && (
//         <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
//           {error}
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//             Email
//           </label>
//           <input
//             id="email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
        
//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//         >
//           {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
//         </button>
//       </form>
      
//       <div className="mt-4 text-center">
//         <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500">
//           Retour à la connexion
//         </Link>
//       </div>
//     </div>
//   )
// }
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/supabaseClient'
import Image from 'next/image'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })

      if (error) throw error
      
      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'envoi du lien")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white py-5 px-4 sm:px-6 lg:px-8">
      {/* Logo - Cohérent avec votre signup */}
      <div className="w-40 mx-auto h-20 mb-5 relative">
        <Image
          src="/dgi.png"
          alt="Company Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Carte de réinitialisation */}
      <div className="w-full max-w-md border border-gray-200 rounded-lg p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Réinitialisation du mot de passe</h1>
          <p className="mt-2 text-sm text-gray-500">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-md border border-green-100 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Email envoyé! Vérifiez votre boîte de réception.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email professionnel"
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || success}
              className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading || success ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </>
              ) : success ? 'Email envoyé!' : 'Envoyer le lien'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Retour à la page de connexion ?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-500">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}