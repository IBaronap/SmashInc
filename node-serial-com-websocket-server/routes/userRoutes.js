import { express } from "../dependencies.js";
import { postUserData, getUsers, postInteractionData } from '../controllers/userControllers.js'

const router = express.Router();

router.post('/', postUserData);
router.post('/interaction', postInteractionData);
router.get('/', getUsers);

export default router;