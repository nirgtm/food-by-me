// Quick JWT token test script
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'foodbyme_secret_key_2026';

// Create a test token (simulating login)
const testUser = { email: 'test@example.com' };
const token = jwt.sign(testUser, JWT_SECRET, { expiresIn: '24h' });

console.log('Generated Token:', token);
console.log('\n--- Token Verification Test ---');

try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('✓ Token verified successfully');
  console.log('Decoded payload:', decoded);
} catch (error) {
  console.log('✗ Token verification failed:', error.message);
}

// Test with wrong secret
console.log('\n--- Wrong Secret Test ---');
try {
  const decoded = jwt.verify(token, 'wrong_secret');
  console.log('✓ Token verified (unexpected)');
} catch (error) {
  console.log('✗ Token verification failed (expected):', error.message);
}

console.log('\n--- Instructions ---');
console.log('1. Check if JWT_SECRET is set on Vercel:');
console.log('   vercel env ls');
console.log('2. If not set, add it:');
console.log('   vercel env add JWT_SECRET');
console.log('   Value: foodbyme_secret_key_2026');
console.log('   Environment: Production');
