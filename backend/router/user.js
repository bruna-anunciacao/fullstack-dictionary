const express = require('express');
const { getUsers, createUser, loginUser } =  require('../controllers/UsersController.js');

const router = express.Router();

router.get('/', getUsers);
router.post('/signup', createUser);
router.post('/signin', loginUser);

module.exports = router;