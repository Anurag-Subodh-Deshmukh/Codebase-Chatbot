import RepoInput from "../models/repoInputModel.js";

export async function saveRepoInput(req, res) {
  try {
    const { email, repos } = req.body;

    if (!email || !repos) {
      return res.status(400).json({ error: "Email and repos are required" });
    }

    // Use upsert to create or update
    const [repoData, created] = await RepoInput.upsert(
      { email, repos },
      { returning: true }
    );

    res.status(201).json(repoData);
  } catch (err) {
    console.error("Save repo input error:", err);
    res.status(500).json({ 
      error: "Failed to save data",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
}

export async function getRepoInput(req, res) {
  try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const data = await RepoInput.findOne({ where: { email } });
    
    if (!data) {
      return res.status(404).json({ error: "Repository data not found" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Get repo input error:", err);
    res.status(500).json({ 
      error: "Failed to get data",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
}
