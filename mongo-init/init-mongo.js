// MongoDB Initialization Script
// This script creates the database and user with proper permissions

db = db.getSiblingDB('mimsc-lab');

// Create user with read/write permissions
db.createUser({
  user: 'erraji0elmahdi',
  pwd: 'Tri2soukain@',
  roles: [
    {
      role: 'readWrite',
      db: 'mimsc-lab'
    }
  ]
});

// Create collections if they don't exist
db.createCollection('admins');
db.createCollection('events');
db.createCollection('publications');
db.createCollection('research');
db.createCollection('students');
db.createCollection('users');

print('MongoDB initialization completed successfully!');