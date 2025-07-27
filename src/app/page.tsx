'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { useState } from 'react'

// Composant Loader réutilisable
const Loader = () => (
  <div className="flex justify-center items-center space-x-2">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ y: [0, -10, 0] }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          delay: i * 0.2,
          ease: "easeInOut"
        }}
        className="w-3 h-3 bg-blue-600 rounded-full"
      />
    ))}
  </div>
)

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleNavigation = () => {
    setIsLoading(true)
    // Simuler un chargement (retirer dans la vraie application)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b ">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="w-48 h-24 relative">
            <Image
              src="/watu.jpg"
              alt="Databank DGI Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
          >
            Bienvenue sur <span className="text-blue-600">Watu wetu RendezVous</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 mb-6 max-w-2xl mx-auto"
          >
            Le système innovant de gestion des rendez-vous médicaux, conçu pour simplifier la prise de rendez-vous et améliorer l'accès aux soins.
          </motion.p>

         


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/dashboard"
              onClick={handleNavigation}
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-lg transition-all duration-300 min-w-[220px]"
            >
              {isLoading ? (
                <Loader />
              ) : (
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center"
                >
                  <span className="mr-3">Accéder à la plateforme</span>
                  <FiArrowRight className="w-5 h-5" />
                </motion.span>
              )}
            </Link>
          </motion.div>
        </div>

        {/* Éléments décoratifs animés */}
        <div className="mt-20 grid grid-cols-3 gap-8 opacity-20">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 1, delay: 0.6 + i * 0.2 }}
              className="h-2 bg-blue-500 rounded-full"
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-sm text-gray-500"
        >
          <p>Système conçu par l'iR Flore KANAMA</p>
          <p className="mt-1">En collaboration avec le DS TG</p>
        </motion.div>
      </footer>
    </div>
  )
}