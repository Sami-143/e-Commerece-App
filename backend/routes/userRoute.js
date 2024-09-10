const express = require('express')
const {registerUser, loginUser} = require('../controllers/userController.js')

const router = express.Router()

router.route('/register').post(registerUser);
router.route('/loginUser').post(loginUser)

module.exports = router;