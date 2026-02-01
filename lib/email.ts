import nodemailer from 'nodemailer';

const FROM_EMAIL = process.env.SMTP_FROM || 'LFP Admin <noreply@laforetperformance.fr>';
const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3002';

// Créer le transporteur SMTP
function createTransporter() {
  // En dev sans config SMTP, on utilise un mode console
  if (!process.env.SMTP_HOST) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true pour 465, false pour autres ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendPasswordSetupEmail(
  email: string,
  name: string,
  token: string
) {
  const setupUrl = `${APP_URL}/admin/setup-password?token=${token}`;
  const transporter = createTransporter();

  // Mode dev sans SMTP : pas de logs
  if (!transporter) {
    return { success: true, data: { id: 'dev-mode' } };
  }

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'Bienvenue sur LFP Admin - Definissez votre mot de passe',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenue sur LFP</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #000000;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px;">

                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding-bottom: 32px;">
                      <img src="https://oh7qghmltywp4luq.public.blob.vercel-storage.com/logo-lfp.jpg" alt="LFP" width="80" height="80" style="border-radius: 50%; border: 2px solid #333333; display: block;" />
                    </td>
                  </tr>

                  <!-- Main Card -->
                  <tr>
                    <td>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border: 1px solid #1f1f1f; border-radius: 20px; overflow: hidden;">

                        <!-- White accent bar -->
                        <tr>
                          <td style="height: 2px; background: linear-gradient(90deg, #333333 0%, #ffffff 50%, #333333 100%);"></td>
                        </tr>

                        <!-- Content -->
                        <tr>
                          <td style="padding: 48px 40px;">

                            <!-- Welcome badge -->
                            <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                              <tr>
                                <td style="background-color: rgba(255, 255, 255, 0.08); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.15);">
                                  <span style="color: #999999; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Nouveau compte</span>
                                </td>
                              </tr>
                            </table>

                            <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.3;">
                              Bienvenue ${name} !
                            </h1>

                            <p style="color: #666666; font-size: 15px; line-height: 1.7; margin: 0 0 28px 0;">
                              Un compte administrateur a été créé pour vous sur le panel de gestion de <strong style="color: #888888;">La Forêt Performance</strong>.
                            </p>

                            <!-- Info box -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #111111; border-radius: 12px; margin-bottom: 32px;">
                              <tr>
                                <td style="padding: 20px;">
                                  <p style="color: #888888; font-size: 14px; line-height: 1.6; margin: 0;">
                                    Cliquez sur le bouton ci-dessous pour définir votre mot de passe et activer votre accès au panel d'administration.
                                  </p>
                                </td>
                              </tr>
                            </table>

                            <!-- Button -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                              <tr>
                                <td align="center">
                                  <a href="${setupUrl}" style="display: inline-block; background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%); color: #000000; text-decoration: none; padding: 18px 48px; border-radius: 12px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);">
                                    Activer mon compte
                                  </a>
                                </td>
                              </tr>
                            </table>

                          </td>
                        </tr>

                        <!-- Footer info -->
                        <tr>
                          <td style="padding: 0 40px 40px 40px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top: 1px solid #1f1f1f; padding-top: 24px;">
                              <tr>
                                <td>
                                  <p style="color: #444444; font-size: 13px; line-height: 1.6; margin: 0;">
                                    <span style="color: #666666;">&#9679;</span> Ce lien expire dans <strong style="color: #666666;">24 heures</strong><br>
                                    <span style="color: #666666;">&#9679;</span> Si vous n'avez pas demandé ce compte, ignorez cet email
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding-top: 32px;">
                      <p style="color: #333333; font-size: 12px; margin: 0 0 8px 0;">
                        La Forêt Performance
                      </p>
                      <p style="color: #222222; font-size: 11px; margin: 0;">
                        Pâturages et belles mécaniques en Charente-Maritime
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
    return { success: true, data: { id: info.messageId } };
  } catch (error) {
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
) {
  const resetUrl = `${APP_URL}/admin/setup-password?token=${token}&reset=true`;
  const transporter = createTransporter();

  // Mode dev sans SMTP : pas de logs
  if (!transporter) {
    return { success: true, data: { id: 'dev-mode' } };
  }

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'LFP Admin - Reinitialisation de mot de passe',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reinitialisation mot de passe</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #000000;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px;">

                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding-bottom: 32px;">
                      <img src="https://oh7qghmltywp4luq.public.blob.vercel-storage.com/logo-lfp.jpg" alt="LFP" width="80" height="80" style="border-radius: 50%; border: 2px solid #333333; display: block;" />
                    </td>
                  </tr>

                  <!-- Main Card -->
                  <tr>
                    <td>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border: 1px solid #1f1f1f; border-radius: 20px; overflow: hidden;">

                        <!-- Gray accent bar for reset -->
                        <tr>
                          <td style="height: 2px; background: linear-gradient(90deg, #333333 0%, #888888 50%, #333333 100%);"></td>
                        </tr>

                        <!-- Content -->
                        <tr>
                          <td style="padding: 48px 40px;">

                            <!-- Reset badge -->
                            <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                              <tr>
                                <td style="background-color: rgba(255, 255, 255, 0.05); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
                                  <span style="color: #888888; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Sécurité</span>
                                </td>
                              </tr>
                            </table>

                            <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.3;">
                              Réinitialisation du mot de passe
                            </h1>

                            <p style="color: #666666; font-size: 15px; line-height: 1.7; margin: 0 0 28px 0;">
                              Bonjour <strong style="color: #888888;">${name}</strong>, vous avez demandé à réinitialiser votre mot de passe pour accéder au panel d'administration.
                            </p>

                            <!-- Info box -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #111111; border-radius: 12px; margin-bottom: 32px;">
                              <tr>
                                <td style="padding: 20px;">
                                  <p style="color: #888888; font-size: 14px; line-height: 1.6; margin: 0;">
                                    Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe sécurisé.
                                  </p>
                                </td>
                              </tr>
                            </table>

                            <!-- Button -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                              <tr>
                                <td align="center">
                                  <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%); color: #000000; text-decoration: none; padding: 18px 48px; border-radius: 12px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);">
                                    Nouveau mot de passe
                                  </a>
                                </td>
                              </tr>
                            </table>

                          </td>
                        </tr>

                        <!-- Footer info -->
                        <tr>
                          <td style="padding: 0 40px 40px 40px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top: 1px solid #1f1f1f; padding-top: 24px;">
                              <tr>
                                <td>
                                  <p style="color: #444444; font-size: 13px; line-height: 1.6; margin: 0;">
                                    <span style="color: #888888;">&#9679;</span> Ce lien expire dans <strong style="color: #666666;">1 heure</strong><br>
                                    <span style="color: #666666;">&#9679;</span> Si vous n'avez pas fait cette demande, ignorez cet email
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding-top: 32px;">
                      <p style="color: #333333; font-size: 12px; margin: 0 0 8px 0;">
                        La Forêt Performance
                      </p>
                      <p style="color: #222222; font-size: 11px; margin: 0;">
                        Paturages et belles mécaniques en Charente-Maritime
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, data: { id: info.messageId } };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}
