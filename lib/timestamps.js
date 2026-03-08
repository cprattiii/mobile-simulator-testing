/**
 * Timestamp Utilities
 * Generates unique timestamps for test data (campaigns, emails, etc.)
 */

/**
 * Generate ISO timestamp string
 * @returns {string} ISO timestamp (e.g., "2026-03-08T16-01-23")
 */
function generateTimestamp() {
  const now = new Date();
  return now.toISOString()
    .replace(/:/g, '-')
    .replace(/\..+/, '');
}

/**
 * Generate unique campaign name with timestamp
 * @param {string} prefix - Prefix for the campaign name
 * @returns {string} Campaign name (e.g., "Test-Shopify-2026-03-08T16-01-23")
 */
function generateCampaignName(prefix = 'Test-Shopify') {
  return `${prefix}-${generateTimestamp()}`;
}

/**
 * Generate unique email subject with timestamp
 * @param {string} subject - Base subject line
 * @returns {string} Email subject with timestamp
 */
function generateEmailSubject(subject = 'Test Email') {
  return `${subject} - ${generateTimestamp()}`;
}

/**
 * Generate unique list name with timestamp
 * @param {string} prefix - Prefix for the list name
 * @returns {string} List name
 */
function generateListName(prefix = 'Test-List') {
  return `${prefix}-${generateTimestamp()}`;
}

module.exports = {
  generateTimestamp,
  generateCampaignName,
  generateEmailSubject,
  generateListName
};
