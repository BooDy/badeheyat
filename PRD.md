# **Product Requirements Document (PRD): Project بديهيات (Axioms)**

## **1\. Project Overview**

**Name:** بديهيات (Badeheyaat / Axioms)

**Purpose:** A web platform hosting shareable, educational content designed to efficiently shut down bad-faith internet arguments with visually distinct, factual rebuttals.

**Target Audience:** Internet users looking for quick, authoritative rebuttals to copy-paste in online discussions, bypassing the need to type out repetitive arguments.

**Core Workflow:**

1. Admin logs into Strapi (secured with 2FA) and inputs a toxic argument and a list of factual rebuttals.  
2. Upon saving, a Strapi webhook triggers an isolated Node.js microservice.  
3. The microservice uses Satori to generate 3 static PNG images (OG, Square, Story) applying a category-specific visual theme.  
4. The images are saved to a shared volume, and their URLs are written back to the Strapi record.  
5. The Next.js frontend statically generates the page with the proper Open Graph tags and user download buttons.

## **2\. Technical Stack & Architecture**

* **Backend CMS / Admin:** Strapi (Node.js).  
* **Database:** PostgreSQL.  
* **Image Microservice:** Node.js, Express, Satori (HTML to SVG), @resvg/resvg-js (SVG to PNG).  
* **Frontend:** Next.js (App Router, static site generation or ISR).  
* **Styling:** Tailwind CSS (for both Next.js UI and Satori templates).  
* **Infrastructure:** Docker Compose (coordinating Strapi, Postgres, Next.js, the Microservice, and a shared media volume).

## **3\. Data Models (Strapi Content Types)**

### **Collection: Category**

* name: String (e.g., "Feminism", "Politics", "General").  
* slug: UID (based on name).  
* themeKey: String (e.g., "theme-purple", "theme-red"). Defines the color palette used by the image microservice.

### **Collection: Axiom**

* slug: UID.  
* badArgument: Text (The toxic quote/talking point).  
* rebuttalFacts: JSON/Array of Strings (Multiple short, punchy facts/bullet points).  
* detailedBody: Rich Text (Optional deeper explanation for the web page).  
* category: Relation (Many-to-One with Category).  
* imageOg: Media/String (Auto-populated by microservice \- 1200x630).  
* imageSquare: Media/String (Auto-populated by microservice \- 1080x1080).  
* imageStory: Media/String (Auto-populated by microservice \- 1080x1920).

## **4\. Core Features & Requirements**

### **Feature 1: Admin Panel & Security (Strapi)**

* **2FA / TOTP:** The Strapi admin interface must be secured using a Two-Factor Authentication plugin (TOTP via Google Authenticator/Authy). Admin accounts must not rely solely on passwords.  
* **Webhooks:** Strapi must be configured to fire a webhook to the Image Microservice on entry.create and entry.update for the Axiom collection.

### **Feature 2: Event-Driven Image Generation (Microservice)**

* **Endpoint:** Expose a POST /generate endpoint to receive Strapi webhooks.  
* **Theme Dictionary:** Implement a theme.config.ts mapping themeKeys to specific hex codes (background, primary text, accent colors).  
* **Satori Template:** \* Must strictly enforce RTL (Right-to-Left) direction.  
  * Must load a custom Arabic font buffer (e.g., Cairo, IBM Plex Sans Arabic).  
  * Design: Split layout. Top shows badArgument in muted colors. Bottom iterates over the rebuttalFacts array, rendering each as a bulleted list item using the theme's accent color for the bullet/checkmark.  
* **Multi-Format Output:** Render and convert SVGs to PNGs using @resvg/resvg-js in three sizes:  
  1. \[slug\]-og.png (1200x630)  
  2. \[slug\]-square.png (1080x1080)  
  3. \[slug\]-story.png (1080x1920)  
* **Storage & Callback:** Save PNGs to a shared Docker volume (/shared-media), then authenticate via Strapi REST API to PUT the file paths back into the Axiom record.

### **Feature 3: The Public Interface (Next.js)**

* **Index Page (/):** A grid of recent Axioms displaying the Square images or stylized text cards. Filterable by Category.  
* **Detail Page (/a/\[slug\]):** \* Displays the badArgument as a quoted/incorrect premise.  
  * Renders the rebuttalFacts list.  
  * Renders detailedBody if it exists.  
  * **SEO Critical:** Injects the imageOg URL into \<meta property="og:image"\> and \<meta name="twitter:image"\>.  
  * **Sharing:** Provides explicit buttons to "Download for Instagram Post" (imageSquare) and "Download for Story" (imageStory).

## **5\. Implementation Phases for AI Agents**

* **Phase 1: Infrastructure & DB**  
  * Generate the docker-compose.yml defining Strapi, Postgres, Next.js, and the Express Microservice, including a shared volume for /media.  
* **Phase 2: Backend (Strapi)**  
  * Initialize Strapi.  
  * Define the Axiom and Category schemas.  
  * Document instructions for installing/configuring a Strapi 2FA plugin.  
* **Phase 3: Image Microservice**  
  * Initialize the Node/Express app.  
  * Implement the Theme Dictionary.  
  * Implement Satori HTML-to-SVG and Resvg SVG-to-PNG logic with RTL Arabic font support.  
  * Implement the Strapi Webhook listener and the callback API logic to update records.  
* **Phase 4: Frontend (Next.js)**  
  * Initialize Next.js App Router.  
  * Build the Strapi fetch utilities.  
  * Build the Index and Detail routes, strictly adhering to Open Graph metadata requirements.