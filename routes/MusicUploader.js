const express = require('express')
const router = express.Router()
const {upload} = require('../controller/MusicUploaderController')

router.route('/').post(upload)



module.exports = router