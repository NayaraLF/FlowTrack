const { OAuth2Client } = require('google-auth-library');

async function test() {
  const googleClient = new OAuth2Client('mock-client-id');
  try {
    // try to verify an invalid token
    await googleClient.verifyIdToken({
      idToken: 'invalid',
      audience: 'my-real-audience'
    });
  } catch (e) {
    console.log("Error details:", e.message);
  }
}
test();
