import express from 'express'

const router = express.Router()

// Mock user database
const users = {}

// GET /api/users/me - Get current user profile
router.get('/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // TODO: Verify token and get user from database
    const decodedToken = JSON.parse(Buffer.from(token, 'base64').toString())

    // Mock user response
    const user = {
      id: decodedToken.userId,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      school: 'Test School',
      grade: '8th Grade',
      bio: 'A student profile',
      profilePictureURL: null,
      completedCourses: ['course_1', 'course_2'],
      achievements: ['achievement_1'],
      points: 150,
      preferredDifficulty: 'moderate',
      preferredSubject: 'Algebra'
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', details: error.message })
  }
})

// PUT /api/users/me - Update current user profile
router.put('/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const { firstName, lastName, email, bio, school, grade, preferredDifficulty, preferredSubject } = req.body

    // TODO: Verify token, update user in database
    const decodedToken = JSON.parse(Buffer.from(token, 'base64').toString())

    // Mock updated user response
    const updatedUser = {
      id: decodedToken.userId,
      username: 'testuser',
      email: email || 'test@example.com',
      firstName: firstName || 'Test',
      lastName: lastName || 'User',
      school: school || 'Test School',
      grade: grade || '8th Grade',
      bio: bio || 'A student profile',
      profilePictureURL: null,
      completedCourses: ['course_1', 'course_2'],
      achievements: ['achievement_1'],
      points: 150,
      preferredDifficulty: preferredDifficulty || 'moderate',
      preferredSubject: preferredSubject || 'Algebra'
    }

    res.status(200).json({
      user: updatedUser,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user', details: error.message })
  }
})

export default router
