import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import asyncHandler from 'express-async-handler'
import { User } from '../models/index.js'

const router = express.Router()

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  })
}

// POST /api/auth/login
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { username, password } = req.body

  // Find user by username
  const user = await User.findOne({ username })
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  // Generate token
  const token = generateToken(user._id)

  // Return user data (exclude password)
  const userResponse = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    school: user.school,
    grade: user.grade,
    preferredDifficulty: user.preferredDifficulty,
    preferredSubject: user.preferredSubject,
    points: user.points,
    achievements: user.achievements
  }

  res.json({
    user: userResponse,
    token,
    message: 'Login successful'
  })
}))

// POST /api/auth/register
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const {
    username,
    password,
    email,
    firstName,
    lastName,
    school,
    grade,
    role = 'student',
    preferredDifficulty = 'moderate',
    preferredSubject = 'Algebra'
  } = req.body

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existingUser) {
    return res.status(400).json({
      error: existingUser.username === username ? 'Username already exists' : 'Email already exists'
    })
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = new User({
    username,
    password: hashedPassword,
    email,
    firstName,
    lastName,
    school,
    grade,
    role,
    preferredDifficulty,
    preferredSubject
  })

  await user.save()

  // Generate token
  const token = generateToken(user._id)

  // Return user data (exclude password)
  const userResponse = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    school: user.school,
    grade: user.grade,
    preferredDifficulty: user.preferredDifficulty,
    preferredSubject: user.preferredSubject,
    points: user.points,
    achievements: user.achievements
  }

  res.status(201).json({
    user: userResponse,
    token,
    message: 'Registration successful'
  })
}))

// Middleware to verify JWT token
export const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    req.user = await User.findById(decoded.userId).select('-password')
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' })
    }
    next()
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' })
  }
})

export default router
