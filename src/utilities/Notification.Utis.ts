import "dotenv/config";
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "../config";

export const GenerateOtp = () => {
	const otp = Math.floor(100000 + Math.random() * 900000);
	let expiry = new Date()
	expiry.setTime(new Date().getTime() + 600000) // 10 minutes
	return { otp, expiry }
}

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
	const accountSid = TWILIO_ACCOUNT_SID;
	const authToken = TWILIO_AUTH_TOKEN;
	const client = require('twilio')(accountSid, authToken);

	const message = await client.messages.create({
		body: `Your OTP is ${otp}`,
		from: "+16205079823",
		to: `+49${toPhoneNumber}`
	});

	return message;

}