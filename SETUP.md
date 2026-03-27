# Full-Stack Docker Project

A complete Docker setup with React (Vite) frontend, Express backend, and MongoDB database.

## Setup & Installation

### Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for local development)

### Local Development (Without Docker)

1. **Install server dependencies:**

   ```bash
   cd server
   npm install
   ```

2. **Install client dependencies:**

   ```bash
   cd client
   npm install
   ```

3. **Start MongoDB locally** (or update `.env` with your MongoDB URL)

4. **Run development servers:**

   ```bash
   # Terminal 1 - Server
   cd server
   npm run dev

   # Terminal 2 - Client
   cd client
   npm run dev
   ```

### Docker Compose Setup

1. **Build and start all services:**

   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Client: http://localhost:5173
   - Server API: http://localhost:5000
   - MongoDB: localhost:27017

3. **Stop services:**
   ```bash
   docker-compose down
   ```

## Project Structure

```
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── api.js      # API communication service
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env            # Client environment variables
│   └── Dockerfile
│
├── server/             # Express + Mongoose backend
│   ├── index.js        # Main server file
│   ├── .env            # Server environment variables
│   └── Dockerfile
│
└── docker-compose.yml  # Docker orchestration
```

## Key Features Added

✅ **CORS middleware** - Enables client-server communication
✅ **Body parser** - Handles JSON requests
✅ **Environment variables** - Configurable setup (.env files)
✅ **API service layer** - Client-side API communication helper
✅ **Nodemon** - Auto-restart server on changes
✅ **Volume mounts** - Real-time code updates in Docker
✅ **Proper networking** - Services communicate via Docker network

## Environment Variables

### Server (.env)

```
MONGO_URL=mongodb://mongo:27017/docker
PORT=5000
NODE_ENV=development
```

### Client (.env)

```
VITE_API_URL=http://localhost:5000
```

## Usage Example

**Server:**

- GET `/` - Returns "Backend running 🚀"

**Client:**
Use the API service to make requests:

```javascript
import { fetchFromAPI } from "./api";

fetchFromAPI("/your-endpoint")
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

## Troubleshooting

**CORS Error?** - Ensure cors middleware is loaded ✓ (already added)

**Can't connect to DB?** - Check MongoDB is running and MONGO_URL is correct

**Port already in use?** - Update ports in docker-compose.yml or .env

**Hot reload not working?** - Ensure volume mounts are correct in docker-compose.yml
