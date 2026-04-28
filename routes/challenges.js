import express from 'express'
import asyncHandler from 'express-async-handler'
import { Challenge } from '../models/index.js'
import { authenticateToken } from './auth.js'

const router = express.Router()

// GET /api/challenges - List all challenges
router.get('/', asyncHandler(async (req, res) => {
  const { language, difficulty, tags, limit = 50, offset = 0 } = req.query

  let query = {}

  if (language) query.language = language
  if (difficulty) query.difficulty = difficulty
  if (tags) query.tags = { $in: tags.split(',') }

  const challenges = await Challenge.find(query)
    .select('-solutions') // Don't include solutions in list
    .limit(parseInt(limit))
    .skip(parseInt(offset))
    .sort({ createdAt: -1 })

  res.json(challenges)
}))

// GET /api/challenges/:id - Get single challenge
router.get('/:id', asyncHandler(async (req, res) => {
  const challenge = await Challenge.findOne({ id: req.params.id })
    .select('-solutions') // Don't include solutions

  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' })
  }

  res.json(challenge)
}))

// POST /api/challenges/:id/submit - Submit challenge solution
router.post('/:id/submit', authenticateToken, asyncHandler(async (req, res) => {
  const { code } = req.body

  if (!code) {
    return res.status(400).json({ error: 'Code is required' })
  }

  const challenge = await Challenge.findOne({ id: req.params.id })

  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' })
  }

  const userId = req.user._id

  // Check if user already has a solution for this challenge
  const existingSolution = challenge.solutions.find(s =>
    s.userId.toString() === userId.toString()
  )

  // TODO: Implement actual code execution and testing
  // For now, we'll simulate test execution
  const passedTests = Math.random() > 0.3 // 70% success rate for demo
  const pointsEarned = passedTests ? (challenge.difficulty === 'Beginner' ? 25 :
                                       challenge.difficulty === 'Intermediate' ? 50 : 100) : 0

  if (existingSolution) {
    // Update existing solution
    existingSolution.code = code
    existingSolution.submissionDate = new Date()
    existingSolution.passedTests = passedTests
    existingSolution.pointsEarned = pointsEarned
  } else {
    // Add new solution
    challenge.solutions.push({
      id: `solution_${Date.now()}`,
      challengeId: challenge.id,
      userId,
      code,
      submissionDate: new Date(),
      passedTests,
      pointsEarned
    })
  }

  await challenge.save()

  // Award points to user if tests passed and it's a new solution or better score
  if (passedTests && (!existingSolution || !existingSolution.passedTests)) {
    req.user.points += pointsEarned
    await req.user.save()
  }

  res.json({
    message: 'Challenge submitted',
    challengeId: challenge.id,
    passedTests,
    pointsEarned,
    submittedAt: new Date().toISOString()
  })
}))

// GET /api/challenges/:id/solutions - Get user's solutions for challenge
router.get('/:id/solutions', authenticateToken, asyncHandler(async (req, res) => {
  const challenge = await Challenge.findOne({ id: req.params.id })

  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' })
  }

  const userId = req.user._id

  const userSolutions = challenge.solutions.filter(s =>
    s.userId.toString() === userId.toString()
  )

  res.json({
    challengeId: challenge.id,
    solutions: userSolutions
  })
}))

export default router
