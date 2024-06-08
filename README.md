# z-backend

## Demo link:

Coming soon

## Documentation

Coming soon

## Table of Content:

- About The App
- Technologies
- Setup
- Environment Variables
- To-Do
- Documentation
- Status

## About The App

z-backend is an application similar to Twitter, aiming to implement a tree-like structure for message replies.

## Technologies

This project uses:

- **Node.js**
- **NestJS**
- **TypeScript**
- **TypeORM**
- **PostgreSQL**
- **JWT** for authentication (access and refresh tokens)
- **Multer** for file handling
- **Jest** for testing

## Setup

```bash
git clone https://github.com/bi472/z-backend.git
cd z-backend

# Install dependencies
npm install

# Create .env file based on .env-example
cp .env-example .env
nano .env

# Start the application
npm run start
```

Done!

## Environment Variables

```plaintext
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=yourusername
DB_PASSWORD=yourpassword
DB_DATABASE=yourdbname

JWT_SECRET=yourjwtsecret
JWT_EXPIRATION_TIME=3600
REFRESH_SESSIONS_MAX_COUNT=5

MULTER_DEST=./uploads
MULTER_LIMIT_SIZE=5MB

FRONTEND_URL=http://localhost:3000
```

## To-Do

- Add transform interceptors to all routes.
- Complete Swagger documentation.
- Write tests for services.

## Status

z-backend works stably. Main features are implemented.

z-backend works stably.

## About

No description, website, or topics provided. 
