# Resend Email Setup Guide

## Overview
This project uses Resend (https://resend.com) for handling form submissions via email. Resend offers a free tier with 100 emails/day and 3,000 emails/month.

## Step 1: Create Resend Account

1. Go to https://resend.com
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your API Key

1. Log into your Resend dashboard
2. Go to **API Keys** section
3. Click "Create API Key"
4. Give it a name (e.g., "ReadySold Production")
5. Copy the API key (starts with `re_`)

## Step 3: Add Domain (Optional but Recommended)

### For Production:
1. In Resend dashboard, go to **Domains**
2. Click "Add Domain"
3. Enter your domain (e.g., `readysold.co.uk`)
4. Add the DNS records provided by Resend to your domain registrar
5. Wait for verification (usually 5-30 minutes)

### For Development/Testing:
- You can use the default `onboarding@resend.dev` sender
- Or verify a single email address in **Domains > Verified Emails**

## Step 4: Configure Vercel Environment Variables

### Via Vercel Dashboard:
1. Go to your Vercel project dashboard
2. Click on **Settings** > **Environment Variables**
3. Add the following variables:

```
RESEND_API_KEY=re_your_api_key_here
RECIPIENT_EMAIL=hello@readysold.co.uk
FROM_EMAIL=noreply@readysold.co.uk
```

### Via Vercel CLI:
```bash
vercel env add RESEND_API_KEY
# Paste your API key when prompted

vercel env add RECIPIENT_EMAIL
# Enter: hello@readysold.co.uk

vercel env add FROM_EMAIL  
# Enter: noreply@readysold.co.uk
```

## Step 5: Install Dependencies

Run this command in your project directory:

```bash
npm install
```

This will install the `resend` package defined in `package.json`.

## Step 6: Deploy to Vercel

```bash
# Make sure you're logged in to Vercel
vercel login

# Deploy
vercel --prod
```

## Step 7: Update Email Addresses

In `/api/send-email.js`, update the email addresses:

```javascript
let recipientEmail = 'hello@readysold.co.uk'; // Your company email

// And in the send function:
from: 'ReadySold <noreply@readysold.co.uk>', // Use your verified domain
```

## Testing the Integration

### 1. Test Locally with Vercel Dev:

```bash
vercel dev
```

Then submit a form on `localhost:3000` to test the API endpoint.

### 2. Test in Production:

After deployment, submit a test form on your live website.

### 3. Check Resend Dashboard:

- Go to **Logs** in Resend dashboard
- You should see your sent emails
- Click on any email to see delivery status

## Email Templates

The system sends two types of emails:

### 1. Valuation Request (Full Form)
- Subject: "New Valuation Request - [REG]"
- Includes: Vehicle details, contact info, message
- Triggered by: Main contact form

### 2. Hero Form Submission (Quick Lead)
- Subject: "New Lead - [NAME]"
- Includes: Registration, contact details
- Triggered by: Hero section quick form

## Troubleshooting

### Error: "Domain not verified"
- Check your DNS records in your domain registrar
- Wait up to 48 hours for DNS propagation
- Use verified email address for testing in the meantime

### Error: "Rate limit exceeded"
- Free tier: 100 emails/day, 3,000/month
- Upgrade to paid plan if needed
- Check for form spam/bot submissions

### Error: "Invalid API key"
- Verify the API key in Vercel environment variables
- Make sure there are no extra spaces or quotes
- Regenerate API key in Resend if needed

### Emails not arriving:
- Check Resend dashboard **Logs** for delivery status
- Check spam folder
- Verify recipient email is correct
- Ensure domain is verified (for production)

## Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use environment variables** - API keys stored securely in Vercel
3. **Validate form data** - Server-side validation in place
4. **Rate limiting** - Consider adding rate limiting for production
5. **CORS protection** - Only allow requests from your domain

## Cost Breakdown

### Resend Free Tier:
- 100 emails/day
- 3,000 emails/month
- Perfect for starting out

### Resend Pro (if needed):
- $20/month
- 50,000 emails/month
- No daily limits
- Priority support

## Monitoring

Check these regularly:
1. Resend dashboard > **Logs** - Email delivery status
2. Resend dashboard > **Analytics** - Open rates, delivery rates
3. Vercel dashboard > **Functions** - API endpoint performance

## Alternative: Testing Without Deployment

For local development without Vercel:

1. Create a `.env` file (don't commit it):
```
RESEND_API_KEY=re_your_key_here
RECIPIENT_EMAIL=your@email.com
```

2. Install dependencies:
```bash
npm install resend dotenv
```

3. Create `test-email.js`:
```javascript
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const testEmail = await resend.emails.send({
  from: 'Test <onboarding@resend.dev>',
  to: process.env.RECIPIENT_EMAIL,
  subject: 'Test Email',
  html: '<p>This is a test email!</p>'
});

console.log('Email sent:', testEmail);
```

4. Run: `node test-email.js`

## Support

- Resend Documentation: https://resend.com/docs
- Resend Support: support@resend.com
- Vercel Documentation: https://vercel.com/docs
