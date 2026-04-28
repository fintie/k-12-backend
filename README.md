# K-12 Backend API

Backend API for the K-12 tutoring platform. Provides endpoints for user authentication, course management, lessons, challenges, and community features.

## 🚀 Quick Deploy

**Deploy to Render (Recommended for iOS app integration):**
```bash
npm run deploy:render
```
Then follow the instructions to deploy via Render dashboard.

**Alternative: Railway deployment:**
```bash
npm run deploy
```

**Note:** GitHub Pages only supports static websites and cannot run Node.js applications. Use Render or Railway for backend deployment.

## Features

- **Authentication**: JWT tokens with bcrypt password hashing
- **Database**: MongoDB with Mongoose ODM
- **Validation**: express-validator on all endpoints
- **User Management**: Complete profiles with achievements and progress
- **Courses**: Enrollment, progress tracking, and lesson completion
- **Challenges**: Code submission with testing simulation
- **Community**: Posts, comments, and likes
- **Deployment**: Docker, Railway, Render, and PM2 ready

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
- MongoDB (local installation or MongoDB Atlas)
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

3. Set up MongoDB:
   - Install MongoDB locally, or
   - Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/k12-tutor
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Database Setup

1. Start MongoDB (if running locally):
```bash
mongod
```

2. Seed the database with sample data:
```bash
npm run seed
```

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

## Features Implemented ✅

- **Database Integration**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Input Validation**: express-validator middleware on all endpoints
- **User Management**: Complete user profiles with preferences and achievements
- **Course System**: Enrollment, progress tracking, and lesson completion
- **Challenge Platform**: Code submission with simulated testing
- **Community Features**: Posts, comments, and likes
- **Error Handling**: Comprehensive error responses and logging

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

## Deployment

### Render Deployment (Recommended for iOS App Integration)

1. **Push your code to GitHub** (if not already done)

2. **Go to [Render.com](https://render.com) and sign up/login**

3. **Create a new Web Service:**
   - Connect your GitHub repository
   - Service Name: `k12-backend-api`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Set Environment Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=<run: ./generate-jwt-secret.sh>
   DB_URI=<your-mongodb-atlas-connection-string>
   CORS_ORIGIN=<your-ios-app-domain-or-*>
   ```

5. **Set up MongoDB Atlas:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Get your connection string
   - Add `0.0.0.0/0` to MongoDB Atlas network access (for Render)

6. **Deploy!** Render will automatically build and deploy your app.

**Quick setup script:**
```bash
npm run deploy:render
```

### Alternative: Railway Deployment

```bash
npm install -g @railway/cli
railway login
./deploy.sh
```

### Alternative: Docker Deployment

```bash
docker-compose up --build
```

### Manual Deployment

```bash
npm install -g pm2
pm2 start ecosystem.config.js
```

**Note:** GitHub Pages only supports static websites and cannot run Node.js applications.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `DB_URI` | MongoDB connection string | mongodb://localhost:27017/k12-tutoring |
| `JWT_SECRET` | JWT signing secret | (required) |
| `CORS_ORIGIN` | Allowed CORS origins | http://localhost:3000 |
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
