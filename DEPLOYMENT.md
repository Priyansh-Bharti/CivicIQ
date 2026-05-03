# 🚀 Deployment Guide

CivicIQ is designed for zero-friction deployment. From a fresh clone to a live, scalable production instance on Google Cloud, the process takes less than 30 minutes.

---

## 💻 1. Local Development
1.  **Clone**: `git clone https://github.com/Priyansh-Bharti/CivicIQ.git`
2.  **Install**: `npm install`
3.  **Environment**: Create `.env` from `.env.example`.
4.  **Run**: `npm run dev`

---

## 📦 2. Containerization (Docker)
We use a multi-stage Docker build to ensure a minimal footprint and maximum security.

**Build Image**:
```bash
docker build -t civiciq .
```

**Run Locally**:
```bash
docker run -p 8080:8080 civiciq
```

---

## ☁️ 3. Google Cloud Run Deployment
Cloud Run provides the scalability and security needed for a national civic platform.

1.  **Enable APIs**:
    ```bash
    gcloud services enable run.googleapis.com cloudbuild.googleapis.com
    ```

2.  **Submit to Cloud Build**:
    ```bash
    gcloud builds submit --tag gcr.io/[PROJECT_ID]/civiciq
    ```

3.  **Deploy to Run**:
    ```bash
    gcloud run deploy civiciq \
      --image gcr.io/[PROJECT_ID]/civiciq \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated
    ```

---

## 🔐 4. Environment Variables
Ensure the following variables are configured in the Cloud Run service settings:
- `VITE_FIREBASE_API_KEY`: Your Firebase API Key.
- `VITE_GEMINI_API_KEY`: Your Google AI SDK Key.
- `VITE_FIREBASE_PROJECT_ID`: Your GCP Project ID.

---

## 🔄 5. CI/CD Pipeline Setup
Automate your deployments via **Cloud Build Triggers**:
1. Go to the Cloud Build console.
2. Create a new Trigger linked to your GitHub repository.
3. Select `cloudbuild.yaml` as the build configuration.
4. Now, every push to `main` will automatically trigger a test run, build, and deploy.

---

## 📊 6. Monitoring & Logs
View real-time performance metrics and system logs via the **Google Cloud Console**:
- **Logs Explorer**: Filter by `resource.type="cloud_run_revision"` to see request logs.
- **Monitoring Dashboard**: Track CPU usage, request latency, and billable instance counts.

---

**CivicIQ is designed for zero-friction deployment—from a fresh clone to a live Cloud Run instance in under 30 minutes.**
