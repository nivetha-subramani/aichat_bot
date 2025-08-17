


import express from "express";
import fetch from "node-fetch";
import multer from "multer";

const app = express();
app.use(express.json());
app.use(express.static("public"));

// For image upload
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint to analyze image using Gemini Vision API
app.post("/analyze-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }
    // Convert image buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          parts: [
            {
              text: "Describe this image."
            },
            {
              inline_data: {
                mime_type: req.file.mimetype,
                data: base64Image
              }
            }
          ]
        }
      ]
    };
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No description returned.";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image analysis failed" });
  }
});
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await apiResponse.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
