const express = require('express')
const {registeruser} = require('../controllers/userController.js')

const router = express().Router()

router.route('/register').post(registeruser)


export default router