import { Router } from 'express';
import {createOg} from '../controllers/ogs';

const router = Router();

router.post('/', createOg);

router.get('/');


export default router;