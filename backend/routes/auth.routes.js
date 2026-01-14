import express from 'express';
import { register, login, getMe, forgotPassword, resetPassword, verifyEmail, googleLogin, updatePassword } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', protect, register); // Protected for admin-only (logic inside controller)
router.post('/login', login);
router.post('/google', googleLogin);
router.put('/password', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/verifyemail/:token', verifyEmail);
router.get('/me', protect, getMe);

export default router;
