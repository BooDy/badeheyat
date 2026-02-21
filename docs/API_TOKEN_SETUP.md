# Strapi API Token Setup Guide

This guide explains how to generate a Strapi API token and configure it for the Image Microservice.

## Why is this needed?

The **Image Microservice** needs to update the `Axiom` records in Strapi with the URLs of the generated images (OG, Square, Story). To do this securely, it requires an API token with appropriate permissions.

## Step-by-Step Instructions

### 1. Log in to Strapi Admin
Access the Strapi admin panel at [http://localhost:1337/admin](http://localhost:1337/admin).

### 2. Navigate to API Tokens
In the left sidebar, go to **Settings** -> **Global Settings** -> **API Tokens**.

### 3. Create a New Token
Click the **+ Create new API Token** button in the top right corner.

### 4. Configure the Token
Fill in the following details:
- **Name**: `Microservice` (or any descriptive name)
- **Description**: `Token for the Image Microservice to update Axiom records.`
- **Token type**: `Full Access` (Recommended for simplicity) or `Custom`.
  - *If choosing Custom*, ensure it has `update` permissions for the `Axiom` content type.
- **Token duration**: `Unlimited` (Recommended for development).

### 5. Save and Copy the Token
Click **Save**. A banner will appear at the top of the page with your new token.
**IMPORTANT**: Copy this token immediately. You will not be able to see it again once you leave this page.

### 6. Update your `.env` file
Open the `.env` file in the root of your project and find the `STRAPI_API_TOKEN` variable. Replace the placeholder value with the token you just copied:

```env
STRAPI_API_TOKEN=your_copied_token_here
```

### 7. Restart the Microservice
For the changes to take effect, restart your Docker containers:

```bash
docker-compose up -d microservice
```

## Troubleshooting

- **401 Unauthorized**: Ensure the token in your `.env` file matches exactly what was generated in Strapi.
- **403 Forbidden**: If using a `Custom` token type, double-check that it has the `update` permission for the `Axiom` content type.
