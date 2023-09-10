import { Router } from 'express';
import * as userController from '../controllers/user.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js';
import handleValidationErrors from '../middlewares/handleValidationErrors.js';
import { registerValidation } from '../validators/index.js';
const router = Router();

router.post('/register', handleValidationErrors(registerValidation), userController.create);
router.post('/login', userController.login);
router.get('/auth',authMiddleware, userController.check);
router.get('/get/:id', userController.getUser);
router.get('/', userController.getUsers);

export default router;