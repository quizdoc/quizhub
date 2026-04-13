# QuizHub API Documentation

## Base URL

```
http://localhost:3001/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe"
}

Response: 201
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response: 200
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Demo Login
```
POST /auth/demo-login
Content-Type: application/json

{
  "role": "user" | "admin"
}

Response: 200
{
  "message": "Demo login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "demo-user-001",
    "email": "user@quizhub.com",
    "name": "Demo User",
    "role": "user"
  }
}
```

### Quizzes

#### Get All Quizzes
```
GET /quizzes

Response: 200
[
  {
    "id": "uuid",
    "title": "General Knowledge",
    "description": "Test your general knowledge",
    "time_limit": 600,
    "creator_name": "Admin",
    "total_attempts": 42,
    "avg_score": 75.5,
    "is_published": true,
    "created_at": "2026-04-10T10:00:00Z"
  }
]
```

#### Get Quiz by ID
```
GET /quizzes/:id
Authorization: Bearer <token>

Response: 200
{
  "id": "uuid",
  "title": "General Knowledge",
  "description": "Test your general knowledge",
  "time_limit": 600,
  "questions": [
    {
      "id": "uuid",
      "question_text": "What is the capital of France?",
      "options": ["Paris", "London", "Berlin", "Madrid"],
      "correct_answer": 0,
      "explanation": "Paris is the capital of France"
    }
  ]
}
```

#### Create Quiz (Admin Only)
```
POST /quizzes
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "General Knowledge",
  "description": "Test your general knowledge",
  "time_limit": 600,
  "questions": [
    {
      "question_text": "What is the capital of France?",
      "options": ["Paris", "London", "Berlin", "Madrid"],
      "correct_answer": 0,
      "explanation": "Paris is the capital of France"
    }
  ]
}

Response: 201
{
  "message": "Quiz created successfully",
  "quiz_id": "uuid"
}
```

#### Update Quiz (Admin Only)
```
PUT /quizzes/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "time_limit": 900,
  "questions": [...]
}

Response: 200
{
  "message": "Quiz updated successfully"
}
```

#### Delete Quiz (Admin Only)
```
DELETE /quizzes/:id
Authorization: Bearer <admin-token>

Response: 200
{
  "message": "Quiz deleted successfully"
}
```

#### Submit Quiz Attempt
```
POST /quizzes/:id/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": [0, 1, 2, 3],
  "time_taken": 245
}

Response: 200
{
  "attempt_id": "uuid",
  "score": 3,
  "percentage": 75,
  "total_questions": 4
}
```

#### Get Attempt Details
```
GET /quizzes/:id/attempt/:attemptId
Authorization: Bearer <token>

Response: 200
{
  "id": "uuid",
  "quiz_title": "General Knowledge",
  "score": 3,
  "percentage": 75,
  "time_taken": 245,
  "attempted_at": "2026-04-10T10:00:00Z",
  "questions": [...]
}
```

### Users

#### Get Profile
```
GET /users/profile
Authorization: Bearer <token>

Response: 200
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "created_at": "2026-04-10T10:00:00Z"
}
```

#### Get User Attempts
```
GET /users/attempts
Authorization: Bearer <token>

Response: 200
[
  {
    "id": "uuid",
    "quiz_id": "uuid",
    "title": "General Knowledge",
    "score": 3,
    "percentage": 75,
    "time_taken": 245,
    "attempted_at": "2026-04-10T10:00:00Z"
  }
]
```

#### Get User Statistics
```
GET /users/stats
Authorization: Bearer <token>

Response: 200
{
  "quizzes_attempted": 5,
  "total_attempts": 8,
  "avg_score": 72.5,
  "best_score": 95,
  "total_time": 3600
}
```

### Leaderboard

#### Global Leaderboard
```
GET /leaderboard/global?limit=50&offset=0

Response: 200
{
  "leaderboard": [
    {
      "id": "uuid",
      "name": "John Doe",
      "quizzes_attempted": 10,
      "total_attempts": 25,
      "avg_score": 85.5,
      "best_score": 100,
      "quizzes_passed": 9
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

#### Quiz Leaderboard
```
GET /leaderboard/quiz/:quizId?limit=50

Response: 200
[
  {
    "id": "uuid",
    "name": "John Doe",
    "score": 4,
    "percentage": 100,
    "time_taken": 180,
    "attempted_at": "2026-04-10T10:00:00Z",
    "rank": 1
  }
]
```

#### User Rank
```
GET /leaderboard/rank
Authorization: Bearer <token>

Response: 200
{
  "rank": 15,
  "total_users": 250
}
```

### Admin

#### Get All Users
```
GET /admin/users?limit=50&offset=0
Authorization: Bearer <admin-token>

Response: 200
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "total_attempts": 5,
      "avg_score": 75.5,
      "created_at": "2026-04-10T10:00:00Z"
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

#### Get All Quizzes (Admin)
```
GET /admin/quizzes?limit=50&offset=0
Authorization: Bearer <admin-token>

Response: 200
{
  "quizzes": [
    {
      "id": "uuid",
      "title": "General Knowledge",
      "creator_name": "Admin",
      "total_attempts": 42,
      "avg_score": 75.5,
      "is_published": true,
      "created_at": "2026-04-10T10:00:00Z"
    }
  ],
  "total": 25,
  "limit": 50,
  "offset": 0
}
```

#### Get Dashboard Statistics
```
GET /admin/stats
Authorization: Bearer <admin-token>

Response: 200
{
  "total_users": 150,
  "total_quizzes": 25,
  "total_attempts": 500,
  "avg_score": 72.5,
  "active_users": 85
}
```

#### Get Quiz Performance
```
GET /admin/quiz-performance/:quizId
Authorization: Bearer <admin-token>

Response: 200
{
  "unique_attempts": 42,
  "total_attempts": 50,
  "avg_score": 75.5,
  "min_score": 20,
  "max_score": 100,
  "passed": 35,
  "failed": 15,
  "avg_time": 245
}
```

#### Delete User
```
DELETE /admin/users/:userId
Authorization: Bearer <admin-token>

Response: 200
{
  "message": "User deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Quiz not found"
}
```

### 409 Conflict
```json
{
  "error": "Email already registered"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

No rate limiting is currently implemented. Consider adding it for production.

## Pagination

Endpoints that return lists support pagination:
- `limit`: Number of items per page (default: 50, max: 500)
- `offset`: Number of items to skip (default: 0)

Example:
```
GET /leaderboard/global?limit=50&offset=100
```

## Timestamps

All timestamps are in ISO 8601 format (UTC):
```
2026-04-10T10:00:00Z
```

## Data Types

- `uuid`: UUID string (e.g., "550e8400-e29b-41d4-a716-446655440000")
- `integer`: Whole number (e.g., 42)
- `string`: Text (e.g., "Hello World")
- `array`: List of items (e.g., [1, 2, 3])
- `object`: Key-value pairs (e.g., {"key": "value"})

## Examples

### Complete Quiz Flow

1. **Get Quiz**
   ```
   GET /quizzes/quiz-123
   ```

2. **Submit Answers**
   ```
   POST /quizzes/quiz-123/submit
   {
     "answers": [0, 1, 2],
     "time_taken": 300
   }
   ```

3. **View Results**
   ```
   GET /quizzes/quiz-123/attempt/attempt-456
   ```

4. **Check Leaderboard**
   ```
   GET /leaderboard/quiz/quiz-123
   ```

## Support

For API issues or questions, please open an issue on GitHub or contact support@quizhub.com
