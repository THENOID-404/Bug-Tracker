# ⬡ Bug-Tracker-App

A developer-first bug ticketing and collaboration tool. Deployable anywhere via Docker — fully OpenShift-ready.

---

## Features

- **Ticket management** — Create, edit, delete tickets with status, priority, type
- **Collaboration** — Comments with code snippet support per ticket
- **Filtering & Search** — Filter by status, priority, type, assignee; full-text search
- **Stats bar** — Live overview of open / in-progress / resolved counts
- **Code snippets** — Attach code blocks directly to tickets and comments
- **Label system** — Tag tickets for easy filtering
- **Dark terminal UI** — Built for developer eyes

---

## Screenshots

<img width="1582" height="882" alt="Openshift Project" src="https://github.com/user-attachments/assets/efadf40b-98ed-4b2b-a4ff-dbc5aaf2c8c6" />
<img width="1600" height="411" alt="Project Pods" src="https://github.com/user-attachments/assets/8850c529-bd62-4483-a165-2c5ddde070ca" />
<img width="1918" height="964" alt="APP" src="https://github.com/user-attachments/assets/200a9005-711c-4d03-b4fc-ed2a7328297b" />

---

## Architecture

<img width="1024" height="1536" alt="ChatGPT Image Jun 9, 2026, 07_32_21 PM" src="https://github.com/user-attachments/assets/15f9ed2d-9e58-4847-992e-3ba76d60c656" />





## Quick Start (Local Dev)

### Prerequisites
- Node.js 18+
- npm 9+

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Start dev server (http://localhost:3000)
npm start
```

**Demo users** (no password required — just click to log in):
| Name          | Email             | Role           |
|---------------|-------------------|----------------|
| Ravi More     | ravi@dev.io       | Senior Dev     |
| Radha Thakrey | radha@dev.io      | Backend Dev    |
| Mahesh Gauda  | mahesh@dev.io     | Frontend Dev   |
| Sam Patric    | sam@dev.io        | DevOps Engin   |

---

## Docker

### Build & Run (Production)

```bash
# Build image
docker build -t bug-tracker-app:latest .

# Run container (port 8080)
docker run -p 8080:8080 bug-tracker-app:latest

# Visit http://localhost:8080
```

### Docker Compose

```bash
# Production (port 8080)
docker-compose up --build

# Development with hot reload (port 3000)
docker-compose --profile dev up bug-tracker-app-dev
```

---

## OpenShift Deployment

### Option A — Build on OpenShift from GitHub (Recommended)

This is the approach used for the live deployment of this project.

**Step 1: Update BuildConfig**

Edit `openshift-buildconfig.yaml`:
```yaml
git:
  uri: https://github.com/THENOID-404/Bug-Tracker-App.git
```

Also update the image reference in `openshift-deployment.yaml`:
```yaml
image: image-registry.openshift-image-registry.svc:5000/YOUR-PROJECT-NAME/bug-tracker-app:latest
```

**Step 2: Login to OpenShift**
```bash
oc login --token=<your-token> --server=https://your-cluster.example.com
```

**Step 3: Apply all resources**
```bash
oc apply -f openshift-buildconfig.yaml
oc apply -f openshift-deployment.yaml
```

**Step 4: Trigger a build**
```bash
oc start-build bug-tracker-app --follow
```

**Step 5: Restart deployment & verify**
```bash
oc rollout restart deployment/bug-tracker-app
oc get pods
oc get route
```

---

### Option B — Deploy from Pre-built Image

**Step 1: Build and push image to a registry**
```bash
# Build
docker build -t bug-tracker-app:latest .

# Tag for your registry (Quay, Docker Hub, etc.)
docker tag bug-tracker-app:latest quay.io/YOUR_ORG/bug-tracker-app:latest

# Push
docker push quay.io/YOUR_ORG/bug-tracker-app:latest
```

**Step 2: Update the image reference**

Edit `openshift-deployment.yaml`:
```yaml
image: quay.io/YOUR_ORG/bug-tracker-app:latest
```

**Step 3: Apply manifests**
```bash
oc login --token=<your-token> --server=https://your-cluster.example.com
oc project your-existing-project
oc apply -f openshift-deployment.yaml
oc get pods
oc get route
```

---

### Option C — oc new-app (Quickest)

```bash
# From Git repo (OpenShift auto-detects Dockerfile)
oc new-app https://github.com/THENOID-404/Bug-Tracker-App.git --name=bug-tracker-app

# Expose route
oc expose svc/bug-tracker-app --port=8080

# Get URL
oc get route bug-tracker-app
```

---

## Common Operations

### Scale pods up or down
```bash
oc scale deployment bug-tracker-app --replicas=2
```

### Check pod health
```bash
oc get pods
oc logs -f <pod-name>
oc describe pod <pod-name>
```

### View crash logs
```bash
oc logs <pod-name> --previous
```

### Delete failed build pods
```bash
oc delete pods --field-selector=status.phase=Failed
```

---

## Project Structure

```
Bug-Tracker-App/
├── public/
│   └── index.html                 # HTML entry point
├── src/
│   ├── context/
│   │   ├── AuthContext.js         # User auth state
│   │   └── TicketContext.js       # Ticket CRUD state
│   ├── components/
│   │   ├── Navbar.js / .css       # Top navigation
│   │   ├── StatsBar.js / .css     # Stats overview bar
│   │   └── TicketCard.js / .css   # Ticket list item
│   ├── pages/
│   │   ├── Login.js / .css        # Login screen
│   │   ├── Dashboard.js / .css    # Ticket list + filters
│   │   ├── TicketDetail.js / .css # Ticket view/edit + comments
│   │   └── NewTicket.js / .css    # Create ticket form
│   ├── App.js                     # Root + routing
│   ├── App.css                    # Global styles + design tokens
│   └── index.js                   # React entry point
├── Dockerfile                     # Multi-stage Docker build
├── docker-compose.yml             # Local dev + prod compose
├── nginx.conf                     # Nginx config (SPA + port 8080)
├── openshift-deployment.yaml      # Deployment + Service + Route
├── openshift-buildconfig.yaml     # BuildConfig + ImageStream
├── .dockerignore
├── .gitignore
└── package.json
```

---

## OpenShift Notes

- Container runs on **port 8080** (required — OpenShift blocks port 80)
- Nginx is configured as a **non-root** user (OpenShift security policy)
- The Route is configured with **TLS edge termination** (HTTPS)
- Resources: requests 50m CPU / 64Mi RAM, limits 200m CPU / 256Mi RAM
- Runs **2 replicas** by default for high availability

---

## Extending

This app uses in-memory state (React Context). To add persistence:

1. **Backend API** — Add an Express/FastAPI backend, swap `TicketContext.js` fetches
2. **Database** — PostgreSQL or MongoDB for ticket storage
3. **Auth** — Replace demo users with OAuth2 / LDAP / Keycloak
4. **Notifications** — Add WebSocket or email alerts for ticket updates
