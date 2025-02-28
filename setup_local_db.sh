# Pull the latest PostgreSQL image
docker pull postgres

# Run the PostgreSQL container
docker run -d \
  --name postgres_aiNTPC \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v postgres_aiNTPC:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres

# Check if DATABASE_URL is already in .env, if not, append it
if ! grep -q "DATABASE_URL" .env; then
  echo 'DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres"' >> .env
fi

# Generate Prisma client
npx prisma generate

# Run Prisma migrations
npx prisma migrate dev
