import express from 'express'

const router = express.Router()

// Mock challenges database
const mockChallenges = [
  {
    id: 'challenge_1',
    title: 'FizzBuzz',
    description: 'Write a program that prints the numbers from 1 to 100, but for multiples of 3 print Fizz, for multiples of 5 print Buzz, and for multiples of both print FizzBuzz.',
    language: 'Python',
    starterCode: '# Write your solution here\nfor i in range(1, 101):\n    # Your code here\n    pass',
    testCases: '[{"input": "1-10", "expected": "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz"}]',
    difficulty: 'Intermediate',
    solutions: [],
    tags: ['loops', 'conditionals']
  },
  {
    id: 'challenge_2',
    title: 'Palindrome Check',
    description: 'Write a function that checks if a given string is a palindrome.',
    language: 'Python',
    starterCode: 'def is_palindrome(s):\n    # Your code here\n    pass',
    testCases: '[{"input": "racecar", "expected": "True"}, {"input": "hello", "expected": "False"}]',
    difficulty: 'Beginner',
    solutions: [],
    tags: ['strings', 'functions']
  }
]

// GET /api/challenges - List all challenges
router.get('/', (req, res) => {
  try {
    res.status(200).json(mockChallenges)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch challenges', details: error.message })
  }
})

// GET /api/challenges/:id - Get single challenge
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const challenge = mockChallenges.find(c => c.id === id)

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' })
    }

    res.status(200).json(challenge)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch challenge', details: error.message })
  }
})

// POST /api/challenges/:id/submit - Submit challenge solution
router.post('/:id/submit', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const { id } = req.params
    const { code } = req.body

    if (!code) {
      return res.status(400).json({ error: 'Code is required' })
    }

    const challenge = mockChallenges.find(c => c.id === id)

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' })
    }

    // TODO: Execute code and run test cases
    const passedTests = true // Mock result
    const pointsEarned = passedTests ? 50 : 0

    res.status(200).json({
      message: 'Challenge submitted',
      challengeId: id,
      passedTests,
      pointsEarned,
      submittedAt: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit challenge', details: error.message })
  }
})

export default router
