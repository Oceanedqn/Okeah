import { Router } from 'express';
import { logout, login, register, resetPasswordRequest, resetPassword } from '../controllers/auth.controller';
import { authenticateResetPasswordToken } from '../middlewares/authenticate';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register)
router.post('/reset-password-request', resetPasswordRequest);
router.post('/reset-password', authenticateResetPasswordToken, resetPassword);

export { router as authRoutes };