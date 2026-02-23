# **بديهيات | Badeheyaat (Axioms)**

Badeheyaat is an open-source web platform hosting shareable, educational content designed to efficiently shut down bad-faith internet arguments with visually distinct, factual rebuttals.

> **بديهيات:** منصة إلكترونية لاستضافة محتوى تعليمي قابل للمشاركة، مصمم للرد على الجدالات الرقمية المضللة بحقائق مفصلة وتصاميم بصرية مميزة.

---

## **🚀 Overview**

The project automate the creation of social media assets (OG Images, Square Posts, and Stories) whenever a new "Axiom" (a toxic argument vs. factual rebuttal) is added to the system. This allows users to quickly download and copy-paste authoritative rebuttals in online discussions.

### **Core Workflow**
1. **Content Management**: Admin enters a "Bad Argument" and a list of "Rebuttal Facts" into Strapi 5.
2. **Background Generation**: A Strapi lifecycle hook triggers the **Image Microservice** in the background, ensuring zero database deadlocks.
3. **Arabic-First Synthesis**: The microservice uses **Satori** + **Arabic-Reshaper** + **Bidi** to generate 3 high-fidelity PNG images (OG, Square, Story) with perfect character joining and RTL reordering.
4. **Distribution**: Images are stored in a shared volume and made available on the **Next.js Frontend** for rich SEO previews and user downloads.

---

## **✨ Key Features**

- **🎨 Dynamic Theming**: The entire website UI (Hero, Marquee, Cards) dynamically adapts its color palette based on the selected Category's theme.
- **🎓 School of Logic**: A dedicated education section (`/logic`) teaching basic reasoning and how to spot common logical fallacies like "Straw Man" and "Ad Hominem".
- **📬 Integrated Contact**: A custom-built contact form that submits user reports directly to Strapi for admin review.
- **📱 Social Ready**: Every Axiom is optimized for sharing with dedicated Story and Post formats, including a custom header and integrated QR codes.
- **🔍 SEO & Open Graph**: Full SSR (Server-Side Rendering) with dynamic metadata ensures that sharing a link on social media displays a beautiful, content-aware preview.

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
3. **Permissions**: Go to **Settings > Roles > Public** and enable `find` and `findOne` for Axioms/Categories, and `create` for Messages.
4. **Category Theme**: Create a Category and assign branding colors. The frontend and images will automatically adapt.

---

## **🖥️ VPS Requirements**

To run the full stack comfortably, we recommend the following:

- **Minimum**: 2 GB RAM (with 2GB Swap), 1 vCPU, 20 GB SSD.
- **Recommended**: 4 GB RAM, 2 vCPUs, 40 GB SSD.
- **OS**: Ubuntu 22.04+ or any Docker-compatible Linux distribution.

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
