const fetch = require('node-fetch');

async function testBlogCreation() {
  try {
    // First, login to get a token
    const loginResponse = await fetch('http://localhost:8080/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (loginData.token) {
      // Now try to create a blog
      const blogResponse = await fetch('http://localhost:8080/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`
        },
        body: JSON.stringify({
          title: 'Test Blog',
          excerpt: 'Test excerpt',
          content: 'Test content',
          author: 'Test Author',
          publishedAt: '2024-01-01T00:00:00Z',
          category: 'Technology',
          tags: ['test'],
          readTime: '5'
        })
      });
      
      const blogData = await blogResponse.text();
      console.log('Blog creation response:', blogData);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testBlogCreation();
