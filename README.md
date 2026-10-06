# Deter (迪特)

> A high-speed forum system running on the Discord highway.

Deter is a lightweight, modern forum frontend and discussion API designed specifically for Discord communities. It provides a seamless transition from real-time Discord chat to a structured forum experience.

## System Architecture

Deter is part of a dual-system architecture designed for high performance and reliability:

- **Dunya (Backend/Syncer)**: Responsible for syncing data from Discord guilds to a local database, caching media (avatars, attachments), and exposing the discussion data through a **HMAC-signed data API**. **Dunya holds sole responsibility for database schema management (table creation, updates, and migrations).**
- **Deter (Frontend/API)**: A sleek web interface and API that consumes Dunya's data API over HTTP. Deter **no longer accesses the database directly**; its server routes act as a mapping layer on top of Dunya's data API and serve cached media via the `/assets` directory.

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3 with Composition API)
- **Runtime**: [Bun](https://bun.sh/) (Fast package manager, runner, and bundler)
- **UI Library**: [Tocas UI](https://tocasui.com/) (A modern, clean UI framework)
- **Data Layer**: [Dunya Data API](https://github.com/sa-kingdom/dunya) (HMAC-signed HTTP API; Deter no longer queries the database directly)
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
- **Dunya**: A running instance of Dunya is required to serve the discussion data API and cache media.

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
# Dunya Data API Configuration (server-to-server, HMAC-signed)
NUXT_DUNYA_API_BASE_URL=http://localhost:3001
NUXT_DUNYA_API_SECRET=your_internal_hmac_secret

# API Configuration
NUXT_PUBLIC_API_INVOKE_BASE_URL=/api
NUXT_PUBLIC_API_PUBLIC_BASE_URL=http://localhost:3000
```

## Open Source License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

&copy; [Star Inc.](https://starinc.xyz)
