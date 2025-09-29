<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1jcNus_RZaqWWrN2-hIC4JwqatOfQOAj9

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and set your environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and set:
   - `VITE_SUPABASE_URL` - Your Supabase project URL  
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `GEMINI_API_KEY` - Your Gemini API key (for edge functions)
3. Run the app:
   `npm run dev`

## Security Notes

- Environment variables are now properly configured instead of hardcoded values
- The application uses React 18 for better compatibility with dependencies
- Some security vulnerabilities remain in the jspdf dependency but upgrading would be a breaking change
