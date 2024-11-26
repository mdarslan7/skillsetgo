/* eslint-disable no-undef */

const express = require("express");
const path = require("path");
const { spawn } = require("child_process");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post("/recommend-course", (req, res) => {
  const { skills } = req.body;

  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({
      error: "Skills must be provided as a non-empty array",
    });
  }

  const cppExecutablePath = path.resolve(__dirname, "a.exe");
  const cppProcess = spawn(cppExecutablePath);

  let outputData = "";
  let errorData = "";

  cppProcess.stdout.on("data", (data) => {
    outputData += data.toString();
  });

  cppProcess.stderr.on("data", (data) => {
    errorData += data.toString();
    // Log error for debugging
    console.error(`C++ Error: ${data}`);
  });

  cppProcess.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({
        error: "Error in course recommendation",
        details: errorData,
      });
    }

    try {
      // Split the output into lines
      const lines = outputData.trim().split("\n");

      if (lines.length < 3) {
        return res.status(500).json({
          error: "Unexpected output format from C++ program",
          details: outputData,
        });
      }

      // Parse the output correctly
      const courseName = lines[0].trim();
      const courseUrl = lines[1].trim();
      const nextSkillsString = lines[2].trim();

      // Split the next skills string into an array of individual skills
      const nextSkills = nextSkillsString
        ? nextSkillsString.split(" ").map((skill) => skill.trim())
        : [];

      // Build the response object
      const response = {
        recommendedCourse: {
          name: courseName,
          url: courseUrl,
          nextSkills: nextSkills,
        },
        currentSkills: skills,
      };

      res.json(response);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      res.status(500).json({
        error: "Failed to parse recommendation",
        details: parseError.message,
      });
    }
  });

  // Send skills to C++ program
  cppProcess.stdin.write(skills.join(", ") + "\n");
  cppProcess.stdin.end();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
