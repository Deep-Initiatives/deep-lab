# Deep Lab

A modern web application for managing development labs, applications, and team collaboration.

## Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-database-user
DB_PASSWORD=your-database-password

# Legacy DATABASE_URL (for drizzle-kit)
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT Secret (for production, use a strong secret)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
NODE_ENV=development
PORT=5000
```

### Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see above)

3. Run database migrations:
   ```bash
   npm run db:push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- **Admin Dashboard**: Manage pods, applications, and blog posts
- **Authentication**: JWT-based admin authentication
- **Database**: PostgreSQL with Drizzle ORM
- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Express.js with TypeScript