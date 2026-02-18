
import 'dotenv/config';
import { db } from '../server/db';
import { apps, blogs } from '../shared/schema';
import { eq, like } from 'drizzle-orm';

const PROXY_BASE = '/api/uploads/';
const GCS_BASE = 'https://storage.googleapis.com/deep-lab-website/';

async function updateUrls() {
    console.log('🔄 Updating Database URLs to use Proxy...');

    // Apps
    const allApps = await db.select().from(apps);
    let appCount = 0;
    for (const app of allApps) {
        let updated = false;
        let newImageUrl = app.imageUrl;
        let newIcon = app.icon;

        if (app.imageUrl && app.imageUrl.startsWith(GCS_BASE)) {
            newImageUrl = app.imageUrl.replace(GCS_BASE, PROXY_BASE);
            updated = true;
        }
        if (app.icon && app.icon.startsWith(GCS_BASE)) {
            newIcon = app.icon.replace(GCS_BASE, PROXY_BASE);
            updated = true;
        }

        if (updated) {
            await db.update(apps)
                .set({ imageUrl: newImageUrl, icon: newIcon, updatedAt: new Date() })
                .where(eq(apps.id, app.id));
            appCount++;
            console.log(`   ✅ Updated app: ${app.name}`);
        }
    }
    console.log(`✨ Updated ${appCount} apps.`);

    // Blogs
    const allBlogs = await db.select().from(blogs);
    let blogCount = 0;
    for (const blog of allBlogs) {
        if (blog.imageUrl && blog.imageUrl.startsWith(GCS_BASE)) {
            const newUrl = blog.imageUrl.replace(GCS_BASE, PROXY_BASE);
            await db.update(blogs)
                .set({ imageUrl: newUrl, updatedAt: new Date() })
                .where(eq(blogs.id, blog.id));
            blogCount++;
            console.log(`   ✅ Updated blog: ${blog.title}`);
        }
    }
    console.log(`✨ Updated ${blogCount} blogs.`);

    process.exit(0);
}

updateUrls().catch(err => {
    console.error(err);
    process.exit(1);
});
