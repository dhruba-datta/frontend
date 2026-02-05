# Recruit Pro - Recruitment Platform

Recruit Pro is a modern, full-stack recruitment platform designed to streamline the hiring process by connecting employers with top talent. It features intelligent job matching, manual and invitation-based application workflows, and dedicated dashboards for both employers and job seekers.

## 🚀 Features

- **For Employers:**
  - Create and manage job postings.
  - View and manage applicants.
  - Invite specific talent to apply for jobs.
  - AI-driven talent matching scores.
- **For Talent:**
  - Browse a personalized feed of relevant job openings.
  - Apply to jobs manually or respond to invitations.
  - Track application status.
  - Manage professional profile.

- **Authentication & Security:**
  - Role-based access control (Employer vs. Talent).
  - Secure JWT authentication.
  - Protected routes and API endpoints.

## 🛠 Tech Stack

### Frontend

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) (Headless accessible primitives), [Lucide React](https://lucide.dev/) (Icons)
- **Animation:** `tw-animate-css`

### Backend Integration

- **API Client:** Type-safe REST API client (`src/lib/api.ts`)
- **Authentication:** Custom JWT-based auth via `AuthContext`.
- **Backend Service:** Connects to a backend service (default: `http://localhost:4000`) managing Supabase/PostgreSQL interactions.

## 🏗 Architecture Overview

The project follows a modular architecture using the **Next.js App Router**:

```
src/
├── app/                 # Next.js App Router
│   ├── (public)/        # Public routes (Landing, Auth)
│   ├── employer/        # Protected Employer routes
│   ├── talent/          # Protected Talent routes
│   └── layout.tsx       # Root layout and global providers
├── components/          # React components
│   ├── ui/              # Reusable UI primitives (buttons, inputs)
│   └── ...              # Feature-specific components (Navbar, Sidebar)
├── lib/                 # Utilities and Services
│   ├── api.ts           # Centralized API client methods
│   ├── AuthContext.tsx  # Authentication state management
│   └── utils.ts         # Helper functions
```

### Key Modules

- **Authentication:** Managed via `AuthContext.tsx`, which handles token storage (localStorage + Cookies) and user session state.
- **API Layer:** `api.ts` serves as a wrapper for `fetch`, handling base URLs, headers, token injection, and error handling.
- **Routing:**
  - **Public:** Accessible to all visitors.
  - **Employer:** Accessible only to users with `role: 'EMPLOYER'`.
  - **Talent:** Accessible only to users with `role: 'TALENT'`.

## 🚦 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Backend server running (default port 4000)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd recruitment-platform
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality issues.
