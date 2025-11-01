import { Worker } from 'bullmq';
import connection from './config/bullmq.config.js';
import { indexProcessor } from './handler/indexer.js';

const queue_name = "bhavesh";

await Worker(
    queue_name,
    indexProcessor,
    {
        connection : connection,
        concurrency : 5,
    }
);