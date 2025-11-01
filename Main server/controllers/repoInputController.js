import repoInputModel from "../models/repoInputModel.js";

export async function saveRepoInput(req, res) {
  try {
    const { email, repos } = req.body;
    const RepoInput = await repoInputModel();

    const newRepo = await RepoInput.create({ email, repos });
    res.status(201).json(newRepo);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({ error: "Failed to save data" });
  }
}

export async function getRepoInput(req, res) {
  try {
    const email = req.params.email;
    const RepoInput = await repoInputModel();

    const data = await RepoInput.findOne({ where: { email: email } });
    res.status(200).json(data);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({ error: "Failed to get data" });
  }
}
