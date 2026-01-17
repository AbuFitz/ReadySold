# ReadySold Email System

## Overview
Comprehensive email notification system using Resend API for both company notifications and customer confirmations.

## Email Types

### 1. Company Notification Emails

**Purpose:** Notify ReadySold team of new form submissions

**Design:** Professional with gradient backgrounds, detailed information display

**Types:**
- **Valuation Request Email** - Full details from contact form (vehicle, mileage, condition, asking price, contact info, additional notes)
- **Hero Form Email** - Quick lead from homepage hero section (registration, name, email, phone)

**Features:**
- Gradient header with logo
- Priority badges
- Organized information sections
- Color-coded highlights
- Footer with links
- Mobile responsive

---

### 2. Customer Confirmation Email

**Purpose:** Confirm receipt of customer's request and provide next steps

**Design:** Clean Spotify-style minimalist design without background boxes

**Features:**
- Clean white background (no gradient boxes)
- Navy (#0F172A) and Sky Blue (#0EA5E9) as accent colors only
- Personalized greeting using first name
- Shows submitted vehicle details
- "What Happens Next?" section
- "Why Choose ReadySold?" benefits section
- Professional footer with links
- Mobile responsive

**Key Design Principles:**
- No emojis
- No pushy sales language
- Honest, professional tone
- Clear typography
- Ample white space
- Signature colors used sparingly as borders/accents

---

## Technical Implementation

### API Endpoint
`/api/send-email.js` - Vercel serverless function

### Email Functions
- `generateValuationEmail(data)` - Company notification for full valuation requests
- `generateHeroFormEmail(data)` - Company notification for quick leads
- `generateCustomerConfirmationEmail(data)` - Customer-facing confirmation email

### Email Flow

1. User submits form on website
2. JavaScript calls `/api/send-email` with form data
3. API validates request
4. API sends email to company (hello@readysold.co.uk)
5. API sends confirmation email to customer
6. Both emails sent via Resend API
7. Success/error response returned to frontend

### Request Format
```javascript
{
  type: 'valuation' | 'hero-form',
  data: {
    name: string,
    email: string,
    phone: string,
    registration: string,
    mileage: number (optional),
    askingPrice: number (optional),
    condition: string (optional),
    additionalInfo: string (optional)
  }
}
```

### Response Format
```javascript
{
  success: true,
  messageId: string
}
// or
{
  error: string,
  details: string
}
```

---

## Environment Variables

Required in `.env` (local) and Vercel dashboard (production):

```env
RESEND_API_KEY=re_RmcnCA7U_KzJqYoqerAFpFMSk5wshwViY
RECIPIENT_EMAIL=hello@readysold.co.uk
FROM_EMAIL=noreply@readysold.co.uk
```

---

## Email Design Comparison

### Company Emails (Valuation & Hero Form)
- ✅ Gradient backgrounds
- ✅ Color-coded sections
- ✅ Priority badges
- ✅ Full branding
- ✅ Detailed information display
- ✅ Dark navy footer

### Customer Confirmation Email
- ✅ Clean white background
- ✅ No gradient boxes
- ✅ Minimal color accents (border-left only)
- ✅ Simple section dividers
- ✅ Personalized greeting
- ✅ Educational content (what happens next)
- ✅ Light footer design
- ❌ No emojis
- ❌ No pushy language

---

## Testing

### Local Preview
Open `email-preview.html` in browser to see all three email templates:
- Company: Valuation
- Company: Hero Form
- Customer: Confirmation

### Live Testing
1. Submit form on website
2. Check company email (hello@readysold.co.uk)
3. Check customer email (provided in form)
4. Verify both emails received
5. Test email rendering in different clients (Gmail, Outlook, Apple Mail)

---

## Email Client Compatibility

All emails use table-based layouts for maximum compatibility:
- ✅ Gmail
- ✅ Outlook (Desktop & Web)
- ✅ Apple Mail (macOS & iOS)
- ✅ Yahoo Mail
- ✅ ProtonMail
- ✅ Thunderbird

**Design Approach:**
- Inline CSS (no external stylesheets)
- Table-based layouts (not flexbox/grid)
- System fonts for universal support
- Media queries for mobile responsiveness
- Bulletproof buttons (anchor tags, not button elements)

---

## Commission & Pricing in Emails

All emails correctly reflect:
- **8% commission** (NOT 10%)
- **£350 minimum fee**
- **No upfront costs**
- **30-day exclusive listing**

---

## Resend Configuration

**Plan:** Free tier
**Limits:** 100 emails/day, 3000/month
**Domain:** readysold.co.uk
**Verification:** Required (SPF, DKIM, DMARC records)

**Important:** Before going live, verify domain in Resend dashboard and add DNS records provided by Resend.

---

## Future Enhancements

Potential improvements:
- Email tracking (opens, clicks)
- Follow-up email sequences
- SMS notifications
- CRM integration
- Email templates for different car conditions
- Automated valuation email with pricing estimate
- Review request emails post-sale

---

## Deployment Notes

**When deploying to Vercel:**
1. Add all environment variables in Vercel dashboard
2. Verify domain in Resend (add DNS records)
3. Test email sending in production
4. Monitor Resend logs for delivery issues
5. Check spam folders if emails not received
6. Ensure reply-to address is set correctly

**Quick Deploy:**
```bash
vercel --prod
```

Then add environment variables in Vercel dashboard under Settings → Environment Variables.

---

## Support

**Resend Dashboard:** https://resend.com/emails
**Resend Docs:** https://resend.com/docs
**Vercel Dashboard:** https://vercel.com/dashboard

For issues with email delivery, check:
1. Resend logs for error messages
2. Spam folders
3. Domain verification status
4. API key validity
5. Environment variables set correctly
