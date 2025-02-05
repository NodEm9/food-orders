import { Request, Response, NextFunction } from 'express';
import { CreateVendorInput } from '../dto';
import { Vendor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utilities';

type FindVendorProps = {
	email: string;
	id?: string;
}

export const FindVendor = async ({ email, id }: FindVendorProps) => {
	if (email) {
		return await Vendor.findOne({ email: email });
	} else {
		return await Vendor.findById(id);
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
	})

	res.json(createVendor);

}

export const GetVendors = async (
	req: Request, res: Response, next: NextFunction
) => {
	const vendors = await Vendor.find();
	if (vendors !== null) {
		res.json(vendors);
	}
	res.status(200).json({ message: "Returning all vendor records" });
}

export const GetVendorById = async (
	req: Request, res: Response, next: NextFunction
) => {
	const vendorId = req.params.id;
	const vendor = await FindVendor({ email: '', id: vendorId });
	if (vendor !== null) {
		res.json(vendor);
	}

	res.json({ message: "Vendor not found" });
}