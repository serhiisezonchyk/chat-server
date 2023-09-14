import { Router } from 'express';
import * as chatController from '../controllers/chat.controller.js'
import checkAuth from '../middlewares/checkAuth.js';
const router = Router();

router.post('/', checkAuth, chatController.createChat);
router.get('/:user_id', checkAuth, chatController.findUserChats);
router.get('/find/:sender_id/:recipient_id', checkAuth, chatController.findChat);


export default router;