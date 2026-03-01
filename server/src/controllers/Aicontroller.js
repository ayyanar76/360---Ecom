// server/src/controllers/ai.controller.js
import Groq from "groq-sdk";
import Product from "../models/productSchema.js";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// POST /api/ai/recommend
export const recommend = async (req, res) => {
  try {
    const userHistory = req.body.userHistory || [];
    const category = req.body.category || "all";

    const products = await Product.find({}).lean();

    const productList = products.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      category: p.category,
      price: p.price,
    }));

    const prompt =
      `You are an e-commerce recommendation AI. 
Products: ${JSON.stringify(productList)}
User history: ${JSON.stringify(userHistory)}
Category filter: ${category}
Return ONLY a JSON array of 3 product id strings. No explanation.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // free fast model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
 console.log(response.choices[0].message);
 
    const ids = JSON.parse(response.choices[0].message.content);

    const recommended = products.filter((p) =>
      ids.includes(p._id.toString())
    );

    res.json({ success: true, products: recommended });
  } catch (err) {
    console.log(err.message);

    const fallback = await Product.find({}).limit(3);
    res.json({ success: true, products: fallback });
  }
};

// POST /api/ai/chat
export const chat = async (req, res) => {
  try {
    const messages = req.body.messages || [];
    const products = await Product.find({}).lean();

    const productInfo = products.map((p) => ({
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category,
    }));

    const systemPrompt =
      `You are a helpful customer support agent for AI Shop.
Products available: ${JSON.stringify(productInfo)}
Be friendly, helpful and concise.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
    });

    res.json({
      success: true,
      reply: response.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};