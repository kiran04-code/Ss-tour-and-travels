import nodemailer from "nodemailer";

export interface QuoteNotificationPayload {
  quoteId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  message: string;
  carName: string;
  preferredContactMethod?: string;
  createdAt?: Date;
}

export const emailService = {
  async sendNewQuoteNotification(payload: QuoteNotificationPayload): Promise<void> {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "kiran.rathod.dev1@gmail.com";
    const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
    const adminUrl = `${frontendUrl}/admin`;
    const cleanPhone = payload.customerPhone.replace(/\D/g, "");

    const subject = `🚖 New Quote Request: ${payload.customerName} (${payload.carName}) - SS Tours & Travels`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Quote Request</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7F9FC; margin: 0; padding: 20px; color: #071D49; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 14px rgba(7, 29, 73, 0.08); }
    .header { background: #071D49; padding: 24px 28px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; color: #F9B900; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.8); }
    .content { padding: 28px; }
    .badge { display: inline-block; background: #FFF4CC; color: #805F00; font-weight: 700; font-size: 11px; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 16px; }
    .info-table { width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 20px; }
    .info-table td { padding: 10px 12px; border-bottom: 1px solid #F1F5F9; font-size: 13px; }
    .info-table td.label { font-weight: 700; color: #64748B; width: 35%; }
    .info-table td.value { font-weight: 600; color: #071D49; }
    .message-box { background: #F8FAFC; border-left: 4px solid #F9B900; padding: 14px 16px; border-radius: 6px; font-size: 13px; line-height: 1.6; color: #334155; margin: 16px 0 24px 0; }
    .btn-container { text-align: center; margin: 28px 0 16px 0; }
    .btn-primary { display: inline-block; background: #071D49; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 28px; border-radius: 8px; border: 2px solid #F9B900; }
    .quick-actions { margin-top: 14px; text-align: center; font-size: 13px; }
    .quick-actions a { margin: 0 8px; font-weight: 700; text-decoration: none; }
    .footer { background: #F8FAFC; padding: 18px; text-align: center; font-size: 11px; color: #94A3B8; border-top: 1px solid #F1F5F9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SS TOURS &amp; TRAVELS</h1>
      <p>New Ride &amp; Taxi Quote Request Received</p>
    </div>
    <div class="content">
      <div class="badge">New Inbound Booking Lead</div>
      <h2 style="margin: 0 0 8px 0; font-size: 18px; color: #071D49;">Customer: ${payload.customerName}</h2>
      <p style="margin: 0 0 16px 0; font-size: 13px; color: #64748B;">A new quote inquiry has just been submitted on your website.</p>

      <table class="info-table">
        <tr>
          <td class="label">Customer Name:</td>
          <td class="value">${payload.customerName}</td>
        </tr>
        <tr>
          <td class="label">Phone Number:</td>
          <td class="value">
            <a href="tel:${payload.customerPhone}" style="color: #071D49; text-decoration: underline;">${payload.customerPhone}</a>
          </td>
        </tr>
        <tr>
          <td class="label">Email Address:</td>
          <td class="value">
            <a href="mailto:${payload.customerEmail}" style="color: #071D49;">${payload.customerEmail}</a>
          </td>
        </tr>
        <tr>
          <td class="label">Requested Vehicle:</td>
          <td class="value"><b style="color: #805F00;">${payload.carName}</b></td>
        </tr>
        <tr>
          <td class="label">Received At:</td>
          <td class="value">${new Date(payload.createdAt || Date.now()).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
        </tr>
      </table>

      <div style="font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase;">Customer Travel Requirement / Route:</div>
      <div class="message-box">
        ${payload.message.replace(/\n/g, "<br>")}
      </div>

      <div class="btn-container">
        <a href="${adminUrl}" target="_blank" class="btn-primary">
          👉 Open Admin Dashboard to Manage Quote
        </a>
      </div>

      <div class="quick-actions">
        <a href="tel:${payload.customerPhone}" style="color: #071D49;">📞 Call Customer</a>
        &bull;
        <a href="https://wa.me/${cleanPhone}" target="_blank" style="color: #26734D;">💬 WhatsApp Chat</a>
        &bull;
        <a href="${adminUrl}" style="color: #805F00;">⚡ View in Admin</a>
      </div>
    </div>
    <div class="footer">
      This is an automated booking alert sent to <b>${adminEmail}</b>.<br>
      SS Tours &amp; Travels &bull; Solapur, Maharashtra
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
New Taxi Quote Request - SS Tours & Travels

Customer Details:
- Name: ${payload.customerName}
- Phone: ${payload.customerPhone}
- Email: ${payload.customerEmail}
- Vehicle: ${payload.carName}
- Time: ${new Date(payload.createdAt || Date.now()).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}

Requirement:
${payload.message}

Manage this quote in Admin Dashboard:
${adminUrl}
    `.trim();

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromAddress = process.env.SMTP_FROM || `"SS Tours & Travels" <${smtpUser || "notifications@sstours.in"}>`;

    console.log(`[Quote Notification] New inquiry from ${payload.customerName} (${payload.customerPhone}) for ${payload.carName}. Sending alert to ${adminEmail}...`);

    if (!smtpUser || !smtpPass) {
      console.log(`[Email Service] SMTP credentials not configured in .env. Email notification prepared for: ${adminEmail}`);
      console.log(`[Email Service] Direct Admin Link: ${adminUrl}`);
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: fromAddress,
        to: adminEmail,
        subject,
        text: textContent,
        html: htmlContent
      });

      console.log(`[Email Service] Quote notification successfully sent to ${adminEmail}`);
    } catch (error) {
      console.error("[Email Service] Failed to send email via SMTP:", (error as Error).message);
    }
  }
};
