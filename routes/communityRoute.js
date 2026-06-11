import express from 'express';
import communityController from '../controllers/communityController.js';
import { isHostMiddleware } from '../middleware/isHostMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create' ,authMiddleware, isHostMiddleware , communityController.createCommunity)
router.get('/all' , communityController.getAllCommunities );
router.get('/hosted',authMiddleware,communityController.getHostedCommunities);
router.get('/specific' , communityController.getSpecificCommunity )
router.get('/with-members' , communityController.getCommunityWithMembers )
router.delete('/:id' , authMiddleware , isHostMiddleware , communityController.deleteCommunity)

export default router