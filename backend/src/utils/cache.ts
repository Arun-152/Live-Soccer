import NodeCache from 'node-cache';

// Initialize cache
// stdTTL: default time to live in seconds
// checkperiod: period in seconds used for the automatic delete check interval
export const apiCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
