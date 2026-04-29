import express from 'express'
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import { Course, Progress } from '../models/index.js'
import { authenticateToken } from './auth.js'

const router = express.Router()

const fallbackCourses = [
  {
    id: 'python-foundations',
    title: 'Python Foundations',
    description: 'Build confidence with variables, conditionals, loops, functions, and small programs.',
    language: 'Python',
    difficulty: 'Beginner',
    imageUrl: null,
    modules: [
      {
        id: 'python-module-1',
        title: 'Getting Started',
        description: 'Write your first Python programs and understand how data moves through code.',
        lessons: [
          {
            id: 'python-lesson-1',
            title: 'Variables and Data Types',
            content: 'Variables store values so you can reuse them. Try creating name = "Ava", age = 12, and is_learning = True, then print each value.',
            type: 'text',
            isCompleted: false
          },
          {
            id: 'python-lesson-2',
            title: 'Conditionals',
            content: 'Conditionals let programs make decisions. Use if, elif, and else to show a different message based on a quiz score.',
            type: 'code',
            isCompleted: false
          }
        ]
      },
      {
        id: 'python-module-2',
        title: 'Loops and Functions',
        description: 'Use repetition and reusable blocks to solve bigger problems.',
        lessons: [
          {
            id: 'python-lesson-3',
            title: 'For Loops',
            content: 'A for loop repeats work over a sequence. Print the numbers 1 through 10, then update the loop to print only even numbers.',
            type: 'code',
            isCompleted: false
          },
          {
            id: 'python-lesson-4',
            title: 'Writing Functions',
            content: 'Functions group steps behind a name. Create a function called calculate_points that returns 10 points for each completed lesson.',
            type: 'code',
            isCompleted: false
          }
        ]
      }
    ]
  },
  {
    id: 'javascript-web-starter',
    title: 'JavaScript Web Starter',
    description: 'Learn how JavaScript powers interactive web pages with events, arrays, and DOM updates.',
    language: 'JavaScript',
    difficulty: 'Beginner',
    imageUrl: null,
    modules: [
      {
        id: 'js-module-1',
        title: 'Interactive Pages',
        description: 'Connect JavaScript to buttons, lists, and page content.',
        lessons: [
          {
            id: 'js-lesson-1',
            title: 'Variables in JavaScript',
            content: 'Use let and const to store values. Build a simple points counter with const lessonName and let points.',
            type: 'text',
            isCompleted: false
          },
          {
            id: 'js-lesson-2',
            title: 'Button Clicks',
            content: 'Use addEventListener to respond when a user clicks a button. Change a heading from "Ready" to "Lesson complete".',
            type: 'code',
            isCompleted: false
          }
        ]
      }
    ]
  },
  {
    id: 'algebra-with-code',
    title: 'Algebra With Code',
    description: 'Practice algebra concepts by turning formulas and patterns into small programs.',
    language: 'Python',
    difficulty: 'Intermediate',
    imageUrl: null,
    modules: [
      {
        id: 'algebra-module-1',
        title: 'Patterns and Equations',
        description: 'Use code to explore sequences, variables, and simple equations.',
        lessons: [
          {
            id: 'algebra-lesson-1',
            title: 'Number Patterns',
            content: 'Generate arithmetic sequences with code. Start at 3, add 4 each time, and print the first 8 terms.',
            type: 'code',
            isCompleted: false
          },
          {
            id: 'algebra-lesson-2',
            title: 'Solving for x',
            content: 'Represent equations as code. If 3x + 4 = 19, use Python to test values for x until the equation is true.',
            type: 'code',
            isCompleted: false
          }
        ]
      }
    ]
  },
  {
    id: 'swift-app-starter',
    title: 'Swift App Starter',
    description: 'Create your first iOS-style app screens while learning Swift variables, views, and state.',
    language: 'Swift',
    difficulty: 'Beginner',
    imageUrl: null,
    modules: [
      {
        id: 'swift-module-1',
        title: 'Swift Basics',
        description: 'Learn the Swift building blocks that power simple apps.',
        lessons: [
          {
            id: 'swift-lesson-1',
            title: 'Constants and Variables',
            content: 'Use let for values that stay the same and var for values that change. Create a lessonTitle constant and a score variable.',
            type: 'text',
            isCompleted: false
          },
          {
            id: 'swift-lesson-2',
            title: 'Simple Views',
            content: 'Build a VStack with a title, subtitle, and button. Change the button text to match your learning goal.',
            type: 'code',
            isCompleted: false
          }
        ]
      },
      {
        id: 'swift-module-2',
        title: 'State and Interaction',
        description: 'Make a screen respond when a learner taps a button.',
        lessons: [
          {
            id: 'swift-lesson-3',
            title: 'Using State',
            content: 'Use @State to track whether a lesson is complete. Toggle the value when the learner taps a button.',
            type: 'code',
            isCompleted: false
          }
        ]
      }
    ]
  },
  {
    id: 'data-detectives',
    title: 'Data Detectives',
    description: 'Use code to collect, sort, and interpret small data sets like a real analyst.',
    language: 'Python',
    difficulty: 'Intermediate',
    imageUrl: null,
    modules: [
      {
        id: 'data-module-1',
        title: 'Lists and Averages',
        description: 'Store data in lists and calculate useful summaries.',
        lessons: [
          {
            id: 'data-lesson-1',
            title: 'Working With Lists',
            content: 'Create a list of quiz scores, print the highest score, and count how many scores are above 80.',
            type: 'code',
            isCompleted: false
          },
          {
            id: 'data-lesson-2',
            title: 'Mean, Min, and Max',
            content: 'Use sum, len, min, and max to summarize data. Explain what each number tells you about the class.',
            type: 'code',
            isCompleted: false
          }
        ]
      },
      {
        id: 'data-module-2',
        title: 'Finding Patterns',
        description: 'Use loops and conditions to spot trends in data.',
        lessons: [
          {
            id: 'data-lesson-3',
            title: 'Trend Flags',
            content: 'Loop through daily step counts and print a message when a day beats the weekly average.',
            type: 'code',
            isCompleted: false
          }
        ]
      }
    ]
  },
  {
    id: 'creative-web-lab',
    title: 'Creative Web Lab',
    description: 'Design interactive browser projects with HTML, CSS, and JavaScript.',
    language: 'HTML/CSS/JavaScript',
    difficulty: 'Beginner',
    imageUrl: null,
    modules: [
      {
        id: 'web-module-1',
        title: 'Build a Learning Card',
        description: 'Create a polished card that presents a topic, progress, and action button.',
        lessons: [
          {
            id: 'web-lesson-1',
            title: 'HTML Structure',
            content: 'Use semantic HTML to build a card with a heading, description, tag, and button.',
            type: 'text',
            isCompleted: false
          },
          {
            id: 'web-lesson-2',
            title: 'CSS Styling',
            content: 'Add spacing, color, border radius, and hover states so the card feels interactive.',
            type: 'code',
            isCompleted: false
          },
          {
            id: 'web-lesson-3',
            title: 'JavaScript Progress',
            content: 'Use JavaScript to update a progress label when the learner clicks the button.',
            type: 'code',
            isCompleted: false
          }
        ]
      }
    ]
  }
]

