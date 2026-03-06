const express = require('express');
const auth = require('../middleware/auth');
const messagesCtrl = require('../controllers/messages');

const router = express.Router();

router.get('/:roomId/messages', auth, messagesCtrl.list);
router.post('/:roomId/messages', auth, messagesCtrl.create);

router.post('/:roomId/read', auth, messagesCtrl.read);

module.exports = router;
