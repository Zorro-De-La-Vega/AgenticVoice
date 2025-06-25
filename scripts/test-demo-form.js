const fetch = require('node-fetch');

// Sample demo request data
const testData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '555-123-4567',
  practiceType: 'solo',
  preferredTime: 'morning',
  message: 'This is a test submission',
  agreeToTerms: true
};

async function testDemoSubmission() {
  try {
    // Submit demo request
    console.log('Submitting test demo request...');
    const response = await fetch('http://localhost:3000/api/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log('Submission result:', result);
    
    if (result.success) {
      console.log('✅ Demo request successfully submitted!');
    } else {
      console.log('❌ Demo request submission failed:', result.error);
    }
  } catch (error) {
    console.error('Error testing demo submission:', error);
  }
}

// Execute the test
testDemoSubmission();
