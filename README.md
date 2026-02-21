# **بديهيات | Badeheyaat (Axioms)**

Badeheyaat is an open-source web platform hosting shareable, educational content designed to efficiently shut down bad-faith internet arguments with visually distinct, factual rebuttals.

> **بديهيات:** منصة إلكترونية لاستضافة محتوى تعليمي قابل للمشاركة، مصمم للرد على الجدالات الرقمية المضللة بحقائق مفصلة وتصاميم بصرية مميزة.

---

## **🚀 Overview**

The project automate the creation of social media assets (OG Images, Square Posts, and Stories) whenever a new "Axiom" (a toxic argument vs. factual rebuttal) is added to the system. This allows users to quickly download and copy-paste authoritative rebuttals in online discussions.

### **Core Workflow**
1. **Content Management**: Admin enters a "Bad Argument" and a list of "Rebuttal Facts" into Strapi.
2. **Event-Driven Generation**: A Strapi webhook triggers the **Image Microservice**.
3. **Image Synthesis**: The microservice uses **Satori** to generate 3 static PNG images (OG, Square, Story) with full **RTL Arabic** support.
4. **Distribution**: Images are stored in a shared volume and made available on the **Next.js Frontend** for SEO and user download.

---

## **🏗️ Project Architecture**

This is a **Monorepo** orchestrated by Docker Compose:

| Service | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js (App Router) | Public UI, SEO, ISR, Image Serving |
| **Backend** | Strapi 5 (Headless CMS) | Admin Panel, API, Content Lifecycle |
| **Microservice** | Node.js (Satori/Resvg) | Dynamic PNG Generation from HTML/CSS |
| **Database** | PostgreSQL 16 | Persistent Data Storage |
| **Volume** | Docker Shared Volume | Shared Media Assets between containers |

---

## **🛠️ Tech Stack**

- **Frameworks**: [Next.js](https://nextjs.org/), [Strapi](https://strapi.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Image Gen**: [Satori](https://github.com/vercel/satori), [Resvg](https://github.com/yisibl/resvg-js)
- **Typography**: IBM Plex Sans Arabic (RTL Optimized)
- **Infrastructure**: [Docker](https://www.docker.com/), [GitHub Actions](https://github.com/features/actions)

---

## **🚦 Getting Started**

### **1. Prerequisites**
- Docker & Docker Compose
- GitHub Account (for CI/CD)

### **2. Installation**
```bash
git clone <your-repo-url>
cd v2
cp .env.example .env
```

### **3. Start the Stack**
```bash
docker-compose up -d --build
```

---

## **⚙️ Initial Configuration**

1. **Admin Setup**: Create your admin user at `http://localhost:1337/admin`.
2. **API Security**: Follow the [API Token Setup Guide](./docs/API_TOKEN_SETUP.md) to link the Microservice to Strapi.
3. **Webhook Setup**:
   - URL: `http://microservice:4000/generate`
   - Events: `entry.create`, `entry.update`
4. **Category Theme**: Create a Category and assign a `themeKey` (e.g., `theme-purple`).

---

## **🚀 CI/CD & Deployment**

This project includes a production-ready pipeline:
- **CI**: Path-filtered checks for each service.
- **CD**: Automated SSH deployment to a single VPS.

Refer to the [**Deployment Guide**](./docs/DEPLOYMENT_GUIDE.md) for full instructions on setting up GitHub Secrets and your VPS environment.

---

## **📄 License**

Distributed under the GNU General Public License v3.0 (GPLv3). See `LICENSE` for more information.

---

## **🤝 Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
