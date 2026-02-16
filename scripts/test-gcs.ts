
import 'dotenv/config';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KEY_FILE = process.env.GCP_KEY_FILE || 'labs-463322-e6044e04d06e.json';
const PROJECT_ID = process.env.GCP_PROJECT_ID || 'labs-463322';
const resolvedKeyPath = path.join(__dirname, '..', KEY_FILE);

console.log(`Using Key File: ${resolvedKeyPath}`);

const storage = new Storage({
    keyFilename: resolvedKeyPath,
    projectId: PROJECT_ID,
});

async function test() {
    try {
        const [buckets] = await storage.getBuckets();
        console.log('Buckets:');
        buckets.forEach(bucket => {
            console.log(bucket.name);
        });
    } catch (err) {
        console.error('ERROR:', err);
    }
}

test();
