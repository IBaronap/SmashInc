import { express } from "../dependencies.js";
import { postUserData, getUsers } from '../controllers/userControllers.js'

const router = express.Router();

router.post('/', postUserData);
router.get('/', getUsers);

export default router;