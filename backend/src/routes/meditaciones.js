const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getSeries, getFeedback, postFeedback } = require('../controllers/meditacionesController');

router.get('/series', getSeries);
router.get('/:id/feedback', getFeedback);
router.post('/:id/feedback', verifyToken, postFeedback);

module.exports = router;
