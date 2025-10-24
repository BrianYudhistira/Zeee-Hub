# Zeee-Hub Portfolio API

A RESTful API for managing user portfolios built with Laravel and Sanctum authentication.

## Base URL
```
http://localhost:8000/api
```

## Overview
This API provides endpoints for user authentication and portfolio management including personal information, skills, projects, and contact details.

## Authentication
The API uses Laravel Sanctum for stateless API authentication with Bearer tokens.

### Authentication Headers
All protected endpoints require:
```http
Authorization: Bearer {your_access_token}
```

### Content Types
- **JSON requests**: `Content-Type: application/json`  
- **File uploads**: `Content-Type: multipart/form-data` (auto-set by browser)

---

## Endpoints

### Authentication

#### Login
```http
POST /api/login
```

Authenticate user and retrieve access token.

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response:**
```http
200 OK
```
```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "name": "User Name",
        "email": "user@example.com",
        "created_at": "2025-01-01T00:00:00.000000Z",
        "updated_at": "2025-01-01T00:00:00.000000Z"
    },
    "access_token": "1|randomTokenString",
    "token_type": "Bearer"
}
```

**Error Response:**
```http
401 Unauthorized
```
```json
{
    "message": "Invalid credentials"
}
```

#### Register
```http
POST /api/signin
```

Register a new user account.

**Request Body (multipart/form-data):**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | ✓ | max:255, unique |
| email | string | ✓ | valid email, max:255, unique |
| password | string | ✓ | min:6 characters |
| photo | file | ✗ | image (jpeg,png,jpg,gif), max:2MB |

**Response:**
```http
201 Created
```
```json
{
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "name": "User Name", 
        "email": "user@example.com",
        "photo_path": "users/550e8400-e29b-41d4-a716-446655440000.jpg",
        "created_at": "2025-01-01T00:00:00.000000Z",
        "updated_at": "2025-01-01T00:00:00.000000Z"
    },
    "access_token": "1|randomTokenString",
    "token_type": "Bearer"
}
```

