// import { Twilio } from 'twilio'

export class SMSService {
  send(message: string, _phoneNumber: string): void {
    // twilio implementation:

    // const client = new Twilio(process.env.TWILIO_SID || '', process.env.TWILIO_AUTH_TOKEN || '')
    // client.messages.create({
    //   body: message,
    //   to: phoneNumber,
    //   from: process.env.TWILIO_PHONE_NUMBER || '',
    // })

    // since I don't have a twilio account I just log the OTP here
    console.log('\n' + message + '\n')
  }
}
