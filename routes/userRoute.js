import express from 'express';
import userController from '../controllers/userController.js'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { isMemberMiddleware } from '../middleware/isMemberMiddleware.js';
import { isHostMiddleware } from '../middleware/isHostMiddleware.js';
import uploadProfilePic from '../config/multer.js';

const router = express.Router();

router.post('/register' , userController.register)
router.post('/login' , userController.login)
router.patch('/join-community'  , authMiddleware , userController.joinCommunity)
router.patch('/make-host', authMiddleware , userController.makeHost)
router.get('/me' ,authMiddleware,userController.profile)
router.patch('/leave-community/:id' , authMiddleware , userController.leaveCommunity)

router.get('/dashboard' , authMiddleware ,isMemberMiddleware, userController.dashboard)
router.get('/host/dashboard' , authMiddleware ,isHostMiddleware, userController.hostDashboard)
router.patch('/toggleRSVP' , authMiddleware , userController.toggleRSVP)
router.get('/logout' , authMiddleware , userController.logout)

router.patch('/upload-profile-pic',authMiddleware ,uploadProfilePic.single('profilePic'), userController.uploadProfilePic)

export default router