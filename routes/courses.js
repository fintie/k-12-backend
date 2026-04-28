import express from 'express'
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import { Course, Progress } from '../models/index.js'
import { authenticateToken } from './auth.js'

const router = express.Router()

const fallbackCourses = [
  {
    id: 'course_1',
    title: 'Python Basics',
    description: 'Learn the fundamentals of Python programming.',
    language: 'Python',
    difficulty: 'Beginner',
    imageUrl: null,
    modules: [
      {
        id: 'module_1',
        title: 'Introduction to Python',
        description: 'Get started with Python basics',
        lessons: [
          { id: 'lesson_1', title: 'Variables and Data Types', content: 'Lesson content here', type: 'text', isCompleted: false },
          { id: 'lesson_2', title: 'Control Structures', content: 'Lesson content here', type: 'text', isCompleted: false }
        ]
      }
    ]
  },
  {
    id: 'course_2',
    title: 'Advanced JavaScript',
    description: 'Dive deep into JavaScript concepts.',
    language: 'JavaScript',
    difficulty: 'Intermediate',
    imageUrl: null,
    modules: []
  }
]

const isDatabaseConnected = () => mongoose.connection.readyState === 1

const getFallbackCourses = ({ language, difficulty, limit = 50, offset = 0 }) => {
  const normalizedOffset = Number.parseInt(offset, 10) || 0
  const normalizedLimit = Number.parseInt(limit, 10) || 50

  return fallbackCourses
    .filter(course => !language || course.language === language)
    .filter(course => !difficulty || course.difficulty === difficulty)
    .slice(normalizedOffset, normalizedOffset + normalizedLimit)
}

// GET /api/courses - List all courses
router.get('/', asyncHandler(async (req, res) => {
  const { language, difficulty, limit = 50, offset = 0 } = req.query

  if (!isDatabaseConnected()) {
    return res.json(getFallbackCourses({ language, difficulty, limit, offset }))
  }

  let query = {}

  if (language) query.language = language
  if (difficulty) query.difficulty = difficulty

  const courses = await Course.find(query)
    .select('-enrolledUsers') // Don't include enrolled users in list
    .limit(parseInt(limit))
    .skip(parseInt(offset))
    .sort({ createdAt: -1 })

  res.json(courses)
}))

// GET /api/courses/:id - Get single course
router.get('/:id', asyncHandler(async (req, res) => {
  if (!isDatabaseConnected()) {
    const course = fallbackCourses.find(course => course.id === req.params.id)

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    return res.json(course)
  }

  const course = await Course.findOne({ id: req.params.id })

  if (!course) {
    return res.status(404).json({ error: 'Course not found' })
  }

  res.json(course)
}))

// POST /api/courses/:id/enroll - Enroll in course
router.post('/:id/enroll', authenticateToken, asyncHandler(async (req, res) => {
  const course = await Course.findOne({ id: req.params.id })

  if (!course) {
    return res.status(404).json({ error: 'Course not found' })
  }

  const userId = req.user._id

  // Check if user is already enrolled
  if (course.enrolledUsers.includes(userId)) {
    return res.status(400).json({ error: 'Already enrolled in this course' })
  }

  // Add user to enrolled users
  course.enrolledUsers.push(userId)
  await course.save()

  res.json({
    message: 'Enrolled in course successfully',
    courseId: course.id,
    enrolledAt: new Date().toISOString()
  })
}))

// GET /api/courses/enrolled - Get user's enrolled courses
router.get('/enrolled/me', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user._id

  const courses = await Course.find({ enrolledUsers: userId })
    .select('-enrolledUsers') // Don't include other enrolled users

  res.json(courses)
}))

// GET /api/courses/:id/progress - Get user's progress in course
router.get('/:id/progress', authenticateToken, asyncHandler(async (req, res) => {
  const course = await Course.findOne({ id: req.params.id })

  if (!course) {
    return res.status(404).json({ error: 'Course not found' })
  }

  const userId = req.user._id

  // Check if user is enrolled
  if (!course.enrolledUsers.includes(userId)) {
    return res.status(403).json({ error: 'Not enrolled in this course' })
  }

  // Get progress for all lessons in the course
  const lessonIds = course.modules.flatMap(module =>
    module.lessons.map(lesson => lesson.id)
  )

  const progressRecords = await Progress.find({
    userId,
    lessonId: { $in: lessonIds }
  })

  const progressMap = {}
  progressRecords.forEach(record => {
    progressMap[record.lessonId] = {
      completed: record.completed,
      completedAt: record.completedAt
    }
  })

  // Calculate overall progress
  const totalLessons = lessonIds.length
  const completedLessons = progressRecords.filter(p => p.completed).length
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  res.json({
    courseId: course.id,
    totalLessons,
    completedLessons,
    progressPercentage: Math.round(progressPercentage),
    lessonProgress: progressMap
  })
}))

export default router
