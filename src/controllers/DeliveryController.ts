import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import {
	UserLoginInputs,
	EditCustomerProfileInputs,
	CreateDeliveryUserInputs
} from '../dto';
import { validate, } from 'class-validator';
import {
	GeneratePassword,
	GenerateSalt,
	GenerateSignature,
	validatePassword,
} from '../utilities';
import { DeliveryUser } from '../models';



export const DeliveryUserSignUp = async (
	req: Request, res: Response, next: NextFunction
) => {

	const deliveryUserInputs = plainToClass(CreateDeliveryUserInputs, req.body);

	const inputErrors = await validate(deliveryUserInputs, { validationError: { target: true } });
	if (inputErrors.length > 0) res.status(400).json({ errors: inputErrors });

	const { email, password, phone, firstName, lastName, address, pincode } = deliveryUserInputs;

	const existingDeliveryUser = await DeliveryUser.findOne({ email: email });

	if (existingDeliveryUser) {
		return res.status(400).json({ message: 'A delivery user exists with the provided email' });
	}

	const salt = await GenerateSalt();
	const userPassword = await GeneratePassword(password, salt);


	const result = await DeliveryUser.create({
		email: email,
		password: userPassword,
		salt: salt,
		phone: phone,
		firstName: firstName,
		lastName: lastName,
		address: address,
		verified: false,
		pincode: pincode,
		lat: 0,
		lng: 0,
		isAvailable: false
	});

	if (result) {

		const signature = GenerateSignature({
			_id: result.id,
			email: result.email,
			verified: result.verified,
		})

		return res.status(201).json({
			signature: signature,
			verified: result.verified,
			email: result.email
		});
	}
	return res.status(400).json({ message: 'An error occurred' });

}

export const DeliveryUserLogin = async (req: Request, res: Response, next: NextFunction) => {

	const loginInputs = plainToClass(UserLoginInputs, req.body);

	const loginErrors = await validate(loginInputs, { validationError: { target: false } });

	if (loginErrors.length > 0) res.status(400).json({ errors: loginErrors });
	const { email, password } = loginInputs;

	const deliveryUser = await DeliveryUser.findOne({ email: email });

	if (deliveryUser) {

		const validation = await validatePassword(password, deliveryUser.password, deliveryUser.salt);
		if (validation) {
			const signature = GenerateSignature({
				_id: deliveryUser.id,
				email: deliveryUser.email,
				verified: deliveryUser.verified,
			})

			return res.status(201).json({
				signature: signature,
				verified: deliveryUser.verified,
				email: deliveryUser.email
			});
		}

	}

	return res.status(400).json({ message: 'Invalid email or password' });
}

export const GetDeliveryUserProfile = async (req: Request, res: Response, next: NextFunction) => {
	const deliveryUser = req.user;

	if (deliveryUser) {
		const profile = await DeliveryUser.findById(deliveryUser._id);
		if (profile) return res.status(200).json(profile);
	}

	return res.status(400).json({ message: 'Error Fetching Profile!' });

}

export const EditDeliveryUserProfile = async (
	req: Request, res: Response, next: NextFunction
) => {
	const deliveryUser = req.user;

	const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);
	const profileErrors = await validate(profileInputs, { validationError: { target: false } });

	if (profileErrors.length > 0) return res.status(400).json({ errors: profileErrors });

	const { firstName, lastName, address } = profileInputs;

	if (deliveryUser) {
		const profile = await DeliveryUser.findById(deliveryUser._id);

		if (profile) {
			profile.firstName = firstName;
			profile.lastName = lastName;
			profile.address = address;

			const result = await profile.save();

			return res.status(200).json(result);
		}
	}

	return res.status(400).json({ message: 'Could not update profile!' });
}

export const UpdateDeliveryUserStatus = async (req: Request, res: Response, next: NextFunction) => {
	const deliveryUser = req.user;

	if (deliveryUser) {

		const { lat, lng } = req.body;
		const profile = await DeliveryUser.findById(deliveryUser._id);

		if (profile) {

			if (lat && lng) {
				profile.lat = lat;
				profile.lng = lng;
			}
			profile.isAvailable = !profile.isAvailable;

			const result = await profile.save();

			return res.status(200).json(result);
		}
	}

	return res.status(400).json({ message: 'Could not update status!' });
}
