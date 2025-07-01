import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';
import DemoRequest from '@/models/DemoRequest';

export async function POST(req: Request) {
  console.log('=== DEMO API ROUTE CALLED ===');
  
  try {
    // Connect to the database
    console.log('Attempting to connect to MongoDB...');
    await connectMongo();
    console.log('✅ Connected to MongoDB');
    
    // Get request data
    const data = await req.json();
    console.log('📥 Received data:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'practiceType', 'preferredTime', 'agreeToTerms'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.log('❌ Missing fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    console.log('✅ All required fields present');
    
    // Create a new demo request in the database
    console.log('Creating demo request in database...');
    const demoRequest = await DemoRequest.create(data);
    console.log('✅ Demo request created:', demoRequest._id);
    
    // Return success response with the created demo request
    return NextResponse.json(
      { 
        success: true, 
        message: 'Demo request submitted successfully', 
        data: demoRequest 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error in demo API route:', error);
    console.error('Error stack:', error.stack);
    
    // Return error response
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit demo request', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
