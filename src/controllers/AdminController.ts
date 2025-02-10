import { Request, Response, NextFunction } from 'express';
import { CreateVendorInput } from '../dto';
import { DeliveryUser, Transaction, Vendor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utilities';
import { FindVendorProps } from '../dto';


export const FindVendor = async ({ _id, email }: FindVendorProps) => {
	if (email) {
		return await Vendor.findOne({ email: email });
	} else {
		return await Vendor.findById(_id);
	}
}

export const CreateVendor = async (
	req: Request, res: Response, next: NextFunction
) => {
	const {
		name, ownerName, foodTypes, pincode, email, password, phone, address
	} = <CreateVendorInput>req.body;

	const existingVendor = await FindVendor({ email: email });
	if (existingVendor) {
		res.json({ message: "Vendor already exists" });
	}

	const salt = await GenerateSalt();
	const hashedPassword = await GeneratePassword(password, salt)

	const createVendor = await Vendor.create({
		name: name,
		ownerName: ownerName,
		foodTypes: foodTypes,
		pincode: pincode,
		email: email,
		password: hashedPassword,
		phone: phone,
		address: address,
		salt: salt,
		serviceAvailable: false,
		coverImage: [],
		foods: [],
		lat: 0,
		lng: 0
	})

	res.json(createVendor);

}

export const GetVendors = async (
	req: Request, res: Response, next: NextFunction
) => {
	const vendors = await Vendor.find();
	if (vendors !== null) {
		return res.json(vendors);
	}

	return res.status(200).json({ message: "Returning all vendor records" });
}

export const GetVendorById = async (
	req: Request, res: Response, next: NextFunction
) => {
	const vendorId = req.params.id;
	const vendor = await FindVendor({ _id: vendorId });
	if (vendor !== null) {
		res.json(vendor);
	}

	res.json({ message: "Vendor not found" });
}

export const GetTransactions = async (
	req: Request, res: Response, next: NextFunction
) => {

	const transaction = await Transaction.find();

	if (transaction) {
		return res.status(200).json(transaction);
	}

	res.json({ message: "Transaction not available" });
}

export const GetTransactionById = async (
	req: Request, res: Response, next: NextFunction
) => {
	const id = req.params.id;
	const transaction = await Transaction.findById(id);

	if (transaction) {
		return res.status(200).json(transaction);
	}

	res.json({ message: "Transaction not available" });
}

export const VerifyDeliveryUser = async (req: Request, res: Response, next: NextFunction) => {
	const { _id, status } = req.body;

	if (_id) {
		
		const profile = await DeliveryUser.findById(_id);

		if (profile) {
			profile.verified = status;
			const result = await profile.save();

			return res.status(200).json(result);
		}
	}

	return res.status(400).json({ message: 'Unable to verify delivery user!' });
}
export const  GetDeliveryUsers = async (req: Request, res: Response, next: NextFunction) => {

		const deliveryUsers = await DeliveryUser.find();

		if (deliveryUsers) {
			return res.status(200).json(deliveryUsers);
		}

	return res.status(400).json({ message: 'No delivery user found!' });
}