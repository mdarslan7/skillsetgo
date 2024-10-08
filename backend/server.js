/* eslint-disable no-undef */
const express = require('express');
const bodyParser = require('body-parser');
const { execFile } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/next-skills', (req, res) => {
    const { domain, skills } = req.body;

    if (!domain || !Array.isArray(skills)) {
        return res.status(400).json({ message: 'Domain (string) and skills (array) are required.' });
    }

    const input = `${domain}:${skills.join(',')}`;
    const cppExecutable = path.join(__dirname, 'a.exe'); 

    const timeout = 10000;

    const child = execFile(cppExecutable, [input], { timeout: timeout }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing C++ program: ${error.message}`);
            if (error.code === 'ETIMEDOUT') {
                return res.status(504).json({ message: 'C++ program execution timed out.' });
            }
            return res.status(500).json({ message: 'Error executing the C++ program.' });
        }

        if (stderr) {
            console.error(`C++ program stderr: ${stderr}`);
            return res.status(500).json({ message: 'C++ program produced an error.' });
        }

        if (!stdout.trim()) {
            return res.status(500).json({ message: 'C++ program produced no output.' });
        }

        const nextSkills = stdout.trim().split(',').map(skill => skill.trim());

        return res.json({ nextSkills });
    });

    // error handling
    child.on('error', (error) => {
        console.error(`Failed to start C++ program: ${error.message}`);
        res.status(500).json({ message: 'Failed to start C++ program.' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});