**Error Response:**
```http
422 Unprocessable Entity
```
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["The email has already been taken."],
        "name": ["The name has already been taken."]
    }
}
```

---

### User Management
*All endpoints in this section require authentication.*

#### Get Current User
```http
GET /api/user
```

Retrieve information about the authenticated user.

**Response:**
```http
200 OK
```
```json
{
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "photo_path": "users/550e8400-e29b-41d4-a716-446655440000.jpg",
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
}
```

#### Logout
```http
POST /api/logout
```

Logout user and revoke access token.

**Response:**
```http
200 OK
```
```json
{
    "message": "Logged out successfully"
}
```

#### Delete Own Account
```http
DELETE /api/user
```

Delete the authenticated user's account and all associated data.

**Response:**
```http
200 OK
```
```json
{
    "message": "User account deleted successfully"
}
```

#### Delete User by ID (Admin Only)
```http
DELETE /api/users/{id}
```

Delete a user by ID. Requires admin privileges.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | User ID to delete |

**Response:**
```http
200 OK
```
```json
{
    "message": "User deleted successfully"
}
```

**Error Responses:**
```http
401 Unauthorized    # Missing or invalid token
403 Forbidden       # User is not admin
404 Not Found       # User ID doesn't exist
```

---

### Portfolio Management
*All portfolio endpoints require authentication.*

#### Get Portfolio
```http
GET /api/portfolio
```

Retrieve the complete portfolio data for the authenticated user.

**Response:**
```http
200 OK
```
```json
{
    "id": 1,
    "user_id": 1,
    "home": {
        "id": 1,
        "greeting": "Hello, I am",
        "name": "Your Name",
        "passions": ["Web Developer", "UI/UX Designer"],
        "description": "Description here",
        "logo_path": "logos/1/uuid.jpg"
    },
    "about": {
        "id": 1,
        "title": "About Me",
        "description": "About description",
        "skills": ["HTML", "CSS", "JavaScript"],
        "image_path": "about_images/1/uuid.jpg",
        "cv_path": "cvs/1/uuid.pdf"
    },
    "projects": [...],
    "contacts": {
        "email": "contact@example.com",
        "phone": "+1234567890",
        // ... other contact fields
    }
}
```

#### Update Home Section
```http
POST /api/portfolio/update_home
```

Update the home section of the user's portfolio.

**Request Body (multipart/form-data):**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| greeting | string | ✗ | max:255 |
| name | string | ✗ | max:255 |
| passions[] | array | ✗ | array of strings, max:100 each |
| description | string | ✗ | text |
| logo | file | ✗ | image, max:2MB |

**Alternative JSON Request:**
```json
{
    "greeting": "Hello, I am",
    "name": "John Doe",
    "passions": ["Developer", "Designer"],
    "description": "I am a full-stack developer..."
}
```

**Response:**
```http
200 OK
```
```json
{
    "message": "Home section updated successfully",
    "data": {
        "id": 1,
        "greeting": "Hello, I am",
        "name": "John Doe",
        "passions": ["Developer", "Designer"],
        "description": "Updated description",
        "logo_path": "logos/1/uuid.jpg"
    }
}
```

#### Update About Section
```http
POST /api/portfolio/update_about
```

Update the about section of the user's portfolio.

**Request Body (multipart/form-data):**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| title | string | ✓ | required |
| description | string | ✓ | required |
| skills[] | array | ✓ | array of strings |
| image | file | ✗ | image, max:2MB |
| cv | file | ✗ | pdf/doc/docx, max:2MB |

**Success Response (200):**
```json
{
    "message": "About section updated successfully"
}
```

**Note:** Jika about section belum ada, akan dibuat baru dengan response:
```json
{
    "message": "About section created successfully"
}
```

---

### 10. Update Projects Section
**POST** `/portfolio/update_projects`

Update bagian projects portfolio.

**Request Body (multipart/form-data):**
```
title: string (required)
description: string (required)
image: file (required, image, max:2048KB)
demo_link: string (optional, URL)
repo_link: string (optional, URL)
techstacks[]: array of strings (required)
```

**Success Response (200):**
```json
{
    "message": "Projects section updated successfully"
}
```

---

### 11. Update Contacts Section
**POST** `/portfolio/update_contacts`

Update bagian contacts portfolio.

**Request Body (JSON):**
```json
{
    "email": "contact@example.com",
    "phone": "+1234567890",
    "address": "123 Street, City",
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "twitter": "https://twitter.com/username"
}
```

**Success Response (200):**
```json
{
    "message": "Contacts section updated successfully"
}
```

---

## File Upload Guidelines

### Supported File Types
- **Images**: jpeg, jpg, png, gif
- **Documents**: pdf, doc, docx

### File Size Limits
- Maximum file size: 2048KB (2MB)

### File Storage Structure
```
storage/app/public/
├── logos/{user_id}/          # Profile logos
├── about_images/{user_id}/   # About section images
├── cvs/{user_id}/           # CV documents
├── project_images/{user_id}/ # Project images
└── users/                   # User profile photos
```

### Array Fields in Form Data
Untuk mengirim array via form-data, gunakan format:
```
passions[]: "Web Development"
passions[]: "UI/UX Design"
skills[]: "HTML"
skills[]: "CSS"
techstacks[]: "React"
techstacks[]: "Laravel"
```

---

## Error Responses

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized (token missing/invalid)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

### Validation Error Format (422)
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "field_name": [
            "Error message 1",
            "Error message 2"
        ]
    }
}
```

---

## Authentication Notes

### Token Expiration
- Tokens expire berdasarkan konfigurasi di `config/sanctum.php`
- Default expiration dapat diatur via `SANCTUM_EXPIRATION` di `.env`

### CORS Support
API mendukung CORS untuk frontend aplikasi (Next.js/React).

---

## Example Usage

### JavaScript/Fetch Example
```javascript
// Login
const loginResponse = await fetch('/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'password123'
    })
});

const loginData = await loginResponse.json();
const token = loginData.access_token;

// Update Home Section
const formData = new FormData();
formData.append('greeting', 'Hello, I am');
formData.append('name', 'John Doe');
formData.append('passions[]', 'Developer');
formData.append('passions[]', 'Designer');
formData.append('logo', fileInput.files[0]);

const response = await fetch('/api/portfolio/update_home', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
    },
    body: formData
});

const data = await response.json();
console.log(data.message); // "Home section updated successfully"
```

### cURL Examples
```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Update home section
curl -X POST http://localhost:8000/api/portfolio/update_home \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "greeting=Hello, I am" \
  -F "name=John Doe" \
  -F "passions[]=Web Developer" \
  -F "passions[]=UI Designer" \
  -F "logo=@/path/to/logo.jpg"

# Update about section  
curl -X POST http://localhost:8000/api/portfolio/update_about \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "title=About Me" \
  -F "description=I am a passionate developer..." \
  -F "skills[]=JavaScript" \
  -F "skills[]=Laravel" \
  -F "image=@/path/to/photo.jpg" \
  -F "cv=@/path/to/resume.pdf"
```