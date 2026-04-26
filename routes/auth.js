import express from 'express'

const router = express.Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }

    // TODO: Implement actual authentication with database
    // For now, return mock response for testing
    const user = {
      id: `user_${Date.now()}`,
      username,
      role: role || 'student',
      email: `${username}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      school: 'Test School',
      grade: '8th Grade',
      preferredDifficulty: 'moderate',
      preferredSubject: 'Algebra'
    }

    const token = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64')

    res.status(200).json({
      user,
      token,
      message: 'Login successful'
    })
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message })
  }
})

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      password,
      role,
      firstName,
      lastName,
      email,
      school,
      grade,
      preferredDifficulty,
      preferredSubject
    } = req.body

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Username, password, and email required' })
    }

    // TODO: Implement actual user creation with database
    // For now, return mock response for testing
    const user = {
      id: `user_${Date.now()}`,
      username,
      email,
      role: role || 'student',
      firstName,
      lastName,
      school,
      grade,
      preferredDifficulty: preferredDifficulty || 'moderate',
      preferredSubject: preferredSubject || 'Algebra'
    }

    const token = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64')

    res.status(201).json({
      user,
      token,
      message: 'Registration successful'
    })
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message })
  }
})

export default router
