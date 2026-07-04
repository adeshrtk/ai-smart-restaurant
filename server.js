import express from "express";
import dotenv from "dotenv";
// import cors from "cors";
// import bodyParser from "body-parser";
// import { Configuration, OpenAIApi } from "openai";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AgentExecutor, createToolCallingAgent } from "@langchain/agents";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const port = process.env.PORT || 3000;
const app = express();

dotenv.config();
// app.use(cors());
// app.use(bodyParser.json());

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "models/gemini-2.5-flash",
  temperature: 0.7,
  maxOutputTokens: 2048,
});

app.get("/", (req, res) => {
  res.send("AI Smart Restaurant API is running");
});


app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
