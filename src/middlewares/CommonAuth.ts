import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import { ValidateSignature } from "../utilities";

declare global {
	namespace Express {
		interface Request {
			user?: AuthPayload;
		}
	}
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
	const validate = await ValidateSignature(req);

	if (validate) {
		next();
	} else {
		res.status(401).json({ message: 'Unauthorized!' });
	}
}