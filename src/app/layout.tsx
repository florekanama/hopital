
// // 'use client' // Ajout nécessaire car nous utilisons des hooks et du client-side interactivity
// // import { AuthProvider } from '@/context/AuthContext'
// // import { useAuth } from '@/context/AuthContext'
// // import { useState } from 'react'
// // import Link from 'next/link'
// // import Image from 'next/image'
// // import './globals.css'
// // import type { Metadata } from 'next'



// // export default function RootLayout({ children }: { children: React.ReactNode }) {
// //   return (
// //     <html lang="fr">
// //       <body className="min-h-screen bg-gray-50">
// //         <AuthProvider>
// //           <AppShell>{children}</AppShell>
// //         </AuthProvider>
// //       </body>
// //     </html>
// //   )
// // }

// // function AppShell({ children }: { children: React.ReactNode }) {
// //   const { user, signOut } = useAuth()
// //   const [isDropdownOpen, setIsDropdownOpen] = useState(false)

// //   return (
// //     <div className="flex flex-col min-h-screen">
// //       {/* Navigation Bar */}
// //       <header className="bg-white shadow-sm">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="flex justify-between h-16 items-center">
// //             <div className="flex items-center">
// //               <Link href="/" className="flex items-center">
// //                 <Image
// //                   src="/watu.jpg" // Chemin vers votre logo
// //                   alt="Logo"
// //                   width={40}
// //                   height={40}
// //                   className="size-10"
// //                 />
// //                 <span className="ml-2 text- font-bold text-gray-900">
// //                   WatuWetu
// //                 </span>
// //               </Link>
// //             </div>

// //             {user && (
// //               <div className="ml-4 flex items-center md:ml-6 relative">
// //                 {/* Profile dropdown */}
// //                 <div className="relative">
// //                   <button
// //                     type="button"
// //                     className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 p-2 focus:ring-blue-500"
// //                     id="user-menu"
// //                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
// //                     aria-expanded="false"
// //                     aria-haspopup="true"
// //                   >
// //                     <span className="sr-only">Ouvrir le menu utilisateur</span>
// //                     <div className="flex items-center space-x-2">
// //                       <div className="text-right hidden md:block">
// //                         <p className="text-sm font-medium text-gray-900">
// //                           {user.nom}
// //                         </p>
// //                         <p className="text-xs text-gray-500">{user.email}</p>
// //                       </div>
// //                       <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
// //                         {user.profil_url ? (
// //                           <Image
// //                             src={user.profil_url}
// //                             alt={`Photo de ${user.nom}`}
// //                             width={32}
// //                             height={32}
// //                             className="object-cover h-full w-full"
// //                           />
// //                         ) : (
// //                           <div className="h-full w-full flex items-center justify-center bg-gray-100">
// //                             <svg
// //                               className="h-5 w-5 text-gray-400"
// //                               fill="currentColor"
// //                               viewBox="0 0 20 20"
// //                             >
// //                               <path
// //                                 fillRule="evenodd"
// //                                 d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
// //                                 clipRule="evenodd"
// //                               />
// //                             </svg>
// //                           </div>
// //                         )}
// //                       </div>
// //                     </div>
// //                   </button>

// //                   {/* Dropdown menu */}
// //                   {isDropdownOpen && (
// //                     <div
// //                       className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
// //                       role="menu"
// //                       aria-orientation="vertical"
// //                       aria-labelledby="user-menu"
// //                     >
// //                       <div className="px-4 py-2 border-b">
// //                         <p className="text-sm font-medium text-gray-900">
// //                           {user.nom}
// //                         </p>
// //                         <p className="text-xs text-gray-500 truncate">
// //                           {user.email}
// //                         </p>
// //                       </div>
// //                       <Link
// //                         href="/profile"
// //                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// //                         role="menuitem"
// //                         onClick={() => setIsDropdownOpen(false)}
// //                       >
// //                         Mon profil
// //                       </Link>
// //                       <button
// //                         onClick={() => {
// //                           signOut()
// //                           setIsDropdownOpen(false)
// //                         }}
// //                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// //                         role="menuitem"
// //                       >
// //                         Déconnexion
// //                       </button>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="flex-grow">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
// //           {children}
// //         </div>
// //       </main>

// //       {/* Footer */}
// //       <footer className="bg-white border-t">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
// //           <p className="text-center text-sm text-gray-500">
// //             © {new Date().getFullYear()} Système de Gestion Hôpital. Tous droits réservés.
// //           </p>
// //         </div>
// //       </footer>
// //     </div>
// //   )
// // }


// 'use client'
// import { AuthProvider } from '@/context/AuthContext'
// import { useAuth } from '@/context/AuthContext'
// import { useState, Suspense } from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import './globals.css'

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="fr">
//       <body className="min-h-screen bg-gray-50">
//         <AuthProvider>
//           <AppShell>
//             <Suspense fallback={<div>Loading...</div>}>
//               {children}
//             </Suspense>
//           </AppShell>
//         </AuthProvider>
//       </body>
//     </html>
//   )
// }

