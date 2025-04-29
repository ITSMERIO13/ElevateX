import express from 'express';
import Comment from '../models/Comment.model.js';

const router = express.Router();

// GET comments for a project
router.get('/:projectId', async (req, res) => {
  try {
    const comments = await Comment.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

// POST a new comment
router.post('/', async (req, res) => {
  const { projectId, userName, profilePic, text,userEmail } = req.body;
    
  if (!projectId || !userName || !text || !userEmail) {
    return res.status(400).json({ message: 'Project ID, user name, and text are required' });
  }

  try {
    const newComment = new Comment({ projectId, userName, profilePic, text,userEmail });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).json({ message: 'Failed to post comment' });
  }
});
router.delete('/:id', async (req, res) => {
    try {
      const deleted = await Comment.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Comment not found' });
  
      res.status(200).json({ message: 'Comment deleted successfully', id: req.params.id });
    } catch (err) {
      console.error('Delete error:', err);
      res.status(500).json({ message: 'Error deleting comment' });
    }
  });
  
export default router;
