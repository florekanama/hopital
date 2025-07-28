
// import { NextResponse } from 'next/server';
// import { exec } from 'child_process';
// import { supabase } from '@/lib/supabase/client';

// import fs from 'fs';
// import os from 'os';

// // Configuration SMTP (déplacez ces valeurs dans .env pour la production)
// const smtpConfig = {
//   server: 'smtp.gmail.com',
//   port: 587,
//   username: 'florekanama8@gmail.com',
//   password: 'tyod hijy iwin heuj',
//   from: 'Watu Wetu <florekanama8@gmail.com>'
// };

// type RendezVous = {
//   id: string;
//   statut: 'confirmé' | 'annulé';
//   date_heure: string;
//   lieu: string;
//   motif?: string;
//   patient: {
//     user: {
//       nom: string;
//       email: string;
//     };
//   };
//   medecin: {
//     user: {
//       nom: string;
//     };
//   };
// };

// export async function POST() {
//   try {
//     // 1. Récupérer les rendez-vous
//     const { data: rendezVous, error } = await supabase
//       .from('rendez_vous')
//       .select(`
//         id,
//         statut,
//         date_heure,
//         lieu,
//         motif,
//         patient:patient_infos!patient_id(
//           user:users!user_id(nom, email)
//         ),
//         medecin:medecin_infos!medecin_id(
//           user:users!user_id(nom)
//         )
//       `)
//       .in('statut', ['confirmé', 'annulé'])
//       .gte('date_heure', new Date().toISOString());

//     if (error) throw error;
//     if (!rendezVous?.length) {
//       return NextResponse.json({ 
//         message: 'Aucun rendez-vous à notifier',
//         details: []
//       });
//     }

//     // 2. Envoyer les emails
//     const results = await Promise.all(
//       rendezVous.map(async (rdv: any) => {
//         try {
//           if (!rdv.patient?.user?.email) {
//             return {
//               id: rdv.id,
//               status: 'skipped',
//               reason: 'Patient sans email'
//             };
//           }

//           const { subject, body } = createEmailContent(rdv);
//           const command = buildPowerShellCommand(
//             rdv.patient.user.email,
//             rdv.patient.user.nom,
//             subject,
//             body
//           );

//           const output = await executePowerShell(command);
          
//           // Vérification supplémentaire du résultat
//           if (!output.includes('Email sent to')) {
//             throw new Error(output);
//           }

//           return {
//             id: rdv.id,
//             status: 'success',
//             email: rdv.patient.user.email
//           };
//         } catch (error: any) {
//           return {
//             id: rdv.id,
//             status: 'error',
//             error: error.message,
//             email: rdv.patient?.user?.email
//           };
//         }
//       })
//     );

//     // 3. Retourner les résultats
//     const successCount = results.filter(r => r.status === 'success').length;
//     return NextResponse.json({
//       message: `${successCount}/${rendezVous.length} emails envoyés avec succès`,
//       details: results
//     });

//   } catch (error: any) {
//     console.error('Erreur API:', error);
//     return NextResponse.json(
//       { error: 'Erreur lors du traitement: ' + error.message },
//       { status: 500 }
//     );
//   }
// }

// // Fonction pour tester l'envoi d'email
// export async function GET() {
//   try {
//     const testEmail = 'deckerkein@gmail.com'; // Email de test
//     const testCommand = buildPowerShellCommand(
//       testEmail,
//       'Test Name',
//       '[TEST] Email de test Watu Wetu',
//       '<h1>Test réussi!</h1><p>Ceci est un email de test.</p>'
//     );

//     const output = await executePowerShell(testCommand);
    
//     return NextResponse.json({
//       success: true,
//       message: `Email de test envoyé à ${testEmail}`,
//       output: output
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: 'Échec du test: ' + error.message },
//       { status: 500 }
//     );
//   }
// }

// function createEmailContent(rdv: RendezVous) {
//   const dateRdv = new Date(rdv.date_heure).toLocaleString('fr-FR', {
//     weekday: 'long',
//     day: 'numeric',
//     month: 'long',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   });

//   if (rdv.statut === 'confirmé') {
//     return {
//       subject: `[Watu Wetu] Confirmation rendez-vous ${dateRdv}`,
//       body: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #4CAF50;">Confirmation de votre rendez-vous</h2>
//           <p>Bonjour ${rdv.patient.user.nom},</p>
//           <p>Votre rendez-vous avec le Dr ${rdv.medecin.user.nom} a été confirmé.</p>
          
