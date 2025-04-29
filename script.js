const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'stored-data.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE));
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Routes

// Store data
app.post('/store', (req, res) => {
    const newData = req.body.data;
    
    fs.readFile(DATA_FILE, 'utf8', (err, fileData) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading data file' });
        }
        
        const dataArray = JSON.parse(fileData);
        dataArray.push({
            id: Date.now(),
            data: newData,
            timestamp: new Date().toISOString()
        });
        
        fs.writeFile(DATA_FILE, JSON.stringify(dataArray, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error saving data' });
            }
            res.json({ message: 'Data stored successfully', data: newData });
        });
    });
});

// Get all stored data
app.get('/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading data file' });
        }
        res.json(JSON.parse(data));
    });
});

// Download data
app.get('/download', (req, res) => {
    const filePath = DATA_FILE;
    res.download(filePath, 'stored-data.json', (err) => {
        if (err) {
            res.status(500).send('Error downloading file');
        }
    });
});

// Share data via email (simulated)
app.post('/send', (req, res) => {
    const { email, data } = req.body;
    
    // In a real app, you would send an email here
    console.log(Simulating sending data to ${email});
    console.log('Data:', data);
    
    res.json({ 
        message: 'Data sent successfully (simulated)', 
        recipient: email,
        data: data
    });
});

// Start server
app.listen(PORT, () => {
    console.log(Server running on http://localhost:${PORT});
});



document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const shareBtn = document.getElementById('shareBtn');
    const storeBtn = document.getElementById('storeBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const sendBtn = document.getElementById('sendBtn');
    
    // Event Listeners
    shareBtn.addEventListener('click', shareData);
    storeBtn.addEventListener('click', storeData);
    refreshBtn.addEventListener('click', refreshStoredData);
    downloadBtn.addEventListener('click', downloadData);