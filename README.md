# Rinjani — Swara Rinjani Media Platform

A community radio and video streaming platform (Arise Media). Admins upload content via the CMS; visitors stream audio and video.

## Folder Structure

```
rinjani/
├── apps/
│   ├── web/          → Next.js frontend (what visitors & admins see)
│   └── api/          → NestJS backend (auth, database, upload logic)
├── design/
│   └── figma-export-original/  → Raw Figma Make export archive, DO NOT edit, reference only
├── packages/
│   └── shared-types/  → (optional) TS types shared between web & api
├── docker-compose.yml → Runs web + api + postgres together
└── .env.example
```

