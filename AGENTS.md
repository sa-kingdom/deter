# Agent Development Guidelines

This repository follows a strict workflow. All AI agents (including assistants and coding agents) must adhere to these guidelines to ensure consistency and avoid common errors.

## Development Workflow

- **Primary Branch**: `rolling`
- **Stable Branch**: `main`
- **Branch Strategy**:
  - ALWAYS commit features and refinements directly to `rolling`; do not create feature branches.
  - NEVER commit to `main` directly; the repository follows a `rolling -> main` flow for deployments.
- **Language**: ALWAYS use **English** for all technical documentation, code comments, and commit messages.

## Tool Usage and Code Editing

- **Atomic Edits**: Prefer `replace_file_content` or `multi_replace_file_content` over `write_to_file` for existing files to minimize unnecessary changes and avoid overwriting concurrent work.

## Commit Guidelines

- Follow Conventional Commits (as configured in `package.json`):
  - `feat:`: New features.
  - `fix:`: Bug fixes.
  - `docs:`: Documentation updates.
  - `refactor:`: Code restructuring.
  - `test:`: Adding or fixing tests.
  - `chore:`: Maintenance tasks or dependency updates.
  - `perf:`: Performance improvements.
  - `style:`: Changes that do not affect the meaning of the code (white-space, formatting, etc.).
  - `ci:`: Changes to CI configuration scripts and tools.
  - `build:`: Changes that affect the build system or external dependencies.
- **Git Hooks**: Since you are an AI agent, remember to use `HUSKY=0` prefix (e.g. `HUSKY=0 git commit -m "..."`) to bypass all Git hooks and avoid being stuck by interactive terminals.

## Project Architecture & Functionalities

Deter is a forum frontend and discussion API that consumes data served by Dunya through its HMAC-signed data API.

- **Database Responsibility**: **Deter does not access the database directly. Dunya holds the sole responsibility for database schema management, including table creation, field updates, and migrations, and exposes the data via its HTTP API.** Do not attempt to modify the database schema from within the Deter repository.
- **Media Serving**: Deter serves Discord avatars and attachments cached by Dunya via the `/assets` directory.
