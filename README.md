# CSCC43 Investment App

Fall 2026 CSCC43 database project.

## Requirements

- Node.js 20+
- PostgreSQL 19
- PostgreSQL database/user with create/drop access

## Setup

```powershell
npm install
Copy-Item .env.example .env
```

Set `DATABASE_URL` in `.env`.

## Commands

```powershell
npm start
npm run check
npm run db:smoke
npm run db:init
npm run db:reset
npm run db:load-history -- C:\path\SP500History.csv
```

`db:reset` deletes project data and rebuilds the schema.
