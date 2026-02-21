# Project Badeheyaat - CI/CD Design Document

**Date:** 2026-02-21
**Author:** Maestro

## 1. Problem Statement & Requirements

**Problem Statement**:
The "Badeheyaat" (Axioms) project is a monorepo containing multiple services (Strapi, Next.js, Image Microservice). We need an automated CI/CD pipeline to ensure code quality on pull requests and handle seamless deployments to a single VPS upon merging to the `main` branch.

**Core Requirements**:
1.  **Continuous Integration (CI)**:
    -   Run linting and build checks for each component (`backend`, `frontend`, `microservice`) on every Pull Request or push to `main`.
    -   Use **Path Filtering** to only run checks for the project(s) that actually changed, saving time and resources.
2.  **Continuous Deployment (CD)**:
    -   Automated deployment to a single VPS on push to `main`.
    -   Use **SSH Pull & Rebuild** strategy: Connect to VPS, pull latest code, and rebuild containers.
3.  **Environment Management**:
    -   Securely manage secrets (SSH keys, API tokens, DB credentials) using **GitHub Secrets**.
    -   Automated population of the `.env` file on the VPS during the deployment process.
4.  **Reliability**:
    -   Deployment should use `docker compose up -d --build` to minimize downtime.
    -   Health checks for the database to ensure services start correctly.

## 2. Selected Approach & Architecture

**Approach: Path-Filtered CI with SSH Deployment**
This design leverages GitHub Actions for both CI and CD. It is optimized for a monorepo targeting a single server, providing a balance between deployment speed and configuration simplicity.

**Architecture Details**:
1.  **CI Workflows (`ci-backend.yml`, `ci-frontend.yml`, `ci-microservice.yml`)**:
    -   Triggered on Pull Requests and pushes to `main`.
    -   Use `on.push.paths` and `on.pull_request.paths` to target specific directories.
    -   Step 1: Install dependencies.
    -   Step 2: Run `npm run lint`.
    -   Step 3: Run `npm run build` to verify compilation.
2.  **CD Workflow (`deploy.yml`)**:
    -   Triggered on push to `main` (after CI passes).
    -   **Step 1: Populate Secrets**: Create a `.env` file from GitHub Secrets.
    -   **Step 2: SSH Connect**: Use `appleboy/ssh-action` (or similar) to connect to the VPS.
    -   **Step 3: Update Code**: `git pull origin main`.
    -   **Step 4: Deploy**: `docker compose up -d --build`.
3.  **Security**:
    -   Use a dedicated SSH key for deployment (added to `~/.ssh/authorized_keys` on VPS).
    -   All sensitive variables (`STRAPI_API_TOKEN`, `POSTGRES_PASSWORD`, etc.) stored as GitHub Secrets.

**Why this approach?**:
-   **Monorepo-Friendly**: Path filtering avoids redundant builds for unchanged services.
-   **Low Overhead**: No need for a Docker Registry (GHCR/DockerHub) or complex Kubernetes orchestration for an MVP.
-   **Centralized Config**: Managing the `.env` via GitHub Secrets ensures the VPS is always in sync with the repository's configuration requirements.

## 3. Component Specifications & Data Flow

**GitHub Actions Workflows**
-   **Location**: `.github/workflows/`
-   **Secrets Required**:
    -   `VPS_HOST`: IP/Hostname of the VPS.
    -   `VPS_USERNAME`: SSH user.
    -   `VPS_SSH_KEY`: Private SSH key for the user.
    -   `ENV_FILE_CONTENT`: The full content of the `.env` file for the VPS.

**Deployment Flow**:
1.  **Developer** pushes code to `main`.
2.  **GitHub Actions** CI workflows trigger (based on paths).
3.  If CI passes, **CD Workflow** starts.
4.  **GitHub Actions** connects to VPS via SSH.
5.  **VPS** executes:
    ```bash
    cd /path/to/project
    git pull origin main
    echo "${{ secrets.ENV_FILE_CONTENT }}" > .env
    docker compose up -d --build
    ```
6.  **Docker Compose** detects changes and restarts updated containers.

## 4. Agent Team Composition & Phase Plan

**Agent Team**:
-   **DevOps Engineer**: Lead for CI/CD setup and Docker optimization.
-   **Technical Writer**: Documentation for secret management and VPS setup.

**Phase Plan**:

**Phase 1: Environment & Secrets (Day 1)**
-   **Goal**: Define required secrets and document VPS preparation.
-   **Tasks**:
    -   Update `.env.example` with any missing CI/CD relevant variables.
    -   Create `docs/DEPLOYMENT_GUIDE.md` explaining how to prepare the VPS (SSH keys, Git setup, Docker install).

**Phase 2: CI Workflows (Day 1)**
-   **Goal**: Automated code quality checks.
-   **Tasks**:
    -   Create `.github/workflows/ci-backend.yml`.
    -   Create `.github/workflows/ci-frontend.yml`.
    -   Create `.github/workflows/ci-microservice.yml`.
    -   Verify YAML syntax and path filters.

**Phase 3: CD Workflow (Day 2)**
-   **Goal**: Automated deployment to VPS.
-   **Tasks**:
    -   Create `.github/workflows/deploy.yml`.
    -   Implement the SSH connection and command sequence.
    -   Verify workflow logic.

## 5. Risk Assessment & Mitigation

**Risks**:
1.  **Downtime during Rebuild**: `docker compose up --build` can cause a brief window of downtime while images are being built.
    *   *Mitigation*: For an MVP, this is acceptable. If downtime becomes a problem, switch to **Docker Registry Push/Pull** to separate build and deploy steps.
2.  **SSH Connection Failure**: VPS might be unreachable or SSH keys misconfigured.
    *   *Mitigation*: Use a dedicated deploy user with limited permissions. Provide clear instructions in the Deployment Guide.
3.  **Monorepo Path Confusion**: CI might trigger unnecessarily if paths are overlapping.
    *   *Mitigation*: Use specific, non-overlapping path patterns in GitHub Actions configuration.

## 6. Success Criteria

**Criteria**:
-   **CI Integration**: Pushing a change to `frontend/` triggers only the frontend CI workflow.
-   **Quality Gate**: Pull Requests cannot be merged if CI fails (to be configured in GitHub settings by user).
-   **Automated Deploy**: Merging to `main` triggers an SSH session on the VPS that updates the code and restarts containers.
-   **Secrets Management**: The project runs successfully using environment variables injected during deployment.
