// app/layout.tsx
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Système de Gestion Hôpital',
  description: 'Application de gestion des rendez-vous médicaux',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>

        <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
