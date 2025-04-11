const router = require('express').Router();
const { getG, addG, updateG, deleteG, selfDestructG, genSelfDestructG } = require('../controllers/gadgetController');

router.get('/', getG);
router.post('/', addG);
router.put('/:id', updateG);
router.delete('/:id', deleteG);

router.get('/:id/selfdestruct', genSelfDestructG);
router.post('/:id/selfdestruct', selfDestructG);


module.exports = router;