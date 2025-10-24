const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

async function createBlogAdmin() {
  console.log("🚀 Creating blog admin user...");

  try {
    // Check if blog admin already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', ['blog-admin']);
    
    if (existingUser.rows.length > 0) {
      console.log("✅ Blog admin user already exists");
      return;
    }

    // Create blog admin user
    const hashedPassword = await bcrypt.hash("blog123", 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      ['blog-admin', hashedPassword, 'blog-admin']
    );

    console.log("✅ Blog admin user created:", result.rows[0].username);
    console.log("📝 Username: blog-admin");
    console.log("🔑 Password: blog123");
    console.log("🎯 Role: blog-admin (can only manage blogs)");

  } catch (error) {
    console.error("❌ Error creating blog admin user:", error);
  } finally {
    await pool.end();
  }
}

createBlogAdmin();

