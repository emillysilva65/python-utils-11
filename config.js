const fs = require('fs');
const path = require('path');

const defaultConfig = {
    apiEndpoint: 'https://api.default.com',
    timeout: 5000,
    retries: 3,
    logLevel: 'info'
};

function loadConfig(filePath) {
    const fullPath = path.resolve(filePath);
    try {
        const userConfig = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        return { ...defaultConfig, ...userConfig };
    } catch (error) {
        console.error('Error loading config:', error);
        return defaultConfig;
    }
}

module.exports = { loadConfig };