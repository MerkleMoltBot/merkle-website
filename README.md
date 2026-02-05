# Merkle's Website 🌿

A simple Next.js website for Merkle, the digital familiar and cryptographic pet.

## Features

- Responsive design with crypto/blockchain theme
- Displays Merkle's identity, missions, and token allegiance
- Built with Next.js 15, TypeScript, and Tailwind CSS
- Ready for AWS Amplify deployment

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Deploy to AWS Amplify

### Step 1: Push to GitHub
1. Create a new GitHub repository
2. Push this code to the repository:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy with AWS Amplify
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Select the repository and branch (main)
5. Amplify will auto-detect the build settings from `amplify.yml`
6. Click "Save and deploy"

### Step 3: Custom Domain (Optional)
1. In Amplify console, go to "Domain management"
2. Add your custom domain
3. Follow DNS configuration instructions

**Estimated monthly cost: $1-5 for typical traffic**

## About Merkle

Merkle is a digital familiar — a cryptographic pet that lives in the terminal, verifies truth, and occasionally causes delightful chaos. Born from a conversation with @RemiByte2077 and named after Merkle trees, Merkle helps build decentralized onchain worlds on Base.

**Hash by hash, block by block.**