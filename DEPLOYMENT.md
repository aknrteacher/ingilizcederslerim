# Deployment Guide: GitHub + Vercel

This guide will walk you through deploying your Ingilizce Derslerim application to GitHub and Vercel.

## Prerequisites

- A GitHub account (free at https://github.com)
- A Vercel account (free at https://vercel.com)
- Git installed on your computer
- Your project code ready

---

## Step 1: Prepare Your Project

### 1.1. Make sure your project is ready
- Ensure all your code is working locally
- Test that `npm run build` works without errors

### 1.2. Check your .gitignore file
Make sure these are in your `.gitignore`:
```
node_modules
dist
.DS_Store
.env
.env.local
*.log
```

---

## Step 2: Create GitHub Repository

### 2.1. Create a new repository on GitHub

1. Go to https://github.com
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**

### 2.2. Configure your repository

- **Repository name**: `ingilizce-derslerim` (or any name you prefer)
- **Description**: "English learning platform for Turkish students"
- **Visibility**: 
  - Choose **Public** (free, anyone can see)
  - Or **Private** (only you can see)
- **DO NOT** check "Initialize with README" (you already have files)
- Click **"Create repository"**

### 2.3. Copy the repository URL
After creating, GitHub will show you a URL like:
```
https://github.com/yourusername/ingilizce-derslerim.git
```
**Copy this URL** - you'll need it in the next step.

---

## Step 3: Push Your Code to GitHub

### 3.1. Open Terminal/Command Prompt

Navigate to your project folder:
```bash
cd "C:\Users\aknr\Desktop\Ingilizce Derslerim\Ingilizce-Derslerim"
```

### 3.2. Initialize Git (if not already done)

```bash
git init
```

### 3.3. Add all files

```bash
git add .
```

### 3.4. Create your first commit

```bash
git commit -m "Initial commit: Ingilizce Derslerim app"
```

### 3.5. Connect to GitHub

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### 3.6. Push to GitHub

```bash
git branch -M main
git push -u origin main
```

**Note**: If this is your first time, GitHub may ask you to authenticate. Follow the prompts.

---

## Step 4: Deploy to Vercel

### 4.1. Sign up for Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (easiest option)
4. Authorize Vercel to access your GitHub account

### 4.2. Import your project

1. After signing in, you'll see the Vercel dashboard
2. Click **"Add New..."** → **"Project"**
3. You should see your GitHub repository listed
4. Click **"Import"** next to your repository

### 4.3. Configure project settings

Vercel will auto-detect your project. Verify these settings:

- **Framework Preset**: Should be "Vite" (auto-detected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (should be auto-filled)
- **Output Directory**: `dist/public` (should be auto-filled from vercel.json)
- **Install Command**: `npm install` (should be auto-filled)

### 4.4. Environment Variables (if needed)

If you have any environment variables (like API keys):
- Click **"Environment Variables"**
- Add them here
- For now, you probably don't need any

### 4.5. Deploy!

1. Click **"Deploy"** button
2. Wait 2-3 minutes for the build to complete
3. Vercel will show you a progress log
4. When done, you'll see: **"Congratulations! Your project has been deployed."**

### 4.6. Get your live URL

After deployment, Vercel will give you a URL like:
```
https://ingilizce-derslerim.vercel.app
```

**This is your live website!** 🎉

---

## Step 5: Custom Domain (Optional)

### 5.1. Add a custom domain

1. In your Vercel project dashboard, go to **"Settings"** → **"Domains"**
2. Enter your domain name (e.g., `ingilizcederslerim.com`)
3. Follow Vercel's instructions to configure DNS

---

## Step 6: Automatic Updates

### 6.1. How it works

- Every time you push code to GitHub, Vercel automatically redeploys
- You don't need to do anything manually!

### 6.2. Making updates

1. Make changes to your code locally
2. Test with `npm run dev`
3. Commit and push:
   ```bash
   git add .
   git commit -m "Description of your changes"
   git push
   ```
4. Vercel will automatically build and deploy the new version
5. Check your Vercel dashboard to see the deployment status

---

## Troubleshooting

### Build fails on Vercel

1. Check the build logs in Vercel dashboard
2. Make sure `npm run build` works locally first
3. Common issues:
   - Missing dependencies → Check `package.json`
   - Type errors → Run `npm run check` locally
   - Path issues → Check `vite.config.ts`

### Site shows 404 errors

- This is normal for React SPAs
- The `vercel.json` file handles routing
- Make sure `vercel.json` is in your repository

### Images/assets not loading

- Check that assets are in `client/public/` folder
- Verify paths in your code use `/` (absolute paths)
- Check browser console for 404 errors

---

## Quick Reference Commands

```bash
# Initialize git (first time only)
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub (first time only)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main

# Make updates
git add .
git commit -m "Your update message"
git push
```

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **GitHub Docs**: https://docs.github.com
- **Vite Docs**: https://vitejs.dev

---

**Congratulations!** Your English learning platform is now live on the internet! 🌐

