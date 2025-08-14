import { verifyCredentials } from '../providers/auth-provider';

(async () => {
  const apiKey = '<your-test-api-key>';
  const secretKey = '<your-test-secret-key>';
  const isPaper = true; // Change to false for live environment

  const isValid = await verifyCredentials(apiKey, secretKey, isPaper);

  if (isValid) {
    console.log('Test credentials are valid.');
  } else {
    console.log('Test credentials are invalid.');
  }
})();
