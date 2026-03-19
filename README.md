# DevLink Chat Platform

A real-time chat platform built with a microservices architecture using Node.js, Express, MongoDB, and WebSockets.

## Features

- **Authentication Service**: Secure user authentication with JWT and refresh tokens
- **Chat Service**: Real-time messaging via WebSocket connections
- **Microservices Architecture**: Separated concerns for scalability
- **Docker Ready**: Containerization support for easy deployment
- **TypeScript**: End-to-end type safety

## Architecture

```
DevLink Chat Platform
├── apps/
│   ├── auth-service/     # Authentication microservice
│   └── chat-service/     # Real-time chat microservice
└── packages/
    ├── shared-types/     # Shared TypeScript interfaces
    ├── shared-utils/     # Shared utility functions
    ├── config/           # Shared configuration
    └── event-bus/        # Event handling system
```

## Services

### Auth Service
Handles user authentication, registration, and token management.
- Endpoints: `/api/auth` (registration, login)
- Token refresh: `/api/refresh`
- Uses MongoDB for persistent storage
- Implements JWT-based authentication with refresh tokens

### Chat Service
Provides real-time messaging capabilities.
- WebSocket connections for live chat
- JWT authentication for secure connections
- Message broadcasting to connected clients
- REST endpoint for health checks: `/test`

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance
- Docker (optional, for containerization)

### Environment Variables

Create `.env` files in each service directory:

**auth-service/.env**
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/devlink-auth
JWT_ACCESS_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

**chat-service/.env**
```
PORT=5000
JWT_ACCESS_SECRET=your-access-token-secret
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/devlink-chat-platform.git
cd devlink-chat-platform

# Install dependencies
npm install

# Build all packages
npm run build

# Start development mode
npm run dev
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build individual images
docker build -t auth-service ./apps/auth-service
docker build -t chat-service ./apps/chat-service
```

## API Endpoints

### Auth Service
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/refresh` - Refresh access token

### Chat Service
- `GET /test` - Health check endpoint
- WebSocket Connection: `ws://localhost:5000/?token=<jwt>`

## Development

### Available Scripts

In the root directory:
- `npm run dev` - Start all services in development mode
- `npm run build` - Build all TypeScript packages
- `npm run lint` - Run ESLint on all packages

In individual service directories:
- `npm run dev` - Start service in development mode
- `npm run build` - Build service TypeScript code

## Project Structure

```
devlink-chat-platform/
├── apps/
│   ├── auth-service/
│   │   ├── src/
│   │   │   ├── controllers/   # Request handlers
│   │   │   ├── middleware/    # Custom middleware
│   │   │   ├── models/        # Database models
│   │   │   ├── routes/        # API route definitions
│   │   │   ├── services/      # Business logic
│   │   │   ├── utils/         # Service-specific utilities
│   │   │   └── server.ts      # Entry point
│   │   ├── Dockerfile
│   │   └── package.json
│   └── chat-service/
│       ├── src/
│       │   ├── middleware/    # WebSocket middleware
│       │   └── server.ts      # Entry point with WebSocket server
│       ├── Dockerfile
│       └── package.json
├── packages/
│   ├── shared-types/          # Shared TypeScript interfaces
│   ├── shared-utils/          # Shared utility functions
│   ├── config/                # Shared configuration
│   └── event-bus/             # Event handling system
├── docker-compose.yml         # Docker Compose configuration
├── package.json               # Root package with workspaces
└── tsconfig.base.json         # Base TypeScript configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Node.js, Express, MongoDB, and WebSockets
- Inspired by modern microservices architectures

Project by Carl Baptiste