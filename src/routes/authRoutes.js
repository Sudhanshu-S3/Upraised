const router = require('express').Router();
const { registerUser, loginUser, getUserProfile, getAllUsers } = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticate, getUserProfile);
router.get('/admin/users', authenticate, authorize(['admin']), getAllUsers);

module.exports = router;
