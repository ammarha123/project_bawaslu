const Store = require('electron-store');
const store = new Store();

function storeSessionToken(token) {
    store.set('sessionToken', token);
}

function getSessionToken() {
    return store.get('sessionToken');
}

const crypto = require('crypto');

function generateSessionToken() {
    // Generate a random session token (a secure random string)
    const token = crypto.randomBytes(8).toString('hex');
    return token;
}