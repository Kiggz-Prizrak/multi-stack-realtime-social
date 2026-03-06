const express = require('express');
const auth = require('../middleware/auth');
const roomsCtrl = require('../controllers/rooms');

const router = express.Router();

router.get('/', auth, roomsCtrl.list);
router.post('/', auth, roomsCtrl.create);

module.exports = router;
