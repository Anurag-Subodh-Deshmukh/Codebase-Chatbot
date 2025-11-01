import { OpenAIEmbeddings } from '@langchain/openai';
import 'dotenv/config';

export const embeddingModel = new OpenAIEmbeddings({
  openAIApiKey: "bhavesh",
  model: "text-embedding-3-small",
});