import express from 'express'
import { body, validationResult } from 'express-validator'
import asyncHandler from 'express-async-handler'
import { User } from '../models/index.js'
import { authenticateToken } from './auth.js'

const router = express.Router()

// GET /api/users/me - Get current user profile
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const user = req.user

  const userResponse = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    school: user.school,
    grade: user.grade,
    bio: user.bio,
    profilePictureURL: user.profilePictureURL,
    completedCourses: user.completedCourses,
    achievements: user.achievements,
    points: user.points,
    preferredDifficulty: user.preferredDifficulty,
    preferredSubject: user.preferredSubject
  }

  res.json(userResponse)
}))

// PUT /api/users/me - Update current user profile
router.put('/me', authenticateToken, [
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const {
    firstName,
    lastName,
    email,
    bio,
    school,
    grade,
    preferredDifficulty,
    preferredSubject
  } = req.body

  const user = req.user

  // Update user fields
  if (firstName !== undefined) user.firstName = firstName
  if (lastName !== undefined) user.lastName = lastName
  if (email !== undefined) user.email = email
  if (bio !== undefined) user.bio = bio
  if (school !== undefined) user.school = school
  if (grade !== undefined) user.grade = grade
  if (preferredDifficulty !== undefined) user.preferredDifficulty = preferredDifficulty
  if (preferredSubject !== undefined) user.preferredSubject = preferredSubject

  await user.save()

  const userResponse = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    school: user.school,
    grade: user.grade,
    bio: user.bio,
    profilePictureURL: user.profilePictureURL,
    completedCourses: user.completedCourses,
    achievements: user.achievements,
    points: user.points,
    preferredDifficulty: user.preferredDifficulty,
    preferredSubject: user.preferredSubject
  }

  res.json({
    user: userResponse,
    message: 'Profile updated successfully'
  })
}))

// GET /api/users/leaderboard - Get leaderboard
router.get('/leaderboard', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10

  const users = await User.find({})
    .select('username firstName lastName points achievements')
    .sort({ points: -1 })
    .limit(limit)

  const leaderboard = users.map((user, index) => ({
    rank: index + 1,
    id: user._id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    points: user.points,
    achievements: user.achievements
  }))

  res.json(leaderboard)
}))

export default router
