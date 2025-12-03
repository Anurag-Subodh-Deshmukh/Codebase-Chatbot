import Prompt from "../models/promptModel.js";
import Auth from "../models/authModel.js";
import { generation } from "../util/ragOutput.js";

export async function savePrompt(req, res) {
  try {
    const { email, prompt, repo_url } = req.body;

    if (!email || !prompt) {
      return res.status(400).json({ error: "Email and prompt are required" });
    }

    // Find user by email
    const user = await Auth.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Save prompt
    const newPrompt = await Prompt.create({
      user_id: user.id,
      repo_url: repo_url,
      prompt,
    });

    const answer = await generation(prompt);

    if(answer.error) {
      return res.status(500).json({ error: answer.error });
    }

    await Prompt.update({ response: answer.answer }, { where: { id: newPrompt.id } });

    res.status(201).json({
      message: "Prompt saved successfully",
      data: newPrompt,
    });
  } catch (err) {
    console.error("Save prompt error:", err);
    res.status(500).json({ 
      error: "Failed to save prompt",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
}

export async function getPrompts(req, res) {
  try {
    const id = req.params.id;
    const prompts = await Prompt.findAll({ where: { user_id: id } });
    if(!prompts) {
      return res.status(404).json({ error: "Prompts not found" });
    }
    console.log(prompts);
    res.status(200).json(prompts);
  } catch (err) {
    console.error("Get prompts error:", err);
    res.status(500).json({ error: "Failed to get prompts" });
  }
}