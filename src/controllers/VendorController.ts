import { Request, Response, NextFunction } from 'express';
import { CreateOfferInput, EditVendorInput, VendorLoginInput } from '../dto';
import { FindVendor } from './AdminController';
import { GenerateSignature, validatePassword } from '../utilities';
import { CreateFoodInput } from '../dto';
import { Food, Offer, Order } from '../models';

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

	const { lat, lng } = req.body;

	if (user) {
		const existingVendor = await FindVendor({ _id: user._id });
		if (existingVendor !== null) {
			existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

			if (lat && lng) {
				existingVendor.lat = lat;
				existingVendor.lng = lng;
			}

			const saveVendor = await existingVendor.save();
			return res.json(saveVendor);
		}

		return res.json(existingVendor);
	}

	return res.json({ message: 'Vendor information not found!' });
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

			return res.json(saveFood);
		}
	}

	return res.json({ message: 'Something went wrong!' });
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

export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;

	if (user) {
		const orders = await Order.find().populate('items.food');
		if (orders !== null) {
			return res.status(200).json(orders);
		}
	}

	return res.json({ message: 'Orders not found!' });
}
export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {
	const orderId = req.params.id;

	const { status, remarks, time } = req.body;

	if (orderId) {

		const order = await Order.findById(orderId).populate('items.food');

		order.orderStatus = status;
		order.remarks = remarks;
		if (time) order.readyTime = time;

		const saveOrder = await order.save();
		if (saveOrder !== null) return res.status(200).json(saveOrder);
	}

	return res.status(500).json({ message: 'Unable to process order!' });
}

export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {

	const orderId = req.params.id;

	if (orderId) {
		const order = await Order.findById({ _id: orderId }).populate('items.food');
		if (order !== null) {
			return res.status(200).json(order);
		}
 
	}

	return res.json({ message: 'Orders not found!' });

}


export const AddOffer = async (
	req: Request, res: Response, next: NextFunction
) => {
	const user = req.user;
	const vendorId = { _id: user._id };

	if (user) {
		const { title, description, offerType, offerAmount, startDate, endDate, promoCode, promoType, pincode, bank, bins, minValue, isActive } = <CreateOfferInput>req.body;

		const vendor = await FindVendor(vendorId);

		if (vendor) {
			const offer = await Offer.create({
				offerType,
				vendors: vendor,
				title,
				description,
				minValue,
				offerAmount,
				startDate,
				endDate,
				promoCode,
				promoType,
				bank,
				bins,
				pincode,
				isActive
			});

			console.log(offer);
			return res.json(offer);
		}
	}

	return res.json({ message: 'Create Offer Unsuccessful!' });
}

export const GetOffers = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;

	if (user) {
		let currentOffers = [];
		const offers = await Offer.find().populate('vendors');

		if (offers) {

			offers.map((item) => {
				if (item.vendors) {
					item.vendors.map((vendor) => {
						if (vendor._id.toString() === user._id) {
							currentOffers.push(item);
						}
					});
				}

				if (item.offerType === 'GENERIC') {
					currentOffers.push(item);
				}
			})
		}

		return res.json(currentOffers);
	}

	return res.json({ message: 'Offers not available!' });
}
export const EditOffer = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const offerId = req.params.id;
	const vendorId = { _id: user._id };

	if (user) {
		const { title, description, offerType, offerAmount, startDate, endDate, promoCode, promoType, pincode, bank, bins, minValue, isActive } = <CreateOfferInput>req.body;

		const currentOffers = await Offer.findById(offerId);

		if (currentOffers) {

			const vendor = await FindVendor(vendorId);

			if (vendor) {
				currentOffers.offerType = offerType;
				currentOffers.title = title;
				currentOffers.description = description;
				currentOffers.minValue = minValue;
				currentOffers.offerAmount = offerAmount;
				currentOffers.startDate = startDate;
				currentOffers.endDate = endDate;
				currentOffers.promoCode = promoCode;
				currentOffers.promoType = promoType;
				currentOffers.bank = bank;
				currentOffers.bins = bins;
				currentOffers.pincode = pincode;
				currentOffers.isActive = isActive;

				const result = await currentOffers.save();
				console.log(result);

				return res.json(result);
			}
		}
	}
	return res.json({ message: 'Unable to Edit Offer!' })
}