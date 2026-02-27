# 🤖 AI-Powered Personalized Learning Assistant

A modern, AI-driven tutoring application that helps students learn effectively using their own curriculum materials. The app uses **Retrieval-Augmented Generation (RAG)** to answer questions based on uploaded documents, with adaptive learning modes that adjust to each student's experience level.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Prisma](https://img.shields.io/badge/Prisma-5-2D3748) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Prerequisites](#-prerequisites)
4. [Quick Start Guide](#-quick-start-guide)
5. [Environment Setup](#-environment-setup)
6. [Database Setup](#-database-setup)
7. [Running the Application](#-running-the-application)
8. [Available Scripts](#-available-scripts)
9. [Project Structure](#-project-structure)
10. [API Keys Setup](#-api-keys-setup)
11. [Deployment](#-deployment)
12. [Troubleshooting](#-troubleshooting)
13. [Support](#-support)

---

## ✨ Features

- **📚 Document Upload**: Upload PDFs, text files, and other curriculum materials
- **🤖 AI Tutor (Lumina)**: Adaptive AI tutor that answers questions from your materials
- **🧠 RAG Pipeline**: Vector-based similarity search to find relevant context
- **📊 Analytics Dashboard**: Track learning progress and usage statistics
- **💬 Chat History**: Save and review past conversations
- **⚙️ Customizable Settings**: Toggle Socratic method, curriculum strictness
- **🔐 Authentication**: Secure email/password authentication via Better Auth
- **📈 Usage Tracking**: Built-in token and API call limits

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Prisma |
| **Authentication** | Better Auth |
| **AI/ML** | OpenRouter SDK, Vercel AI SDK |
| **Embeddings** | NVIDIA Nemotron (via OpenRouter) |
| **Styling** | Tailwind CSS |
| **UI Components** | Radix UI, Lucide Icons |
| **PDF Processing** | pdf-parse |

---

## ✅ Prerequisites

Before setting up this project, ensure you have the following installed:

### 1. Node.js

**Required Version**: 18.x or higher

```bash
# Check if Node.js is installed
node --version

# If not installed, download from: https://nodejs.org
# Recommended: Use nvm (Node Version Manager)
# Windows: https://github.com/coreybutler/nvm-windows
# macOS/Linux: https://github.com/nvm-sh/nvm
```

### 2. Package Manager

This project uses **pnpm** for package management.

```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version
```

### 3. Git

```bash
# Check if Git is installed
git --version
```

### 4. Database (Neon)

You need a **Neon PostgreSQL** account. Sign up for free at:
https://neon.tech

---

## 🚀 Quick Start Guide

Follow these steps to get the application running locally:

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd 2026-02-20_AI-Powered_Personalized_Learning_Assistant
```

### Step 2: Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### Step 3: Environment Setup

```bash
# Copy the example environment file
cp .env.example .env.local
```

### Step 4: Configure Environment Variables

Edit `.env.local` and add your API keys. See the [Environment Setup](#-environment-setup) section for details.

### Step 5: Database Setup

```bash
# Generate Prisma Client
pnpm prisma generate

# Push schema to database
pnpm prisma db push
```

### Step 6: Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# =============================================================================
# DATABASE CONFIGURATION (Neon PostgreSQL)
# =============================================================================
# Get these from your Neon project dashboard: https://neon.tech

DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require&schema=public"

# =============================================================================
# AUTHENTICATION (Better Auth)
# =============================================================================
BETTER_AUTH_SECRET="your-generated-secret-key-min-32-chars-here"
BETTER_AUTH_URL="http://localhost:3000"

# =============================================================================
# AI PROVIDERS (OpenRouter)
# =============================================================================
OPENROUTER_API_KEY="sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# =============================================================================
# APPLICATION
# =============================================================================
NODE_ENV="development"
```

---

## 🗄️ Database Setup

### Option 1: Neon (Recommended)

1. **Create a Neon Project**
   - Go to [Neon Console](https://neon.tech)
   - Click "Create Project"
   - Name your project (e.g., "learning-assistant")
   - Select the closest region to you
   - Click "Create Project"

2. **Get Connection Details**
   - In the Neon dashboard, go to "Connection Details"
   - Select "Pooled connection" for `DATABASE_URL`
   - Select "Direct connection" for `DATABASE_URL_UNPOOLED`
   - Copy the connection strings

3. **Enable pgvector Extension**
   - In Neon Console, go to "Branches"
   - Select your branch
   - Go to "Extensions"
   - Enable the `vector` extension

### Option 2: Local PostgreSQL

If you prefer running PostgreSQL locally:

```bash
# macOS (using Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database
createdb learning_assistant
```

Update your `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/learning_assistant?sslmode=disable"
DATABASE_URL_UNPOOLED="postgresql://postgres:password@localhost:5432/learning_assistant?sslmode=disable"
```

### Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
pnpm prisma generate

# Push schema to database (creates/updates tables)
pnpm prisma db push

# Create a new migration
pnpm prisma migrate dev --name migration_name

# View database in Prisma Studio (GUI)
pnpm prisma studio

# Reset database (WARNING: deletes all data)
pnpm prisma migrate reset
```

---

## ▶️ Running the Application

### Development Mode

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Code Quality

```bash
# Run ESLint
pnpm lint

# Type check
pnpm tsc --noEmit
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm prisma generate` | Generate Prisma Client |
| `pnpm prisma db push` | Push schema to database |
| `pnpm prisma migrate dev` | Create and apply migrations |
| `pnpm prisma studio` | Open Prisma database GUI |

---

## 📂 Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── (auth)/           # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/      # Protected dashboard pages
│   │   │   ├── dashboard/
│   │   │   │   ├── analytics/
│   │   │   │   ├── chat/
│   │   │   │   ├── library/
│   │   │   │   ├── materials/
│   │   │   │   └── settings/
│   │   ├── api/              # API routes
│   │   │   ├── auth/
│   │   │   └── chat/
│   │   ├── actions/          # Server Actions
│   │   └── layout.tsx
│   ├── components/          # React components
│   ├── lib/                  # Utility libraries
│   │   ├── auth.ts           # Better Auth config
│   │   ├── db.ts             # Prisma client
│   │   ├── knowledge.service.ts  # RAG pipeline
│   │   └── usage.service.ts # Usage tracking
│   └── middleware.ts         # Auth middleware
├── .env.example              # Environment variables template
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 🔑 API Keys Setup

### 1. OpenRouter API Key

OpenRouter provides access to 100+ AI models through a unified API.

**Steps:**
1. Go to [OpenRouter.ai](https://openrouter.ai)
2. Sign up / Log in
3. Navigate to "Settings" → "API Keys"
4. Click "Create New Key"
5. Copy the key (it starts with `sk-or-v1-`)
6. Add to `.env.local`:
   ```
   OPENROUTER_API_KEY="sk-or-v1-xxxxxxxxxxxxx"
   ```

**Usage:**
- **Chat Model**: Google Gemini 2.5 Flash (default)
- **Embeddings**: NVIDIA Llama Nemotron Embed VL (free tier)

**Pricing:**
- The app uses free models by default
- You can upgrade to paid models anytime
- Set spending limits in OpenRouter dashboard

### 2. Better Auth Secret

Generate a secure secret for authentication:

```bash
# Generate a random 32-character secret
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/repo.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - In "Environment Variables", add all variables from `.env.example`
   - Click "Deploy"

3. **Update Production URLs**
   After deployment, update these variables:
   ```env
   BETTER_AUTH_URL="https://your-app.vercel.app"
   ```

### Environment Variables in Production

| Variable | Production Value |
|----------|-----------------|
| `NODE_ENV` | `production` |
| `BETTER_AUTH_URL` | `https://your-domain.com` |
| `DATABASE_URL` | Neon pooled connection string |
| `DATABASE_URL_UNPOOLED` | Neon direct connection string |

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "DATABASE_URL is missing"

**Solution:** Ensure your `.env.local` file exists and contains `DATABASE_URL`.

```bash
# Verify the file exists
ls -la .env.local
```

#### 2. Prisma Client not generated

**Solution:** Run `pnpm prisma generate`

```bash
pnpm prisma generate
```

#### 3. WebSocket connection errors

**Solution:** Ensure the `ws` package is installed and configured correctly. The app uses WebSockets for database connections via Neon.

#### 4. Authentication errors

**Solution:** 
1. Verify `BETTER_AUTH_SECRET` is at least 32 characters
2. Ensure `BETTER_AUTH_URL` matches your current URL
3. Clear browser cookies and try again

#### 5. OpenRouter API errors

**Solution:**
1. Verify your API key is correct
2. Check your API key has sufficient credits
3. Ensure the key starts with `sk-or-v1-`

#### 6. Build errors

**Solution:** Clear `.next` cache and rebuild:

```bash
rm -rf .next
pnpm build
```

### Getting Help

If you encounter issues not listed here:

1. Check the error logs in your terminal
2. Review the [Next.js documentation](https://nextjs.org/docs)
3. Check the [Prisma documentation](https://www.prisma.io/docs)
4. Open an issue on GitHub

---

## 📞 Support

- **Documentation**: See the `/docs` folder for detailed specifications
- **Issues**: Report bugs at the GitHub repository
- **Discussions**: Use GitHub Discussions for questions

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React Framework
- [Prisma](https://prisma.io) - Next-generation ORM
- [Better Auth](https://www.better-auth.com) - Authentication for modern web apps
- [OpenRouter](https://openrouter.ai) - Unified AI API
- [Vercel](https://vercel.com) - Deploy with zero configuration
