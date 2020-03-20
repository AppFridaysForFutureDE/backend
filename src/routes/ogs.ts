import { Router } from 'express';
import {createOg, getOgs} from '../controllers/ogs';

const router = Router();

router.post('/', createOg);
router.get('/', getOgs);


export default router;
