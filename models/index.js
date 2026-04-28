import mongoose from 'mongoose'

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  school: { type: String },
  grade: { type: String },
  bio: { type: String },
  profilePictureURL: { type: String },
  completedCourses: [{ type: String }],
  achievements: [{ type: String }],
  points: { type: Number, default: 0 },
  preferredDifficulty: { type: String, default: 'moderate' },
  preferredSubject: { type: String, default: 'Algebra' },
  role: { type: String, enum: ['student', 'tutor'], default: 'student' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export const User = mongoose.model('User', userSchema)

// Course Schema
const lessonSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'code', 'quiz'], default: 'text' },
  isCompleted: { type: Boolean, default: false }
})

const moduleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  lessons: [lessonSchema]
})

const courseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  language: { type: String, required: true },
  difficulty: { type: String, required: true },
  imageUrl: { type: String },
  modules: [moduleSchema],
  enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
})

export const Course = mongoose.model('Course', courseSchema)

// Challenge Schema
const solutionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  challengeId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, required: true },
  submissionDate: { type: Date, default: Date.now },
  passedTests: { type: Boolean, default: false },
  pointsEarned: { type: Number, default: 0 }
})

const challengeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  language: { type: String, required: true },
  starterCode: { type: String },
  testCases: { type: String }, // JSON string
  difficulty: { type: String, required: true },
  solutions: [solutionSchema],
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
})

export const Challenge = mongoose.model('Challenge', challengeSchema)

// Post Schema (Community)
const commentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  postId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  commentDate: { type: Date, default: Date.now }
})

const postSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  postDate: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  codeSnippet: { type: String }
})

export const Post = mongoose.model('Post', postSchema)

// Progress Schema
const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lessonId: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: Date.now }
})

export const Progress = mongoose.model('Progress', progressSchema)
