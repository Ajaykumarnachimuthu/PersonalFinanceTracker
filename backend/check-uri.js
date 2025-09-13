require('dotenv').config();

// Get the connection string from environment variables
const uri = process.env.MONGODB_URI;

console.log('Checking MongoDB URI format...');
console.log('URI:', uri ? uri.replace(/:[^:]*@/, ':****@') : 'NOT FOUND'); // Hide password for security

if (!uri) {
  console.log('❌ ERROR: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

// Check if the URI has the correct format
if (!uri.startsWith('mongodb+srv://')) {
  console.log('❌ ERROR: URI must start with "mongodb+srv://"');
}

// Check if it contains the database name
if (!uri.includes('/finance_tracker')) {
  console.log('❌ ERROR: URI must include database name (/finance_tracker)');
}

// Check if it has the correct structure
const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
if (!match) {
  console.log('❌ ERROR: URI format is incorrect');
  console.log('Expected format: mongodb+srv://username:password@cluster-url/database-name?options');
} else {
  console.log('✅ URI format appears correct');
  console.log('Username:', match[1]);
  console.log('Password length:', match[2].length);
  console.log('Cluster:', match[3]);
  console.log('Database:', match[4]);
}

// Check for common issues
if (uri.includes(' ')) {
  console.log('❌ WARNING: URI contains spaces');
}

if (uri.includes('<') || uri.includes('>')) {
  console.log('❌ WARNING: URI contains angle brackets');
}