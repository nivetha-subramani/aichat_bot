AI ChatBot Demo
===============

What you get:
- public/index.html  -> frontend (works offline with a simulated bot)
- public/style.css
- public/script.js
- server.js           -> optional Express backend that proxies to OpenAI
- package.json

How to run (offline demo):
1. Unzip and open public/index.html in your browser.
2. The frontend will use a built-in simulated bot and respond.

How to run with real AI replies (OpenAI):
1. Install Node.js (v18+ recommended).
2. In the project root:
   npm install
3. Set your OpenAI API key as an environment variable:
   Linux/macOS:
     export OPENAI_API_KEY="sk-..."
   Windows (PowerShell):
     $env:OPENAI_API_KEY = "sk-..."
4. Start the server:
   npm start
5. Open http://localhost:3000 in your browser. Type messages and get replies from the model.

Notes:
- If you don't set OPENAI_API_KEY, the server returns simulated fallback replies.
- The frontend first tries the backend (/api/chat). If that call fails it falls back to a client-side simulated bot so the UI always works.

Sample output:
- Example conversation (in the browser):
  User: "Hi"
  Bot: "Hello! I'm a demo bot. Ask me anything or run the backend for real AI replies."
