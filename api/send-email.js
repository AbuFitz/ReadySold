// Vercel Serverless Function for Resend Email
import { Resend } from 'resend';

const resend = new Resend('re_RmcnCA7U_KzJqYoqerAFpFMSk5wshwViY');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { type, data } = req.body;

    // Validate required fields
    if (!type || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let emailContent;
    let subject;
    let recipientEmail = 'hello@readysold.co.uk'; // Your company email

    // Generate email based on form type
    if (type === 'valuation') {
      subject = `New Valuation Request - ${data.registration || 'N/A'}`;
      emailContent = generateValuationEmail(data);
    } else if (type === 'hero-form') {
      subject = `New Lead - ${data.name || 'Quick Enquiry'}`;
      emailContent = generateHeroFormEmail(data);
    } else {
      return res.status(400).json({ error: 'Invalid form type' });
    }

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: 'ReadySold <noreply@readysold.co.uk>', // Update with your verified domain
      to: recipientEmail,
      subject: subject,
      html: emailContent,
      replyTo: data.email || undefined,
    });

    return res.status(200).json({ 
      success: true, 
      messageId: emailResponse.id 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
}

// Generate HTML email for valuation requests
function generateValuationEmail(data) {
  const baseUrl = 'https://readysold.vercel.app'; // Update with your actual domain
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>New Valuation Request - ReadySold</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      color: #1e293b; 
      margin: 0; 
      padding: 0; 
      background-color: #f1f5f9;
      -webkit-font-smoothing: antialiased;
    }
    .email-wrapper { 
      width: 100%; 
      background-color: #f1f5f9; 
      padding: 40px 0; 
    }
    .email-container { 
      max-width: 680px; 
      margin: 0 auto; 
      background-color: #ffffff; 
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header { 
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); 
      padding: 50px 40px; 
      text-align: center;
      position: relative;
    }
    .logo { 
      margin-bottom: 20px;
    }
    .logo img { 
      max-width: 200px; 
      height: auto; 
      display: inline-block;
    }
    .header h1 { 
      color: #ffffff; 
      margin: 20px 0 10px 0; 
      font-size: 32px; 
      font-weight: 700; 
      letter-spacing: -0.5px;
    }
    .header p { 
      color: rgba(255, 255, 255, 0.9); 
      font-size: 16px; 
      margin: 0;
    }
    .banner-image {
      width: 100%;
      height: 200px;
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .banner-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      opacity: 0.9;
    }
    .content { 
      padding: 50px 40px; 
    }
    .priority-badge { 
      display: inline-block; 
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
      color: white; 
      padding: 8px 20px; 
      border-radius: 20px; 
      font-size: 13px; 
      font-weight: 700; 
      text-transform: uppercase; 
      letter-spacing: 0.5px;
      margin-bottom: 30px;
    }
    .section { 
      margin-bottom: 40px; 
    }
    .section:last-child {
      margin-bottom: 0;
    }
    .section-title { 
      color: #0f172a; 
      font-size: 20px; 
      font-weight: 700; 
      margin-bottom: 20px; 
      padding-bottom: 12px;
      border-bottom: 3px solid #0ea5e9;
    }
    .info-grid {
      display: table;
      width: 100%;
      border-collapse: collapse;
    }
    .info-row { 
      display: table-row;
    }
    .info-label { 
      display: table-cell;
      font-weight: 600; 
      color: #475569; 
      padding: 12px 20px 12px 0;
      width: 40%;
      vertical-align: top;
    }
    .info-value { 
      display: table-cell;
      color: #0f172a;
      padding: 12px 0;
      font-weight: 500;
      vertical-align: top;
    }
    .info-value strong {
      color: #0ea5e9;
      font-size: 18px;
    }
    .highlight-box { 
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-left: 4px solid #0ea5e9; 
      padding: 25px; 
      margin: 30px 0; 
      border-radius: 8px;
    }
    .highlight-box p {
      margin: 0;
      color: #0f172a;
      line-height: 1.7;
    }
    .message-box {
      background-color: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 25px;
      margin: 20px 0;
    }
    .message-box p {
      margin: 0;
      color: #334155;
      line-height: 1.8;
      font-size: 15px;
    }
    .footer { 
      background-color: #0f172a; 
      padding: 40px 40px 30px 40px; 
      text-align: center;
    }
    .footer-logo {
      margin-bottom: 20px;
    }
    .footer-logo img {
      max-width: 150px;
      height: auto;
      opacity: 0.9;
    }
    .footer-text {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      margin-bottom: 20px;
      line-height: 1.6;
    }
    .footer-links {
      margin: 25px 0 20px 0;
      padding: 0;
    }
    .footer-links a {
      color: #0ea5e9;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: color 0.2s;
    }
    .footer-links a:hover {
      color: #38bdf8;
    }
    .footer-divider {
      color: rgba(255, 255, 255, 0.3);
      margin: 0 10px;
    }
    .footer-copyright {
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      margin-top: 20px;
    }
    .timestamp {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 20px 25px;
      border-radius: 8px;
      margin-top: 30px;
    }
    .timestamp p {
      margin: 0;
      color: #92400e;
      font-weight: 600;
      font-size: 15px;
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 20px 0; }
      .email-container { border-radius: 0; }
      .header { padding: 40px 25px; }
      .header h1 { font-size: 26px; }
      .content { padding: 35px 25px; }
      .footer { padding: 35px 25px 25px 25px; }
      .info-label, .info-value { display: block; width: 100%; padding: 8px 0; }
      .info-label { font-weight: 700; color: #0f172a; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header -->
      <div class="header">
        <div class="logo">
          <img src="${baseUrl}/images/photograph.png" alt="ReadySold Logo">
        </div>
        <h1>🚗 New Valuation Request</h1>
        <p>A potential customer is ready to sell their vehicle</p>
      </div>

      <!-- Banner Image -->
      <div class="banner-image">
        <img src="${baseUrl}/images/photograph.png" alt="ReadySold Vehicle">
      </div>

      <!-- Content -->
      <div class="content">
        <span class="priority-badge">⚡ New Lead</span>

        <!-- Vehicle Details -->
        <div class="section">
          <h2 class="section-title">Vehicle Details</h2>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Registration:</div>
              <div class="info-value"><strong>${data.registration || 'Not provided'}</strong></div>
            </div>
            <div class="info-row">
              <div class="info-label">Mileage:</div>
              <div class="info-value">${data.mileage ? Number(data.mileage).toLocaleString() + ' miles' : 'Not provided'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Asking Price:</div>
              <div class="info-value">${data.expectedPrice ? '£' + Number(data.expectedPrice).toLocaleString() : 'Not provided'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Condition:</div>
              <div class="info-value">${data.condition || 'Not specified'}</div>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="section">
          <h2 class="section-title">Contact Information</h2>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Name:</div>
              <div class="info-value">${data.name || 'Not provided'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email:</div>
              <div class="info-value"><a href="mailto:${data.email}" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">${data.email || 'Not provided'}</a></div>
            </div>
            <div class="info-row">
              <div class="info-label">Phone:</div>
              <div class="info-value"><a href="tel:${data.phone}" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">${data.phone || 'Not provided'}</a></div>
            </div>
          </div>
        </div>

        ${data.message ? `
        <!-- Additional Information -->
        <div class="section">
          <h2 class="section-title">Additional Information</h2>
          <div class="message-box">
            <p>${data.message}</p>
          </div>
        </div>
        ` : ''}

        <!-- Timestamp -->
        <div class="timestamp">
          <p>⏰ Submitted: ${new Date().toLocaleString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        <!-- Action Box -->
        <div class="highlight-box">
          <p><strong>Next Steps:</strong> Contact this lead promptly to provide their free valuation and discuss the 30-day exclusive listing process.</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-logo">
          <img src="${baseUrl}/images/photograph.png" alt="ReadySold">
        </div>
        <p class="footer-text">
          <strong>ReadySold</strong><br>
          Professional car selling service - Keep driving while we sell
        </p>
        <div class="footer-links">
          <a href="${baseUrl}/terms.html">Terms & Conditions</a>
          <span class="footer-divider">•</span>
          <a href="${baseUrl}/privacy.html">Privacy Policy</a>
          <span class="footer-divider">•</span>
          <a href="${baseUrl}/contact.html">Contact Us</a>
        </div>
        <p class="footer-copyright">
          © ${new Date().getFullYear()} ReadySold. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// Generate HTML email for hero form submissions
function generateHeroFormEmail(data) {
  const baseUrl = 'https://readysold.vercel.app'; // Update with your actual domain
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Quick Enquiry - ReadySold</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      color: #1e293b; 
      margin: 0; 
      padding: 0; 
      background-color: #f1f5f9;
      -webkit-font-smoothing: antialiased;
    }
    .email-wrapper { 
      width: 100%; 
      background-color: #f1f5f9; 
      padding: 40px 0; 
    }
    .email-container { 
      max-width: 680px; 
      margin: 0 auto; 
      background-color: #ffffff; 
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header { 
      background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%); 
      padding: 50px 40px; 
      text-align: center;
      position: relative;
    }
    .logo { 
      margin-bottom: 20px;
    }
    .logo img { 
      max-width: 200px; 
      height: auto; 
      display: inline-block;
    }
    .header h1 { 
      color: #ffffff; 
      margin: 20px 0 10px 0; 
      font-size: 32px; 
      font-weight: 700; 
      letter-spacing: -0.5px;
    }
    .header p { 
      color: rgba(255, 255, 255, 0.95); 
      font-size: 16px; 
      margin: 0;
    }
    .banner-image {
      width: 100%;
      height: 180px;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .banner-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      opacity: 0.85;
    }
    .content { 
      padding: 50px 40px; 
    }
    .priority-badge { 
      display: inline-block; 
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white; 
      padding: 8px 20px; 
      border-radius: 20px; 
      font-size: 13px; 
      font-weight: 700; 
      text-transform: uppercase; 
      letter-spacing: 0.5px;
      margin-bottom: 30px;
    }
    .section { 
      margin-bottom: 40px; 
    }
    .section:last-child {
      margin-bottom: 0;
    }
    .section-title { 
      color: #0f172a; 
      font-size: 20px; 
      font-weight: 700; 
      margin-bottom: 20px; 
      padding-bottom: 12px;
      border-bottom: 3px solid #0ea5e9;
    }
    .info-grid {
      display: table;
      width: 100%;
      border-collapse: collapse;
    }
    .info-row { 
      display: table-row;
    }
    .info-label { 
      display: table-cell;
      font-weight: 600; 
      color: #475569; 
      padding: 12px 20px 12px 0;
      width: 40%;
      vertical-align: top;
    }
    .info-value { 
      display: table-cell;
      color: #0f172a;
      padding: 12px 0;
      font-weight: 500;
      vertical-align: top;
    }
    .info-value strong {
      color: #0ea5e9;
      font-size: 18px;
    }
    .highlight-box { 
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-left: 4px solid #f59e0b; 
      padding: 25px; 
      margin: 30px 0; 
      border-radius: 8px;
    }
    .highlight-box p {
      margin: 0;
      color: #78350f;
      line-height: 1.7;
      font-weight: 600;
    }
    .footer { 
      background-color: #0f172a; 
      padding: 40px 40px 30px 40px; 
      text-align: center;
    }
    .footer-logo {
      margin-bottom: 20px;
    }
    .footer-logo img {
      max-width: 150px;
      height: auto;
      opacity: 0.9;
    }
    .footer-text {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      margin-bottom: 20px;
      line-height: 1.6;
    }
    .footer-links {
      margin: 25px 0 20px 0;
      padding: 0;
    }
    .footer-links a {
      color: #0ea5e9;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: color 0.2s;
    }
    .footer-links a:hover {
      color: #38bdf8;
    }
    .footer-divider {
      color: rgba(255, 255, 255, 0.3);
      margin: 0 10px;
    }
    .footer-copyright {
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      margin-top: 20px;
    }
    .timestamp {
      background-color: #f0f9ff;
      border-left: 4px solid #0ea5e9;
      padding: 20px 25px;
      border-radius: 8px;
      margin-top: 30px;
    }
    .timestamp p {
      margin: 0;
      color: #075985;
      font-weight: 600;
      font-size: 15px;
    }
    .quick-lead-badge {
      text-align: center;
      padding: 30px;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .quick-lead-badge h3 {
      color: #0ea5e9;
      font-size: 24px;
      margin-bottom: 10px;
    }
    .quick-lead-badge p {
      color: #475569;
      margin: 0;
      font-size: 14px;
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 20px 0; }
      .email-container { border-radius: 0; }
      .header { padding: 40px 25px; }
      .header h1 { font-size: 26px; }
      .content { padding: 35px 25px; }
      .footer { padding: 35px 25px 25px 25px; }
      .info-label, .info-value { display: block; width: 100%; padding: 8px 0; }
      .info-label { font-weight: 700; color: #0f172a; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header -->
      <div class="header">
        <div class="logo">
          <img src="${baseUrl}/images/photograph.png" alt="ReadySold Logo">
        </div>
        <h1>⚡ Quick Enquiry</h1>
        <p>Fast response needed - Hero form submission</p>
      </div>

      <!-- Banner Image -->
      <div class="banner-image">
        <img src="${baseUrl}/images/photograph.png" alt="ReadySold Vehicle">
      </div>

      <!-- Content -->
      <div class="content">
        <span class="priority-badge">🔥 Hot Lead</span>

        <!-- Quick Lead Notice -->
        <div class="quick-lead-badge">
          <h3>Priority Lead</h3>
          <p>This customer used the quick form - they want fast action!</p>
        </div>

        <!-- Vehicle Information -->
        <div class="section">
          <h2 class="section-title">Vehicle Information</h2>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Registration:</div>
              <div class="info-value"><strong>${data.registration || 'Not provided'}</strong></div>
            </div>
          </div>
        </div>

        <!-- Contact Details -->
        <div class="section">
          <h2 class="section-title">Contact Details</h2>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Name:</div>
              <div class="info-value">${data.name || 'Not provided'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email:</div>
              <div class="info-value"><a href="mailto:${data.email}" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">${data.email || 'Not provided'}</a></div>
            </div>
            <div class="info-row">
              <div class="info-label">Phone:</div>
              <div class="info-value"><a href="tel:${data.phone}" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">${data.phone || 'Not provided'}</a></div>
            </div>
          </div>
        </div>

        <!-- Timestamp -->
        <div class="timestamp">
          <p>⏰ Submitted: ${new Date().toLocaleString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        <!-- Action Box -->
        <div class="highlight-box">
          <p>⚡ Quick Action Required: Respond within 30 minutes for best conversion rates. This lead came from the hero section - high intent!</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-logo">
          <img src="${baseUrl}/images/photograph.png" alt="ReadySold">
        </div>
        <p class="footer-text">
          <strong>ReadySold</strong><br>
          Professional car selling service - Keep driving while we sell
        </p>
        <div class="footer-links">
          <a href="${baseUrl}/terms.html">Terms & Conditions</a>
          <span class="footer-divider">•</span>
          <a href="${baseUrl}/privacy.html">Privacy Policy</a>
          <span class="footer-divider">•</span>
          <a href="${baseUrl}/contact.html">Contact Us</a>
        </div>
        <p class="footer-copyright">
          © ${new Date().getFullYear()} ReadySold. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