const isDatabaseConnected = () => mongoose.connection.readyState === 1

const getFallbackCourses = ({ language, difficulty, limit = 50, offset = 0 }) => {
  const normalizedOffset = Number.parseInt(offset, 10) || 0
  const normalizedLimit = Number.parseInt(limit, 10) || 50

  return fallbackCourses
    .filter(course => !language || course.language === language)
    .filter(course => !difficulty || course.difficulty === difficulty)
    .slice(normalizedOffset, normalizedOffset + normalizedLimit)
}

// GET /api/courses - List all courses
router.get('/', asyncHandler(async (req, res) => {
  const { language, difficulty, limit = 50, offset = 0 } = req.query

  if (!isDatabaseConnected()) {
    return res.json(getFallbackCourses({ language, difficulty, limit, offset }))
  }

  let query = {}

  if (language) query.language = language
  if (difficulty) query.difficulty = difficulty

  const courses = await Course.find(query)
    .select('-enrolledUsers') // Don't include enrolled users in list
    .limit(parseInt(limit))
    .skip(parseInt(offset))
    .sort({ createdAt: -1 })

  res.json(courses)
}))

// GET /api/courses/:id - Get single course
router.get('/:id', asyncHandler(async (req, res) => {
  if (!isDatabaseConnected()) {
    const course = fallbackCourses.find(course => course.id === req.params.id)

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    return res.json(course)
  }

  const course = await Course.findOne({ id: req.params.id })

  if (!course) {
    return res.status(404).json({ error: 'Course not found' })
  }

  res.json(course)
}))

// POST /api/courses/:id/enroll - Enroll in course
router.post('/:id/enroll', authenticateToken, asyncHandler(async (req, res) => {
  const course = await Course.findOne({ id: req.params.id })

  if (!course) {
    return res.status(404).json({ error: 'Course not found' })
  }

  const userId = req.user._id

  // Check if user is already enrolled
  if (course.enrolledUsers.includes(userId)) {
    return res.status(400).json({ error: 'Already enrolled in this course' })
  }

  // Add user to enrolled users
  course.enrolledUsers.push(userId)
  await course.save()

  res.json({
    message: 'Enrolled in course successfully',
    courseId: course.id,
    enrolledAt: new Date().toISOString()
  })
}))

// GET /api/courses/enrolled - Get user's enrolled courses
router.get('/enrolled/me', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user._id

  const courses = await Course.find({ enrolledUsers: userId })
    .select('-enrolledUsers') // Don't include other enrolled users

  res.json(courses)
}))

// GET /api/courses/:id/progress - Get user's progress in course
router.get('/:id/progress', authenticateToken, asyncHandler(async (req, res) => {
  const course = await Course.findOne({ id: req.params.id })

  if (!course) {
    return res.status(404).json({ error: 'Course not found' })
  }

  const userId = req.user._id

  // Check if user is enrolled
  if (!course.enrolledUsers.includes(userId)) {
    return res.status(403).json({ error: 'Not enrolled in this course' })
  }

  // Get progress for all lessons in the course
  const lessonIds = course.modules.flatMap(module =>
    module.lessons.map(lesson => lesson.id)
  )

  const progressRecords = await Progress.find({
    userId,
    lessonId: { $in: lessonIds }
  })

  const progressMap = {}
  progressRecords.forEach(record => {
    progressMap[record.lessonId] = {
      completed: record.completed,
      completedAt: record.completedAt
    }
  })

  // Calculate overall progress
  const totalLessons = lessonIds.length
  const completedLessons = progressRecords.filter(p => p.completed).length
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  res.json({
    courseId: course.id,
    totalLessons,
    completedLessons,
    progressPercentage: Math.round(progressPercentage),
    lessonProgress: progressMap
  })
}))

export default router
