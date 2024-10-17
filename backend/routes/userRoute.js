const express = require('express')
const {registerUser, loginUser, logout,forgotPassword} = require('../controllers/userController.js')

const router = express.Router()

router.route('/register').post(registerUser);
router.route('/loginUser').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/logout').get(logout);

module.exports = router;