// function AppShell({ children }: { children: React.ReactNode }) {
//   const { user, signOut } = useAuth()
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Navigation Bar */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">
//             <div className="flex items-center">
//               <Link href="/" className="flex items-center">
//                 <Image
//                   src="/watu.jpg"
//                   alt="Logo"
//                   width={40}
//                   height={40}
//                   className="size-10"
//                 />
//                 <span className="ml-2 text- font-bold text-gray-900">
//                   WatuWetu
//                 </span>
//               </Link>
//             </div>

//             {user && (
//               <div className="ml-4 flex items-center md:ml-6 relative">
//                 {/* Profile dropdown */}
//                 <div className="relative">
//                   <button
//                     type="button"
//                     className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 p-2 focus:ring-blue-500"
//                     id="user-menu"
//                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                     aria-expanded="false"
//                     aria-haspopup="true"
//                   >
//                     <span className="sr-only">Ouvrir le menu utilisateur</span>
//                     <div className="flex items-center space-x-2">
//                       <div className="text-right hidden md:block">
//                         <p className="text-sm font-medium text-gray-900">
//                           {user.nom}
//                         </p>
//                         <p className="text-xs text-gray-500">{user.email}</p>
//                       </div>
//                       <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
//                         {user.profil_url ? (
//                           <Image
//                             src={user.profil_url}
//                             alt={`Photo de ${user.nom}`}
//                             width={32}
//                             height={32}
//                             className="object-cover h-full w-full"
//                           />
//                         ) : (
//                           <div className="h-full w-full flex items-center justify-center bg-gray-100">
//                             <svg
//                               className="h-5 w-5 text-gray-400"
//                               fill="currentColor"
//                               viewBox="0 0 20 20"
//                             >
//                               <path
//                                 fillRule="evenodd"
//                                 d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                                 clipRule="evenodd"
//                               />
//                             </svg>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </button>

//                   {/* Dropdown menu */}
//                   {isDropdownOpen && (
//                     <div
//                       className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
//                       role="menu"
//                       aria-orientation="vertical"
//                       aria-labelledby="user-menu"
//                     >
//                       <div className="px-4 py-2 border-b">
//                         <p className="text-sm font-medium text-gray-900">
//                           {user.nom}
//                         </p>
//                         <p className="text-xs text-gray-500 truncate">
//                           {user.email}
//                         </p>
//                       </div>
//                       <Link
//                         href="/profile"
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         role="menuitem"
//                         onClick={() => setIsDropdownOpen(false)}
//                       >
//                         Mon profil
//                       </Link>
//                       <button
//                         onClick={() => {
//                           signOut()
//                           setIsDropdownOpen(false)
//                         }}
//                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         role="menuitem"
//                       >
//                         Déconnexion
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-grow">
//         <div className="max-w-7xl mx-auto px- sm:px-6 lg:px-8 py-6">
//           {children}
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-white border-t">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <p className="text-center text-sm text-gray-500">
//             © {new Date().getFullYear()} Système de Gestion de Rendez-vous Hôpital. Tous droits réservés.
//           </p>
//         </div>
//       </footer>
//     </div>
//   )
// }
'use client'
import { AuthProvider } from '@/context/AuthContext'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import './globals.css'
import { Suspense } from 'react'
import { useAuth } from '@/context/AuthContext'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <Suspense fallback={<FullPageLoader />}>
            <AppShell>{children}</AppShell>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}

function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}

function AppShell({ children }: { children: React.ReactNode }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <Header isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />
      
      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Système de Gestion de Rendez-vous Hôpital. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Header({
  isDropdownOpen,
  setIsDropdownOpen
}: {
  isDropdownOpen: boolean
  setIsDropdownOpen: (value: boolean) => void
}) {
  const { user, signOut, loading } = useAuth()

  if (loading) return null

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/watu.jpg"
                alt="Logo"
                width={40}
                height={40}
                className="size-10"
              />
              <span className="ml-2 text- font-bold text-gray-900">
                WatuWetu
              </span>
            </Link>
          </div>

          {user && (
            <div className="ml-4 flex items-center md:ml-6 relative">
              {/* Profile dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 p-2 focus:ring-blue-500"
                  id="user-menu"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Ouvrir le menu utilisateur</span>
                  <div className="flex items-center space-x-2">
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-medium text-gray-900">
                        {user.nom}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                      {user.profil_url ? (
                        <Image
                          src={user.profil_url}
                          alt={`Photo de ${user.nom}`}
                          width={32}
                          height={32}
                          className="object-cover h-full w-full"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">
                        {user.nom}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Mon profil
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        setIsDropdownOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div></div>
      </header>
    )
}