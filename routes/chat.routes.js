import { Router } from 'express';
import * as chatController from '../controllers/chat.controller.js'
const router = Router();

router.post('/', chatController.createChat);
router.get('/:user_id', chatController.findUserChats);
router.get('/find/:first_id/:second_id', chatController.findChat);


export default router;