# Email Contact Form Setup

Your contact form is now configured to send emails to **infomnt01@gmail.com**!

## Setup Instructions

### Step 1: Create Environment File

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

### Step 2: Generate Gmail App Password

Since you're using Gmail, you need to generate an **App Password** (regular Gmail password won't work):

1. **Enable 2-Factor Authentication** (if not already enabled):
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click on "2-Step Verification"
   - Follow the setup instructions

2. **Generate App Password**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click on "2-Step Verification"
   - Scroll down and click "App passwords"
   - Select "Mail" as the app and "Other" as the device
   - Enter "Jobstm Website" as the device name
   - Click "Generate"
   - Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

3. **Update `.env.local`**:
   ```env
   EMAIL_USER=infomnt01@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   ```
   (Replace with your actual app password, no spaces)

### Step 3: Restart Development Server

After updating `.env.local`, restart your Next.js development server:

```bash
npm run dev
```

## How It Works

When someone submits the contact form:

1. Form data is validated on the client side
2. Data is sent to `/api/contact` endpoint
3. Server sends a formatted email to `infomnt01@gmail.com`
4. Email includes:
   - Sender's name, email, phone, and subject
   - Message content
   - Reply-to address (sender's email)

## Email Format

The email you receive will be professionally formatted with:
- **Subject**: "New Contact Form Message: [Subject]"
- **From**: infomnt01@gmail.com
- **Reply-To**: [Sender's email]
- **Content**: Formatted HTML with all form details

## Security Notes

- ✅ Environment variables are secure and never exposed to the client
- ✅ `.env.local` is ignored by Git
- ✅ Form validation prevents spam and invalid submissions
- ✅ Server-side email sending for better security

## Testing

1. Fill out the contact form on your website
2. Click "Send Message"
3. Check `infomnt01@gmail.com` inbox for the email
4. You can reply directly to the sender's email

## Troubleshooting

### "Failed to send email" error

- **Check**: Is `.env.local` file created?
- **Check**: Are `EMAIL_USER` and `EMAIL_PASSWORD` set correctly?
- **Check**: Is the app password correct (16 characters, no spaces)?
- **Check**: Is 2-Factor Authentication enabled on the Gmail account?

### Emails not arriving

- Check Gmail spam folder
- Verify the app password is active
- Ensure Gmail account has enough storage
- Check Gmail "Less secure app access" is not blocking it

### For Production Deployment

When deploying to platforms like Vercel, Netlify, etc.:

1. Add environment variables in the platform's dashboard:
   - `EMAIL_USER=infomnt01@gmail.com`
   - `EMAIL_PASSWORD=your-app-password`

2. DO NOT commit `.env.local` to Git!

## Alternative Email Providers

If you want to use a different email service instead of Gmail:

### SendGrid (Recommended for Production)
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
```

### Mailgun
```env
EMAIL_SERVICE=mailgun
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-domain.mailgun.org
```

Let me know if you need help setting up alternative providers!
