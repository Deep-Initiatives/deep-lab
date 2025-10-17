import Database from 'better-sqlite3';
import pg from 'pg';
const { Client } = pg;

// SQLite database
const sqliteDb = new Database('./local.db');

// PostgreSQL database
const pgClient = new Client({
  host: '34.63.102.86',
  port: 5432,
  database: 'deep-lab',
  user: 'deep-lab-user',
  password: 'Jf`&e"0,_Lr0M#2E'
});

try {
  await pgClient.connect();
  console.log('✅ Connected to both databases');
  
  // Migrate users
  console.log('👤 Migrating users...');
  const users = sqliteDb.prepare('SELECT * FROM users').all();
  for (const user of users) {
    await pgClient.query(`
      INSERT INTO users (id, username, password, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO NOTHING
    `, [user.id, user.username, user.password, user.role, new Date(user.created_at * 1000), new Date(user.updated_at * 1000)]);
  }
  console.log(`✅ Migrated ${users.length} users`);
  
  // Migrate pods
  console.log('🏗️ Migrating pods...');
  const pods = sqliteDb.prepare('SELECT * FROM pods').all();
  let migratedPods = 0;
  for (const pod of pods) {
    // Skip pods with invalid UUIDs
    if (pod.id.length !== 36 || !pod.id.includes('-')) {
      console.log(`⚠️ Skipping pod with invalid ID: ${pod.id}`);
      continue;
    }
    
    await pgClient.query(`
      INSERT INTO pods (id, name, description, status, progress, team_size, start_date, end_date, technologies, coordinator_id, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO NOTHING
    `, [
      pod.id, 
      pod.name, 
      pod.description, 
      pod.status, 
      pod.progress, 
      pod.team_size, 
      new Date(pod.start_date * 1000), 
      pod.end_date ? new Date(pod.end_date * 1000) : null,
      pod.technologies,
      pod.coordinator_id,
      pod.is_active === 1,
      new Date(pod.created_at * 1000),
      new Date(pod.updated_at * 1000)
    ]);
    migratedPods++;
  }
  console.log(`✅ Migrated ${migratedPods} pods`);
  
  // Migrate apps
  console.log('📱 Migrating apps...');
  const apps = sqliteDb.prepare('SELECT * FROM apps').all();
  let migratedApps = 0;
  for (const app of apps) {
    // Skip apps with invalid pod_id UUIDs
    if (app.pod_id && (app.pod_id.length !== 36 || !app.pod_id.includes('-'))) {
      console.log(`⚠️ Skipping app with invalid pod_id: ${app.id} -> ${app.pod_id}`);
      continue;
    }
    
    await pgClient.query(`
      INSERT INTO apps (id, name, description, category, status, technologies, icon, demo_url, github_url, pod_id, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO NOTHING
    `, [
      app.id,
      app.name,
      app.description,
      app.category,
      app.status,
      app.technologies,
      app.icon,
      app.demo_url,
      app.github_url,
      app.pod_id,
      app.is_active === 1,
      new Date(app.created_at * 1000),
      new Date(app.updated_at * 1000)
    ]);
    migratedApps++;
  }
  console.log(`✅ Migrated ${migratedApps} apps`);
  
  // Migrate milestones
  console.log('🎯 Migrating milestones...');
  const milestones = sqliteDb.prepare('SELECT * FROM milestones').all();
  for (const milestone of milestones) {
    await pgClient.query(`
      INSERT INTO milestones (id, date, title, description, type, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO NOTHING
    `, [
      milestone.id,
      new Date(milestone.date * 1000),
      milestone.title,
      milestone.description,
      milestone.type,
      milestone.is_active === 1,
      new Date(milestone.created_at * 1000),
      new Date(milestone.updated_at * 1000)
    ]);
  }
  console.log(`✅ Migrated ${milestones.length} milestones`);
  
  // Migrate blogs (if any)
  console.log('📝 Migrating blogs...');
  const blogs = sqliteDb.prepare('SELECT * FROM blogs').all();
  for (const blog of blogs) {
    await pgClient.query(`
      INSERT INTO blogs (id, title, excerpt, content, author, published_at, category, tags, read_time, image_url, external_url, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (id) DO NOTHING
    `, [
      blog.id,
      blog.title,
      blog.excerpt,
      blog.content,
      blog.author,
      new Date(blog.published_at * 1000),
      blog.category,
      blog.tags || '[]',
      blog.read_time,
      blog.image_url,
      blog.external_url,
      blog.is_active === 1,
      new Date(blog.created_at * 1000),
      new Date(blog.updated_at * 1000)
    ]);
  }
  console.log(`✅ Migrated ${blogs.length} blogs`);
  
  console.log('🎉 Data migration completed successfully!');
  
  sqliteDb.close();
  await pgClient.end();
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
}
