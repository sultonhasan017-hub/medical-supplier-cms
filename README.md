<h1 align="center">Next.js Enterprise Corporate CMS</h1>

<p align="center">
  A modern, full-stack B2B Corporate Website & Admin CMS built with Next.js App Router, TypeScript, Prisma ORM, i18n (Multi-language), TipTap Rich Text Editor, and HTML Sanitization.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#live-demo">Live Demo</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation--setup">Installation</a> •
  <a href="#documentation">Documentation</a>
</p>

---

## 🚀 Live Demo
**Frontend & Admin Panel:** [https://medical-supplier-cms.vercel.app/](https://medical-supplier-cms.vercel.app/)

> **Demo Admin Credentials**
> - **Email:** admin@example.id 
> - **Password:** AdminPTSIM123!

---

## ✨ Features

- **⚡ Next.js App Router:** Built with the latest Next.js 15+ features including Server Components and Server Actions.
- **🌍 Internationalization (i18n):** Full support for English and Indonesian languages using `next-intl`.
- **🔐 Secure Admin CMS:** Custom-built Content Management System protected by JWT Authentication.
- **📝 TipTap Rich Text Editor:** Advanced, customizable rich text editor for creating engaging blog posts.
- **🛡️ HTML Sanitization:** Server-side XSS protection using DOMPurify to sanitize all user inputs.
- **🗄️ Prisma ORM & PostgreSQL:** Strongly typed database access and relational data modeling.
- **🎨 Tailwind CSS:** Beautiful, responsive, and maintainable styling with a custom design system.
- **📱 Fully Responsive:** Optimized for all screen sizes, from mobile phones to large desktop displays.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (Hosted on Neon/Supabase)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Authentication:** Custom JWT-based Auth
- **Rich Text Editor:** [TipTap](https://tiptap.dev/)
- **Security:** [DOMPurify](https://github.com/cure53/DOMPurify) (HTML Sanitization)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 💻 Installation & Setup

Follow these steps to run the project locally on your machine.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn or pnpm
- A PostgreSQL database (You can easily get a free one at [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com))

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/medical-supplier-cms.git
cd medical-supplier-cms
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy the example environment file and configure your variables.

```bash
cp .env.example .env
```
Open the `.env` file and update the following values:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `JWT_SECRET`: A long, random string for JWT signing. (You can generate one using `node generate-secret.js`).
- `NEXT_PUBLIC_WA_PHONE_NUMBER`: Your WhatsApp contact number.

### 4. Database Setup
Push the database schema and seed the initial data (Demo Admin Account, Sample Products, and Blogs).

```bash
npx prisma db push
npx prisma db seed
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📚 Documentation

### Project Structure
- `/src/app/[locale]/(public)` - All public-facing pages (Home, Products, Blog, Contact, About).
- `/src/app/[locale]/admin` - The Admin CMS dashboard and management pages.
- `/src/components` - Reusable UI components (Admin layout, Public layout, UI elements).
- `/src/lib` - Utility functions, Prisma client initialization, authentication logic, and sanitization rules.
- `/prisma` - Database schema and seeding scripts.
- `/public` - Static assets, images, and translation JSON files.

### Security Best Practices Implemented
1. **Server-Side Sanitization:** All HTML content submitted from the TipTap editor or contact forms is thoroughly sanitized using `isomorphic-dompurify` before being saved to the database.
2. **JWT HTTP-Only Cookies:** Authentication tokens are stored securely in HTTP-only cookies, protecting them from client-side JavaScript access (XSS).
3. **Server Actions:** Secure server-side mutations for database operations, preventing direct exposure of API endpoints.

---

## 📄 License
This project is for portfolio and demonstration purposes. Feel free to explore the code and adapt it for your own learning!
