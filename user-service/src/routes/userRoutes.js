const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { registerUser, loginUser, getMyProfile } = require('../controllers/userController');

// POST /api/users/register
router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', authenticate, getMyProfile);

module.exports = router;
