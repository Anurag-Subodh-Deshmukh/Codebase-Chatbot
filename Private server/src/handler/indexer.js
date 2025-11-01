import {GitLoader} from '@langchain/community';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Language } from 'langchain/text_splitter';
import { PineconeStore } from '@langchain/pinecone';
import fs from 'fs/promises';

import { pineconeIndex } from '../config/vectordb.config';
import { embeddingModel } from '../config/embedding.config';

export const indexProcessor = async(job)=>{
    const { repo_url, user_id } = job.data;
    const tempDir = `/tmp/${job.id}`;

    try {
        const cloner = new GitLoader({
            repoPath: tempDir,
            url: repo_url,
        });

        const documents = await cloner.load();

        const splitter = RecursiveCharacterTextSplitter.fromLanguage(
            Language.JS, 
                {chunkSize: 1000, chunkOverlap: 100 }
        );
        const chunks = await splitter.splitDocuments(documents);

        const chunksMetaData = chunks.map((chunk)=>{
            chunk.metadata.user_id = user_id;
            chunk.metadata.repo_url = repo_url;

            return chunk;
        })

        await PineconeStore.fromDocuments(
            chunksMetaData,
            embeddingModel,
            {
                pineconeIndex,
                maxConcurrency : 5,
            }
        )
    } catch (error) {
        throw error;
    }
    finally{
        await fs.rm(tempDir, {recursive : true, force : true});
    }
}