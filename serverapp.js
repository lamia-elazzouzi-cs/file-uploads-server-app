const express = require('express');
const multer = require('multer'); // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. 
const path = require('path');

const app = express();
const port = 3000;

// Set up storage for the uploaded files
const storage = multer.diskStorage({

    // Specify the directory where the uploads should be stored
    destination: function (req, file, callbackfct) {
        // As calling convention, we pass null as the first param
        callbackfct(null, 'uploads/');
    },
    // Use the original file name
    filename: function (req, file, callbackfct) {
        callbackfct(null, file.originalname);
    },
});
const upload = multer(
    { storage: storage }
);

// Error handling middleware for Express
app.use((err, req, res, next) => {

    // Set default status code and status message if not provided in the error object
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error";

    // Log the error stack to the console for debugging purposes
    console.log(err.stack);

    // Respond to the client with a JSON object containing error details
    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
    });
});


// Serve the html Form to allow client to upload files
app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'index.html')
    );
});


// Handle file uploading
app.post(
    '/upload', upload.single('file'), (req, res, next) => {

        // If no file was upload, pass error to middleware
        if (!req.file) {
            return next(new Error('No file uploaded.'));
        }

        // Access the uploaded file information
        const uploadedFile = req.file;
        console.log('--> Uploaded file:', uploadedFile);
        res.send('--> File ' + uploadedFile.originalname + ' uploaded!');
    }
);

// Serve the files in the 'uploads' directory using express.static middleware
app.use('/file', express.static('uploads'));


// Use middleware to catch any undefined routes or endpoints
app.use('*', (req, res, next)=>{

    // Create custom Error object 
    const err = new Error(`Cannot find the URL ${req.originalUrl} in this application. Please check.`);

    // Set custom status and statusCode properties
    err.status = "Endpoint Failure";
    err.statusCode = 404;

    // Pass the error to the next middleware to trigger error-handling
    next(err);
});



// Start the server
app.listen(port, ()=>{
    console.log(`-> Server is running on http://localhost:${port}`);
});
