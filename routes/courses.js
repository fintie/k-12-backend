import express from 'express'

const router = express.Router()

// Mock courses database
const mockCourses = [
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

// GET /api/courses - List all courses
router.get('/', (req, res) => {
  try {
    res.status(200).json(mockCourses)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses', details: error.message })
  }
})

// GET /api/courses/:id - Get single course
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const course = mockCourses.find(c => c.id === id)

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    res.status(200).json(course)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course', details: error.message })
  }
})

// POST /api/courses/:id/enroll - Enroll in course
router.post('/:id/enroll', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const { id } = req.params
    const course = mockCourses.find(c => c.id === id)

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    // TODO: Add user to course enrollment in database
    res.status(200).json({
      message: 'Enrolled in course successfully',
      courseId: id,
      enrolledAt: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: 'Enrollment failed', details: error.message })
  }
})

export default router
