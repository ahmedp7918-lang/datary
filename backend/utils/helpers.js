function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getTimestamp() {
    return new Date().toISOString();
}

function sanitizeFieldName(name) {
    return name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
}

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

module.exports = {
    generateId,
    formatBytes,
    getTimestamp,
    sanitizeFieldName,
    deepClone,
    chunkArray
};