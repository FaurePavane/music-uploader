const express = require('express')
const colors = require('colors')
const bodyParser = require('body-parser')
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const NodeID3 = require('node-id3');
const path = require('path');
const port = '5000'
const app = express()

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// Set up multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueFileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueFileName);
    }
});

const upload = multer({ storage: storage });

// Define a route to handle file uploads
app.post('/upload', upload.single('musicFile'), (req, res) => {
    try {
        const musicFilePath = req.file.path;

        // Extract the cover image if available
        const coverImage = NodeID3.read(musicFilePath).image;
        if (coverImage) {
            const coverImageFileName = path.basename(musicFilePath, path.extname(musicFilePath)) + '.jpg';
            const coverImagePath = path.join(__dirname, 'uploads', coverImageFileName);
            fs.writeFileSync(coverImagePath, coverImage.imageBuffer);
            console.log('Cover image saved:', coverImagePath);
        }

        console.log('Uploaded music file path:', musicFilePath);
        res.send('File uploaded successfully!');
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file');
    }
});




app.get('/uploads', (req, res) => {
    // Read the 'uploads' directory
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            console.error('Error reading uploads directory:', err);
            res.status(500).send('Server error');
        } else {
            res.send(files);
        }
    });
});

// Serve uploaded music files as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
    console.log(`Server is run now on ${port}`.bgMagenta)
})