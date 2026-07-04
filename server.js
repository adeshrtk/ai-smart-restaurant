import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AgentExecutor, createToolCallingAgent } from "@langchain/classic/agents";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));


const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "models/gemini-2.5-flash",
  temperature: 0.7,
  maxOutputTokens: 2048,
});

//Tool: Restaurant Menu Tool
const getMenuTool = new DynamicStructuredTool({
  name: "getMenuTool",
  description: "Returns the final answer for today's menu for the given category (breakfast, lunch or dinner). Use this tool to directly answer the user's menu questions.",   
  schema: z.object({
    category: z.string().describe("Type of food. Example: breakfast, lunch, or dinner"),
  }), 
  func: async ({ category }) => {
    const menu = {
      breakfast: "Pancakes, scrambled eggs, and fresh fruit.",
      lunch: "Grilled chicken sandwiches, Caesar salad, and tomato soup.",
      dinner: "Steak, roasted vegetables, and garlic mashed potatoes.",
    };  
    return menu[category.toLowerCase()] || "Sorry, we don't have a menu for that category.";
  }
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant that uses tools when needed."],
  ["human", "{input}"],
  ["ai", "{agent_scratchpad}"]
]);

const agent = await createToolCallingAgent({
  tools: [getMenuTool],
  llm: model,
  prompt,
});

const executor = await AgentExecutor.fromAgentAndTools({
  agent,
  tools: [getMenuTool],
  verbose: true,
});

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  const userInput = String(req.body?.input || '').trim();
  console.log(`User input: ${userInput}`);

  if (!userInput) {
    return res.status(400).json({ output: "Please provide a non-empty 'input' field in the request body." });
  }

  try {
    const response = await executor.invoke({ input: userInput });
    console.log('Agent raw response:', response);

    const output = typeof response.output === 'string'
      ? response.output
      : response.output?.text || response.output?.[0] || JSON.stringify(response.output || '');

    if (output) {
      return res.json({ output });
    }

    return res.status(500).json({ output: "Agent couldn't generate a valid answer." });
  } catch (error) {
    console.error('Error processing user input:', error);
    return res.status(500).json({ output: 'An error occurred while processing your request.', details: error?.message });
  }
});

const router = app._router || app.router;
console.log('app._router exists:', !!app._router, 'app.router exists:', !!app.router);
if (router && router.stack) {
  console.log('Router stack length:', router.stack.length);
  router.stack.forEach((layer, index) => {
    console.log('layer', index, layer.name, layer.route ? layer.route.path : layer.regexp, layer.route ? layer.route.methods : 'middleware');
  });
} else {
  console.log('No router stack found on app');
}

app.get('/ping', (req, res) => res.json({ ok: true }));

app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Server error', message: err?.message });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
