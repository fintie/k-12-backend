import express from 'express'
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import { Challenge } from '../models/index.js'
import { authenticateToken } from './auth.js'

const router = express.Router()

const fallbackChallenges = [
  {
    id: 'challenge_1',
    title: 'Even Number Finder',
    description: 'Write a program that prints all even numbers from 1 to 20.',
    language: 'Python',
    starterCode: 'for number in range(1, 21):\n    # Print only even numbers\n    pass',
    testCases: '[{"input":"1-20","expected":"2 4 6 8 10 12 14 16 18 20"}]',
    difficulty: 'Beginner',
    tags: ['loops', 'conditionals']
  },
  {
    id: 'challenge_2',
    title: 'Score Badge',
    description: 'Create a function that returns Bronze, Silver, or Gold based on a point score.',
    language: 'JavaScript',
    starterCode: 'function badgeForScore(points) {\n  // return "Bronze", "Silver", or "Gold"\n}',
    testCases: '[{"input":"35","expected":"Bronze"},{"input":"75","expected":"Silver"},{"input":"120","expected":"Gold"}]',
    difficulty: 'Intermediate',
    tags: ['functions', 'conditionals']
  }
]

const isDatabaseConnected = () => mongoose.connection.readyState === 1

const getFallbackChallenges = ({ language, difficulty, tags, limit = 50, offset = 0 }) => {
  const normalizedOffset = Number.parseInt(offset, 10) || 0
  const normalizedLimit = Number.parseInt(limit, 10) || 50
  const tagList = tags ? tags.split(',') : []

  return fallbackChallenges
    .filter(challenge => !language || challenge.language === language)
    .filter(challenge => !difficulty || challenge.difficulty === difficulty)
    .filter(challenge => tagList.length === 0 || tagList.some(tag => challenge.tags.includes(tag)))
    .slice(normalizedOffset, normalizedOffset + normalizedLimit)
}

// GET /api/challenges - List all challenges
router.get('/', asyncHandler(async (req, res) => {
  const { language, difficulty, tags, limit = 50, offset = 0 } = req.query

  if (!isDatabaseConnected()) {
    return res.json(getFallbackChallenges({ language, difficulty, tags, limit, offset }))
  }

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
  if (!isDatabaseConnected()) {
    const challenge = fallbackChallenges.find(challenge => challenge.id === req.params.id)

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' })
    }

    return res.json(challenge)
  }

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
