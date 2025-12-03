// MongoDB initialization script
db = db.getSiblingDB('user-management-dev');

// Create collections
db.createCollection('users');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1, isActive: 1 });

print('Database initialized successfully');
