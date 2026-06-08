# ⬡ BugTracker

A developer-first bug ticketing and collaboration tool. Built with React, deployable anywhere via Docker — fully OpenShift-ready.

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
| Name         | Email              | Role         |
|--------------|--------------------|--------------|
| Alex Chen    | alex@dev.io        | Senior Dev   |
| Maya Patel   | maya@dev.io        | Backend Dev  |
| Jordan Kim   | jordan@dev.io      | Frontend Dev |
| Sam Torres   | sam@dev.io         | DevOps       |

---

## Docker

### Build & Run (Production)

```bash
# Build image
docker build -t bugtracker:latest .

# Run container (port 8080)
docker run -p 8080:8080 bugtracker:latest

# Visit http://localhost:8080
```

### Docker Compose

```bash
# Production (port 8080)
docker-compose up --build

# Development with hot reload (port 3000)
docker-compose --profile dev up bugtracker-dev
```

---

## OpenShift Deployment

### Option A — Deploy from Pre-built Image (Recommended)

**Step 1: Build and push image to a registry**
```bash
# Build
docker build -t bugtracker:latest .

# Tag for your registry (Quay, Docker Hub, etc.)
docker tag bugtracker:latest quay.io/YOUR_ORG/bugtracker:latest

# Push
docker push quay.io/YOUR_ORG/bugtracker:latest
```

**Step 2: Update the image reference**

Edit `openshift-deployment.yaml` and update the `image:` field:
```yaml
image: quay.io/YOUR_ORG/bugtracker:latest
```

**Step 3: Apply manifests**
```bash
# Login to OpenShift
oc login --token=<your-token> --server=https://your-cluster.example.com

# Create/select project
oc new-project bugtracker   # or: oc project your-existing-project

# Deploy
oc apply -f openshift-deployment.yaml

# Check status
oc get pods
oc get route bugtracker

# Get the public URL
oc get route bugtracker -o jsonpath='{.spec.host}'
```

---

### Option B — Build on OpenShift (BuildConfig / S2I)

Use this if you want OpenShift to build the image from your Git repo directly.

**Step 1: Update BuildConfig**

Edit `openshift-buildconfig.yaml`:
```yaml
git:
  uri: https://github.com/YOUR_ORG/bugtracker.git
```

**Step 2: Apply all resources**
```bash
oc apply -f openshift-buildconfig.yaml
oc apply -f openshift-deployment.yaml

# Trigger a build
oc start-build bugtracker --follow

# Watch deployment
oc rollout status deployment/bugtracker
```

---

### Option C — oc new-app (Quickest)

```bash
# From Git repo (OpenShift auto-detects Dockerfile)
oc new-app https://github.com/YOUR_ORG/bugtracker.git --name=bugtracker

# Expose route
oc expose svc/bugtracker --port=8080

# Get URL
oc get route bugtracker
```

---

## Project Structure

```
bugtracker/
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
- Runs **2 replicas** by default for HA

---

## Extending

This app uses in-memory state (React Context). To add persistence:

1. **Backend API** — Add an Express/FastAPI backend, swap `TicketContext.js` fetches
2. **Database** — PostgreSQL or MongoDB for ticket storage
3. **Auth** — Replace demo users with OAuth2 / LDAP / Keycloak
4. **Notifications** — Add WebSocket or email alerts for ticket updates
