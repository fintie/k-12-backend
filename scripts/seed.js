import mongoose from 'mongoose'
import { User, Course, Challenge, Post } from '../models/index.js'
import connectDB from '../config/database.js'
import dotenv from 'dotenv'

dotenv.config()

const seedData = async () => {
  try {
    await connectDB()
    console.log('Connected to database for seeding...')

    // Clear existing data
    await User.deleteMany({})
    await Course.deleteMany({})
    await Challenge.deleteMany({})
    await Post.deleteMany({})
    console.log('Cleared existing data...')

    // Create sample users
    const users = await User.create([
      {
        username: 'alex_student',
        email: 'alex@example.com',
        password: '$2a$10$hashedpassword1', // password: 'password123'
        firstName: 'Alex',
        lastName: 'Johnson',
        school: 'Lincoln High School',
        grade: '10th Grade',
        bio: 'Passionate about learning Python and web development!',
        preferredDifficulty: 'moderate',
        preferredSubject: 'Python',
        role: 'student',
        points: 150,
        achievements: ['first_lesson', 'python_basics']
      },
      {
        username: 'jamie_tutor',
        email: 'jamie@example.com',
        password: '$2a$10$hashedpassword2', // password: 'password123'
        firstName: 'Jamie',
        lastName: 'Smith',
        school: 'Tech University',
        grade: 'College',
        bio: 'Experienced tutor specializing in programming fundamentals.',
        preferredDifficulty: 'moderate',
        preferredSubject: 'JavaScript',
        role: 'tutor',
        points: 500,
        achievements: ['top_tutor', 'challenge_master']
      }
    ])
    console.log('Created sample users...')

    // Create sample courses
    const courses = await Course.create([
      {
        id: 'course_python_basics',
        title: 'Python Basics',
        description: 'Learn the fundamentals of Python programming from variables to functions.',
        language: 'Python',
        difficulty: 'Beginner',
        imageUrl: 'https://example.com/python-basics.jpg',
        modules: [
          {
            id: 'module_variables',
            title: 'Variables and Data Types',
            description: 'Understanding variables, strings, numbers, and booleans',
            lessons: [
              {
                id: 'lesson_variables_intro',
                title: 'Introduction to Variables',
                content: 'Variables are containers for storing data values. In Python, you don\'t need to declare variables with any particular type.',
                type: 'text',
                isCompleted: false
              },
              {
                id: 'lesson_data_types',
                title: 'Data Types',
                content: 'Python has several built-in data types including strings, integers, floats, and booleans.',
                type: 'text',
                isCompleted: false
              }
            ]
          },
          {
            id: 'module_control_flow',
            title: 'Control Flow',
            description: 'Learn about conditional statements and loops',
            lessons: [
              {
                id: 'lesson_if_statements',
                title: 'If Statements',
                content: 'If statements allow you to execute code based on conditions.',
                type: 'text',
                isCompleted: false
              }
            ]
          }
        ],
        enrolledUsers: [users[0]._id]
      },
      {
        id: 'course_javascript_intermediate',
        title: 'Intermediate JavaScript',
        description: 'Take your JavaScript skills to the next level with advanced concepts.',
        language: 'JavaScript',
        difficulty: 'Intermediate',
        imageUrl: 'https://example.com/js-intermediate.jpg',
        modules: [],
        enrolledUsers: []
      }
    ])
    console.log('Created sample courses...')

    // Create sample challenges
    await Challenge.create([
      {
        id: 'challenge_fizzbuzz',
        title: 'FizzBuzz',
        description: 'Write a program that prints the numbers from 1 to 100. For multiples of 3, print "Fizz" instead of the number. For multiples of 5, print "Buzz". For numbers which are multiples of both 3 and 5, print "FizzBuzz".',
        language: 'Python',
        starterCode: '# Write your solution here\nfor i in range(1, 101):\n    # Your code here\n    pass',
        testCases: '[{"input": "1-10", "expected": "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz"}]',
        difficulty: 'Intermediate',
        solutions: [],
        tags: ['loops', 'conditionals', 'beginner-friendly']
      },
      {
        id: 'challenge_palindrome',
        title: 'Palindrome Checker',
        description: 'Write a function that checks if a given string is a palindrome (reads the same forwards and backwards).',
        language: 'Python',
        starterCode: 'def is_palindrome(s):\n    # Write your solution here\n    pass',
        testCases: '[{"input": "racecar", "expected": "True"}, {"input": "hello", "expected": "False"}, {"input": "A man a plan a canal Panama", "expected": "True"}]',
        difficulty: 'Beginner',
        solutions: [],
        tags: ['strings', 'functions', 'logic']
      }
    ])
    console.log('Created sample challenges...')

    // Create sample posts
    await Post.create([
      {
        id: 'post_python_complete',
        userId: users[0]._id,
        username: users[0].username,
        content: 'Just completed the Python basics course! Feeling great about my progress. The variables and data types module was really helpful.',
        postDate: new Date('2024-01-20'),
        likes: [users[1]._id],
        comments: [
          {
            id: 'comment_congrats',
            postId: 'post_python_complete',
            userId: users[1]._id,
            username: users[1].username,
            content: 'Congratulations! Keep up the great work! Have you tried the intermediate course yet?',
            commentDate: new Date('2024-01-20')
          }
        ],
        codeSnippet: null
      },
      {
        id: 'post_fizzbuzz_solution',
        userId: users[1]._id,
        username: users[1].username,
        content: 'Sharing a clean FizzBuzz solution I just worked on. What do you think?',
        postDate: new Date('2024-01-19'),
        likes: [users[0]._id],
        comments: [],
        codeSnippet: 'for i in range(1, 101):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)'
      }
    ])
    console.log('Created sample posts...')

    console.log('Database seeded successfully!')
    console.log('Sample data created:')
    console.log(`- ${users.length} users`)
    console.log(`- ${courses.length} courses`)
    console.log('- 2 challenges')
    console.log('- 2 posts')

  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await mongoose.connection.close()
    console.log('Database connection closed.')
  }
}

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData()
}

export default seedData
