# Deployment Guide

## Deploy to Vercel

### Prerequisites
1. Create a [Vercel account](https://vercel.com/signup) if you don't have one
2. Connect your GitHub repository to Vercel

### Quick Deploy (Recommended)

#### Option 1: GitHub Integration
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project" → Import from GitHub
4. Select this repository
5. Vercel will auto-detect the Vite framework settings

#### Option 2: CLI Deploy
```bash
# Login to Vercel
vercel login

# Deploy the project
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name? (Use default or customize)
# - Directory? ./
```

### Environment Variables Setup

After deployment, add these environment variables in your Vercel dashboard:

**Required Variables:**
- `VITE_SUPABASE_URL`: `https://liepvjfiezgjrchbdwnb.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZXB2amZpZXpnanJjaGJkd25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyODMyNjYsImV4cCI6MjA3Mjg1OTI2Nn0.qNQdxdbA75p5MXTJimYfMEE9tt5BEpoAr_VTKNOLs0Y`
- `GEMINI_API_KEY`: (Your Gemini API key)

**To add environment variables:**
1. Go to your project dashboard on Vercel
2. Click "Settings" → "Environment Variables"
3. Add each variable with its value
4. Click "Save"
5. Redeploy your project

### Deployment Commands

The following commands are configured for Vercel:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview locally
npm run preview
```

### Configuration Files

- ✅ `vercel.json` - Vercel deployment configuration
- ✅ `vite.config.ts` - Optimized for production
- ✅ `.env.example` - Environment variable template
- ✅ Package.json scripts updated

### Post-Deployment Checklist

1. ✅ Verify the app loads correctly
2. ✅ Test Supabase authentication
3. ✅ Check that all features work in production
4. ✅ Monitor for any console errors
5. ✅ Set up custom domain (optional)

## Alternative Deployment Options

### Docker Deployment
```bash
# Build the Docker image
docker build -t talk-to-my-lawyer .

# Run the container
docker run -p 80:80 talk-to-my-lawyer
```

### Docker Compose
```bash
docker-compose up -d
```

Your app is now production-ready and configured for easy deployment!