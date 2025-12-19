# Admin Authentication Setup

This project now includes authentication for the `/admin` routes. Only authenticated users can access admin pages.

## Setup Instructions

### 1. Start the Database

The docker-compose files have been updated to include a PostgreSQL database. Start the services:

```bash
# For local development
docker-compose -f docker-compose.local.yml up -d

# For production
docker-compose up -d
```

### 2. Initialize the Database

Run the database initialization script to create the schema and an admin user:

```bash
bun run init-db
```

This will:
- Create the database schema (users and sessions tables)
- Create a default admin user (username: `admin`, password: `admin123`)

**⚠️ Important:** Change the default password after first login!

### 3. Environment Variables

Create a `.env.local` file (or update your existing `.env` file) with the following variables:

```env
# Database Configuration
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=nextjs_auth
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
DATABASE_URL=postgresql://admin:admin123@localhost:5432/nextjs_auth

# Authentication Secrets (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
SESSION_SECRET=your-super-secret-session-key-change-in-production

# Admin User (for initial setup)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 4. Install Dependencies

Install the new dependencies:

```bash
bun install
```

### 5. Access the Admin Panel

1. Navigate to `/admin/login`
2. Log in with the default credentials (or your custom admin user)
3. You'll be redirected to the admin dashboard

## API Routes

The following API routes are available:

- `POST /api/auth/login` - Login endpoint
- `POST /api/auth/logout` - Logout endpoint
- `GET /api/auth/session` - Check current session
- `POST /api/auth/register` - Register a new user (optional, for creating additional admin users)
- `GET /api/admin/protected` - Example protected API route

## Security Notes

1. **Change Default Credentials**: The default admin password should be changed immediately after setup.

2. **JWT Secret**: The JWT secret should be a strong, random string in production. Generate one using:
   ```bash
   openssl rand -base64 32
   ```

3. **Session Security**: Sessions are stored in the database and expire after 7 days. Expired sessions are automatically cleaned up.

4. **HTTPS**: In production, ensure HTTPS is enabled for secure cookie transmission.

5. **Database Security**: 
   - Use strong database passwords
   - Restrict database access to only the application server
   - Regularly backup the database

## Protected Routes

All routes under `/admin/*` are protected by authentication middleware. Unauthenticated users are automatically redirected to `/admin/login`.

## Creating Additional Admin Users

You can create additional admin users by:

1. Using the registration API endpoint (if enabled)
2. Directly inserting into the database (not recommended)
3. Using a database management tool

Example using the API:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "newadmin", "password": "securepassword123"}'
```

## Troubleshooting

### Database Connection Issues

If you're having trouble connecting to the database:

1. Ensure the database container is running: `docker ps`
2. Check database logs: `docker logs nextjs-db`
3. Verify environment variables are set correctly
4. Test connection: `docker exec -it nextjs-db psql -U admin -d nextjs_auth`

### Authentication Not Working

1. Check that the database is initialized: `bun run init-db`
2. Verify cookies are being set (check browser dev tools)
3. Check server logs for errors
4. Ensure JWT_SECRET is set in environment variables

### Static Export Issues

If you need static export for GitHub Pages, note that API routes won't work. Set `BUILD_STATIC=true` in your environment, but admin features will be disabled.

