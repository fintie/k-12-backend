import express from 'express'

const router = express.Router()

// Mock lessons database
const mockLessons = [
  {
    id: 'lesson_1',
    title: 'Variables and Data Types',
    content: 'In Python, a variable is a named container that holds a value...',
    type: 'text',
    isCompleted: false
  },
  {
    id: 'lesson_2',
    title: 'Control Structures',
    content: 'Control structures allow you to direct the flow of your program...',
    type: 'text',
    isCompleted: false
  },
  {
    id: 'lesson_3',
    title: 'Functions in Python',
    content: 'Functions are reusable blocks of code that perform specific tasks...',
    type: 'code',
    isCompleted: false
  }
]

// GET /api/lessons - List all lessons
router.get('/', (req, res) => {
  try {
    res.status(200).json(mockLessons)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lessons', details: error.message })
  }
})

// GET /api/lessons/:id - Get single lesson
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const lesson = mockLessons.find(l => l.id === id)

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' })
    }

    res.status(200).json(lesson)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lesson', details: error.message })
  }
})

// POST /api/lessons/:id/complete - Mark lesson as complete
router.post('/:id/complete', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const { id } = req.params
    const lesson = mockLessons.find(l => l.id === id)

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' })
    }

    // TODO: Record lesson completion in database
    res.status(200).json({
      message: 'Lesson marked as complete',
      lessonId: id,
      completedAt: new Date().toISOString(),
      pointsEarned: 10
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete lesson', details: error.message })
  }
})

export default router
