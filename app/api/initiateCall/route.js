import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST() {
  try {
    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials are not set');
    }

    if (!process.env.CRISIS_HOTLINE_NUMBER || !process.env.TWILIO_PHONE_NUMBER) {
      throw new Error('Phone numbers are not set');
    }

    const call = await client.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml', // Replace with your TwiML instructions
      to: process.env.CRISIS_HOTLINE_NUMBER,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    return NextResponse.json({ message: 'Call initiated', callSid: call.sid }, { status: 200 });
  } catch (error) {
    console.error('Detailed error in initiateCall:', error);
    return NextResponse.json({ message: 'Failed to initiate call', error: error.message }, { status: 500 });
  }
}