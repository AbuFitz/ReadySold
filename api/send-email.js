// Vercel Serverless Function for Resend Email
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    let companyEmailContent;
    let customerEmailContent;
    let companySubject;
    let customerSubject;
    let recipientEmail = 'hello@readysold.co.uk'; // Your company email

    // Generate emails based on form type
    if (type === 'valuation') {
      companySubject = `New Valuation Request - ${data.registration || 'N/A'}`;
      companyEmailContent = generateValuationEmail(data);
      customerSubject = 'Thank You for Your Valuation Request';
      customerEmailContent = generateCustomerConfirmationEmail(data);
    } else if (type === 'hero-form') {
      companySubject = `New Lead - ${data.name || 'Quick Enquiry'}`;
      companyEmailContent = generateHeroFormEmail(data);
      customerSubject = 'Thank You for Contacting ReadySold';
      customerEmailContent = generateCustomerConfirmationEmail(data);
    } else {
      return res.status(400).json({ error: 'Invalid form type' });
    }

    // Send email to company
    const companyEmailResponse = await resend.emails.send({
      from: 'ReadySold <noreply@readysold.co.uk>',
      to: recipientEmail,
      subject: companySubject,
      html: companyEmailContent,
      replyTo: data.email || undefined,
    });

    // Send confirmation email to customer
    if (data.email) {
      await resend.emails.send({
        from: 'ReadySold <noreply@readysold.co.uk>',
        to: data.email,
        subject: customerSubject,
        html: customerEmailContent,
      });
    }

    return res.status(200).json({ 
      success: true, 
      messageId: companyEmailResponse.id 
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
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      color: #334155; 
      margin: 0; 
      padding: 0; 
      background-color: #f1f5f9;
      width: 100%;
    }
    .email-wrapper {
      width: 100%;
      background-color: #f1f5f9;
      padding: 40px 20px;
    }
    .container { 
      max-width: 650px; 
      margin: 0 auto; 
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header { 
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); 
      padding: 50px 40px; 
      text-align: center; 
    }
    .logo {
      font-size: 36px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .logo-tagline {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 400;
      margin-bottom: 20px;
    }
    .header h1 { 
      color: #ffffff; 
      margin: 20px 0 0 0; 
      font-size: 32px; 
      font-weight: 700; 
    }
    .content { 
      padding: 50px 40px; 
    }
    .info-section { 
      margin-bottom: 35px; 
    }
    .info-section h2 { 
      color: #0f172a; 
      font-size: 22px; 
      margin-bottom: 20px; 
      border-bottom: 3px solid #0ea5e9; 
      padding-bottom: 10px;
      font-weight: 700;
    }
    .info-row { 
      display: table;
      width: 100%;
      margin-bottom: 14px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 12px;
    }
    .info-label { 
      display: table-cell;
      font-weight: 600; 
      color: #0f172a; 
      width: 160px;
      vertical-align: top;
      padding-right: 20px;
    }
    .info-value { 
      display: table-cell;
      color: #475569;
      vertical-align: top;
    }
    .info-value strong {
      color: #0f172a;
      font-size: 18px;
    }
    .highlight-box { 
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-left: 5px solid #0ea5e9; 
      padding: 25px; 
      margin: 30px 0; 
      border-radius: 6px;
    }
    .highlight-box p {
      margin: 0;
      color: #0f172a;
      line-height: 1.7;
    }
    .footer { 
      background-color: #0f172a; 
      padding: 40px 40px 30px 40px; 
      text-align: center; 
      color: rgba(255, 255, 255, 0.8);
    }
    .footer-logo {
      font-size: 28px;
      font-weight: 800;
      color: #0ea5e9;
      margin-bottom: 15px;
      letter-spacing: -0.5px;
    }
    .footer-tagline {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 25px;
    }
    .footer-links {
      margin: 25px 0 20px 0;
      font-size: 14px;
    }
    .footer-links a {
      color: #0ea5e9;
      text-decoration: none;
      margin: 0 8px;
      transition: color 0.3s ease;
    }
    .footer-links a:hover {
      color: #38bdf8;
      text-decoration: underline;
    }
    .footer-links span {
      color: rgba(255, 255, 255, 0.5);
      margin: 0 8px;
    }
    .footer-copyright {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 15px;
    }
    .priority-badge { 
      display: inline-block; 
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      color: white; 
      padding: 8px 18px; 
      border-radius: 20px; 
      font-size: 13px; 
      font-weight: 700; 
      text-transform: uppercase; 
      margin-bottom: 25px;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 4px rgba(14, 165, 233, 0.3);
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 20px 10px; }
      .header { padding: 40px 30px; }
      .content { padding: 40px 30px; }
      .footer { padding: 35px 30px 25px 30px; }
      .logo { font-size: 30px; }
      .header h1 { font-size: 26px; }
      .info-label, .info-value { display: block; width: 100%; }
      .info-label { margin-bottom: 5px; }
      .info-row { margin-bottom: 20px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">ReadySold</div>
        <div class="logo-tagline">Professional Car Selling Service</div>
        <h1>🚗 New Valuation Request</h1>
      </div>
      
      <div class="content">
        <span class="priority-badge">New Lead</span>
        
        <div class="info-section">
          <h2>Vehicle Details</h2>
          <div class="info-row">
            <span class="info-label">Registration:</span>
            <span class="info-value"><strong>${data.registration || 'Not provided'}</strong></span>
          </div>
          <div class="info-row">
            <span class="info-label">Mileage:</span>
            <span class="info-value">${data.mileage ? Number(data.mileage).toLocaleString() + ' miles' : 'Not provided'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Asking Price:</span>
            <span class="info-value">${data.expectedPrice ? '£' + Number(data.expectedPrice).toLocaleString() : 'Not provided'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Condition:</span>
            <span class="info-value">${data.condition || 'Not specified'}</span>
          </div>
        </div>

        <div class="info-section">
          <h2>Contact Information</h2>
          <div class="info-row">
            <span class="info-label">Name:</span>
            <span class="info-value">${data.name || 'Not provided'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value"><a href="mailto:${data.email}" style="color: #0ea5e9; text-decoration: none;">${data.email || 'Not provided'}</a></span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-value"><a href="tel:${data.phone}" style="color: #0ea5e9; text-decoration: none;">${data.phone || 'Not provided'}</a></span>
          </div>
        </div>

        ${data.message ? `
        <div class="info-section">
          <h2>Additional Information</h2>
          <div class="highlight-box">
            <p>${data.message}</p>
          </div>
        </div>
        ` : ''}

        <div class="highlight-box">
          <p style="font-weight: 600; color: #0f172a;">⏰ Submitted: ${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</p>
        </div>
      </div>

      <div class="footer">
        <div class="footer-logo">ReadySold</div>
        <div class="footer-tagline">Keep driving while we sell — Pay only when sold</div>
        
        <div class="footer-links">
          <a href="https://readysold.co.uk/terms.html">Terms & Conditions</a>
          <span>•</span>
          <a href="https://readysold.co.uk/privacy.html">Privacy Policy</a>
          <span>•</span>
          <a href="https://readysold.co.uk/contact.html">Contact Us</a>
        </div>
        
        <div class="footer-copyright">
          © ${new Date().getFullYear()} ReadySold. All rights reserved.
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// Generate HTML email for hero form submissions
function generateHeroFormEmail(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      color: #334155; 
      margin: 0; 
      padding: 0; 
      background-color: #f1f5f9;
      width: 100%;
    }
    .email-wrapper {
      width: 100%;
      background-color: #f1f5f9;
      padding: 40px 20px;
    }
    .container { 
      max-width: 650px; 
      margin: 0 auto; 
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header { 
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); 
      padding: 50px 40px; 
      text-align: center; 
    }
    .logo {
      font-size: 36px;
      font-weight: 800;
      color: #0ea5e9;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .logo-tagline {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 400;
      margin-bottom: 20px;
    }
    .header h1 { 
      color: #ffffff; 
      margin: 20px 0 0 0; 
      font-size: 32px; 
      font-weight: 700; 
    }
    .content { 
      padding: 50px 40px; 
    }
    .info-section { 
      margin-bottom: 35px; 
    }
    .info-section h2 { 
      color: #0f172a; 
      font-size: 22px; 
      margin-bottom: 20px; 
      border-bottom: 3px solid #0ea5e9; 
      padding-bottom: 10px;
      font-weight: 700;
    }
    .info-row { 
      display: table;
      width: 100%;
      margin-bottom: 14px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 12px;
    }
    .info-label { 
      display: table-cell;
      font-weight: 600; 
      color: #0f172a; 
      width: 160px;
      vertical-align: top;
      padding-right: 20px;
    }
    .info-value { 
      display: table-cell;
      color: #475569;
      vertical-align: top;
    }
    .info-value strong {
      color: #0f172a;
      font-size: 18px;
    }
    .highlight-box { 
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-left: 5px solid #0ea5e9; 
      padding: 25px; 
      margin: 30px 0; 
      border-radius: 6px;
    }
    .highlight-box p {
      margin: 0;
      color: #0f172a;
      line-height: 1.7;
    }
    .footer { 
      background-color: #0f172a; 
      padding: 40px 40px 30px 40px; 
      text-align: center; 
      color: rgba(255, 255, 255, 0.8);
    }
    .footer-logo {
      font-size: 28px;
      font-weight: 800;
      color: #0ea5e9;
      margin-bottom: 15px;
      letter-spacing: -0.5px;
    }
    .footer-tagline {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 25px;
    }
    .footer-links {
      margin: 25px 0 20px 0;
      font-size: 14px;
    }
    .footer-links a {
      color: #0ea5e9;
      text-decoration: none;
      margin: 0 8px;
      transition: color 0.3s ease;
    }
    .footer-links a:hover {
      color: #38bdf8;
      text-decoration: underline;
    }
    .footer-links span {
      color: rgba(255, 255, 255, 0.5);
      margin: 0 8px;
    }
    .footer-copyright {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 15px;
    }
    .priority-badge { 
      display: inline-block; 
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white; 
      padding: 8px 18px; 
      border-radius: 20px; 
      font-size: 13px; 
      font-weight: 700; 
      text-transform: uppercase; 
      margin-bottom: 25px;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 20px 10px; }
      .header { padding: 40px 30px; }
      .content { padding: 40px 30px; }
      .footer { padding: 35px 30px 25px 30px; }
      .logo { font-size: 30px; }
      .header h1 { font-size: 26px; }
      .info-label, .info-value { display: block; width: 100%; }
      .info-label { margin-bottom: 5px; }
      .info-row { margin-bottom: 20px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">ReadySold</div>
        <div class="logo-tagline">Professional Car Selling Service</div>
        <h1>⚡ Quick Enquiry</h1>
      </div>
      
      <div class="content">
        <span class="priority-badge">Hero Form • Fast Response Required</span>
        
        <div class="info-section">
          <h2>Vehicle Information</h2>
          <div class="info-row">
            <span class="info-label">Registration:</span>
            <span class="info-value"><strong>${data.registration || 'Not provided'}</strong></span>
          </div>
        </div>

        <div class="info-section">
          <h2>Contact Details</h2>
          <div class="info-row">
            <span class="info-label">Name:</span>
            <span class="info-value">${data.name || 'Not provided'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value"><a href="mailto:${data.email}" style="color: #0ea5e9; text-decoration: none;">${data.email || 'Not provided'}</a></span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-value"><a href="tel:${data.phone}" style="color: #0ea5e9; text-decoration: none;">${data.phone || 'Not provided'}</a></span>
          </div>
        </div>

        <div class="highlight-box">
          <p style="font-weight: 600; color: #0f172a;">⏰ Submitted: ${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</p>
          <p style="margin-top: 10px; color: #d97706; font-weight: 600;">💡 Quick lead - Follow up promptly for best conversion!</p>
        </div>
      </div>

      <div class="footer">
        <div class="footer-logo">ReadySold</div>
        <div class="footer-tagline">Keep driving while we sell — Pay only when sold</div>
        
        <div class="footer-links">
          <a href="https://readysold.co.uk/terms.html">Terms & Conditions</a>
          <span>•</span>
          <a href="https://readysold.co.uk/privacy.html">Privacy Policy</a>
          <span>•</span>
          <a href="https://readysold.co.uk/contact.html">Contact Us</a>
        </div>
        
        <div class="footer-copyright">
          © ${new Date().getFullYear()} ReadySold. All rights reserved.
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// Generate customer confirmation email - Clean Spotify-style design
function generateCustomerConfirmationEmail(data) {
  const firstName = data.name ? data.name.split(' ')[0] : 'there';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      color: #1e293b; 
      margin: 0; 
      padding: 0; 
      background-color: #ffffff;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff;
    }
    .header { 
      padding: 50px 40px 40px 40px; 
      text-align: center;
      border-bottom: 1px solid #e2e8f0;
    }
    .logo {
      font-size: 32px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 0;
      letter-spacing: -0.5px;
    }
    .content { 
      padding: 50px 40px; 
    }
    .greeting {
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 20px;
      line-height: 1.3;
    }
    .message {
      font-size: 16px;
      color: #475569;
      margin-bottom: 30px;
      line-height: 1.7;
    }
    .highlight-section {
      border-left: 4px solid #0ea5e9;
      padding: 25px 30px;
      margin: 35px 0;
      background-color: #ffffff;
    }
    .highlight-section h3 {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
    }
    .highlight-section p {
      font-size: 15px;
      color: #475569;
      margin: 0;
      line-height: 1.7;
    }
    .info-box {
      background-color: #f8fafc;
      border-radius: 8px;
      padding: 25px 30px;
      margin: 30px 0;
    }
    .info-box h3 {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 15px;
    }
    .info-item {
      display: flex;
      align-items: baseline;
      margin-bottom: 10px;
      font-size: 15px;
    }
    .info-item:last-child {
      margin-bottom: 0;
    }
    .info-label {
      font-weight: 600;
      color: #0f172a;
      min-width: 120px;
    }
    .info-value {
      color: #475569;
    }
    .cta-section {
      text-align: center;
      margin: 40px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      color: #ffffff;
      text-decoration: none;
      padding: 16px 40px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
    }
    .divider {
      height: 1px;
      background-color: #e2e8f0;
      margin: 40px 0;
    }
    .footer { 
      padding: 40px 40px 50px 40px; 
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer-logo {
      font-size: 24px;
      font-weight: 800;
      color: #0ea5e9;
      margin-bottom: 20px;
      letter-spacing: -0.5px;
    }
    .footer-links {
      margin: 20px 0;
      font-size: 14px;
    }
    .footer-links a {
      color: #64748b;
      text-decoration: none;
      margin: 0 12px;
    }
    .footer-links span {
      color: #cbd5e1;
      margin: 0 8px;
    }
    .footer-text {
      font-size: 13px;
      color: #94a3b8;
      margin-top: 20px;
    }
    @media only screen and (max-width: 600px) {
      .header { padding: 40px 30px 30px 30px; }
      .content { padding: 40px 30px; }
      .footer { padding: 35px 30px 40px 30px; }
      .greeting { font-size: 24px; }
      .highlight-section { padding: 20px 25px; }
      .info-box { padding: 20px 25px; }
      .info-item { flex-direction: column; }
      .info-label { margin-bottom: 3px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ReadySold</div>
    </div>
    
    <div class="content">
      <h1 class="greeting">Thanks ${firstName}, we've received your request</h1>
      
      <p class="message">
        We're excited to help you sell your car. Our team will review your details and get back to you shortly with a comprehensive valuation.
      </p>

      ${data.registration ? `
      <div class="info-box">
        <h3>Your Submission Details</h3>
        <div class="info-item">
          <span class="info-label">Vehicle:</span>
          <span class="info-value">${data.registration}</span>
        </div>
        ${data.mileage ? `
        <div class="info-item">
          <span class="info-label">Mileage:</span>
          <span class="info-value">${Number(data.mileage).toLocaleString()} miles</span>
        </div>
        ` : ''}
      </div>
      ` : ''}

      <div class="highlight-section">
        <h3>What Happens Next?</h3>
        <p>
          Our specialists will analyse current market conditions and comparable sales to provide you with an accurate, honest valuation. We'll reach out to you directly to discuss the details and answer any questions you may have.
        </p>
      </div>

      <div class="divider"></div>

      <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 20px; text-align: center;">
        Why Choose ReadySold?
      </h3>

      <div style="margin: 30px 0;">
        <div style="margin-bottom: 25px;">
          <div style="font-weight: 600; color: #0f172a; margin-bottom: 5px; font-size: 15px;">
            Keep Your Car
          </div>
          <div style="color: #64748b; font-size: 14px; line-height: 1.6;">
            Continue driving while we handle all viewings, negotiations, and paperwork
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <div style="font-weight: 600; color: #0f172a; margin-bottom: 5px; font-size: 15px;">
            Pay Only When Sold
          </div>
          <div style="color: #64748b; font-size: 14px; line-height: 1.6;">
            8% commission (£350 minimum) — No upfront costs, no hidden fees
          </div>
        </div>

        <div>
          <div style="font-weight: 600; color: #0f172a; margin-bottom: 5px; font-size: 15px;">
            Professional Service
          </div>
          <div style="color: #64748b; font-size: 14px; line-height: 1.6;">
            Quality photos, multi-platform listings, and expert negotiation included
          </div>
        </div>
      </div>

      <div class="cta-section">
        <a href="https://readysold.co.uk" class="cta-button">Visit Our Website</a>
      </div>

      <p class="message" style="text-align: center; color: #64748b; font-size: 14px; margin-top: 40px;">
        Questions? Reply to this email or visit our website for more information.
      </p>
    </div>

    <div class="footer">
      <div class="footer-logo">ReadySold</div>
      
      <div class="footer-links">
        <a href="https://readysold.co.uk/terms.html">Terms & Conditions</a>
        <span>•</span>
        <a href="https://readysold.co.uk/privacy.html">Privacy Policy</a>
        <span>•</span>
        <a href="https://readysold.co.uk/contact.html">Contact Us</a>
      </div>
      
      <div class="footer-text">
        © ${new Date().getFullYear()} ReadySold. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
