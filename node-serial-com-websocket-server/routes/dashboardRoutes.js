import { express } from "../dependencies.js";
import { getData } from '../controllers/dashboardControllers.js'

const router = express.Router();

router.get('/', getData);

export default router;