import { Request, Response, NextFunction } from 'express';
import { Offer, Vendor } from '../models';
import { IFoodDoc } from '../models/Food';


export const GetFoodAvailability = async (
	req: Request, res: Response, next: NextFunction
) => {

	const pincode = req.params.pincode;
	const result = await Vendor.find({ pincode: pincode, serviceAvailable: false })
		.sort([['rating', 'desc']])
		.populate('foods');

	if (result.length > 0) res.status(200).json(result);

	res.status(400).json({ message: 'Data Not Found!' });
}

export const GetTopRestaurants = async (
	req: Request, res: Response, next: NextFunction
) => {
	const pincode = req.params.pincode;
	const result = await Vendor.find({ pincode: pincode, serviceAvailable: false })
		.sort([['rating', 'desc']]).limit(10);

	if (result.length > 0) res.status(200).json(result);

	res.status(400).json({ message: 'Data Not Found!' });
}

export const GetFoodsIn30Min = async (req: Request, res: Response, next: NextFunction) => {
	const pincode = req.params.pincode;
	const result = await Vendor.find({ pincode: pincode, serviceAvailable: false })
		.populate('foods')

	if (result.length > 0) {
		let foodResult: any = [];
		result.map((vendor) => {
			const foods = vendor.foods as [IFoodDoc];
			foods.map((food) => {
				if (food.readyTime <= 30) {
					foodResult.push({ vendor: vendor, food: food });
				}
			})
		})
		res.status(200).json(foodResult);
	}

	res.status(400).json({ message: 'Data Not Found!' });
}

export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {
	const pincode = req.params.pincode;
	const result = await Vendor.find({ pincode: pincode, serviceAvailable: false })
		.populate('foods')

	if (result.length > 0) {
		let foodResult: any = [];
		result.map((item) => foodResult.push({ foods: item.foods }))
		res.status(200).json(foodResult);
	} else {

		res.status(400).json({ message: 'Data Not Found!' });
	}

}

export const GetRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const result = await Vendor.findById(id).populate('foods');
	if (result) {
		res.status(200).json(result);
	} else {
		res.status(400).json({ message: 'Data Not Found!' });
	}
}

export const GetAvailableOffers = async (req: Request, res: Response, next: NextFunction) => {
	const pincode = req.params.pincode;

	const offers = await Offer.find({ pincode: pincode, isActive: true });

	if (offers.length > 0) {
		return res.status(200).json(offers); 
	}

	return res.status(400).json({ message: 'Offers Not Found!' });

}