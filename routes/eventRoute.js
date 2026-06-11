import express from 'express';
import eventController from '../controllers/eventController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { isHostMiddleware } from '../middleware/isHostMiddleware.js';

const router = express.Router();

router.post('/create' ,authMiddleware , isHostMiddleware, eventController.createEvent)
router.get('/all' , eventController.getAllEvents)
router.get('/specific' , eventController.getSpecificEvent)
router.delete('/:id' , authMiddleware , isHostMiddleware , eventController.deleteEvent);


export default router