//           <h3>Détails du rendez-vous:</h3>
//           <ul>
//             <li><strong>Date:</strong> ${dateRdv}</li>
//             <li><strong>Lieu:</strong> ${rdv.lieu}</li>
//             ${rdv.motif ? `<li><strong>Motif:</strong> ${rdv.motif}</li>` : ''}
//           </ul>
          
//           <p>Nous vous remercions de votre confiance.</p>
//           <p>Cordialement,<br>L'équipe Watu Wetu</p>
//         </div>
//       `
//     };
//   } else {
//     return {
//       subject: `[Watu Wetu] Annulation rendez-vous ${dateRdv}`,
//       body: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #f44336;">Annulation de votre rendez-vous</h2>
//           <p>Bonjour ${rdv.patient.user.nom},</p>
//           <p>Nous vous informons que votre rendez-vous avec le Dr ${rdv.medecin.user.nom} prévu le ${dateRdv} a été annulé.</p>
          
//           <p>Nous vous prions de nous excuser pour ce contretemps.</p>
//           <p>Veuillez prendre un nouveau rendez-vous via notre plateforme.</p>
          
//           <p>Cordialement,<br>L'équipe Watu Wetu</p>
//         </div>
//       `
//     };
//   }
// }


// function buildPowerShellCommand(toEmail: string, toName: string, subject: string, body: string): string {
//   // Convert to single line and escape for PowerShell
//   const clean = (str: string) => str
//     .replace(/'/g, "''")
//     .replace(/\r?\n/g, ' ')
//     .replace(/\s+/g, ' ')
//     .trim();

//   return [
//     `$ErrorActionPreference = 'Stop'`,
//     `try {`,
//     `  $username = '${clean(smtpConfig.username)}'`,
//     `  $password = '${clean(smtpConfig.password)}'`,
//     `  $cred = New-Object System.Management.Automation.PSCredential($username, (ConvertTo-SecureString -String $password -AsPlainText -Force))`,
//     `  $mailParams = @{`,
//     `    From = '${clean(smtpConfig.from)}'`,
//     `    To = '${clean(toName)} <${clean(toEmail)}>'`,
//     `    Subject = '${clean(subject)}'`,
//     `    Body = '${clean(body)}'`,
//     `    BodyAsHtml = $true`,
//     `    SmtpServer = '${smtpConfig.server}'`,
//     `    Port = ${smtpConfig.port}`,
//     `    Credential = $cred`,
//     `    UseSsl = $true`,
//     `    DeliveryNotificationOption = 'OnFailure'`,
//     `  }`,
//     `  Send-MailMessage @mailParams`,
//     `  Write-Output "Email sent to ${clean(toEmail)}"`,
//     `} catch {`,
//     `  Write-Output "PS_ERROR: $_"`,
//     `  exit 1`,
//     `}`
//   ].join('\n');
// }

// // async function executePowerShell(command: string): Promise<string> {
// //   return new Promise((resolve, reject) => {
// //     // Save to temporary file and execute that to avoid quoting issues
// //     const tempFile = `${os.tmpdir()}/email_${Date.now()}.ps1`;
// //     fs.writeFileSync(tempFile, command, 'utf8');
    
// //     exec(`powershell -ExecutionPolicy Bypass -File "${tempFile}"`, (error, stdout, stderr) => {
// //       fs.unlinkSync(tempFile); // Clean up
      
// //       if (error) {
// //         reject(new Error(`PowerShell error: ${error.message}`));
// //       } else if (stderr) {
// //         reject(new Error(stderr));
// //       } else {
// //         resolve(stdout);
// //       }
// //     });
// //   });
// // }

// async function executePowerShell(command: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     // Save to temporary file and execute that to avoid quoting issues
//     const tempFile = `${os.tmpdir()}/email_${Date.now()}.ps1`;
//     fs.writeFileSync(tempFile, command, 'utf8');
    
//     console.log('Executing PowerShell script:');
//     console.log('----------------------------');
//     console.log(command); // Affiche la commande PowerShell complète
//     console.log('----------------------------');

