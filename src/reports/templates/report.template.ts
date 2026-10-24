export interface ReportTemplateData {
  address: string;
  description: string;
  severity: string;
  reporterPhone: string;
  photoUrl?: string;
  id?: number;
  createdAt?: Date;
}

export const generateReportTemplate = (
  dto: ReportTemplateData,
  photoUrl?: string,
): string => {
  const finalPhotoUrl = photoUrl || dto.photoUrl;

  const severityColors: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    high: { bg: '#fed7d7', text: '#9b2c2c', label: 'Alta' },
    medium: { bg: '#feebc8', text: '#9c4221', label: 'Media' },
    low: { bg: '#c6f6d5', text: '#22543d', label: 'Baja' },
  };

  const currentSeverity = severityColors[dto.severity?.toLowerCase()] || {
    bg: '#e2e8f0',
    text: '#2d3748',
    label: dto.severity || 'No especificada',
  };

  const photoHtml = finalPhotoUrl
    ? `
        <!-- Leak Photo Section -->
        <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;">
          <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #1e293b; text-align: left;">
            📸 Evidencia Fotográfica de la Fuga:
          </p>
          <a href="${finalPhotoUrl}" target="_blank" style="display: inline-block;">
            <img src="${finalPhotoUrl}" alt="Foto de la fuga de agua" style="max-width: 100%; height: auto; max-height: 400px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: block; margin: 0 auto; object-fit: cover;" />
          </a>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">
            Haz clic en la imagen si deseas verla en tamaño completo.
          </p>
        </div>
      `
    : '';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notificación de Fuga de Agua - AguaFix</title>
</head>
<body style="margin: 0; padding: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f9; color: #333333;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">💧 AguaFix - Segunda Prueba de Sistema de Reportes</h1>
        <p style="margin: 0; font-size: 15px; opacity: 0.95;">Segunda Prueba Aviso de Fuga de Agua en Vía Pública</p>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 28px 24px;">
        <p style="margin-top: 0; font-size: 16px; line-height: 1.5; color: #4b5563;">
          Se ha recibido un nuevo reporte ciudadano a través de la plataforma. A continuación se presentan los detalles para la atención de la cuadrilla de mantenimiento:
        </p>

        <!-- Details Table -->
        <table border="0" cellpadding="12" cellspacing="0" width="100%" style="border-collapse: collapse; margin-top: 16px; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
          <tr style="background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
            <td width="35%" style="font-weight: 600; color: #374151; font-size: 14px;">📍 Dirección / Referencia:</td>
            <td style="color: #1f2937; font-size: 14px; font-weight: 500;">${dto.address}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="font-weight: 600; color: #374151; font-size: 14px;">📝 Descripción:</td>
            <td style="color: #1f2937; font-size: 14px; line-height: 1.4;">${dto.description}</td>
          </tr>
          <tr style="background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
            <td style="font-weight: 600; color: #374151; font-size: 14px;">⚠️ Severidad:</td>
            <td>
              <span style="display: inline-block; padding: 4px 12px; font-size: 13px; font-weight: 700; border-radius: 9999px; background-color: ${currentSeverity.bg}; color: ${currentSeverity.text}; text-transform: uppercase;">
                ${currentSeverity.label}
              </span>
            </td>
          </tr>
          <tr>
            <td style="font-weight: 600; color: #374151; font-size: 14px;">📞 Teléfono de Contacto:</td>
            <td style="color: #1f2937; font-size: 14px; font-weight: 600;">
              <a href="tel:${dto.reporterPhone}" style="color: #0284c7; text-decoration: none;">${dto.reporterPhone}</a>
            </td>
          </tr>
        </table>

        ${photoHtml}

        <!-- Notice -->
        <div style="margin-top: 24px; padding: 14px 16px; background-color: #eff6ff; border-left: 4px solid #0284c7; border-radius: 4px;">
          <p style="margin: 0; font-size: 13px; line-height: 1.4; color: #1e40af;">
            <strong>Nota para la cuadrilla:</strong> Por favor acudir al sitio a la brevedad para evaluar y proceder con la reparación correspondiente.
          </p>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; font-size: 12px; color: #64748b;">
        <p style="margin: 0 0 4px 0;">Este es un correo automático generado por el Sistema Municipal de Fugas de Agua <strong>AguaFix</strong>.</p>
        <p style="margin: 0;">Favor de no responder directamente a este mensaje.</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};
