/**
 * Jest Setup File
 * Runs before all tests
 */

require('dotenv').config();

// Verify required environment variables
const requiredEnvVars = [
  'CTCT_USERNAME',
  'CTCT_PASSWORD',
  'CTCT_LOGIN_URL'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

console.log('Environment variables validated ✓');
