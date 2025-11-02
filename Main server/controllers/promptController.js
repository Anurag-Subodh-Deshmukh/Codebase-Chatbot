import promptModel from "../models/promptModel.js";
import authModel from "../models/authModel.js";

export async function savePrompt(req, res) {
  try {
    const { email, prompt } = req.body;

    if (!email || !prompt) {
      return res.status(400).json({ error: "Email and prompt are required" });
    }

    const Auth = await authModel();
    const Prompt = await promptModel();

    // Find user by email
    const user = await Auth.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Save prompt
    const newPrompt = await Prompt.create({
      user_id: user.id,
      prompt,
    });

    res.status(201).json({
      message: "Prompt saved successfully",
      data: newPrompt,
    });
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({ error: "Failed to save prompt" });
  }
}

