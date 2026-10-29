const templateCodigo = (codigo, nomeLoja = 'Ecommerce N-Tech solutions') => `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:30px 12px;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

          <!-- Cabeçalho -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 20px;">
              <div style="font-size:42px;line-height:1;">🛍️</div>
              <h1 style="margin:10px 0 0;color:#ffffff;font-size:22px;font-weight:700;">${nomeLoja}</h1>
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td align="center" style="padding:36px 28px 10px;">
              <h2 style="margin:0 0 10px;color:#1e293b;font-size:20px;">Confirma o teu email</h2>
              <p style="margin:0;color:#64748b;font-size:15px;line-height:1.6;">
                Usa o código abaixo para concluir o teu registo.
              </p>
            </td>
          </tr>

          <!-- Código -->
          <tr>
            <td align="center" style="padding:20px 28px;">
              <div style="display:inline-block;background:#eef2ff;border:2px dashed #6366f1;border-radius:12px;padding:16px 28px;">
                <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#4f46e5;font-family:'Courier New',monospace;">
                  ${codigo}
                </span>
              </div>
            </td>
          </tr>

          <!-- Aviso -->
          <tr>
            <td align="center" style="padding:0 28px 32px;">
              <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">
                ⏱️ Este código expira em <strong>10 minutos</strong>.<br>
                Se não foste tu a pedir, ignora este email.
              </p>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td align="center" style="background:#f8fafc;padding:18px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                © ${new Date().getFullYear()} ${nomeLoja}. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;

module.exports = templateCodigo;