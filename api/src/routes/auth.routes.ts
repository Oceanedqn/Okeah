import { Router } from 'express';
import { logout, login, register } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register)

export { router as authRoutes };