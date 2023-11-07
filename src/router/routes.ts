import { get_home, get_test } from "../controllers/staticController";
import Router from "./router";

const router = new Router();

// home
router.get('/', get_home);

router.get('/test', get_test);

export default router;

