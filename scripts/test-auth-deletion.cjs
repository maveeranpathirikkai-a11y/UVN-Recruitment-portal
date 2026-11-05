/**
 * UNGAL VIJAY NAALITHAZH — Server-Side Auth & Application Deletion Test Suite
 * 
 * Verifies:
 * 1. Cryptographic token generation & HMAC-SHA256 signature verification
 * 2. Timing-safe equality
 * 3. Token expiry enforcement
 * 4. Tampered / forged token rejection
 * 5. Password hashing with salt
 * 6. Server-side adminLogin action (valid & invalid credentials)
 * 7. Protected deleteApplication action:
 *    - Rejection of unauthenticated requests
 *    - Rejection of expired tokens
 *    - Rejection of tampered tokens
 *    - Authorized deletion of designated test candidate
 *    - Preservation of all other candidate records
 *    - Activity log entry with admin identity, action, and applicationId
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Test runner helper
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

// Emulate Google Apps Script Utilities using Node.js crypto
const MockUtilities = {
  DigestAlgorithm: { SHA_256: 'SHA-256' },
  Charset: { UTF_8: 'UTF-8' },
  computeDigest(alg, value, charset) {
    const hash = crypto.createHash('sha256').update(value, 'utf8').digest();
    return Array.from(hash).map(b => b > 127 ? b - 256 : b);
  },
  computeHmacSha256Signature(value, key) {
    const hmac = crypto.createHmac('sha256', key).update(value, 'utf8').digest();
    return Array.from(hmac).map(b => b > 127 ? b - 256 : b);
  },
  base64EncodeWebSafe(bytesOrString) {
    let buf;
    if (typeof bytesOrString === 'string') {
      buf = Buffer.from(bytesOrString, 'utf8');
    } else {
      const u8 = new Uint8Array(bytesOrString.map(b => b < 0 ? b + 256 : b));
      buf = Buffer.from(u8);
    }
    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  },
  base64DecodeWebSafe(str) {
    let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const buf = Buffer.from(b64, 'base64');
    return {
      getDataAsString() {
        return buf.toString('utf8');
      }
    };
  },
  newBlob(bytes) {
    return bytes;
  },
  getUuid() {
    return crypto.randomUUID();
  }
};

// Implement the exact Code.gs auth functions for direct local testing
function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function hashPassword(password, salt) {
  const rawBytes = MockUtilities.computeDigest(
    MockUtilities.DigestAlgorithm.SHA_256,
    String(salt) + ':' + String(password),
    MockUtilities.Charset.UTF_8
  );
  let hex = '';
  for (let i = 0; i < rawBytes.length; i++) {
    let byte = rawBytes[i];
    if (byte < 0) byte += 256;
    let byteHex = byte.toString(16);
    if (byteHex.length === 1) byteHex = '0' + byteHex;
    hex += byteHex;
  }
  return hex;
}

const mockScriptProperties = {
  'ADMIN_USERNAME': 'admin',
  'ADMIN_SALT': 'uvn_salt_2026_x7',
  'ADMIN_JWT_SECRET': 'super_secure_jwt_signing_key_uvn_2026'
};
mockScriptProperties['ADMIN_PASSWORD_HASH'] = hashPassword('uvn2026', mockScriptProperties['ADMIN_SALT']);

function generateSignedSessionToken(username, role, customExpSec) {
  const secret = mockScriptProperties['ADMIN_JWT_SECRET'];
  const header = { alg: 'HS256', typ: 'JWT' };
  const nowSec = Math.floor(Date.now() / 1000);
  const expSec = customExpSec !== undefined ? customExpSec : (nowSec + 1800); // 30 minutes (1800s)
  
  const payload = {
    sub: username,
    name: 'Editorial Administrator',
    role: role || 'admin',
    iat: nowSec,
    exp: expSec,
    jti: MockUtilities.getUuid()
  };
  
  const headerB64 = MockUtilities.base64EncodeWebSafe(JSON.stringify(header)).replace(/=+$/, '');
  const payloadB64 = MockUtilities.base64EncodeWebSafe(JSON.stringify(payload)).replace(/=+$/, '');
  const signingInput = headerB64 + '.' + payloadB64;
  const sigBytes = MockUtilities.computeHmacSha256Signature(signingInput, secret);
  const sigB64 = MockUtilities.base64EncodeWebSafe(sigBytes).replace(/=+$/, '');
  
  return {
    token: signingInput + '.' + sigB64,
    expiresAt: expSec * 1000,
    user: {
      username: username,
      name: 'Editorial Administrator',
      role: role || 'admin'
    }
  };
}

function verifyAdminSessionToken(token) {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Missing authentication token.' };
  }
  const parts = String(token).trim().split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Malformed authentication token format.' };
  }
  const headerB64 = parts[0];
  const payloadB64 = parts[1];
  const sigB64 = parts[2];
  
  const secret = mockScriptProperties['ADMIN_JWT_SECRET'];
  const signingInput = headerB64 + '.' + payloadB64;
  const expectedSigBytes = MockUtilities.computeHmacSha256Signature(signingInput, secret);
  const expectedSigB64 = MockUtilities.base64EncodeWebSafe(expectedSigBytes).replace(/=+$/, '');
  
  if (!timingSafeEqual(sigB64, expectedSigB64)) {
    return { valid: false, error: 'Cryptographic signature verification failed: invalid token.' };
  }
  
  let payload;
  try {
    const payloadJson = MockUtilities.newBlob(MockUtilities.base64DecodeWebSafe(payloadB64)).getDataAsString();
    payload = JSON.parse(payloadJson);
  } catch (e) {
    return { valid: false, error: 'Invalid token payload encoding.' };
  }
  
  const nowSec = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp < nowSec) {
    return { valid: false, error: 'Administrator session has expired. Please log in again.' };
  }
  
  if (payload.role !== 'admin') {
    return { valid: false, error: 'Unauthorized: Administrator privileges required.' };
  }
  
  return {
    valid: true,
    username: payload.sub || 'admin',
    role: payload.role,
    expiresAt: payload.exp * 1000
  };
}

function handleAdminLogin(payload) {
  const username = String(payload.username || '').trim().toLowerCase();
  const password = String(payload.password || '').trim();
  
  if (!username || !password) {
    return { success: false, status: 400, error: 'Username and password are required.' };
  }
  
  const computedHash = hashPassword(password, mockScriptProperties['ADMIN_SALT']);
  const userMatches = timingSafeEqual(username, mockScriptProperties['ADMIN_USERNAME'].toLowerCase());
  const passMatches = timingSafeEqual(computedHash, mockScriptProperties['ADMIN_PASSWORD_HASH']);
  
  if (!userMatches || !passMatches) {
    return { success: false, status: 401, error: 'Invalid administrative username or password.' };
  }
  
  const tokenData = generateSignedSessionToken(username, 'admin');
  return {
    success: true,
    status: 200,
    message: 'Administrator authenticated successfully.',
    token: tokenData.token,
    expiresAt: tokenData.expiresAt,
    user: tokenData.user
  };
}

// Mock Google Spreadsheet Database for Deletion Testing
function createMockSheetDb() {
  const activityLog = [];
  const applications = [
    { id: 'UVN-20261103-EF7272B9', name: 'UVN Test Candidate', status: 'Rejected' },
    { id: 'UVN-20261103-2C25AD37', name: 'Test Candidate Krishnagiri', status: 'Rejected' },
    { id: 'UVN-20261103-FC5A5F76', name: 'M. Senthil Kumar', status: 'Rejected' },
    { id: 'UVN-20261104-980D5119', name: 'Eswar', status: 'Selected' },
    { id: 'UVN-TEST-DELETE-TARGET', name: 'Temporary Test Candidate', status: 'New' }
  ];

  function handleApplicationRemoval(payload) {
    const token = payload.token || (payload.payload && payload.payload.token);
    if (!token) {
      return { success: false, status: 401, error: 'Unauthorized: Administrator authorization token required.' };
    }
    
    const tokenCheck = verifyAdminSessionToken(token);
    if (!tokenCheck.valid) {
      activityLog.push({
        appId: String(payload.applicationId || 'N/A'),
        action: 'DELETE_UNAUTHORIZED',
        performedBy: 'Unknown'
      });
      return { success: false, status: 401, error: tokenCheck.error || 'Unauthorized: Invalid or expired administrator session token.' };
    }
    
    const appId = payload.applicationId || (payload.payload && payload.payload.applicationId);
    if (!appId || String(appId).trim() === '') {
      return { success: false, status: 400, error: 'Missing required parameter: applicationId' };
    }
    
    const cleanAppId = String(appId).trim();
    const idx = applications.findIndex(a => a.id === cleanAppId);
    if (idx === -1) {
      return { success: false, status: 404, error: 'Application not found with ID: ' + cleanAppId };
    }
    
    const removedCandidate = applications[idx];
    applications.splice(idx, 1);
    
    activityLog.push({
      timestamp: new Date().toISOString(),
      appId: cleanAppId,
      action: 'APPLICATION_DELETED',
      details: 'Application for ' + removedCandidate.name + ' (' + cleanAppId + ') was permanently deleted by administrator ' + tokenCheck.username + '.',
      performedBy: tokenCheck.username
    });
    
    return {
      success: true,
      status: 200,
      action: 'deleteApplication',
      applicationId: cleanAppId,
      message: 'Application ' + cleanAppId + ' removed successfully.'
    };
  }

  return { applications, activityLog, handleApplicationRemoval };
}

// Run Test Suite
console.log('================================================================');
console.log('TEST SUITE: Server-Side Administrator Auth & Application Deletion');
console.log('================================================================\n');

console.log('1. Timing-Safe Equality & Password Hashing:');
assert(timingSafeEqual('admin', 'admin') === true, 'timingSafeEqual returns true for identical strings');
assert(timingSafeEqual('admin', 'user') === false, 'timingSafeEqual returns false for different strings');
assert(timingSafeEqual('admin', 'admin123') === false, 'timingSafeEqual returns false for different lengths');
const hash1 = hashPassword('uvn2026', 'salt1');
const hash2 = hashPassword('uvn2026', 'salt1');
const hash3 = hashPassword('wrongpass', 'salt1');
assert(hash1 === hash2, 'Password hash is deterministic with identical salt');
assert(hash1 !== hash3, 'Different password yields different hash');

console.log('\n2. Cryptographic Token Generation & Signature Verification:');
const validSession = generateSignedSessionToken('admin', 'admin');
assert(typeof validSession.token === 'string', 'generateSignedSessionToken returns token string');
assert(validSession.token.split('.').length === 3, 'Token has valid 3-part format (header.payload.signature)');
const verifyValid = verifyAdminSessionToken(validSession.token);
assert(verifyValid.valid === true, 'Valid token passes cryptographic verification');
assert(verifyValid.username === 'admin', 'Decoded token sub matches authenticated username');
assert(verifyValid.role === 'admin', 'Decoded token role matches admin');

console.log('\n3. Tampered & Forged Token Rejection:');
const parts = validSession.token.split('.');
const tamperedPayload = MockUtilities.base64EncodeWebSafe(JSON.stringify({ sub: 'hacker', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }));
const forgedToken = parts[0] + '.' + tamperedPayload + '.' + parts[2];
const verifyForged = verifyAdminSessionToken(forgedToken);
assert(verifyForged.valid === false, 'Tampered payload is rejected by HMAC signature verification');
assert(verifyForged.error.includes('signature verification failed'), 'Reports explicit cryptographic failure');

console.log('\n4. Expired Token Rejection:');
const expiredNowSec = Math.floor(Date.now() / 1000) - 100; // expired 100 seconds ago
const expiredSession = generateSignedSessionToken('admin', 'admin', expiredNowSec);
const verifyExpired = verifyAdminSessionToken(expiredSession.token);
assert(verifyExpired.valid === false, 'Expired token is rejected');
assert(verifyExpired.error.includes('expired'), 'Reports explicit session expiration error');

console.log('\n5. Server-Side handleAdminLogin Action:');
const loginOk = handleAdminLogin({ username: 'admin', password: 'uvn2026' });
assert(loginOk.success === true, 'Correct credentials authenticate successfully (HTTP 200)');
assert(loginOk.token !== undefined, 'Returns signed cryptographic token');
assert(loginOk.user.role === 'admin', 'Returns user role admin');

const loginWrongPass = handleAdminLogin({ username: 'admin', password: 'wrongpassword' });
assert(loginWrongPass.success === false, 'Wrong password rejected');
assert(loginWrongPass.status === 401, 'Returns HTTP 401 Unauthorized');

const loginWrongUser = handleAdminLogin({ username: 'notanadmin', password: 'uvn2026' });
assert(loginWrongUser.success === false, 'Unknown username rejected (HTTP 401)');

console.log('\n6. Protected deleteApplication Action:');
const db = createMockSheetDb();
const initialCount = db.applications.length;

// Test A: Unauthorized request (no token)
const noTokenReq = db.handleApplicationRemoval({ applicationId: 'UVN-TEST-DELETE-TARGET' });
assert(noTokenReq.success === false, 'Missing token request is rejected');
assert(noTokenReq.status === 401, 'Missing token returns HTTP 401');
assert(db.applications.length === initialCount, 'No records removed on unauthenticated request');

// Test B: Request with expired token
const expiredTokenReq = db.handleApplicationRemoval({
  token: expiredSession.token,
  applicationId: 'UVN-TEST-DELETE-TARGET'
});
assert(expiredTokenReq.success === false, 'Expired token request is rejected');
assert(expiredTokenReq.status === 401, 'Expired token returns HTTP 401');
assert(expiredTokenReq.error.includes('expired'), 'Returns explicit expiry error message');
assert(db.applications.length === initialCount, 'No records removed on expired token');

// Test C: Request with forged/tampered token
const forgedTokenReq = db.handleApplicationRemoval({
  token: forgedToken,
  applicationId: 'UVN-TEST-DELETE-TARGET'
});
assert(forgedTokenReq.success === false, 'Forged token request is rejected');
assert(forgedTokenReq.status === 401, 'Forged token returns HTTP 401');
assert(db.applications.length === initialCount, 'No records removed on forged token');

// Test D: Request with valid session token but non-existent ID
const notFoundReq = db.handleApplicationRemoval({
  token: loginOk.token,
  applicationId: 'UVN-DOES-NOT-EXIST'
});
assert(notFoundReq.success === false, 'Non-existent application ID returns error');
assert(notFoundReq.status === 404, 'Non-existent application returns HTTP 404');
assert(db.applications.length === initialCount, 'No records removed on 404');

// Test E: Authorized Admin deletion of target candidate
const validDeleteReq = db.handleApplicationRemoval({
  token: loginOk.token,
  applicationId: 'UVN-TEST-DELETE-TARGET'
});
assert(validDeleteReq.success === true, 'Authorized admin deletes target candidate successfully (HTTP 200)');
assert(validDeleteReq.applicationId === 'UVN-TEST-DELETE-TARGET', 'Returns confirmed deleted applicationId');
assert(db.applications.length === initialCount - 1, 'Exactly one application record was removed');
assert(!db.applications.some(a => a.id === 'UVN-TEST-DELETE-TARGET'), 'Target application is no longer in database');

// Test F: Integrity check - ensure all other candidate records remain untouched
const remainingIds = db.applications.map(a => a.id);
assert(remainingIds.includes('UVN-20261103-EF7272B9'), 'Candidate EF7272B9 preserved');
assert(remainingIds.includes('UVN-20261103-2C25AD37'), 'Candidate 2C25AD37 preserved');
assert(remainingIds.includes('UVN-20261103-FC5A5F76'), 'Candidate FC5A5F76 preserved');
assert(remainingIds.includes('UVN-20261104-980D5119'), 'Candidate Eswar (980D5119) preserved');

// Test G: Verify Activity Log
assert(db.activityLog.length >= 2, 'Activity log entries recorded');
const deleteLog = db.activityLog.find(l => l.action === 'APPLICATION_DELETED');
assert(deleteLog !== undefined, 'Activity Log contains APPLICATION_DELETED entry');
assert(deleteLog.appId === 'UVN-TEST-DELETE-TARGET', 'Log records deleted Application ID');
assert(deleteLog.performedBy === 'admin', 'Log records administrator identity');

console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
}

