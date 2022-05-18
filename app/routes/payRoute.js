const express = require('express')
const router = express.Router()
const {auth, pay,toyo} = require('../controllers/payController.js');
const {verification} = require('../middleware/token.js')

  router
    .route('/cardPay')
    .post(verification, auth, pay)
    
module.exports = router
