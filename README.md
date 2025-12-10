# Cognitio - AI Augmented Learning Platform

> Built for House of Edtech Assignment (Fullstack Developer)

Cognitio is an intelligent flashcard application that uses **Generative AI (Llama 3.3)** to instantly create active recall study materials from any topic. It features a modern, optimistic UI, real-time streaming generation, and a robust serverless architecture.


## 🛠 Tech Stack (The "God Tier")

| Layer | Technology | Why I Chose It |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (Canary)** | For the new `useOptimistic` hook, Server Actions, and Partial Prerendering capabilities. |
| **Language** | **TypeScript** | Strict mode enabled for bulletproof type safety end-to-end. |
| **Database** | **Neon (Postgres)** | Serverless PostgreSQL. chosen for its branching capabilities and zero-cold-start speed. |
| **ORM** | **Drizzle ORM** | Lightweight, type-safe, and faster than Prisma. SQL-like syntax keeps queries optimized. |
| **AI Engine** | **Groq (Llama 3.3)** | Ultra-low latency inference (300+ tokens/s). Essential for the "instant" feel. |
| **AI SDK** | **Vercel AI SDK 4.0** | Specifically `@ai-sdk/rsc` for streaming structured objects directly to client components. |
| **Styling** | **Tailwind + Shadcn/UI** | For a premium, accessible, and responsive design system. |
| **Auth** | **Auth.js v5 (NextAuth)** | Edge-compatible authentication with Google OAuth. |

## 🌟 Key Features

### 1. Generative UI Streaming
Unlike standard chatbots, Cognitio streams **Structured JSON** directly into React components.
- **Tech:** `streamObject` from Vercel AI SDK.
- **Benefit:** Users see the flashcards being built card-by-card in real-time, reducing perceived latency to zero.

### 2. Optimistic Mutations
The dashboard feels instant.
- **Tech:** `useOptimistic` hook.
- **Benefit:** When a user creates a set, it appears immediately. The network request happens in the background. If it fails, the UI rolls back gracefully.

### 3. Intelligent User Sync
A custom "Emergency Sync" logic ensures users are never locked out, even if their OAuth ID changes (handling edge cases between Auth.js and Postgres).

### 4. Production-Grade Security
- **Zod Validation:** Every server action input is validated before execution.
- **RSC Authorization:** Every data fetch verifies ownership `(set.userId === session.user.id)`.
- **Middleware:** Protects private routes from unauthenticated access.

## ⚡️ Getting Started

### Prerequisites
- Node.js 20+
- A Neon DB project
- A Groq API Key
- Google OAuth Credentials

### Installation

1. **Clone the repo**
git clone https://github.com/yourusername/cognitio.git
cd cognitio


2. **Install dependencies**
npm install

Note: We use --legacy-peer-deps if AI SDK versions conflict

3. **Environment Setup**
Create `.env.local`:
DATABASE_URL="postgresql://..."
AUTH_SECRET="your_secret"
AUTH_GOOGLE_ID="client_id"
AUTH_GOOGLE_SECRET="client_secret"
GROQ_API_KEY="gsk_..."


4. **Database Push**
npx drizzle-kit push


5. **Run Development Server**
npm run dev


## 📂 Project Structure

src/
├── actions/ # Server Actions (Mutations & AI)
├── app/ # Next.js App Router (Pages)
├── components/ # React Components (UI & Logic)
├── db/ # Drizzle Schema & Connection
└── lib/ # Utilities (AI Client, utils)


## 🧠 Design Philosophy
I avoided "Magic" wherever possible.
- Instead of generic API routes, I used **Server Actions** for colocation of code.
- Instead of complex state management (Redux/Zustand), I leveraged **URL State** and **Server State**.
- The UI is designed to be "invisible" - putting the content (knowledge) front and center.

---

**Built by Saad Samir Momin**