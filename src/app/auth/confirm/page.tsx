

// 'use client'
// import { useEffect, useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { supabase } from '@/lib/supabase/supabaseClient'
// import Image from 'next/image'
// import { FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi'

// export default function ConfirmPage() {
//   const router = useRouter()
//   const params = useSearchParams()
//   const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)


// useEffect(() => {
//   let timeoutId: NodeJS.Timeout;
//   let minLoadingTimeoutId: NodeJS.Timeout;

//   const confirmEmail = async () => {
//     const token_hash = params.get('token_hash');
//     const type = params.get('type');

//     // Vérification des paramètres requis
//     if (!token_hash || type !== 'email') {
//       setStatus('error');
//       setErrorMessage('Lien de confirmation invalide');
//       timeoutId = setTimeout(() => router.push('/login?error=invalid_token'), 3000);
//       return;
//     }

//     try {
//       // 1. Vérification du token OTP avec Supabase
//       const { error, data } = await supabase.auth.verifyOtp({
//         type: 'email',
//         token_hash,
//       });

//       if (error) throw error;

//       // 2. Si confirmation réussie, récupérer le profil utilisateur
//       if (data.user?.id) {
//         const { data: profile, error: profileError } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('id', data.user.id)
//           .single();

//         if (profileError) throw profileError;

//         setStatus('success');
        
//         // 3. Redirection après un délai pour afficher le message de succès
//         timeoutId = setTimeout(() => {
//           // Utilisation de window.location pour un rechargement complet des données
//           window.location.href = '/dashboard';
//         }, 2000);
//       }
//     } catch (err) {
//       console.error('Erreur de confirmation:', err);
//       setStatus('error');
      
//       const message = err instanceof Error ? 
//         err.message : 
//         'Échec de la confirmation du email';
      
//       setErrorMessage(message);
      
//       // Redirection vers login avec le message d'erreur
//       timeoutId = setTimeout(() => {
//         router.push(`/login?error=${encodeURIComponent(message)}`);
//       }, 5000);
//     }
//   };

//   // Délai minimum pour éviter le "flash" d'écran
//   minLoadingTimeoutId = setTimeout(() => {
//     confirmEmail();
//   }, 800);

//   return () => {
//     clearTimeout(minLoadingTimeoutId);
//     if (timeoutId) clearTimeout(timeoutId);
//   };
// }, [params, router]);

//   const renderContent = () => {
//     switch (status) {
//       case 'success':
//         return (
//           <div className="text-center">
//             <FiCheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Email confirmé avec succès !</h2>
//             <p className="text-gray-600">Redirection en cours...</p>
//           </div>
//         )
//       case 'error':
//         return (
//           <div className="text-center">
//             <FiAlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur de confirmation</h2>
//             <p className="text-gray-600 mb-4">{errorMessage}</p>
//             <p className="text-sm text-gray-500">Vous allez être redirigé vers la page de connexion</p>
//           </div>
//         )
//       default:
//         return (
//           <div className="text-center">
//             <FiLoader className="mx-auto h-12 w-12 text-blue-500 animate-spin mb-4" />
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Validation en cours</h2>
//             <p className="text-gray-600">Veuillez patienter pendant la confirmation...</p>
//           </div>
//         )
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
//       <div className="w-full max-w-md mx-auto">
//         {/* Logo - Même que dans le login */}
//         <div className="w-40 mx-auto h-20 mb-8 relative">
//           <Image
//             src="/dgi.png"
//             alt="Company Logo"
//             fill
//             className="object-contain"
//             priority
//           />
//         </div>

//         <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
//           {renderContent()}
//         </div>

//         {/* Footer avec informations utiles */}
//         <div className="mt-8 text-center text-sm text-gray-500">
//           <p>Si la redirection ne fonctionne pas, <a href="/login" className="text-blue-600 hover:underline">cliquez ici</a></p>
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/supabaseClient'
import Image from 'next/image'
import { FiCheckCircle, FiAlertCircle, FiLoader, FiMail } from 'react-icons/fi'

export default function ConfirmPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let minLoadingTimeoutId: NodeJS.Timeout

    const confirmEmail = async () => {
      const token_hash = params.get('token_hash')
      const type = params.get('type')
      const emailParam = params.get('email') // Récupération de l'email depuis les paramètres

      // Vérification des paramètres requis
      if (!token_hash || type !== 'email') {
        setStatus('error')
        setErrorMessage('Lien de confirmation invalide')
        timeoutId = setTimeout(() => router.push('/login?error=invalid_token'), 3000)
        return
      }

      // Si email est dans les paramètres, on l'affiche immédiatement
      if (emailParam) {
        setEmail(emailParam)
      }

      try {
        // 1. Vérification du token OTP avec Supabase
        const { error, data } = await supabase.auth.verifyOtp({
          type: 'email',
          token_hash,
          email: emailParam || undefined,
        })

        if (error) throw error

        // 2. Si confirmation réussie, récupérer le profil utilisateur
        if (data.user?.id) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()

          if (profileError) throw profileError

          setStatus('success')
          
          // 3. Redirection après un délai pour afficher le message de succès
          timeoutId = setTimeout(() => {
            window.location.href = '/dashboard'
          }, 2000)
        }
      } catch (err) {
        console.error('Erreur de confirmation:', err)
        setStatus('error')
        
        const message = err instanceof Error ? 
          err.message : 
          'Échec de la confirmation du email'
        
        setErrorMessage(message)
        
        // Redirection vers login avec le message d'erreur
        timeoutId = setTimeout(() => {
          router.push(`/login?error=${encodeURIComponent(message)}`)
        }, 5000)
      }
    }

    // Délai minimum pour éviter le "flash" d'écran
    minLoadingTimeoutId = setTimeout(() => {
      confirmEmail()
    }, 800)

    return () => {
      clearTimeout(minLoadingTimeoutId)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [params, router])

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="text-center">
            <FiCheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Email confirmé avec succès !</h2>
            {email && (
              <div className="flex items-center justify-center mb-4">
                <FiMail className="mr-2 text-gray-500" />
                <span className="text-gray-600">{email}</span>
              </div>
            )}
            <p className="text-gray-600">Redirection en cours...</p>
          </div>
        )
      case 'error':
        return (
          <div className="text-center">
            <FiAlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur de confirmation</h2>
            {email && (
              <div className="flex items-center justify-center mb-4">
                <FiMail className="mr-2 text-gray-500" />
                <span className="text-gray-600">{email}</span>
              </div>
            )}
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <p className="text-sm text-gray-500">Vous allez être redirigé vers la page de connexion</p>
          </div>
        )
      default:
        return (
          <div className="text-center">
            <FiLoader className="mx-auto h-12 w-12 text-blue-500 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Validation en cours</h2>
            {email && (
              <div className="flex items-center justify-center mb-4">
                <FiMail className="mr-2 text-gray-500" />
                <span className="text-gray-600">{email}</span>
              </div>
            )}
            <p className="text-gray-600">Veuillez patienter pendant la confirmation...</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="w-40 mx-auto h-20 mb-8 relative">
          <Image
            src="/dgi.png"
            alt="Company Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          {renderContent()}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Si la redirection ne fonctionne pas, <a href="/login" className="text-blue-600 hover:underline">cliquez ici</a></p>
        </div>
      </div>
    </div>
  )
}