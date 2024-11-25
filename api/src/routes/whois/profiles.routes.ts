import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { get_profile, update_profile, get_profil_by_id } from "../../controllers/whois/profiles.controller";



const router = Router();


router.get('/:id_party', authenticate, get_profile);
router.put('/', authenticate, update_profile)
router.get('/:id_party/:id_user', authenticate, get_profil_by_id)



export { router as profilesRoutes };