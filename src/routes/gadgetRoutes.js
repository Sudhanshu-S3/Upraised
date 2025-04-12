const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const validation = require('../middleware/validation');
const { getGadgets, addGadget, updateGadget, deleteGadget, selfDestructGadget, generateSelfDestructCode } = require('../controllers/gadgetController');

// Gadget inventory management endpoints
router.get('/', auth.authenticate, getGadgets);
router.post('/', auth.authenticate, auth.authorize('admin'), validation.validateGadget, addGadget);
router.patch('/:id', auth.authenticate, auth.authorize('admin'), validation.validateGadgetId, validation.validateGadget, updateGadget);
router.delete('/:id', auth.authenticate, auth.authorize('admin'), validation.validateGadgetId, deleteGadget);

// Self-destruct functionality
router.get('/:id/self-destruct', auth.authenticate, validation.validateGadgetId, generateSelfDestructCode);
router.post('/:id/self-destruct', auth.authenticate, validation.validateGadgetId, validation.validateSelfDestruct, selfDestructGadget);

module.exports = router;