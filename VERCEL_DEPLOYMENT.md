# Vercel Deployment Environment Variables Guide

## Required Environment Variables for Vercel:

When you deploy to Vercel, make sure you add these environment variables in your Vercel dashboard:

### Essential Variables:
```
NEXTAUTH_URL = https://your-app-name.vercel.app
NEXTAUTH_SECRET = RREjnPu+ULXwURW7Vsswah2cF3VwNQdrZYpe3hXgEME
```

### Optional Variables (add if you're using these features):
```
GOOGLE_CLIENT_ID = your_google_client_id
GOOGLE_CLIENT_SECRET = your_google_client_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = your_stripe_publishable_key
```

## How to Add Environment Variables in Vercel:

1. **Go to your Vercel dashboard** (https://vercel.com/dashboard)
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add each variable:**
   - Name: `NEXTAUTH_URL`
   - Value: `https://your-actual-vercel-url.vercel.app`
   - Environment: Select "Production", "Preview", and "Development"
5. **Click "Save"**
6. **Repeat for each variable**

## Important Notes:

### NEXTAUTH_URL:
- **Must be your actual Vercel URL** (not localhost)
- Usually looks like: `https://your-app-123abc.vercel.app`
- You can find this URL in your Vercel dashboard after deployment

### After Adding Variables:
- **Redeploy your application** (Vercel usually does this automatically)
- Check the deployment logs for any errors
- Test your authentication flow

## Troubleshooting:

If authentication still doesn't work after deployment:

1. **Check Environment Variables:**
   ```bash
   # In your Vercel dashboard, verify all variables are set correctly
   ```

2. **Check Deployment Logs:**
   - Go to your Vercel dashboard
   - Click on your latest deployment
   - Check the "Functions" tab for any API errors

3. **Verify NEXTAUTH_URL:**
   - Make sure it matches your exact Vercel URL
   - No trailing slash
   - Uses HTTPS

4. **Test API Endpoints:**
   - Try accessing: `https://your-app.vercel.app/api/auth/signin`
   - Should show NextAuth signin page

## Common Issues:

1. **"Configuration error" in production:**
   - Usually means `NEXTAUTH_SECRET` is missing

2. **Redirect loops:**
   - Usually means `NEXTAUTH_URL` is wrong

3. **API routes not working:**
   - Check if your API routes are in the correct `/pages/api/` directory
   - Verify Vercel is detecting them as serverless functions

## Vercel-Specific Considerations:

- Vercel automatically handles Next.js API routes as serverless functions
- Environment variables are available in both client and server code (depending on prefix)
- Variables starting with `NEXT_PUBLIC_` are available in the browser
- Other variables are only available on the server side
