import { GoogleGenAI } from "@google/genai";
import { buildAugmentedPrompt } from "./augmenter.js";
import client from "../client/weaviate.client.js";

export async function generation(query) {
    try {
        if (!query) {
            return { error: "Query is required" };
        }
        const collection = client.collections.use('RepoCodeChunk');

        const result = await collection.query.nearText(query, {
            limit: 5,
            returnMetadata: ['distance']
        })

        const prompt = buildAugmentedPrompt(query, result);
        const YOUR_API_KEY = process.env.GEMINI_API_KEY;

        const ai = new GoogleGenAI({ apiKey: YOUR_API_KEY });

        console.log(prompt);

        const llmResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const finalAnswer = llmResponse.text;
        console.log(finalAnswer);

        return {
            success: true,
            answer: finalAnswer,
            model: "gemini-2.5-flash"
        };
    } catch (error) {
        console.error("Falied to generate...", err);
        return {
            error: "Failed to generate...",
            details: process.env.NODE_ENV === "development" ? err.message : undefined
        };
    }
}

