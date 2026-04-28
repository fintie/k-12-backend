import express from 'express'
import { body, validationResult } from 'express-validator'
import asyncHandler from 'express-async-handler'
import { Post } from '../models/index.js'
import { authenticateToken } from './auth.js'

const router = express.Router()

// GET /api/posts - List all posts
router.get('/', asyncHandler(async (req, res) => {
  const { limit = 50, offset = 0 } = req.query

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
