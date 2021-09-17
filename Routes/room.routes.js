const express = require('express');
const router = express.Router();

const rooms = require('../controllers/room.controller');

router.get('/', rooms.get)
router.post('/create', rooms.create)
router.put('/:id', rooms.update)
router.delete('/:id',rooms.delete)


export default router