//     const child = exec(
//       `powershell -ExecutionPolicy Bypass -File "${tempFile}"`,
//       (error, stdout, stderr) => {
//         // Clean up
//         fs.unlinkSync(tempFile);

//         // Affiche toutes les sorties dans le terminal
//         console.log('\nPowerShell Output:');
//         console.log('----------------------------');
//         if (stdout) console.log('STDOUT:', stdout);
//         if (stderr) console.error('STDERR:', stderr);
//         if (error) console.error('ERROR:', error.message);
//         console.log('----------------------------\n');

//         if (error) {
//           reject(new Error(`PowerShell error: ${error.message}\n${stderr}`));
//         } else if (stderr) {
//           reject(new Error(stderr));
//         } else {
//           resolve(stdout);
//         }
//       }
//     );

//     // Écoute les sorties en temps réel
//     child.stdout?.on('data', (data) => {
//       console.log('PS Output:', data.toString());
//     });
    
//     child.stderr?.on('data', (data) => {
//       console.error('PS Error:', data.toString());
//     });
//   });
// }



import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { supabase } from '@/lib/supabase/client';

import fs from 'fs';
import os from 'os';

// Configuration SMTP (déplacez ces valeurs dans .env pour la production)
const smtpConfig = {
  server: 'smtp.gmail.com',
  port: 587,
  username: 'florekanama8@gmail.com',
  password: 'tyod hijy iwin heuj',
  from: 'Watu Wetu <florekanama8@gmail.com>'
};


const LOGO_URL="https://i.ibb.co/ZpQPGPbg/watu.jpg"

type RendezVous = {
  id: string;
  statut: 'confirmé' | 'annulé';
  date_heure: string;
  lieu: string;
  motif?: string;
  patient: {
    user: {
      nom: string;
      email: string;
    };
  };
  medecin: {
    user: {
      nom: string;
    };
  };
};

export async function POST() {
  try {
    // 1. Récupérer les rendez-vous
    const { data: rendezVous, error } = await supabase
      .from('rendez_vous')
      .select(`
        id,
        statut,
        date_heure,
        lieu,
        motif,
        patient:patient_infos!patient_id(
          user:users!user_id(nom, email)
        ),
        medecin:medecin_infos!medecin_id(
          user:users!user_id(nom)
        )
      `)
      .in('statut', ['confirmé', 'annulé'])
      .gte('date_heure', new Date().toISOString());

    if (error) throw error;
    if (!rendezVous?.length) {
      return NextResponse.json({ 
        message: 'Aucun rendez-vous à notifier',
        details: []
      });
    }

    // 2. Envoyer les emails
    const results = await Promise.all(
      rendezVous.map(async (rdv: any) => {
        try {
          if (!rdv.patient?.user?.email) {
            return {
              id: rdv.id,
              status: 'skipped',
              reason: 'Patient sans email'
            };
          }

          const { subject, body } = createEmailContent(rdv);
          const command = buildPowerShellCommand(
            rdv.patient.user.email,
            rdv.patient.user.nom,
            subject,
            body
          );

          const output = await executePowerShell(command);
          
          // Vérification supplémentaire du résultat
          if (!output.includes('Email sent to')) {
            throw new Error(output);
          }

          return {
            id: rdv.id,
            status: 'success',
            email: rdv.patient.user.email
          };
        } catch (error: any) {
          return {
            id: rdv.id,
            status: 'error',
            error: error.message,
            email: rdv.patient?.user?.email
          };
        }
      })
    );

    // 3. Retourner les résultats
    const successCount = results.filter(r => r.status === 'success').length;
    return NextResponse.json({
      message: `${successCount}/${rendezVous.length} emails envoyés avec succès`,
      details: results
    });

  } catch (error: any) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement: ' + error.message },
      { status: 500 }
    );
  }
}

