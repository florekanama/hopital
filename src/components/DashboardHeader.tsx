// 'use client'

// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase/supabaseClient'
// import UserProfile from '@/components/UserProfile'
// import Image from 'next/image'
// import { FiLogOut } from 'react-icons/fi'

// export default function DashboardHeader({ role }: { role: string | null }) {
//   const router = useRouter()

//   const handleSignOut = async () => {
//     await supabase.auth.signOut()
//     router.push('/login')
//   }

//   return (
//     <header className="fixed w-full flex text-gray-700 justify-between items-center py-2 px-3 md:px-[30px] bg-white shadow z-50">
//       <div className="w-35 h-12 relative">
//         <Image
//           src="/dgi.png"
//           alt="Company Logo"
//           fill
//           className="object-contain"
//           priority
//         />
//       </div>
//       <div className="flex items-center gap-4">
//         <UserProfile />
//         <button
//           onClick={handleSignOut}
//           className="flex items-center gap-1 text-bo font-bold px-4 py-2 text-sm font- rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
//         >
//           <FiLogOut className="text-gray-600" />
//         </button>
//       </div>
//     </header>
//   )
// }

// 'use client'

// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase/supabaseClient'
// import UserProfile from '@/components/UserProfile'
// import Image from 'next/image'
// import { FiLogOut } from 'react-icons/fi'

// export default function DashboardHeader({ role }: { role: string | null }) {
//   const router = useRouter()

//   const handleSignOut = async () => {
//     await supabase.auth.signOut()
//     router.push('/login')
//   }

//   return (
//     <header className="fixed w-full flex justify-between items-center py-3 px-4 md:px-8 bg-white shadow-sm z-50 border-b border-gray-100">
//       <div className="w-32 h-10 relative">
//         <Image
//           src="/dgi.png"
//           alt="DGI Logo"
//           fill
//           className="object-contain"
//           priority
//         />
//       </div>

//       <div className="flex items-center gap-4">
//         {role && (
//           <span className="hidden md:block text-sm font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
//             {role}
//           </span>
//         )}
//         <UserProfile />
//         <button
//           onClick={handleSignOut}
//           className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
//         >
//           <FiLogOut className="text-gray-500" />
//           <span className="hidden md:inline">Déconnexion</span>
//         </button>
//       </div>
//     </header>
//   )
// }
'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/supabaseClient'
import UserProfile from '@/components/UserProfile'
import Image from 'next/image'
import { FiLogOut, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { useState, useRef, useEffect } from 'react'

export default function DashboardHeader({ role }: { role: string | null }) {
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="fixed w-full flex justify-between items-center py-3 px-4 md:px-8 bg-white shadow-sm z-50 border-b border-gray-100">
      <div className="w-32 h-10 relative">
        <Image
          src="/dgi.png"
          alt="DGI Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="flex items-center gap-4">
        {role && (
          <span className="hidden md:block text-sm font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
            {role}
          </span>
        )}

        {/* Zone profil avec menu déroulant */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg transition-colors p-1"
            aria-label="Menu profil"
          >
            <UserProfile />
            {isProfileOpen ? (
              <FiChevronUp className="text-gray-500 hidden md:block" />
            ) : (
              <FiChevronDown className="text-gray-500 hidden md:block" />
            )}
          </button>

          {/* Menu déroulant - visible sur mobile et desktop */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors md:hidden"
              >
                <FiLogOut className="text-gray-500" />
                <span>Déconnexion</span>
              </button>
              <button
                onClick={handleSignOut}
                className="hidden md:flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FiLogOut className="text-gray-500" />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>

        {/* Bouton de déconnexion séparé - visible seulement sur desktop quand le menu est fermé */}
        {/* {!isProfileOpen && (
          <button
            onClick={handleSignOut}
            className="hidden md:flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FiLogOut className="text-gray-500" />
            <span>Déconnexion</span>
          </button>
        )} */}
      </div>
    </header>
  )
}