import jwt from 'jsonwebtoken';
import Student from '../models/student.model.js';
import Mentor from '../models/mentor.model.js';
import Admin from '../models/admin.model.js';

// Middleware to authenticate JWT tokens
export const authenticateToken = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // If no token is provided
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      // Find the user from token data
      let userModel;
      switch (user.role) {
        case 'student':
          userModel = await Student.findById(user.id);
          break;
        case 'mentor': 
          userModel = await Mentor.findById(user.id);
          break;
        case 'admin':
          userModel = await Admin.findById(user.id);
          break;
        default:
          return res.status(403).json({ error: 'Invalid user role' });
      }

      if (!userModel) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Add user data to request
      req.userId = user.id;
      req.userRole = user.role;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Middleware for student-only routes
export const isStudent = (req, res, next) => {
  if (req.userRole !== 'student') {
    return res.status(403).json({ error: 'Access denied. Student permission required.' });
  }
  next();
};

// Middleware for mentor-only routes
export const isMentor = (req, res, next) => {
  if (req.userRole !== 'mentor') {
    return res.status(403).json({ error: 'Access denied. Mentor permission required.' });
  }
  next();
};

// Middleware for admin-only routes
export const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin permission required.' });
  }
  next();
}; 