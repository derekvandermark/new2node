import { get_home } from "../controllers/staticController";
import Router from "../router";

const router = new Router();

// home
router.get('/', get_home);

export default router;

