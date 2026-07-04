# AI Smart Restaurant

A lightweight Express-based restaurant assistant that combines a simple chat-style frontend with a LangChain-powered backend. The app answers menu-related questions using Google Gemini and a structured menu tool.

## Overview

This project serves:
- a browser-based chat UI at the root route
- a backend endpoint for AI-assisted responses
- a lightweight health check endpoint

The backend uses:
- Express for the web server
- LangChain with Google Generative AI
- a custom menu tool for breakfast, lunch, and dinner queries

## Features

- Simple restaurant-themed chat interface
- Sends user input to the `/api/chat` endpoint
- Uses a tool-calling agent to provide menu answers
- Returns JSON output for easy integration with frontend or API clients
- Includes a `/ping` endpoint for basic health monitoring

## Project Structure

- `server.js`
  - Main Express server entry point
  - Loads environment variables from `.env`
  - Serves static files from `public/`
  - Defines the following routes:
    - `GET /` → serves the frontend UI
    - `POST /api/chat` → processes chat input and returns an AI-generated response
    - `GET /ping` → returns a health check response

- `public/`
  - Contains the frontend UI
  - `index.html` includes the chat form and JavaScript that calls `/api/chat`

- `package.json`
  - Project metadata and npm scripts
  - Uses ES modules via `"type": "module"`

## Requirements

- Node.js
- A Google Generative AI API key

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root and add your Google API key:

```env
GOOGLE_API_KEY=your_google_api_key_here
PORT=3000
```

3. Start the server:

```bash
npm start
```

4. Open the application in your browser:

```text
http://localhost:3000
```

## API Reference

### `POST /api/chat`

Send a JSON request with a user prompt.

Request body:

```json
{
  "input": "What is on the dinner menu?"
}
```

Example success response:

```json
{
  "output": "Steak, roasted vegetables, and garlic mashed potatoes."
}
```

### `GET /ping`

Returns a simple health check response:

```json
{
  "ok": true
}
```

## Notes

- The app currently focuses on menu-related questions such as breakfast, lunch, and dinner.
- The backend relies on a valid Google Generative AI key. If the key is missing or invalid, requests may fail with a server error.
- The current menu responses are predefined in the server-side tool implementation.
