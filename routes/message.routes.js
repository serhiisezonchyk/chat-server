import { Router } from 'express';
import * as messageController from '../controllers/message.controller.js'
const router = Router();

router.post('/', messageController.createMessage);
router.get('/:chat_id', messageController.getMessages);


export default router;