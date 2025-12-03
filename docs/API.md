# API Documentation

Complete API documentation for the User Management Service.

## Base URL

```
Development: http://localhost:3001
Production: https://api.yourplatform.com
```

## Authentication

Most endpoints require authentication using JWT Bearer tokens.

Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Endpoints

### Authentication

#### Register User
- **POST** `/api/v1/auth/register`
- **Access**: Public
- **Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "Password123",
  "role": "student"
}
```
- **Response**: 201 Created
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "student",
      "fullName": "John Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
- **POST** `/api/v1/auth/login`
- **Access**: Public
- **Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "Password123"
}
```
- **Response**: 200 OK

#### Refresh Token
- **POST** `/api/v1/auth/refresh`
- **Access**: Public
- **Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Response**: 200 OK
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Profile
- **GET** `/api/v1/auth/profile`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`
- **Response**: 200 OK

#### Logout
- **POST** `/api/v1/auth/logout`
- **Access**: Private
- **Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Response**: 200 OK

### User Management

#### Get All Users
- **GET** `/api/v1/users?page=1&limit=10&role=student&search=john`
- **Access**: Admin only
- **Query Parameters**:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10)
  - `sortBy` (string): Sort field (default: createdAt)
  - `sortOrder` (string): asc or desc (default: desc)
  - `role` (string): Filter by role
  - `search` (string): Search in name and email
- **Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

#### Get User by ID
- **GET** `/api/v1/users/:id`
- **Access**: Private
- **Response**: 200 OK

#### Update User
- **PUT** `/api/v1/users/:id`
- **Access**: Private (Own profile or Admin)
- **Body**:
```json
{
  "firstName": "Jane",
  "bio": "Software developer",
  "skills": ["JavaScript", "Python"],
  "learningGoals": ["Master React", "Learn Docker"]
}
```
- **Response**: 200 OK

#### Change Password
- **PUT** `/api/v1/users/password/change`
- **Access**: Private
- **Body**:
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```
- **Response**: 200 OK

#### Update Preferences
- **PUT** `/api/v1/users/preferences`
- **Access**: Private
- **Body**:
```json
{
  "language": "en",
  "timezone": "America/New_York",
  "notifications": {
    "email": true,
    "push": false
  }
}
```
- **Response**: 200 OK

#### Deactivate User
- **DELETE** `/api/v1/users/:id/deactivate`
- **Access**: Private (Own account or Admin)
- **Response**: 200 OK

#### Delete User
- **DELETE** `/api/v1/users/:id`
- **Access**: Admin only
- **Response**: 200 OK

## Status Codes

- `200` OK - Request successful
- `201` Created - Resource created successfully
- `400` Bad Request - Invalid input
- `401` Unauthorized - Authentication required
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource not found
- `409` Conflict - Resource already exists
- `429` Too Many Requests - Rate limit exceeded
- `500` Internal Server Error - Server error

## Rate Limiting

- Window: 15 minutes
- Max Requests: 100 per window
- Applies to all `/api/*` endpoints

## Error Codes

Common error messages:

- `No token provided` - Missing authorization header
- `Invalid or expired token` - Token verification failed
- `You do not have permission to perform this action` - Insufficient role
- `User not found` - User doesn't exist
- `Invalid email or password` - Login credentials incorrect
- `User with this email already exists` - Duplicate registration