// Fonction pour tester l'envoi d'email
export async function GET() {
  try {
    const testEmail = 'deckerkein@gmail.com'; // Email de test
    const testCommand = buildPowerShellCommand(
      testEmail,
      'Test Name',
      '[TEST] Email de test Watu Wetu',
      '<h1>Test réussi!</h1><p>Ceci est un email de test.</p>'
    );

    const output = await executePowerShell(testCommand);
    
    return NextResponse.json({
      success: true,
      message: `Email de test envoyé à ${testEmail}`,
      output: output
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Échec du test: ' + error.message },
      { status: 500 }
    );
  }
}

// function createEmailContent(rdv: RendezVous) {
//   const dateRdv = new Date(rdv.date_heure).toLocaleString('fr-FR', {
//     weekday: 'long',
//     day: 'numeric',
//     month: 'long',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   });

//   if (rdv.statut === 'confirmé') {
//     return {
//       subject: `[Watu Wetu] Confirmation rendez-vous ${dateRdv}`,
//       body: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #4CAF50;">Confirmation de votre rendez-vous</h2>
//           <p>Bonjour ${rdv.patient.user.nom},</p>
//           <p>Votre rendez-vous avec le Dr ${rdv.medecin.user.nom} a été confirmé.</p>
          
//           <h3>Détails du rendez-vous:</h3>
//           <ul>
//             <li><strong>Date:</strong> ${dateRdv}</li>
//             <li><strong>Lieu:</strong> ${rdv.lieu}</li>
//             ${rdv.motif ? `<li><strong>Motif:</strong> ${rdv.motif}</li>` : ''}
//           </ul>
          
//           <p>Nous vous remercions de votre confiance.</p>
//           <p>Cordialement,<br>L'équipe Watu Wetu</p>
//         </div>
//       `
//     };
//   } else {
//     return {
//       subject: `[Watu Wetu] Annulation rendez-vous ${dateRdv}`,
//       body: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #f44336;">Annulation de votre rendez-vous</h2>
//           <p>Bonjour ${rdv.patient.user.nom},</p>
//           <p>Nous vous informons que votre rendez-vous avec le Dr ${rdv.medecin.user.nom} prévu le ${dateRdv} a été annulé.</p>
          
//           <p>Nous vous prions de nous excuser pour ce contretemps.</p>
//           <p>Veuillez prendre un nouveau rendez-vous via notre plateforme.</p>
          
//           <p>Cordialement,<br>L'équipe Watu Wetu</p>
//         </div>
//       `
//     };
//   }
// }

function createEmailContent(rdv: RendezVous) {
  const dateRdv = new Date(rdv.date_heure).toLocaleString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const baseTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; }
        .header { text-align: center; margin-bottom: 20px; }
        .logo { max-height: 80px; margin-bottom: 15px; }
        h1 { color: #2c3e50; font-size: 24px; margin-top: 0; }
        .card { background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #7f8c8d; text-align: center; }
        .button { 
          display: inline-block; padding: 10px 20px; background-color: #3498db; 
          color: white !important; text-decoration: none; border-radius: 4px; margin-top: 15px;
        }
        ul.details { list-style-type: none; padding-left: 0; }
        ul.details li { margin-bottom: 8px; }
        ul.details strong { display: inline-block; width: 80px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${LOGO_URL}" alt="Watu Wetu Logo" class="logo">
          <h1>Watu Wetu - Gestion Médicale</h1>
        </div>
  `;

  if (rdv.statut === 'confirmé') {
    return {
      subject: `[Watu Wetu] Confirmation de votre rendez-vous du ${dateRdv}`,
      body: baseTemplate + `
        <p>Bonjour <strong>${rdv.patient.user.nom}</strong>,</p>
        <p>Votre rendez-vous avec le Dr <strong>${rdv.medecin.user.nom}</strong> a été confirmé.</p>
        
        <div class="card">
          <h3 style="margin-top: 0;">📅 Détails du rendez-vous</h3>
          <ul class="details">
            <li><strong>Date:</strong> ${dateRdv}</li>
            <li><strong>Lieu:</strong> ${rdv.lieu}</li>
            ${rdv.motif ? `<li><strong>Motif:</strong> ${rdv.motif}</li>` : ''}
            <li><strong>Médecin:</strong> Dr ${rdv.medecin.user.nom}</li>
          </ul>
        </div>

        <p>Nous vous remercions de votre confiance et vous attendons à la date convenue.</p>
        
        <div class="footer">
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          <p>© ${new Date().getFullYear()} Watu Wetu - Tous droits réservés</p>
        </div>
      </div>
    </body>
    </html>
      `
    };
  } else {
    return {
      subject: `[Watu Wetu] Annulation de votre rendez-vous du ${dateRdv}`,
      body: baseTemplate + `
        <p>Bonjour <strong>${rdv.patient.user.nom}</strong>,</p>
        <p>Nous vous informons avec regret que votre rendez-vous avec le Dr <strong>${rdv.medecin.user.nom}</strong> prévu le <strong>${dateRdv}</strong> a été annulé.</p>
        
        <div class="card" style="background-color: #fde8e8;">
          <h3 style="margin-top: 0; color: #e74c3c;">❌ Rendez-vous annulé</h3>
          <p>Nous vous prions de nous excuser pour la gêne occasionnée.</p>
        </div>

        <p style="text-align: center;">
          <a href="https://watuwetu.vercel.app" class="button">Prendre un nouveau rendez-vous</a>
        </p>

        <div class="footer">
          <p>Pour toute question, contactez-nous à contact@watu-wetu.com</p>
          <p>© ${new Date().getFullYear()} Watu Wetu</p>
        </div>
      </div>
    </body>
    </html>
      `
    };
  }
}



function buildPowerShellCommand(toEmail: string, toName: string, subject: string, body: string): string {
  // Convert to single line and escape for PowerShell
  const clean = (str: string) => str
    .replace(/'/g, "''")
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return [
    `$ErrorActionPreference = 'Stop'`,
    `try {`,
    `  $username = '${clean(smtpConfig.username)}'`,
    `  $password = '${clean(smtpConfig.password)}'`,
    `  $cred = New-Object System.Management.Automation.PSCredential($username, (ConvertTo-SecureString -String $password -AsPlainText -Force))`,
    `  $mailParams = @{`,
    `    From = '${clean(smtpConfig.from)}'`,
    `    To = '${clean(toName)} <${clean(toEmail)}>'`,
    `    Subject = '${clean(subject)}'`,
    `    Body = '${clean(body)}'`,
    `    BodyAsHtml = $true`,
    `    SmtpServer = '${smtpConfig.server}'`,
    `    Port = ${smtpConfig.port}`,
    `    Credential = $cred`,
    `    UseSsl = $true`,
    `    DeliveryNotificationOption = 'OnFailure'`,
    `  }`,
    `  Send-MailMessage @mailParams`,
    `  Write-Output "Email sent to ${clean(toEmail)}"`,
    `} catch {`,
    `  Write-Output "PS_ERROR: $_"`,
    `  exit 1`,
    `}`
  ].join('\n');
}

// async function executePowerShell(command: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     // Save to temporary file and execute that to avoid quoting issues
//     const tempFile = `${os.tmpdir()}/email_${Date.now()}.ps1`;
//     fs.writeFileSync(tempFile, command, 'utf8');
    
//     exec(`powershell -ExecutionPolicy Bypass -File "${tempFile}"`, (error, stdout, stderr) => {
//       fs.unlinkSync(tempFile); // Clean up
      
//       if (error) {
//         reject(new Error(`PowerShell error: ${error.message}`));
//       } else if (stderr) {
//         reject(new Error(stderr));
//       } else {
//         resolve(stdout);
//       }
//     });
//   });
// }

async function executePowerShell(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Save to temporary file and execute that to avoid quoting issues
    const tempFile = `${os.tmpdir()}/email_${Date.now()}.ps1`;
    fs.writeFileSync(tempFile, command, 'utf8');
    
    console.log('Executing PowerShell script:');
    console.log('----------------------------');
    console.log(command); // Affiche la commande PowerShell complète
    console.log('----------------------------');

    const child = exec(
      `powershell -ExecutionPolicy Bypass -File "${tempFile}"`,
      (error, stdout, stderr) => {
        // Clean up
        fs.unlinkSync(tempFile);

        // Affiche toutes les sorties dans le terminal
        console.log('\nPowerShell Output:');
        console.log('----------------------------');
        if (stdout) console.log('STDOUT:', stdout);
        if (stderr) console.error('STDERR:', stderr);
        if (error) console.error('ERROR:', error.message);
        console.log('----------------------------\n');

        if (error) {
          reject(new Error(`PowerShell error: ${error.message}\n${stderr}`));
        } else if (stderr) {
          reject(new Error(stderr));
        } else {
          resolve(stdout);
        }
      }
    );

    // Écoute les sorties en temps réel
    child.stdout?.on('data', (data) => {
      console.log('PS Output:', data.toString());
    });
    
    child.stderr?.on('data', (data) => {
      console.error('PS Error:', data.toString());
    });
  });
}