import { authenticate } from "../middlewares/authenticate";
import { getMe } from "../controllers/users.controller";
import { Router } from "express";



const router = Router();


router.get('/me', authenticate, getMe);


export { router as usersRoutes };