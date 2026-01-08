# Fix GitHub Secret Detection

GitHub detected a secret in your commit. Follow these steps to fix it:

## Step 1: Remove the secret from Git

Run these commands in PowerShell:

```powershell
# Remove the file from git tracking
git rm -r --cached .config

# Also remove .local if it exists
git rm -r --cached .local 2>$null

# Update .gitignore (already done)
# Make sure .config/ and .local/ are in .gitignore
```

## Step 2: Amend your commit (remove secret from history)

```powershell
# Amend the last commit to remove the secret
git commit --amend --no-edit

# Or if you want to change the commit message:
# git commit --amend -m "Initial commit: Ingilizce Derslerim app"
```

## Step 3: Force push (since you're rewriting history)

```powershell
# Force push to update GitHub
git push -f origin main
```

**Note**: Force push is safe here because this is your first commit and no one else has pulled it yet.

## Alternative: Create a new commit

If amending doesn't work, you can create a new commit:

```powershell
# Remove from tracking
git rm -r --cached .config
git rm -r --cached .local 2>$null

# Add the removal
git add .gitignore
git commit -m "Remove Replit config files containing secrets"

# Push
git push origin main
```

## After fixing

Once you've removed the secret and pushed successfully, you can proceed with Vercel deployment!

