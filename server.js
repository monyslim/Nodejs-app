const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8087;

const uploadedDocuments = []; // Array to store uploaded document filenames

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, callback) => {
    const filename = file.originalname;
    uploadedDocuments.push(filename); // Add filename to the array
    callback(null, filename);
  },
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).send('File uploaded successfully.');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/remove/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      res.status(500).send('Error deleting file.');
    } else {
      const index = uploadedDocuments.indexOf(filename);
      if (index !== -1) {
        uploadedDocuments.splice(index, 1); // Remove filename from the array
      }
      console.log('File deleted:', filename);
      res.status(200).send('File deleted successfully.');
    }
  });
});

app.get('/uploaded-documents', (req, res) => {
  res.json(uploadedDocuments); // Send the list of uploaded document filenames
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});