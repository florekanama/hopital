'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/supabaseClient'
import Image from 'next/image'

export default function WaitingConfirmation() {
  const params = useSearchParams()
  const email = params.get('email')

  useEffect(() => {
    // Vérifier périodiquement si l'email a été confirmé
    const interval = setInterval(async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (session?.user) {
        clearInterval(interval)
        window.location.href = '/dashboard'
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Vérifiez votre email</h2>
          <p className="text-gray-600 mb-6">
            Un lien de confirmation a été envoyé à <span className="font-semibold">votre email</span>.
            Veuillez cliquer sur ce lien pour activer votre compte.
          </p>
          
          <div className="animate-pulse flex justify-center">
            <div className="h-8 w-8 bg-blue-500 rounded-full"></div>
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            Vous n'avez pas reçu l'email? <button 
              className="text-blue-600 hover:underline"
              onClick={async () => {
                await supabase.auth.resend({
                  type: 'signup',
                  email: email || ''
                })
                alert('Email de confirmation renvoyé!')
              }}
            >
              Renvoyer le lien
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}