# API Documentation

Complete API reference for EduPlatform frontend integration.

## Base URL
```
http://localhost:3000/api/v1
Production: https://your-api-domain.com/api/v1
```

## Authentication

### Token Storage
```javascript
// Token is automatically stored in localStorage
localStorage.getItem('authToken')

// Automatically added to all requests
Authorization: Bearer {token}
```

### User Data
```javascript
// User object stored in localStorage
const user = JSON.parse(localStorage.getItem('user'))
// {
//   _id: "...",
//   name: "...",
//   email: "...",
//   role: "student" | "instructor" | "admin",
//   avatar: "...",
//   bio: "...",
//   enrolledCourses: [...],
//   createdCourses: [...],
//   createdAt: "...",
//   updatedAt: "..."
// }
```

---

## 👤 User Endpoints

### Sign Up
```javascript
POST /user/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" | "instructor"
}

Response:
{
  "success": true,
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": { ...userData }
}
```

### Sign In
```javascript
POST /user/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "User signed in successfully",
  "token": "jwt_token_here",
  "user": { ...userData }
}
```

### Get Current Profile
```javascript
GET /user/profile
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": { ...userData }
}
```

### Update Profile
```javascript
PATCH /user/profile
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "name": "John Updated",
  "bio": "Software Developer",
  "avatar": File // Optional
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ...updatedUserData }
}
```

### Change Password
```javascript
PATCH /user/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "oldPassword": "currentPassword",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}

Response:
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Sign Out
```javascript
POST /user/signout
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Delete Account
```javascript
DELETE /user/account
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 📚 Course Endpoints

### Get Published Courses
```javascript
GET /course/published?page=1&limit=10&category=Programming&level=beginner

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- category: Filter by category
- level: Filter by level (beginner, intermediate, advanced)
- sort: Sort by (default: -createdAt)

