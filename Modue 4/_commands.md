# Prisma

### Step 1: Install Prisma and Prisma Client

`npm install prisma @prisma/client`

### Step 2: Initialize Prisma (Creates the prisma/ directory and schema.prisma)

`npx prisma init`

### Step 4: Generate Prisma Migrations

`npx prisma migrate dev --name init`

### Step 5: Apply Prisma Migrations (to update your database)

`npx prisma migrate deploy`

### Step 6: Generate Prisma Client

`npx prisma generate`

### Step 7: Start Prisma Studio (optional, for inspecting your data)

`npx prisma studio`

# Docker

## Start Docker Containers

`docker compose up --build -d`

### Log into the Express API container:

`docker exec -it express_api /bin/sh`

# Postgres

### Log into the Postgres container:

`docker exec -it postgres_db /bin/bash`

### Inspect Tables in the Database

`\dt`

### Describe a Specific Table

`\d category`

### Dump Tables SQL with Data

pg_dump -h localhost -p 5432 -U myuser -d mydatabase -F p > backup.sql

### Dump Tables SQL without Data

pg_dump -h localhost -p 5432 -U myuser -d mydatabase --schema-only > schema_backup.sql
