#!/usr/bin/env bun

/**
 * Database initialization script
 * Run this to set up the database schema and create an admin user
 * 
 * Usage: bun run scripts/init-db.ts
 */

import { initDb } from '../lib/db';
import { createUser, getUserByUsername } from '../lib/auth';

async function main() {
  console.log('Initializing database...');
  
  try {
    // Initialize database schema
    await initDb();
    console.log('✓ Database schema initialized');

    // Check if admin user exists
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await getUserByUsername(adminUsername);
    
    if (existingAdmin) {
      console.log(`✓ Admin user "${adminUsername}" already exists`);
    } else {
      // Create admin user
      const admin = await createUser(adminUsername, adminPassword);
      console.log(`✓ Admin user "${adminUsername}" created successfully`);
      console.log(`  User ID: ${admin.id}`);
      console.log(`  Username: ${admin.username}`);
      console.log(`\n⚠️  Default credentials:`);
      console.log(`  Username: ${adminUsername}`);
      console.log(`  Password: ${adminPassword}`);
      console.log(`\n⚠️  Please change the default password after first login!`);
    }

    console.log('\n✓ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    process.exit(1);
  }
}

main();