Response:
{
  "success": true,
  "data": [
    {
      "_id": "course_id",
      "title": "Complete React Course",
      "subtitle": "Learn React from scratch",
      "description": "...",
      "category": "Programming",
      "level": "beginner",
      "price": 29.99,
      "thumbnail": "image_url",
      "instructor": { ...instructorData },
      "enrolledStudents": ["user_id1", "user_id2"],
      "lectures": ["lecture_id1", "lecture_id2"],
      "isPublished": true,
      "totalLectures": 2,
      "totalDuration": 120,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-02T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Search Courses
```javascript
GET /course/search?query=react&category=Programming

Query Parameters:
- query: Search term
- category: Filter by category
- level: Filter by level

Response:
{
  "success": true,
  "data": [ ...courseData ]
}
```

### Get Course Details
```javascript
GET /course/c/{courseId}
Authorization: Bearer {token} (optional)

Response:
{
  "success": true,
  "data": {
    "course": { ...courseData },
    "lectures": [ ...lectureData ],
    "isPurchased": true // If authenticated
  }
}
```

### Create Course (Instructor)
```javascript
POST /course
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "My New Course",
  "subtitle": "Course subtitle",
  "description": "Detailed course description",
  "category": "Programming",
  "level": "beginner",
  "price": 49.99,
  "thumbnail": File // Required image
}

Response:
{
  "success": true,
  "message": "Course created successfully",
  "data": { ...courseData }
}
```

### Get My Created Courses (Instructor)
```javascript
GET /course
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [ ...courseData ]
}
```

### Update Course (Instructor)
```javascript
PATCH /course/c/{courseId}
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "Updated Title",
  "subtitle": "Updated subtitle",
  "description": "Updated description",
  "category": "Programming",
  "level": "intermediate",
  "price": 59.99,
  "thumbnail": File // Optional
}

Response:
{
  "success": true,
  "message": "Course updated successfully",
  "data": { ...updatedCourseData }
}
```

### Get Course Lectures
```javascript
GET /course/c/{courseId}/lectures
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "_id": "lecture_id",
      "title": "Introduction to React",
      "description": "...",
      "videoUrl": "video_url",
      "videoPublicId": "cloudinary_id",
      "duration": 15, // minutes
      "resources": ["resource_url"],
      "isPreviewFree": true,
      "course": "course_id",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-02T00:00:00Z"
    }
  ]
}
```

### Add Lecture to Course (Instructor)
```javascript
POST /course/c/{courseId}/lectures
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "Lecture Title",
  "description": "Lecture description",
  "video": File, // Video file (required)
  "duration": 15, // Minutes (optional)
  "isPreviewFree": false // Optional
}

Response:
{
  "success": true,
  "message": "Lecture added successfully",
  "data": { ...lectureData }
}
```

---

## 💳 Purchase Endpoints

### Create Stripe Checkout Session
```javascript
POST /purchase/checkout/create-checkout-session
Authorization: Bearer {token}
Content-Type: application/json

{
  "courseId": "course_id"
}

Response:
{
  "success": true,
  "sessionUrl": "https://checkout.stripe.com/...",
  "sessionId": "cs_..."
}
```

### Get Purchased Courses
```javascript
GET /purchase
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [ ...purchasedCourses ]
}
```

### Get Course Purchase Status
```javascript
GET /purchase/course/{courseId}/detail-with-status
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "course": { ...courseData },
    "isPurchased": true | false,
    "purchaseDate": "2024-01-01T00:00:00Z"
  }
}
```

---

## 📊 Progress Endpoints

### Get Course Progress
```javascript
GET /progress/course/{courseId}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "_id": "progress_id",
    "course": "course_id",
    "user": "user_id",
    "completedLectures": ["lecture_id1", "lecture_id2"],
    "progressPercentage": 50,
    "isCompleted": false,
    "completedAt": null,
    "lastAccessedAt": "2024-01-02T00:00:00Z"
  }
}
```

### Update Lecture Progress
```javascript
PATCH /progress/course/{courseId}/lecture/{lectureId}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Progress updated",
  "data": { ...progressData }
}
```

### Complete Course
```javascript
POST /progress/course/{courseId}/complete
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Course completed",
  "data": { ...progressData }
}
```

---

## 🔄 Stripe Webhook

### Handle Stripe Webhooks
```javascript
POST /purchase/webhook
Content-Type: application/json
Stripe-Signature: {signature}

// Handles events:
// - payment_intent.succeeded
// - charge.refunded
```

---

## Error Responses

All endpoints return errors in this format:

```javascript
{
  "success": false,
  "status": "error",
  "message": "Error description",
  "statusCode": 400 // or 401, 404, 500, etc
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Server Error |

---

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Headers**:
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: 99
  - `X-RateLimit-Reset`: 1234567890

---

## File Upload Limits

- **Image (Thumbnail)**: Max 5MB
- **Video (Lecture)**: Max 500MB
- **Allowed Image Types**: jpg, jpeg, png, gif, webp
- **Allowed Video Types**: mp4, webm, mov, avi

---

## Using in Frontend

### Example: Sign Up
```javascript
import { authAPI } from '../api/authAPI';

const handleSignup = async (data) => {
  try {
    const response = await authAPI.signup(data);
    // response = { token, user, message }
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  } catch (error) {
    console.error(error.message);
  }
};
```

### Example: Get Courses
```javascript
import { courseAPI } from '../api/courseAPI';

const handleBrowse = async () => {
  try {
    const response = await courseAPI.getPublishedCourses({
      page: 1,
      limit: 10,
      category: 'Programming'
    });
    // response = { data: [...], pagination: {...} }
  } catch (error) {
    console.error(error.message);
  }
};
```

### Example: Create Course
```javascript
import { courseAPI } from '../api/courseAPI';

const handleCreateCourse = async (formData) => {
  try {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('thumbnail', formData.thumbnail);
    
    const response = await courseAPI.createCourse(data);
    // response = { data: {...}, message: "..." }
  } catch (error) {
    console.error(error.message);
  }
};
```

---

## Testing

### Using Postman

1. Import the API collection
2. Set `{{BASE_URL}}` variable to `http://localhost:3000/api/v1`
3. Set `{{TOKEN}}` variable after sign in
4. Use Bearer token in Authorization header

### Test Accounts

```
Email: demo@example.com
Password: demo123456
```

---

## Pagination

```javascript
// Example paginated response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Sorting

Add `sort` query parameter:

```javascript
// Ascending: name
GET /course/published?sort=title

// Descending: -name
GET /course/published?sort=-createdAt

// Multiple fields
GET /course/published?sort=-createdAt,title
```

---

**Last Updated**: January 2024
**Version**: 1.0.0
