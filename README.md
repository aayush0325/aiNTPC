for local setup

npm i

bash setup_local_db.sh

add .env

npx prisma generate - generate prisma client

npx prisma migrate dev - generate migrations

npx prisma migrate reset - clear db

npx prisma db push - push model to db straight away (dev)

npx prisma studio - open a GUI to see db rows and tables
