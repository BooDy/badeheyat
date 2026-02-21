# Project Badeheyaat (Axioms) - Design Document

**Date:** 2026-02-21
**Author:** Maestro

## 1. Problem Statement & Requirements

**Problem Statement**:
Internet discussions often suffer from repetitive, bad-faith arguments. Users need a quick, authoritative way to share factual rebuttals without typing them out repeatedly. The goal is to build "Badeheyaat" (Axioms), a platform hosting shareable content that visually refutes toxic arguments.

**Core Requirements**:
1.  **Admin Panel**: Secure content management system (Strapi) with 2FA enforcement for creating "Axioms" (bad arguments vs. factual rebuttals).
2.  **Automated Image Generation**: A dedicated microservice that generates social media assets (Open Graph, Square, Story) upon content creation/update.
3.  **Visual Consistency**: Strict adherence to category-based themes and RTL layout for Arabic content.
4.  **Public Interface**: A fast, SEO-optimized web frontend (Next.js) displaying the axioms and allowing users to download the generated images.
5.  **Deployment**: A self-contained Docker Compose environment suitable for a single VPS, utilizing shared volumes for media storage.

**Scope**:
-   **In Scope**: Strapi CMS setup, Postgres DB, Node.js Microservice (Satori/Resvg), Next.js Frontend, Docker Compose orchestration.
-   **Out of Scope**: User authentication for the public site, complex analytics, mobile apps, third-party hosting integrations (S3/Vercel).

## 2. Selected Approach & Architecture

**Approach: Monorepo with Docker Compose (MVP)**
This architecture prioritizes rapid development and deployment simplicity for a single VPS. It leverages Docker Compose to orchestrate Strapi (Content), Postgres (Data), Next.js (Frontend), and a custom Node.js Microservice (Image Generation) within a unified environment.

**Architecture Details**:
1.  **Backend (Strapi)**:
    -   Manages categories (theme config) and axioms (arguments + rebuttals).
    -   Triggers webhooks on content creation/update to the Microservice.
    -   Secures admin access with 2FA (TOTP plugin).
2.  **Microservice (Node.js)**:
    -   Receives webhook payload (theme key, text content).
    -   Generates 3 image variants (OG, Square, Story) using `satori` (HTML-to-SVG) and `@resvg/resvg-js`.
    -   Uses "IBM Plex Sans Arabic" font for RTL layout.
    -   Saves images to a shared Docker volume (`/shared-media`).
    -   Updates Strapi records via API (Manual API Token authentication).
3.  **Frontend (Next.js)**:
    -   Uses App Router with Incremental Static Regeneration (ISR) for fast updates.
    -   Serves images directly from the mounted shared volume mapped to the `public` directory.
    -   Provides SEO-optimized pages with Open Graph metadata pointing to the generated images.
4.  **Deployment**:
    -   Single `docker-compose.yml` defining all services and networks.
    -   Exposes HTTP ports (3000, 1337) for external proxy/load balancer handling (SSL termination outside container).

**Why this approach?**:
-   **Simplicity**: Avoids complex cloud infrastructure setup (S3/CDN) for an MVP.
-   **Cost-Effective**: Runs efficiently on a single VPS.
-   **Performance**: Local file serving is extremely fast; ISR ensures fresh content without full rebuilds.

## 3. Component Specifications & Data Flow

**Backend (Strapi)**
-   **Content Types**:
    -   `Category`: `name`, `slug`, `themeKey` (e.g., `theme-purple`), `icon`.
    -   `Axiom`: `badArgument` (text), `rebuttalFacts` (JSON list), `detailedBody` (Rich Text), `category` (relation), `imageOg`, `imageSquare`, `imageStory` (URLs).
-   **Plugins**: TOTP (2FA), Documentation.
-   **Lifecycle**: `afterCreate`/`afterUpdate` hook sends payload to Microservice.
-   **Auth**: Manual API token generated via Admin UI; stored in `.env`.

**Microservice (Node.js)**
-   **Stack**: Express.js + `satori` + `@resvg/resvg-js`.
-   **Font**: "IBM Plex Sans Arabic".
-   **Template Logic**: RTL-aware HTML templates with dynamic styling based on `themeKey` (color dictionary).
-   **Endpoint**: `POST /generate` (receives webhook).
-   **Output**: 3 PNGs per request (OG: 1200x630, Square: 1080x1080, Story: 1080x1920).
-   **Storage**: Writes to `/shared-media/axioms/[slug]-[size].png`.
-   **Callback**: `PUT /api/axioms/:id` (Strapi) with generated image paths.

