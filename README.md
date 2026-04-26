# K-12 Backend API

Backend API for the K-12 tutoring platform. Provides endpoints for user authentication, course management, lessons, challenges, and community features.

## Features

- **Authentication**: User login and registration
- **User Management**: Profile management and preferences
- **Courses**: Browse and enroll in courses
- **Lessons**: Access lesson content and track completion
- **Challenges**: Programming challenges with code submission
- **Community**: Social feed for posts, comments, and likes

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll in course

### Lessons
- `GET /api/lessons` - List all lessons
- `GET /api/lessons/:id` - Get lesson details
- `POST /api/lessons/:id/complete` - Mark lesson complete

### Challenges
- `GET /api/challenges` - List all challenges
- `GET /api/challenges/:id` - Get challenge details
- `POST /api/challenges/:id/submit` - Submit solution

### Posts (Community)
- `GET /api/posts` - List all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get post details
- `POST /api/posts/:id/like` - Like a post
- `POST /api/posts/:id/comment` - Add comment to post

## Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd k-12-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## Testing

Check if server is running:
```bash
curl http://localhost:5000/health
```

Example login request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

## Architecture

```
k-12-backend/
├── routes/          # API route handlers
│   ├── auth.js      # Authentication routes
│   ├── users.js     # User profile routes
│   ├── courses.js   # Course routes
│   ├── lessons.js   # Lesson routes
│   ├── challenges.js # Challenge routes
│   └── posts.js     # Community posts routes
├── models/          # Database models (MongoDB schemas)
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── server.js        # Main server entry point
└── package.json     # Dependencies
```

## TODO: Database Integration

This is currently a mock backend with in-memory data. To productionize:

1. Set up MongoDB or PostgreSQL database
2. Create proper data models using Mongoose or TypeORM
3. Implement JWT authentication middleware
4. Add input validation
5. Implement user authentication with bcrypt
6. Add error handling and logging
7. Create database migrations
8. Add unit and integration tests
9. Implement rate limiting
10. Add CORS configuration
11. Deploy to production server

## iOS App Integration

This backend is designed to work with the NextGenius Tutor iOS app. The iOS app uses the following API base URL:

```swift
static let baseURL = "https://stem.nextgenius.com.au/api"
```

Update this URL in the iOS app's `NetworkService.swift` to point to this backend when deploying.

## Environment Variables

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `DB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CORS_ORIGIN`: Allowed CORS origin
- `API_BASE_URL`: Base URL for API

## License

MIT

## Author

NextGenius Team
