const express = require('express')
const router = express.Router()
const {auth, pay} = require('../controllers/payController.js');
const {verification} = require('../middleware/token.js')

  router
    .route('/test')
    .post(verification, auth, pay)


module.exports = router
