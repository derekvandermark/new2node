import { get_home, get_references, get_test } from "../controllers/staticController";
import Router from "./router";

const router = new Router();

// home
router.get('/', get_home);

router.get('/test', get_test);

router.get('/references', get_references);

export default router;

