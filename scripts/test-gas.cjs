const testUrl = 'https://script.google.com/macros/s/AKfycbws6g8Sg1jyCmDt9EWLZgiDW-DTqUn1w4L-RfppzqfHSe_HFHrJTJZW1iP-Iww_N9eNFQ/exec';

async function test() {
  console.log('Testing GET request...');
  const getRes = await fetch(testUrl + '?action=ping');
  console.log('GET status:', getRes.status);
  const getText = await getRes.text();
  const getTitle = getText.match(/<title>([^<]+)<\/title>/i);
  console.log('GET Title:', getTitle ? getTitle[1] : 'No title');

  console.log('\nTesting POST request...');
  const postRes = await fetch(testUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'submitApplication',
      payload: {
        state: 'Tamil Nadu',
        district: 'Chennai',
        taluk: 'Mylapore',
        fullName: 'Test Candidate',
        mobileNumber: '9876543210',
        email: 'test@example.com',
        residentialAddress: 'Chennai',
        pinCode: '600004',
        positionAppliedFor: 'Reporter',
        educationalQualification: 'Undergraduate Degree',
        journalismExperience: 'No',
        consent1: true,
        consent2: true,
        consent3: true
      }
    })
  });
  console.log('POST status:', postRes.status);
  const postText = await postRes.text();
  const postTitle = postText.match(/<title>([^<]+)<\/title>/i);
  console.log('POST Title:', postTitle ? postTitle[1] : 'No title');
  
  if (postText.startsWith('{')) {
    console.log('POST JSON response:', postText);
  } else {
    console.log('POST returned non-JSON HTML (length ' + postText.length + ')');
    // Look for error text in HTML
    console.log(postText.slice(0, 1000));
  }
}

test().catch(console.error);
