import "dotenv/config";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config"; 
import { Request } from 'express';
import { AuthPayload } from '../dto/Auth.dto';

export const GenerateSalt = async (): Promise<string> => {
	return await bcrypt.genSalt(10);
}

export const GeneratePassword = async (password: string, salt: string): Promise<string> => {
	return await bcrypt.hash(password, salt);
}

export const validatePassword = async (
	enteredPassword: string,
	savedPassword: string,
	salt: string): Promise<boolean> => {
	return await GeneratePassword(enteredPassword, salt) === savedPassword;
}

export const GenerateSignature = (payLoad: AuthPayload) => {
	return jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: '1d' });

}

export const ValidateSignature = async (req: Request) => {
	const signature = req.headers.authorization;
	if (signature) {
		const payload = jwt.verify(signature.split(' ')[1], process.env.JWT_SECRET) as AuthPayload
		req.user = payload;

		return true;
	}

	return false;
}
