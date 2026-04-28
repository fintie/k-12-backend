import express from 'express'
import { body, validationResult } from 'express-validator'
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import { Post } from '../models/index.js'
import { authenticateToken } from './auth.js'

const router = express.Router()

const fallbackPosts = [
  {
    id: 'post_1',
    userId: 'community_user_1',
    username: 'maya_student',
    content: 'I finished the Python variables lesson today. The trick that helped me was saying the variable name out loud before choosing what value it should hold.',
    postDate: new Date('2026-04-24T09:30:00.000Z'),
    likes: ['community_user_2', 'community_user_3'],
    comments: [
      {
        id: 'comment_1',
        postId: 'post_1',
        userId: 'community_user_2',
        username: 'leo_tutor',
        content: 'That is a great debugging habit. Clear names make code much easier to read.',
        commentDate: new Date('2026-04-24T10:10:00.000Z')
      }
    ],
    codeSnippet: 'name = "Maya"\npoints = 20\nprint(f"{name} has {points} points")'
  },
  {
    id: 'post_2',
    userId: 'community_user_3',
    username: 'sam_codes',
    content: 'Button click events finally clicked for me. I made a tiny page that updates the lesson status without refreshing.',
    postDate: new Date('2026-04-23T15:45:00.000Z'),
    likes: ['community_user_1'],
    comments: [],
    codeSnippet: 'button.addEventListener("click", () => {\n  status.textContent = "Lesson complete";\n});'
  },
  {
    id: 'post_3',
    userId: 'community_user_4',
    username: 'aisha_math',
    content: 'Using Python to test values for x made algebra feel less mysterious. It is basically a very patient calculator.',
    postDate: new Date('2026-04-22T12:20:00.000Z'),
    likes: ['community_user_1', 'community_user_2'],
    comments: [
      {
        id: 'comment_2',
        postId: 'post_3',
        userId: 'community_user_5',
        username: 'nora_teacher',
        content: 'Exactly. Code is a powerful way to experiment with math ideas quickly.',
        commentDate: new Date('2026-04-22T13:05:00.000Z')
      }
    ],
    codeSnippet: 'for x in range(10):\n    if 3 * x + 4 == 19:\n        print(x)'
  }
]

const isDatabaseConnected = () => mongoose.connection.readyState === 1

const getFallbackPosts = ({ limit = 50, offset = 0 }) => {
  const normalizedOffset = Number.parseInt(offset, 10) || 0
  const normalizedLimit = Number.parseInt(limit, 10) || 50

  return fallbackPosts
    .sort((a, b) => new Date(b.postDate) - new Date(a.postDate))
    .slice(normalizedOffset, normalizedOffset + normalizedLimit)
}

// GET /api/posts - List all posts
router.get('/', asyncHandler(async (req, res) => {
  const { limit = 50, offset = 0 } = req.query

  if (!isDatabaseConnected()) {
    return res.json(getFallbackPosts({ limit, offset }))
  }

  const posts = await Post.find({})
    .populate('userId', 'username firstName lastName')
    .populate('likes', 'username')
    .populate('comments.userId', 'username')
    .sort({ postDate: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(offset))

  res.json(posts)
}))

// POST /api/posts - Create new post
router.post('/', authenticateToken, [
  body('content').notEmpty().withMessage('Content is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { content, codeSnippet } = req.body

  const post = new Post({
    id: `post_${Date.now()}`,
    userId: req.user._id,
    username: req.user.username,
    content,
    postDate: new Date(),
    likes: [],
    comments: [],
    codeSnippet: codeSnippet || null
  })

  await post.save()

  // Populate user data for response
  await post.populate('userId', 'username firstName lastName')

  res.status(201).json({
    message: 'Post created successfully',
    post
  })
}))

// GET /api/posts/:id - Get single post
router.get('/:id', asyncHandler(async (req, res) => {
  if (!isDatabaseConnected()) {
    const post = fallbackPosts.find(post => post.id === req.params.id)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    return res.json(post)
  }

  const post = await Post.findOne({ id: req.params.id })
    .populate('userId', 'username firstName lastName')
    .populate('likes', 'username')
    .populate('comments.userId', 'username')

  if (!post) {
    return res.status(404).json({ error: 'Post not found' })
  }

  res.json(post)
}))

// POST /api/posts/:id/like - Like/unlike a post
router.post('/:id/like', authenticateToken, asyncHandler(async (req, res) => {
  const post = await Post.findOne({ id: req.params.id })

  if (!post) {
    return res.status(404).json({ error: 'Post not found' })
  }

  const userId = req.user._id
  const userIdStr = userId.toString()
  const likeIndex = post.likes.findIndex(id => id.toString() === userIdStr)

  let liked = false
  if (likeIndex === -1) {
    // Add like
    post.likes.push(userId)
    liked = true
  } else {
    // Remove like
    post.likes.splice(likeIndex, 1)
  }

  await post.save()

  res.json({
    message: liked ? 'Post liked' : 'Post unliked',
    postId: post.id,
    likesCount: post.likes.length,
    liked
  })
}))

// POST /api/posts/:id/comment - Add comment to post
router.post('/:id/comment', authenticateToken, [
  body('content').notEmpty().withMessage('Comment content is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const post = await Post.findOne({ id: req.params.id })

  if (!post) {
    return res.status(404).json({ error: 'Post not found' })
  }

  const { content } = req.body

  const comment = {
    id: `comment_${Date.now()}`,
    postId: post.id,
    userId: req.user._id,
    username: req.user.username,
    content,
    commentDate: new Date()
  }

  post.comments.push(comment)
  await post.save()

  res.status(201).json({
    message: 'Comment added',
    comment
  })
}))

export default router