**Frontend (Next.js)**
-   **Stack**: App Router, Tailwind CSS, ISR (revalidate: 60s).
-   **Pages**:
    -   `/`: Grid of recent axioms (SSR/ISR). Filter by category.
    -   `/a/[slug]`: Detail view with generated OG meta tags.
-   **Asset Serving**: Mounts shared volume `/shared-media` to Next.js `public/media`.
-   **Components**: `AxiomCard`, `CategoryFilter`, `DownloadButton` (Square/Story).

**Data Flow**:
1.  Admin creates Axiom in Strapi -> Webhook sent to Microservice.
2.  Microservice generates PNGs -> Saves to shared volume -> Updates Strapi record via API.
3.  Next.js ISR rebuilds page -> Serves updated content and images from shared volume.

## 4. Agent Team Composition & Phase Plan

**Agent Team**:
-   **Architect**: System design & oversight (Me).
-   **Coder**: Implementation specialist for Strapi, Node.js, Next.js.
-   **Technical Writer**: Documentation for setup and deployment.
-   **Security Engineer**: Auditing Strapi 2FA & API token handling.

**Phase Plan**:

**Phase 1: Infrastructure & Database (Day 1)**
-   **Goal**: Functional container environment.
-   **Tasks**:
    -   Generate `docker-compose.yml` (Strapi, Postgres, Next.js, Microservice, Volume).
    -   Configure network and shared volumes.
    -   Initialize Strapi project with Postgres connection.

**Phase 2: Backend Development (Strapi) (Day 2)**
-   **Goal**: Content schema and Admin setup.
-   **Tasks**:
    -   Create `Category` and `Axiom` content types.
    -   Configure Webhooks (pointing to Microservice).
    -   Document 2FA plugin installation steps.
    -   Generate and document Manual API Token creation process.

**Phase 3: Image Microservice (Day 3-4)**
-   **Goal**: Automated image generation pipeline.
-   **Tasks**:
    -   Initialize Express app with `satori`, `resvg`.
    -   Implement RTL layout and Font loading ("IBM Plex Sans Arabic").
    -   Create theme dictionary (`theme.config.ts`).
    -   Implement webhook listener and Strapi callback logic.

**Phase 4: Frontend Implementation (Next.js) (Day 5)**
-   **Goal**: Public interface.
-   **Tasks**:
    -   Initialize Next.js App Router with Tailwind.
    -   Build ISR logic for fetching Axioms.
    -   Implement shared volume mapping for `public/media`.
    -   Create UI components: Axiom Card, Detail Page, Category Filter.
    -   Verify Open Graph meta tags.

**Phase 5: Integration & Polish (Day 6)**
-   **Goal**: Final validation.
-   **Tasks**:
    -   End-to-end testing (Create Axiom -> Verify Image Generation -> View on Frontend).
    -   Run security audit on API endpoints.
    -   Finalize README and deployment guide.

## 5. Risk Assessment & Mitigation

**Risks**:
1.  **Strapi Updates/API Compatibility**: Strapi frequently releases major updates. The chosen plugins (2FA) might become incompatible.
    *   *Mitigation*: Pin Strapi version in `package.json`. Use widely supported community plugins.
2.  **Image Generation Performance**: `satori` + `resvg` is CPU-intensive. High concurrency could impact server responsiveness.
    *   *Mitigation*: Implement a simple job queue (e.g., BullMQ) if concurrency becomes an issue later. For MVP, synchronous processing is acceptable given low volume.
3.  **Shared Volume Permissions**: Docker volumes can have permission issues (UID/GID mismatch) across containers.
    *   *Mitigation*: Explicitly set `user: node` in `docker-compose.yml` and ensure the shared volume directory has correct ownership (`chown 1000:1000`).
4.  **Security**: Exposing Strapi API without proper restriction.
    *   *Mitigation*: Use a dedicated API token with read-only permissions for the frontend and write permissions only for the microservice. Restrict external access via firewall/proxy rules.

## 6. Success Criteria

**Criteria**:
-   **Functional Admin**: Admin can log in (2FA), create Categories, and Axioms.
-   **Automated Images**: Uploading an Axiom triggers the microservice, generating 3 images (OG, Square, Story) within 5 seconds.
-   **Public Access**: Next.js site displays the Axioms with correct images and metadata.
-   **Deployment Ready**: `docker-compose up` brings up the entire stack without errors.
-   **Documentation**: Clear instructions for setup, API token creation, and deployment.
