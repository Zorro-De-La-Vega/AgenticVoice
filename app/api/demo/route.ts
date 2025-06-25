import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';
import DemoRequest from '@/models/DemoRequest';

export async function POST(req: Request) {
  try {
    // Connect to the database
    await connectMongo();
    
    // Get request data
    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'practiceType', 'preferredTime', 'agreeToTerms'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Create a new demo request in the database
    const demoRequest = await DemoRequest.create(data);
    
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
    console.error('Error creating demo request:', error);
    
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
