import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with animation */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl transform transition duration-500 hover:scale-105">
              Espace <span className="text-indigo-600">Administrateur</span>
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 transition duration-300 hover:text-gray-700">
              Gestion complète de votre plateforme
            </p>
          </div>

          {/* Main card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3 animate-pulse">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Tableau de bord d'administration</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Accédez à toutes les fonctionnalités réservées aux administrateurs
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* User Management Card */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 transition-all duration-300 hover:scale-[1.02] hover:border-indigo-300 hover:shadow-md">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                      <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-gray-900">Gestion des utilisateurs</h4>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link 
                      href="/dashboard"
                      className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 hover:scale-[1.02] active:scale-95"
                    >
                      Accéder aux utilisateurs
                    </Link>
                  </div>
                </div>

                {/* Statistics Card */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 transition-all duration-300 hover:scale-[1.02] hover:border-indigo-300 hover:shadow-md">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                      <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-gray-900">Statistiques</h4>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed transition duration-300">
                      Bientôt disponible
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center animate-fade-in">
            <p className="text-sm text-gray-500 transition duration-300 hover:text-gray-700">
              Vous avez accès à toutes les fonctionnalités administratives
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}