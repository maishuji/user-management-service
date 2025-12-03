# User Management Service

A robust, scalable microservice for user management in a learning platform, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication with access and refresh tokens
  - Role-based access control (Student, Instructor, Admin)
  - Secure password hashing with bcrypt
  - Token refresh mechanism
  - Logout and logout from all devices

- **User Management**
  - User registration and profile management
  - Email verification support
  - Password change and reset
  - User preferences and settings
  - Account deactivation and deletion

- **Security**
  - Rate limiting to prevent abuse
  - Helmet for HTTP headers security
  - CORS configuration
  - Input validation and sanitization
  - SQL injection and XSS prevention

- **Scalability & Performance**
  - MongoDB with connection pooling
  - Redis support for caching and sessions
  - Compression middleware
  - Efficient database indexing
  - Horizontal scaling ready

- **Developer Experience**
  - Comprehensive error handling
  - Winston logging with file rotation
  - ESLint and Prettier for code quality
  - Docker and Docker Compose support
  - CI/CD with GitHub Actions
  - 70%+ test coverage with Jest

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 7.0
- Redis (optional, for caching)
- Docker & Docker Compose (optional)

## 🛠️ Installation

### Local Development

1. **Clone the repository**
   ```bash
   cd user-management-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration

4. **Start MongoDB locally** (if not using Docker)
   ```bash
   mongod --dbpath /path/to/data
   ```

5. **Run the service**
   ```bash
   # Development mode with hot reload
   npm run dev

   # Production mode
   npm start
   ```

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - User Management Service on port 3001
   - MongoDB on port 27017
   - Redis on port 6379

2. **View logs**
   ```bash
   docker-compose logs -f user-service
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

## 📁 Project Structure

```
user-management-service/
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # GitHub Actions CI/CD pipeline
├── src/
│   ├── config/
│   │   └── index.js               # Configuration management
│   ├── controllers/
│   │   ├── authController.js      # Authentication endpoints
│   │   └── userController.js      # User management endpoints
│   ├── database/
│   │   └── index.js               # Database connection
│   ├── middleware/
│   │   ├── authenticate.js        # JWT authentication middleware
│   │   ├── authorize.js           # Role-based authorization
│   │   ├── errorHandler.js        # Global error handler
│   │   ├── rateLimiter.js         # Rate limiting
│   │   └── validator.js           # Request validation
│   ├── models/
│   │   └── User.js                # User data model
│   ├── routes/
│   │   ├── authRoutes.js          # Auth routes
│   │   ├── userRoutes.js          # User routes
│   │   └── index.js               # Route aggregator
│   ├── services/
│   │   ├── authService.js         # Authentication business logic
│   │   └── userService.js         # User management business logic
│   ├── utils/
│   │   ├── appError.js            # Custom error class
│   │   ├── catchAsync.js          # Async error wrapper
│   │   └── logger.js              # Winston logger configuration
│   └── index.js                   # Application entry point
├── tests/
│   ├── integration/
│   │   └── auth.test.js           # Integration tests
│   ├── unit/
│   │   └── user.model.test.js     # Unit tests
│   └── setup.js                   # Test configuration
├── scripts/
│   └── init-mongo.js              # MongoDB initialization
├── docs/
│   └── API.md                     # API documentation
├── logs/                          # Log files (gitignored)
├── .env.example                   # Environment variables template
├── .eslintrc.json                 # ESLint configuration
├── .prettierrc                    # Prettier configuration
├── .gitignore
├── docker-compose.yml             # Docker Compose configuration
├── Dockerfile                     # Docker image definition
├── jest.config.js                 # Jest testing configuration
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/register` | Register new user | Public |
| POST | `/api/v1/auth/login` | Login user | Public |
| POST | `/api/v1/auth/refresh` | Refresh access token | Public |
| POST | `/api/v1/auth/logout` | Logout user | Private |
| POST | `/api/v1/auth/logout-all` | Logout from all devices | Private |
| GET | `/api/v1/auth/profile` | Get current user profile | Private |

### User Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/users` | Get all users (paginated) | Admin |
| GET | `/api/v1/users/:id` | Get user by ID | Private |
| PUT | `/api/v1/users/:id` | Update user profile | Private |
| PUT | `/api/v1/users/password/change` | Change password | Private |
| PUT | `/api/v1/users/preferences` | Update preferences | Private |
| DELETE | `/api/v1/users/:id/deactivate` | Deactivate account | Private |
| DELETE | `/api/v1/users/:id` | Delete user permanently | Admin |

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/health` | Service health check | Public |
| GET | `/api/v1/health` | API health check | Public |

## 📝 API Examples

### Register User

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "Password123",
    "role": "student"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "Password123"
  }'
```

### Get Profile (Authenticated)

```bash
curl -X GET http://localhost:3001/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update User

```bash
curl -X PUT http://localhost:3001/api/v1/users/USER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "bio": "Learning enthusiast",
    "skills": ["JavaScript", "Python"]
  }'
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run integration tests only
npm run test:integration

# Generate coverage report
npm test -- --coverage
```

## 🔍 Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## 📊 Monitoring & Logging

Logs are stored in the `logs/` directory:
- `app.log` - All application logs
- `error.log` - Error logs only

Log levels: error, warn, info, http, verbose, debug, silly

Configure log level in `.env`:
```env
LOG_LEVEL=info
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secrets**: Use strong, random secrets (min 32 characters)
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Configured to prevent abuse
5. **Password Policy**: Minimum 8 characters, mixed case, numbers
6. **Token Expiration**: Short-lived access tokens (15 minutes)
7. **Refresh Tokens**: Limited to 5 active sessions per user

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets
- [ ] Configure MongoDB with authentication
- [ ] Set up SSL/TLS certificates
- [ ] Enable HTTPS
- [ ] Configure CORS for specific origins
- [ ] Set up monitoring and alerting
- [ ] Configure log aggregation
- [ ] Set up automated backups
- [ ] Review and adjust rate limits
- [ ] Enable Redis for session management

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://username:password@host:27017/dbname?authSource=admin
JWT_SECRET=your-256-bit-production-secret
JWT_REFRESH_SECRET=your-256-bit-refresh-secret
CORS_ORIGIN=https://yourdomain.com
REDIS_HOST=redis.yourdomain.com
REDIS_PASSWORD=your-redis-password
```

## 🤝 Integration with Other Services

This service can communicate with other microservices:

```javascript
// Example: Notify user registration
const axios = require('axios');

await axios.post(`${config.services.notificationService}/api/v1/notifications`, {
  userId: user._id,
  type: 'welcome_email',
  data: { email: user.email, name: user.fullName }
});
```

## 📈 Performance Optimization

- **Database Indexing**: Email and role fields are indexed
- **Connection Pooling**: MongoDB connection pool (min: 2, max: 10)
- **Compression**: Gzip compression for responses
- **Caching**: Redis support for frequently accessed data
- **Pagination**: All list endpoints support pagination

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# View MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Docker Issues
```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild containers
docker-compose up --build
```

## 📚 Additional Documentation

- [API Documentation](./docs/API.md) - Complete API reference
- For architecture decisions and contributing guidelines, see the docs folder

## 🛣️ Roadmap

- [ ] Email verification implementation
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, GitHub)
- [ ] Password reset via email
- [ ] User activity audit logs
- [ ] GraphQL API support
- [ ] WebSocket for real-time updates
- [ ] Advanced analytics dashboard

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ for the Learning Platform**