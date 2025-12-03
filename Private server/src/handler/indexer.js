import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { TextLoader } from "@langchain/classic/document_loaders/fs/text"
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { glob } from "glob";
import client from '../config/vectordb.config.js';

const EXTENSION_MAP = {
    ".js": "js",
    ".jsx": "js",
    ".ts": "js",
    ".tsx": "js",
    ".py": "python",
    ".java": "java",
    ".go": "go",
    ".cpp": "cpp",
    ".php": "php",
};

export const indexProcessor = async (job) => {
    const { repo_url, email } = job.data;
    console.log("Hi");
    //console.log(job.data)

    const prefix = path.join(os.tmpdir(), 'repo-clone-');
    const localPath = fs.mkdtempSync(prefix);
    try {

        execSync(`git clone --depth 1 ${repo_url} .`, { cwd: localPath, stdio: 'ignore' });

        const files = await glob("**/*", {
            cwd: localPath,
            nodir: true,
            absolute: true,
            ignore: [
                "**/node_modules/**", "**/.git/**", "**/*.md", "**/*.json", "**/*.lock"
            ]
        });

        const allChunks = [];

        for (const filePath of files) {
            const ext = path.extname(filePath).toLowerCase();
            const loader = new TextLoader(filePath);
            const docs = await loader.load();

            const language = EXTENSION_MAP[ext];
            let splitter;

            if (language) {
                splitter = RecursiveCharacterTextSplitter.fromLanguage(language, {
                    chunkSize: 800, chunkOverlap: 100,
                });
            } else {
                splitter = new RecursiveCharacterTextSplitter({
                    chunkSize: 1000, chunkOverlap: 100,
                });
            }

            const newChunks = await splitter.splitDocuments(docs);

            newChunks.forEach(chunk => {
                chunk.metadata.source = filePath;
                chunk.metadata.repo = repo_url;
                chunk.metadata.userid = email;
                chunk.pageContent = `File: ${path.basename(filePath)}\n\n${chunk.pageContent}`;
            });

            allChunks.push(...newChunks);
        }

        console.log(allChunks);
        const myCollection = client.collections.use('RepoCodeChunk')

        let dataObjects = new Array();

        for (let srcObject of allChunks) {
            dataObjects.push({
                text: srcObject.pageContent,
                repourl: srcObject.metadata.repo,
                userid: srcObject.metadata.userid
            });
        }

        const response = await myCollection.data.insertMany(dataObjects);
        console.log(response);
    } catch (error) {
        console.error("Error processing repo:", error);
        throw error;
    } finally {
        if (fs.existsSync(localPath)) {
            fs.rmSync(localPath, { recursive: true, force: true });
            console.log(`Cleaned up ${localPath}`);
        }
    }
}