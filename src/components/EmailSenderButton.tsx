import { useState } from 'react';
import { toast } from 'react-toastify';

export function EmailSenderButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSendEmails = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      const response = await fetch('/api/send-rdv-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur inconnue');

      setResults(data);
      toast.success(data.message);
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi des emails');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Envoi des emails de rendez-vous</h2>
      
      <button
        onClick={handleSendEmails}
        disabled={isLoading}
        className={`px-4 py-2 rounded-md text-white ${
          isLoading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
        } transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Envoi en cours...
          </span>
        ) : (
          'Envoyer les emails de confirmation/annulation'
        )}
      </button>

      {results && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-2">Résultats:</h3>
          <p className="mb-2">{results.message}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-green-50 p-3 rounded">
              <p className="text-green-800 font-medium">
                Succès: {results.details.filter((r: any) => r.status === 'success').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded">
              <p className="text-yellow-800 font-medium">
                Ignorés: {results.details.filter((r: any) => r.status === 'skipped').length}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <p className="text-red-800 font-medium">
                Erreurs: {results.details.filter((r: any) => r.status === 'error').length}
              </p>
            </div>
          </div>

          <details className="mt-4">
            <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
              Voir les détails complets
            </summary>
            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-60 border border-gray-200">
              {JSON.stringify(results.details, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}