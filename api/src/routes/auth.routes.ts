import { Router } from 'express';
import { logout, login } from '../controllers/login.controller';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);

export { router as authRoutes };