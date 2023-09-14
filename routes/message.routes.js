import { Router } from 'express';
import * as messageController from '../controllers/message.controller.js'
import checkAuth from '../middlewares/checkAuth.js';
const router = Router();

router.post('/', checkAuth, messageController.createMessage);
router.get('/:chat_id', checkAuth, messageController.getMessages);
router.get('/latest/:chat_id', checkAuth, messageController.getLatestMessage);


export default router;