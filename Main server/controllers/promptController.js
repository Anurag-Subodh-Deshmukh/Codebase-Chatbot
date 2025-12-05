import Prompt from "../models/promptModel.js";
import Chat from "../models/chatModel.js";
import RepoInput from "../models/repoInputModel.js";
//import Auth from "../models/authModel.js";
import { generation } from "../util/ragOutput.js";

export async function savePrompt(req, res) {
  try {
    const { chat_id, prompt, repo_id } = req.body;

    if (!chat_id || !prompt) {
      return res.status(400).json({ error: "Email and prompt are required" });
    }

    if (chat_id === -1) {
      const newChat = await Chat.create({
        repo_id
      });

      if (!newChat) {
        return res.status(500).json({ error: "Unable to create new chat" });
      }

      chat_id = newChat.chat_id;
    }

    // Find user by email
    // const user = await Auth.findOne({ where: { email } });
    // if (!user) {
    //   return res.status(404).json({ error: "User not found" });
    // }

    // Save prompt
    const newPrompt = await Prompt.create({
      chat_id,
      prompt,
    });

    const data = await RepoInput.findOne({ where: { repo_id } });

    const answer = await generation(prompt, data.email, data.repo_url);

    if (answer.error) {
      return res.status(500).json({ error: answer.error });
    }

    await Prompt.update({ response: answer.answer }, { where: { prompt_id: newPrompt.prompt_id } });

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
    const chat_id = req.params.chat_id;
    const prompts = await Prompt.findAll({ where: { chat_id: chat_id } });
    if (!prompts) {
      return res.status(404).json({ error: "Prompts not found" });
    }
    //console.log(prompts);
    res.status(200).json(prompts);
  } catch (err) {
    console.error("Get prompts error:", err);
    res.status(500).json({ error: "Failed to get prompts" });
  }
}