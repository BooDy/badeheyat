# Deployment Guide

This guide provides step-by-step instructions for setting up a Virtual Private Server (VPS) and configuring GitHub Actions for automated deployment of the Badeheyaat (Axioms) v2 platform.

## 1. VPS Setup

### Recommended OS
We recommend using **Ubuntu 22.04 LTS** or **Ubuntu 24.04 LTS**.

### Install Prerequisites

Connect to your VPS via SSH and run the following commands to install Docker, Docker Compose, and Git.

#### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### Install Docker
```bash
# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo 
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu 
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | 
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update

# Install Docker packages:
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

#### Verify Installation
```bash
docker --version
docker compose version
```

---

## 2. SSH Setup for GitHub Actions

To allow GitHub Actions to deploy to your VPS, you need to set up an SSH key.

### Generate a Deploy Key
On your local machine (or the VPS), generate a new SSH key pair:
```bash
ssh-keygen -t ed25519 -C "github-actions-deploy"
```
When prompted for a file, you can name it `id_ed25519_deploy`.

### Add Public Key to Authorized Keys
Copy the content of the public key (`id_ed25519_deploy.pub`) and append it to the `~/.ssh/authorized_keys` file on your VPS:
```bash
cat id_ed25519_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

---

## 3. GitHub Secrets Configuration

In your GitHub repository, go to **Settings** -> **Secrets and variables** -> **Actions** and add the following secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `VPS_HOST` | The IP address or domain of your VPS. | `1.2.3.4` |
| `VPS_USERNAME` | The SSH username for your VPS. | `ubuntu` |
| `VPS_SSH_KEY` | The **private** SSH key generated in step 2. | `-----BEGIN OPENSSH PRIVATE KEY----- ...` |
| `ENV_FILE_CONTENT` | The full content of your production `.env` file. | (See below) |

### `ENV_FILE_CONTENT` Template
Ensure your `ENV_FILE_CONTENT` includes all necessary production variables:
```env
# Database
DATABASE_NAME=badeheyaat
DATABASE_USERNAME=badeheyaat_user
DATABASE_PASSWORD=your_secure_password

# Strapi
STRAPI_ADMIN_JWT_SECRET=your_secret
STRAPI_API_TOKEN_SALT=your_salt
STRAPI_TRANSFER_TOKEN_SALT=your_salt
STRAPI_APP_KEYS=key1,key2

# Microservice
STRAPI_API_TOKEN=your_strapi_api_token

# Frontend
NEXT_PUBLIC_STRAPI_API_URL=https://api.yourdomain.com
```

---

## 4. Initial Deployment

Before the GitHub Action can run successfully, you must perform the initial clone on the VPS.

### Clone the Repository
```bash
cd ~
git clone <your-repository-url> badeheyaat
cd badeheyaat
```

### Manual First Run (Optional but Recommended)
It's a good idea to run the containers manually once to ensure everything is working:
```bash
# Create the .env file manually for the first run
nano .env 
# Paste your environment variables

# Start the services
docker compose up -d --build
```

---

## 5. Automated Deployment

Once the initial setup is complete, any push to the `main` branch will trigger the CD pipeline defined in `.github/workflows/deploy.yml`.

The pipeline will:
1. SSH into your VPS.
2. Pull the latest code from the `main` branch.
3. Update the `.env` file with the content of the `ENV_FILE_CONTENT` secret.
4. Rebuild and restart the Docker containers.
