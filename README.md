# Study Task Manager

A simple full-stack task management web application built with **Next.js**, **Prisma**, **TiDB Cloud**, **Docker**, and **Jenkins CI/CD**.

This project was created for **DIT205 Web Application Development** and extended for **DIT312 CI/CD with Jenkins + Docker**.

---

## 🚀 Features

- User Registration & Login (NextAuth)
- Protected routes (only logged-in users can access tasks)
- Create, Read, Update, Delete tasks
- Image upload support for tasks
- TiDB Cloud database with Prisma ORM
- Fully containerized using Docker & Docker Compose
- Automated CI/CD using Jenkins on a Ubuntu VM

---

## 📁 Project Structure
study-task-manager/
├── app/ # Frontend & API routes (Next.js App Router)
├── prisma/ # Prisma schema & migrations
├── Dockerfile # App container definition
├── docker-compose.yml # Deployment stack
├── Jenkinsfile # Jenkins CI/CD pipeline
└── README.md

---

## 🛠️ Run the App Locally

### 1. Install dependencies
npm install


### 2. Set environment variables  
Create a `.env` file:

DATABASE_URL="your_tidb_url"
AUTH_SECRET="your_auth_secret"
AUTH_TRUST_HOST=true


### 3. Start local dev server
npm run dev

Open browser:  
👉 http://localhost:3000

---

## 🐳 Run with Docker

docker compose up -d


App will run at:  
👉 http://localhost:3000

---

## 🔄 CI/CD with Jenkins

The Jenkins pipeline:

1. Checks out the GitHub repo  
2. Builds a production Docker image  
3. Injects secrets (AUTH_SECRET, DATABASE_URL)  
4. Deploys the updated container  
5. Runs a health check  

Every new commit to GitHub automatically triggers the pipeline.

---

## 📦 Tech Stack

- **Next.js 15**
- **Prisma ORM**
- **TiDB Cloud (MySQL-compatible)**
- **NextAuth Authentication**
- **Docker + Docker Compose**
- **Jenkins Pipeline**

---

## 🧑‍💻 Author

Lwin Min Thant  
DIT205 / DIT312 Final Project  
Rangsit University

---



