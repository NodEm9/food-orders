import { Request, Response, NextFunction } from 'express';
import { EditVendorInput, VendorLoginInput } from '../dto';
import { FindVendor } from './AdminController';
import { GenerateSignature, validatePassword } from '../utilities';
import { CreateFoodInput } from '../dto/Food.dto';
import { Food } from '../models/Food';

export const VendorLogin = async (
	req: Request, res: Response, next: NextFunction
) => {
	const { email, password } = <VendorLoginInput>req.body;

	const existingVendor = await FindVendor({ email: email });
	if (existingVendor !== null) {
		const isPasswordValid = await validatePassword(password, existingVendor.password, existingVendor.salt);
		if (isPasswordValid) {
			const signature = GenerateSignature({
				_id: existingVendor.id,
				email: existingVendor.email,
				name: existingVendor.name,
				foodTypes: existingVendor.foodTypes
			})

			res.json(signature);
		} else {
			res.json({ message: 'Invalid credentials!' });
		}
	} else {
		res.status(404).json({ message: 'Vendor not found!' });
	}
}

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	if (user) {
		const existingVendor = await FindVendor({ _id: user._id });
		if (existingVendor) {
			res.json(existingVendor);
		} else {
			res.status(401).json({ message: 'Unauthorized!' });
		}
	} else {
		res.status(404).json({ message: 'Vendor information not found!' });
	}

}

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
	const { name, foodTypes, phone, address } = <EditVendorInput>req.body;
	const user = req.user;
	if (user) {
		const existingVendor = await FindVendor({ _id: user._id });
		if (existingVendor !== null) {
			existingVendor.name = name;
			existingVendor.foodTypes = foodTypes;
			existingVendor.phone = phone;
			existingVendor.address = address;

			const saveVendor = await existingVendor.save();
			res.json(saveVendor);
		}
	} else {
		res.status(404).json({ message: 'Vendor Information not found!' });
	}

}

export const UpdateVendorCoverageImage = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	if (user) {
		const vendor = await FindVendor({ _id: user._id });
		if (vendor !== null) {
			const files = req.files as [Express.Multer.File];
			const images = files.map((files: Express.Multer.File) => files.filename);
			vendor.coverImages.push(...images);
			const result = await vendor.save();
			res.json(result);
		} else {
			res.json({ message: 'Something went wrong!' });
		}
	}
}

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	if (user) {
		const existingVendor = await FindVendor({ _id: user._id });
		if (existingVendor !== null) {
			existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
			const saveVendor = await existingVendor.save();
			res.json(saveVendor);
		}
	}
}

export const AddFood = async (
	req: Request, res: Response, next: NextFunction) => {
	const user = req.user;

	if (user) {
		const { name, description, price, foodType, category, readyTime } = <CreateFoodInput>req.body;
		const vendor = await FindVendor({ _id: user._id });
		if (vendor !== null) {
			const files = req.files as [Express.Multer.File];
			const images = files.map((files: Express.Multer.File) => files.filename);
			const food = await Food.create({
				vendorId: vendor.id,
				name: name,
				description: description,
				price: price,
				foodType: foodType,
				category: category,
				readyTime: readyTime,
				images: images,
				rating: 0
			});

			await vendor.foods.push(food);
			const saveFood = await vendor.save();
			res.json(saveFood);
		} else {
			res.json({ message: 'Something went wrong!' });
		}
	}
}

export const GetFood = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	if (user) {
		const foods = await Food.find({ vendorId: user._id });
		if (foods !== null) res.json(foods);

	} else {
		res.json({ message: 'Food information not available!' });
	}
}