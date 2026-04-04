# Lexi REST API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication

All endpoints (except signup/login) require a JWT token:
```
Authorization: Bearer <token>
```

Tokens are obtained from `/auth/login` and expire after 30 minutes.

---

## Authentication Endpoints

### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123",
  "full_name": "John Doe"  // optional
}
```

**Response (201):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00"
}
```

**Errors:**
- `400` - Username or email already registered

---

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

**Errors:**
- `401` - Invalid credentials
- `403` - User account is inactive

---

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00"
}
```

---

### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Chat Endpoints

### Create Chat
```http
POST /chats
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Legal Question",
  "description": "Discussing property laws"  // optional
}
```

**Response (201):**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Legal Question",
  "description": "Discussing property laws",
  "is_archived": false,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

---

### List Chats
```http
GET /chats?archived=false
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Legal Question",
    "description": "Discussing property laws",
    "is_archived": false,
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  }
]
```

**Query Parameters:**
- `archived` (boolean) - Filter by archive status

---

### Get Chat Detail
```http
GET /chats/{chat_id}
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Legal Question",
  "description": "Discussing property laws",
  "is_archived": false,
  "messages": [
    {
      "id": 1,
      "chat_id": 1,
      "user_id": 1,
      "content": "What is property law?",
      "role": "user",
      "created_at": "2024-01-15T10:30:00"
    }
  ],
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

---

### Update Chat
```http
PUT /chats/{chat_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "is_archived": true
}
```

**Response (200):** Chat object

---

### Delete Chat
```http
DELETE /chats/{chat_id}
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Chat deleted successfully"
}
```

---

## Message Endpoints

### Send Message
```http
POST /chats/{chat_id}/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "What is property law in Nepal?"
}
```

**Response (201):**
```json
{
  "id": 2,
  "chat_id": 1,
  "user_id": 1,
  "content": "According to Nepal's property laws...",
  "role": "assistant",
  "created_at": "2024-01-15T10:35:00"
}
```

**Process:**
1. Saves user message
2. Queries ChromaDB for context
3. Sends to OpenAI
4. Saves AI response
5. Returns assistant message

---

### Get Messages
```http
GET /chats/{chat_id}/messages
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "chat_id": 1,
    "user_id": 1,
    "content": "What is property law?",
    "role": "user",
    "created_at": "2024-01-15T10:30:00"
  },
  {
    "id": 2,
    "chat_id": 1,
    "user_id": 1,
    "content": "According to Nepal's property laws...",
    "role": "assistant",
    "created_at": "2024-01-15T10:35:00"
  }
]
```

---

## Settings Endpoints

### Get User Settings
```http
GET /users/{user_id}/settings
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "theme": "light",
  "language": "en",
  "notifications_enabled": true
}
```

---

### Update Settings
```http
PUT /users/{user_id}/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "theme": "dark",
  "language": "ne",
  "notifications_enabled": false
}
```

**Response (200):** Updated settings object

---

## Health Check

### API Status
```http
GET /health
```

**Response (200):**
```json
{
  "status": "healthy"
}
```

---

## API Documentation (Interactive)

Visit `http://localhost:8000/docs` for interactive Swagger UI where you can:
- View all endpoints
- Test endpoints directly
- See request/response examples
- Authorize with your token

---

## Error Responses

### Common Errors

**400 - Bad Request**
```json
{
  "detail": "Invalid request data"
}
```

**401 - Unauthorized**
```json
{
  "detail": "Could not validate credentials"
}
```

**403 - Forbidden**
```json
{
  "detail": "Not authorized to access this resource"
}
```

**404 - Not Found**
```json
{
  "detail": "Chat not found"
}
```

**500 - Server Error**
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting. Future versions will include:
- 100 requests/minute for authenticated users
- 10 requests/minute for unauthenticated endpoints

---

## Pagination (Future)

Currently all results are returned. Future versions will include:
```http
GET /chats?limit=10&offset=0
```

---

## WebSocket (Future)

Real-time message updates via WebSocket:
```
ws://localhost:8000/ws/chats/{chat_id}?token=<token>
```

---

## Rate Limiting (Future)

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1234567890
```

---

## Examples

### Complete Login & Chat Flow

**1. Sign Up**
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "pass123"
  }'
```

**2. Login**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "pass123"
  }'
```

Response includes `access_token`. Save this.

**3. Create Chat**
```bash
curl -X POST http://localhost:8000/api/chats \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Chat"
  }'
```

**4. Send Message**
```bash
curl -X POST http://localhost:8000/api/chats/1/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "What is property law?"
  }'
```

---

## Environment Variables

Required for API to work:
```env
OPENAI_API_KEY=sk-...
SECRET_KEY=your-secret-key
VECTOR_DB_PATH=./nepal_law_db
```

---

## Support

- Check interactive docs: `/docs`
- Check logs: Terminal running backend
- Check database: `sqlite3 lexi.db`
