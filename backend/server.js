const express = require('express');
const bodyParser = require('body-parser');
const { execFile } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(cors());
app.use(bodyParser.json());

// Define the endpoint
app.post('/next-skills', (req, res) => {
    const { domain, skills } = req.body;

    if (!domain || !Array.isArray(skills)) {
        return res.status(400).json({ message: 'Domain (string) and skills (array) are required.' });
    }

    // Prepare input for the C++ program
    const input = `${domain}:${skills.join(',')}`;
    const cppExecutable = path.join(__dirname, 'a.exe'); // Path to the compiled C++ executable

    // Set a timeout for the execution (e.g., 10 seconds)
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

        // Check if stdout is empty
        if (!stdout.trim()) {
            return res.status(500).json({ message: 'C++ program produced no output.' });
        }

        // Parse the output
        const nextSkills = stdout.trim().split(',').map(skill => skill.trim());

        return res.json({ nextSkills });
    });

    // Handle potential errors
    child.on('error', (error) => {
        console.error(`Failed to start C++ program: ${error.message}`);
        res.status(500).json({ message: 'Failed to start C++ program.' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});