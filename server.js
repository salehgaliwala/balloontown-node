const express = require('express');

const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require("cors");
const app = express();
const port = 3001;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/saveSettings', (req, res) => {
  const settings = req.body;

  const settingsFilePath = path.join(__dirname, 'settings.json');
  fs.writeFile(settingsFilePath, JSON.stringify(settings, null, 2), (err) => {
    if (err) {
      console.error('Error saving settings:', err);
      res.status(500).json({ error: 'Error saving settings' });
    } else {
      console.log('Settings saved successfully');
      res.json({ message: 'Settings saved successfully' });
    }
  });
});

app.get('/getSettings', (req, res) => {
  const settingsFilePath = path.join(__dirname, 'settings.json');
  fs.readFile(settingsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading settings:', err);
      res.status(500).json({ error: 'Error fetching settings' });
    } else {
      const settings = JSON.parse(data);
      res.json(settings);
    }
  });
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
