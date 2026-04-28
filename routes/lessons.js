import express from 'express'
import asyncHandler from 'express-async-handler'
import { Course, Progress } from '../models/index.js'
import { authenticateToken } from './auth.js'

const router = express.Router()

// GET /api/lessons/:id - Get single lesson by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const lessonId = req.params.id

  // Find the course that contains this lesson
  const course = await Course.findOne({
    'modules.lessons.id': lessonId
  })

  if (!course) {
    return res.status(404).json({ error: 'Lesson not found' })
  }

  // Find the specific lesson
  let lesson = null
  for (const module of course.modules) {
    lesson = module.lessons.find(l => l.id === lessonId)
    if (lesson) break
  }

  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' })
  }

  res.json({
    id: lesson.id,
    title: lesson.title,
    content: lesson.content,
    type: lesson.type
  })
}))

// POST /api/lessons/:id/complete - Mark lesson as complete
router.post('/:id/complete', authenticateToken, asyncHandler(async (req, res) => {
  const lessonId = req.params.id
  const userId = req.user._id

  // Find the course that contains this lesson
  const course = await Course.findOne({
    'modules.lessons.id': lessonId
  })

  if (!course) {
    return res.status(404).json({ error: 'Lesson not found' })
  }

  // Check if user is enrolled in the course
  if (!course.enrolledUsers.includes(userId)) {
    return res.status(403).json({ error: 'Not enrolled in course containing this lesson' })
  }

  // Find or create progress record
  let progress = await Progress.findOne({ userId, lessonId })

  if (!progress) {
    progress = new Progress({
      userId,
      lessonId,
      completed: true,
      completedAt: new Date()
    })
  } else if (!progress.completed) {
    progress.completed = true
    progress.completedAt = new Date()
  } else {
    return res.status(400).json({ error: 'Lesson already completed' })
  }

  await progress.save()

  // Award points to user
  const pointsEarned = 10
  req.user.points += pointsEarned
  await req.user.save()

  res.json({
    message: 'Lesson marked as complete',
    lessonId,
    completedAt: progress.completedAt,
    pointsEarned
  })
}))

// GET /api/lessons/:id/progress - Get user's progress for specific lesson
router.get('/:id/progress', authenticateToken, asyncHandler(async (req, res) => {
  const lessonId = req.params.id
  const userId = req.user._id

  const progress = await Progress.findOne({ userId, lessonId })

  res.json({
    lessonId,
    completed: progress ? progress.completed : false,
    completedAt: progress ? progress.completedAt : null
  })
}))

export default router
