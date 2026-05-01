const express = require('express');
const { getUsers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, admin, getUsers);

module.exports = router;