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
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
    .content { padding: 40px 30px; }
    .info-section { margin-bottom: 30px; }
    .info-section h2 { color: #0f172a; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #0ea5e9; padding-bottom: 8px; }
    .info-row { display: flex; margin-bottom: 12px; }
    .info-label { font-weight: 600; color: #0f172a; min-width: 140px; }
    .info-value { color: #475569; }
    .highlight-box { background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 4px; }
    .footer { background-color: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
    .priority-badge { display: inline-block; background-color: #0ea5e9; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
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
          <p style="margin: 0;">${data.message}</p>
        </div>
      </div>
      ` : ''}

      <div class="highlight-box">
        <p style="margin: 0; font-weight: 600; color: #0f172a;">⏰ Submitted: ${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</p>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 10px 0;"><strong>ReadySold</strong></p>
      <p style="margin: 0;">Professional car selling service</p>
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
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
    .content { padding: 40px 30px; }
    .info-section { margin-bottom: 30px; }
    .info-section h2 { color: #0f172a; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #0ea5e9; padding-bottom: 8px; }
    .info-row { display: flex; margin-bottom: 12px; }
    .info-label { font-weight: 600; color: #0f172a; min-width: 140px; }
    .info-value { color: #475569; }
    .highlight-box { background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 4px; }
    .footer { background-color: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
    .priority-badge { display: inline-block; background-color: #0ea5e9; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ Quick Enquiry</h1>
    </div>
    
    <div class="content">
      <span class="priority-badge">Hero Form Submission</span>
      
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
        <p style="margin: 0; font-weight: 600; color: #0f172a;">⏰ Submitted: ${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</p>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 10px 0;"><strong>ReadySold</strong></p>
      <p style="margin: 0;">Professional car selling service</p>
    </div>
  </div>
</body>
</html>
  `;
}
