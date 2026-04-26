import express from 'express'

const router = express.Router()

// Mock posts database
let mockPosts = [
  {
    id: 'post_1',
    userId: 'user_1',
    username: 'alex_student',
    content: 'Just completed the Python basics course! Feeling great about my progress.',
    postDate: new Date('2026-04-20'),
    likes: ['user_2', 'user_3'],
    comments: [
      {
        id: 'comment_1',
        postId: 'post_1',
        userId: 'user_2',
        username: 'jamie_tutor',
        content: 'Congratulations! Keep up the great work!',
        commentDate: new Date('2026-04-20')
      }
    ],
    codeSnippet: null
  },
  {
    id: 'post_2',
    userId: 'user_3',
    username: 'chris_dev',
    content: 'Sharing a FizzBuzz solution I just worked on:',
    postDate: new Date('2026-04-19'),
    likes: ['user_1', 'user_4'],
    comments: [],
    codeSnippet: 'for i in range(1, 101):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)'
  }
]

// GET /api/posts - List all posts
router.get('/', (req, res) => {
  try {
    const sortedPosts = [...mockPosts].sort((a, b) => new Date(b.postDate) - new Date(a.postDate))
    res.status(200).json(sortedPosts)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts', details: error.message })
  }
})

// POST /api/posts - Create new post
router.post('/', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const { content, codeSnippet } = req.body

    if (!content) {
      return res.status(400).json({ error: 'Content is required' })
    }

    // TODO: Get actual user from token
    const newPost = {
      id: `post_${Date.now()}`,
      userId: 'user_1',
      username: 'testuser',
      content,
      postDate: new Date(),
      likes: [],
      comments: [],
      codeSnippet: codeSnippet || null
    }

    mockPosts.push(newPost)

    res.status(201).json({
      message: 'Post created successfully',
      post: newPost
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post', details: error.message })
  }
})

// GET /api/posts/:id - Get single post
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const post = mockPosts.find(p => p.id === id)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    res.status(200).json(post)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post', details: error.message })
  }
})

// POST /api/posts/:id/like - Like a post
router.post('/:id/like', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const { id } = req.params
    const post = mockPosts.find(p => p.id === id)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    // TODO: Get actual user from token
    const userId = 'user_1'

    if (!post.likes.includes(userId)) {
      post.likes.push(userId)
    }

    res.status(200).json({
      message: 'Post liked',
      postId: id,
      likesCount: post.likes.length
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to like post', details: error.message })
  }
})

// POST /api/posts/:id/comment - Add comment to post
router.post('/:id/comment', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const { id } = req.params
    const { content } = req.body

    if (!content) {
      return res.status(400).json({ error: 'Comment content is required' })
    }

    const post = mockPosts.find(p => p.id === id)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    // TODO: Get actual user from token
    const comment = {
      id: `comment_${Date.now()}`,
      postId: id,
      userId: 'user_1',
      username: 'testuser',
      content,
      commentDate: new Date()
    }

    post.comments.push(comment)

    res.status(201).json({
      message: 'Comment added',
      comment
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment', details: error.message })
  }
})

export default router
