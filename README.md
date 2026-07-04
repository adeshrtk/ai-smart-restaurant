# AI Smart Restaurant

## Overview

`ai-smart-restaurant` is a simple Express-based restaurant assistant that serves a frontend chat UI and a backend AI/chat endpoint. The backend uses Google Generative AI via `@langchain/google-genai` and a small menu tool to answer meal-related questions.

## Project Structure

- `server.js`
  - Main Express server entrypoint
  - Loads environment variables from `.env`
  - Serves static frontend assets from `public/`
  - Defines API routes:
    - `GET /` serves the chat UI
    - `POST /api/chat` accepts JSON input and returns AI-generated responses
    - `GET /ping` health check endpoint
  - Uses LangChain to wire a tool-calling agent and menu tool

- `public/`
  - Static frontend files
  - `index.html` contains the chat UI and JavaScript for sending requests to `/api/chat`

- `.env`
  - Stores environment variables for local development
  - Required variable:
    - `GOOGLE_API_KEY`

- `package.json`
  - Project metadata and npm scripts
  - Uses ES modules via `"type": "module"`

## Functionality

- Displays a restaurant chat interface in the browser
- Sends user questions to `/api/chat`
- Uses a LangChain agent with a structured tool to answer menu-related requests
- Returns JSON responses containing `output`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with a valid Google Generative AI API key:

```env
GOOGLE_API_KEY=your_valid_api_key_here
```

3. Start the server:

```bash
npm start
```

4. Open the app in your browser:

```text
http://localhost:3000
```

## API Reference

### `POST /api/chat`

Request body:

```json
{
  "input": "What is on the dinner menu?"
}
```

Successful response:

```json
{
  "output": "Steak, roasted vegetables, and garlic mashed potatoes."
}
```

### `GET /ping`

Returns a JSON health check:

```json
{
  "ok": true
}
```

## Troubleshooting

- If `POST /api/chat` returns an error, verify that:
  - `.env` exists and includes `GOOGLE_API_KEY`
  - the API key is valid and authorized for `generativelanguage.googleapis.com`
  - the server is running on port `3000`

- If the frontend returns `Cannot POST /api/chat`, make sure the server is running and the route exists.

## Notes

- This project currently relies on a Google Generative AI key. If the key is invalid or expired, the backend will return a 500 error.
- The tool currently supports simple categories: `breakfast`, `lunch`, and `dinner`.
