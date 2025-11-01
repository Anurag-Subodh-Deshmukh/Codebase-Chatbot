import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: 'bhavesh'
});
export const pineconeIndex = pc.index('code-embedding');