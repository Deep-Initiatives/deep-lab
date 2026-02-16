
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Storage } from '@google-cloud/storage';
import { db } from '../server/db';
import { apps, blogs, pods } from '../shared/schema';
import { eq, like, or } from 'drizzle-orm';
import { fileURLToPath } from 'url';

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config
const BUCKET_NAME = process.env.GCP_BUCKET_NAME || 'deep-lab-website';
const KEY_FILE = process.env.GCP_KEY_FILE || 'labs-463322-e6044e04d06e.json';
const PROJECT_ID = process.env.GCP_PROJECT_ID || 'labs-463322';
const UPLOADS_DIR = path.join(__dirname, '..', 'client', 'public', 'uploads');

import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

// Initialize Storage (not used for upload anymore, but maybe for other things if needed)
// We'll use gcloud CLI for upload to avoid clock skew issues with node library

async function uploadFileToGCS(filename: string): Promise<string> {
    const localFilePath = path.join(UPLOADS_DIR, filename);

    if (!fs.existsSync(localFilePath)) {
        console.warn(`⚠️ File not found locally: ${localFilePath}`);
        return '';
    }

    try {
        const destination = `gs://${BUCKET_NAME}/${filename}`;
        // Use gcloud storage cp
        await execPromise(`gcloud storage cp "${localFilePath}" "${destination}"`);

        // Assuming bucket is public or we use the public link format:
        return `https://storage.googleapis.com/${BUCKET_NAME}/${filename}`;
    } catch (error) {
        console.error(`❌ Error uploading ${filename}:`, error);
        return '';
    }
}

async function migrateApps() {
    console.log('🔄 Migrating Apps...');
    const allApps = await db.select().from(apps);
    let count = 0;

    for (const app of allApps) {
        let updated = false;
        let newImageUrl = app.imageUrl;
        let newIcon = app.icon;

        // Check imageUrl
        if (app.imageUrl && app.imageUrl.startsWith('/uploads/')) {
            const filename = app.imageUrl.replace('/uploads/', '');
            const gcsUrl = await uploadFileToGCS(filename);
            if (gcsUrl) {
                newImageUrl = gcsUrl;
                updated = true;
                console.log(`   ✅ Uploaded app image: ${filename}`);
            }
        }

        // Check icon (if stored locally)
        if (app.icon && app.icon.startsWith('/uploads/')) {
            const filename = app.icon.replace('/uploads/', '');
            const gcsUrl = await uploadFileToGCS(filename);
            if (gcsUrl) {
                newIcon = gcsUrl;
                updated = true;
                console.log(`   ✅ Uploaded app icon: ${filename}`);
            }
        }

        if (updated) {
            await db.update(apps)
                .set({
                    imageUrl: newImageUrl,
                    icon: newIcon,
                    updatedAt: new Date()
                })
                .where(eq(apps.id, app.id));
            count++;
        }
    }
    console.log(`✨ Migrated ${count} apps.`);
}

async function migrateBlogs() {
    console.log('🔄 Migrating Blogs...');
    const allBlogs = await db.select().from(blogs);
    let count = 0;

    for (const blog of allBlogs) {
        let updated = false;
        if (blog.imageUrl && blog.imageUrl.startsWith('/uploads/')) {
            const filename = blog.imageUrl.replace('/uploads/', '');
            const gcsUrl = await uploadFileToGCS(filename);

            if (gcsUrl) {
                await db.update(blogs)
                    .set({
                        imageUrl: gcsUrl,
                        updatedAt: new Date()
                    })
                    .where(eq(blogs.id, blog.id));
                updated = true;
                count++;
                console.log(`   ✅ Uploaded blog image: ${filename}`);
            }
        }
    }
    console.log(`✨ Migrated ${count} blogs.`);
}

async function main() {
    console.log('🚀 Starting Image Migration to GCP...');
    console.log(`📂 Reading from: ${UPLOADS_DIR}`);
    console.log(`☁️  Target Bucket: ${BUCKET_NAME}`);

    try {
        await migrateApps();
        await migrateBlogs();
        // Add other tables if needed
        console.log('🏁 Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

main();
