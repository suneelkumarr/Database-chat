const express = require('express');
const router = express.Router();

const users = require('../controllers/user.controller');

router.get('/',users.get)
router.post('/create', users.create)
router.put('/:id', users.update)
router.delete('/:id',users.delete)


export default router