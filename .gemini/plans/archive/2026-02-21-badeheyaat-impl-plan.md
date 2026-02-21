# Implementation Plan - Project Badeheyaat (Axioms)

**Date:** 2026-02-21
**Phase:** 2 (Planning)

## 1. Plan Overview
- **Total Phases:** 5
- **Agents:** DevOps Engineer, Coder, Technical Writer
- **Estimated Effort:** ~6 Days (represented as 5 execution phases)

## 2. Dependency Graph
```mermaid
graph TD
    P1[Phase 1: Infrastructure] --> P2[Phase 2: Backend (Strapi)]
    P1 --> P3[Phase 3: Microservice]
    P1 --> P4[Phase 4: Frontend (Next.js)]
    P2 --> P5[Phase 5: Integration & Docs]
    P3 --> P5
    P4 --> P5
```

## 3. Execution Strategy

| Phase | Agent | Mode | Dependencies |
|-------|-------|------|--------------|
| 1. Infrastructure | devops-engineer | Sequential | None |
| 2. Backend (Strapi) | coder | Sequential | P1 |
| 3. Microservice | coder | Sequential | P1 |
| 4. Frontend (Next.js) | coder | Sequential | P1 |
| 5. Integration & Docs | technical-writer | Sequential | P2, P3, P4 |

*Note: Phases 2, 3, and 4 are logically independent but will be executed sequentially to ensure stability in the monorepo setup.*

## 4. Phase Details

### Phase 1: Infrastructure & Project Skeleton
**Objective:** specific Docker Compose environment with Strapi, Postgres, Node.js Microservice, and Next.js services.
**Agent:** `devops-engineer`
**Files to Create:**
- `docker-compose.yml`: Define services (strapi, postgres, microservice, frontend) and networks.
- `.env.example`: Template for environment variables.
- `.gitignore`: Global gitignore.
- `backend/.gitkeep`, `frontend/.gitkeep`, `microservice/.gitkeep`: Directory placeholders.
**Validation:**
- `docker-compose config` returns valid configuration.
- Directory structure exists.

### Phase 2: Backend Core (Strapi)
**Objective:** Initialize Strapi CMS and define Content Types.
**Agent:** `coder`
**Files to Create/Modify:**
- `backend/package.json`: Strapi dependencies.
- `backend/config/plugins.js`: Configure documentation/upload plugins.
- `backend/src/api/category/content-types/category/schema.json`: Define Category schema.
- `backend/src/api/axiom/content-types/axiom/schema.json`: Define Axiom schema.
**Validation:**
- `npm run build` in `backend/` succeeds.
- Strapi starts successfully.

### Phase 3: Image Microservice
**Objective:** Build the Node.js microservice for image generation.
**Agent:** `coder`
**Files to Create:**
- `microservice/package.json`: Dependencies (`express`, `satori`, `@resvg/resvg-js`, `node-fetch`).
- `microservice/src/server.ts`: Express server and webhook endpoint (`POST /generate`).
- `microservice/src/generator.ts`: Satori & Resvg logic.
- `microservice/src/theme.config.ts`: Theme definitions.
- `microservice/src/utils/strapi.ts`: Helper to update Strapi records.
- `microservice/src/assets/IBMPlexSansArabic-Regular.ttf`: Font file (downloaded or mocked).
**Validation:**
- `npm run build` (if TS) or `node src/server.js` starts.
- `curl` to `/generate` endpoint produces a file in shared volume (mocked test).

### Phase 4: Frontend Core (Next.js)
**Objective:** Build the Public Interface with ISR.
**Agent:** `coder`
**Files to Create:**
- `frontend/package.json`: Next.js dependencies.
- `frontend/app/page.tsx`: Home page (Grid of Axioms).
- `frontend/app/a/[slug]/page.tsx`: Detail page.
- `frontend/lib/api.ts`: Strapi fetch logic.
- `frontend/components/AxiomCard.tsx`: UI Component.
**Validation:**
- `npm run build` in `frontend/` succeeds.
- Pages render with mock data.

### Phase 5: Integration & Documentation
**Objective:** Finalize setup instructions and verify E2E flow.
**Agent:** `technical-writer`
**Files to Create/Modify:**
- `README.md`: Comprehensive setup guide (Prerequisites, Install, Usage).
- `docs/API_TOKEN_SETUP.md`: Manual steps to generate Strapi Token.
**Validation:**
- Instructions are clear and accurate.

## 5. File Inventory
| File | Phase | Purpose |
|------|-------|---------|
| `docker-compose.yml` | 1 | Orchestration |
| `backend/` | 2 | CMS Source |
| `microservice/` | 3 | Image Gen Source |
| `frontend/` | 4 | UI Source |
| `README.md` | 5 | Documentation |

## 6. Risk Assessment
- **Phase 2 (Strapi)**: HIGH. Strapi initialization can be flaky with DB connections. *Mitigation*: Ensure Postgres is healthy in Docker before Strapi starts.
- **Phase 3 (Microservice)**: MEDIUM. Satori font loading can be tricky. *Mitigation*: Use absolute paths or verified local font files.
- **Phase 4 (Frontend)**: LOW. Standard Next.js patterns.

