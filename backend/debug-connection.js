require('dotenv').config();

console.log('Raw MONGODB_URI from .env:');
console.log(process.env.MONGODB_URI);

console.log('\nURI length:', process.env.MONGODB_URI.length);
console.log('Includes database name:', process.env.MONGODB_URI.includes('/finance_tracker?'));
console.log('Starts with mongodb+srv:', process.env.MONGODB_URI.startsWith('mongodb+srv://'));

// Test if there are any hidden characters
console.log('\nFirst 50 characters:');
console.log(JSON.stringify(process.env.MONGODB_URI.substring(0, 50)));

console.log('\nLast 30 characters:');
console.log(JSON.stringify(process.env.MONGODB_URI.substring(process.env.MONGODB_URI.length - 30)));