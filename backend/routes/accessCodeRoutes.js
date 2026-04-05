import express from 'express';
import { createAccessCode, validateAccessCode, getAccessCodes, deleteAccessCode, updateAccessCode } from '../controllers/accessCodeController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, isAdmin, createAccessCode);
router.post('/validate', validateAccessCode);
router.get('/', protect, isAdmin, getAccessCodes);
router.delete('/:id', protect, isAdmin, deleteAccessCode);
router.put('/:id', protect, isAdmin, updateAccessCode);

export default router;