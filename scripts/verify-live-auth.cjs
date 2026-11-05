/**
 * UNGAL VIJAY NAALITHAZH — Live Backend Verification Script
 * 
 * Tests the live Google Apps Script endpoint after deployment:
 * 1. Health check (action=ping)
 * 2. Server-side rejection of invalid credentials (action=adminLogin with wrong password)
 * 3. Server-side issuance of signed session token (action=adminLogin with correct credentials)
 * 4. Protection of deleteApplication (rejection without token & rejection with forged token)
 */

const testUrl = 'https://script.google.com/macros/s/AKfycbws6g8Sg1jyCmDt9EWLZgiDW-DTqUn1w4L-RfppzqfHSe_HFHrJTJZW1iP-Iww_N9eNFQ/exec';

async function verifyLive() {
  console.log('================================================================');
  console.log('PROBING LIVE GOOGLE APPS SCRIPT WEB APP ENDPOINT');
  console.log(`URL: ${testUrl}`);
  console.log('================================================================\n');

  // Test 1: Ping
  console.log('1. Testing Health Check (action: ping)...');
  try {
    const pingRes = await fetch(`${testUrl}?action=ping`);
    const pingText = await pingRes.text();
    console.log(`   HTTP ${pingRes.status}: ${pingText.slice(0, 100)}`);
  } catch (err) {
    console.error(`   Failed to connect: ${err.message}`);
    return;
  }

  // Test 2: Admin Login with incorrect password
  console.log('\n2. Testing Server-Side Login Rejection (Wrong Password)...');
  try {
    const badLoginRes = await fetch(testUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'adminLogin',
        username: 'admin',
        password: 'incorrect_password_123'
      })
    });
    const badLoginText = await badLoginRes.text();
    console.log(`   HTTP ${badLoginRes.status}: ${badLoginText}`);
    const isSuccessFalse = badLoginText.includes('"success":false');
    const isInvalidCreds = badLoginText.includes('Invalid administrative');
    if (isSuccessFalse && isInvalidCreds) {
      console.log('   [SUCCESS] Live backend successfully verified and rejected wrong password!');
    } else if (badLoginText.includes('Invalid action')) {
      console.log('   [NOTE] Live backend has not yet updated to latest Code.gs (returned "Invalid action: adminLogin").');
      console.log('   Please copy google-apps-script/Code.gs into Apps Script and deploy New Version.');
      return;
    }
  } catch (err) {
    console.error(`   Request failed: ${err.message}`);
  }

  // Test 3: Admin Login with valid credentials
  console.log('\n3. Testing Server-Side Login & Token Issuance (admin / uvn2026)...');
  let sessionToken = null;
  try {
    const loginRes = await fetch(testUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'adminLogin',
        username: 'admin',
        password: 'uvn2026'
      })
    });
    const loginText = await loginRes.text();
    console.log(`   HTTP ${loginRes.status}: ${loginText.slice(0, 200)}...`);
    try {
      const data = JSON.parse(loginText);
      if (data.success && data.token) {
        sessionToken = data.token;
        console.log('   [SUCCESS] Cryptographically signed session token received:');
        console.log(`   Token prefix: ${sessionToken.slice(0, 35)}...`);
        console.log(`   Expires in: ${Math.round((data.expiresAt - Date.now()) / 60000)} minutes`);
      }
    } catch {
      console.log('   Unable to parse login response as JSON');
    }
  } catch (err) {
    console.error(`   Request failed: ${err.message}`);
  }

  // Test 4: Delete Application without token
  console.log('\n4. Testing Deletion Guard without token...');
  try {
    const noTokenRes = await fetch(testUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'deleteApplication',
        applicationId: 'UVN-NONEXISTENT-TEST'
      })
    });
    const noTokenText = await noTokenRes.text();
    console.log(`   HTTP ${noTokenRes.status}: ${noTokenText}`);
    if (noTokenText.includes('"success":false')) {
      console.log('   [SUCCESS] Unauthenticated deletion correctly blocked by server!');
    }
  } catch (err) {
    console.error(`   Request failed: ${err.message}`);
  }

  // Test 5: Delete Application with forged token
  console.log('\n5. Testing Deletion Guard with forged token...');
  try {
    const forgedRes = await fetch(testUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'deleteApplication',
        token: 'fake.jwt.token',
        applicationId: 'UVN-NONEXISTENT-TEST'
      })
    });
    const forgedText = await forgedRes.text();
    console.log(`   HTTP ${forgedRes.status}: ${forgedText}`);
    if (forgedText.includes('"success":false')) {
      console.log('   [SUCCESS] Forged token correctly rejected by server!');
    }
  } catch (err) {
    console.error(`   Request failed: ${err.message}`);
  }

  console.log('\n================================================================');
  console.log('LIVE VERIFICATION PROBE COMPLETE');
  console.log('================================================================\n');
}

verifyLive();
