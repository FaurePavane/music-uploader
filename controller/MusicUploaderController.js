const asyncHandler = require('express-async-handler')

// @desc Upload a image
// @route Post /upload
// @access Public
const upload = asyncHandler(async (req, res) => {
 
    if (req.file) {
        res.json({
            music: 'localhost:5000/' + req.file.path.replace(/\\/g, '/')
        })
        console.log(req.files.foo);
    }
})
module.exports = { upload }