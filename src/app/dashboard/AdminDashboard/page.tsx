'use client';
import AdminGestionMedecins from "@/app/admin/medecin/page";
import ListeRendezVous from "@/app/admin/rendez-vous/page";
import { EmailSenderButton } from "@/components/EmailSenderButton";
import GestionUtilisateur from "@/components/GestionUtilisateur";
import { useState } from "react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'utilisateurs' | 'parametres'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="mt-2 text-lg text-gray-600">
            Gestion complète de la plateforme médicale
          </p>
        </div>

        {/* Onglets de navigation - même style que les autres pages */}
        <div className="flex justify-center mb-8">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('utilisateurs')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'utilisateurs'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Rappels
            </button>
            <button
              onClick={() => setActiveTab('parametres')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'parametres'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Rendez vous
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-3">
            {activeTab === 'dashboard' && <><GestionUtilisateur/></>}
          {activeTab === 'utilisateurs' && <><EmailSenderButton/></>}
            {activeTab === 'parametres' && <><ListeRendezVous/></>}
          </div>
        </div>
      </div>
    </div>
  );
}