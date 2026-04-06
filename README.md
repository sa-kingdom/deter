# Deter (迪特)

> A high-speed forum system running on the Discord highway.

Deter is a lightweight, modern forum frontend and discussion API designed specifically for Discord communities. It provides a seamless transition from real-time Discord chat to a structured forum experience.

## System Architecture

Deter is part of a dual-system architecture designed for high performance and reliability:

- **Dunya (Backend/Syncer)**: Responsible for syncing data from Discord guilds to a local database and caching media (avatars, attachments). **Dunya holds sole responsibility for database schema management (table creation, updates, and migrations).**
- **Deter (Frontend/API)**: A sleek web interface and API that consumes the data synced by Dunya. Deter is a **database consumer only** and serves cached media via the `/assets` directory.

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3 with Composition API)
- **Runtime**: [Bun](https://bun.sh/) (Fast package manager, runner, and bundler)
- **UI Library**: [Tocas UI](https://tocasui.com/) (A modern, clean UI framework)
- **Database Layer**: [Sequelize](https://sequelize.org/) (connecting to MySQL/MariaDB managed by Dunya)
- **Animations**: [Vue3-Lottie](https://github.com/chenqingspring/vue3-lottie) (for Discord sticker support)

## Key Features

- **Discord-Integrated Forum**: Provides a structured view of Discord discussions.
- **Media Serving**: Efficiently serves Discord avatars and attachments cached locally by Dunya to prevent expired CDN links.
- **Rich Content Support**:
  - Discord-style markdown and mention resolution.
  - Role-based color indicators.
  - Support for Discord stickers, including **animated Lottie stickers**.
- **SEO Optimized**: Built-in SEO best practices for better discoverability.
- **Micro-animations**: Smooth transitions and interactions for a premium experience.

## Setup

### Prerequisites

- **Bun**: Ensure you have [Bun](https://bun.sh/) installed.
- **Dunya**: A running instance of Dunya is required to populate the database and cache media.

### Installation

```sh
bun install
```

### Development

Start the development server with automatic reloading:

```sh
bun run dev
```

### Production

Compile the project for production, optimizing and outputting to the `.output` directory:

```sh
bun run build
```

Preview the production build locally:

```sh
bun run preview
```

## Project Structure

```text
├── app/                  # Frontend application (Nuxt 4)
│   ├── components/       # Reusable Vue components
│   ├── layouts/          # Page layouts
│   ├── pages/            # View pages (auto-routed)
│   └── plugins/          # Client-side and server-side plugins
├── public/               # Public static files
├── server/               # Backend API and server-side utilities
│   ├── api/              # API endpoints
│   └── utils/            # Shared database models and utilities
├── nuxt.config.ts        # Nuxt configuration
└── package.json          # Project dependencies
```

## Environment Variables

Copy `.env.example` (if available) or create a `.env` file with the following configuration:

```env
# Database Configuration (Matching Dunya)
NUXT_DATABASE_NAME=deter
NUXT_DATABASE_USER=deter
NUXT_DATABASE_PASS=password
NUXT_DATABASE_HOST=127.0.0.1
NUXT_DATABASE_PORT=3306

# API Configuration
NUXT_PUBLIC_API_INVOKE_BASE_URL=/api
NUXT_PUBLIC_API_PUBLIC_BASE_URL=http://localhost:3000
```

## Open Source License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

&copy; [Star Inc.](https://starinc.xyz)
