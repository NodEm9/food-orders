import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import {
	CreateCustomerInputs,
	UserLoginInputs,
	EditCustomerProfileInputs,
	OrderInputs
} from '../dto/Customer.dto';
import { validate, } from 'class-validator';
import {
	GenerateOtp,
	GeneratePassword,
	GenerateSalt,
	GenerateSignature,
	onRequestOTP,
	validatePassword
} from '../utilities';
import { Customer } from '../models/Customer';
import { Food } from '../models/Food';
import { Order } from '../models/Order';


export const CustomerSignUp = async (
	req: Request, res: Response, next: NextFunction
) => {

	const customerInputs = plainToClass(CreateCustomerInputs, req.body);

	const inputErrors = await validate(customerInputs, { validationError: { target: true } });
	if (inputErrors.length > 0) res.status(400).json({ errors: inputErrors });

	const { email, password, phone } = customerInputs;

	const existingCustomer = await Customer.findOne({ email: email });
	if (existingCustomer) {
		return res.status(400).json({ message: 'Email already exists' });
	}

	const salt = await GenerateSalt();
	const userPassword = await GeneratePassword(password, salt);
	const { otp, expiry } = GenerateOtp();


	const result = await Customer.create({
		email: email,
		password: userPassword,
		salt: salt,
		phone: phone,
		otp: otp,
		otp_expiry: expiry,
		firstName: '',
		lastName: '',
		address: '',
		verified: false,
		lat: 0,
		lng: 0,
		orders: []
	});

	if (result) {
		await onRequestOTP(otp, phone);

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

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {

	const loginInputs = plainToClass(UserLoginInputs, req.body);

	const loginErrors = await validate(loginInputs, { validationError: { target: false } });

	if (loginErrors.length > 0) res.status(400).json({ errors: loginErrors });
	const { email, password } = loginInputs;
	const customer = await Customer.findOne({ email: email });

	if (customer) {

		const validation = await validatePassword(password, customer.password, customer.salt);
		if (validation) {
			const signature = GenerateSignature({
				_id: customer.id,
				email: customer.email,
				verified: customer.verified,
			})
			res.status(201).json({
				signature: signature,
				verified: customer.verified,
				email: customer.email
			});
		}
	} else {
		res.status(400).json({ message: 'Invalid email or password' });
	}
}

export const VerifyCustomer = async (req: Request, res: Response, next: NextFunction) => {
	const { otp } = req.body;

	const customer = req.user;

	if (customer) {
		const profile = await Customer.findById(customer._id);
		const verifiedCustomer = {
			otp: profile?.otp === parseInt(otp),
			otp_expiry: profile?.otp_expiry! >= new Date(),
			verified: true
		};

		if (!profile) {
			res.status(400).json({ message: 'An error occurred with OTP validation.' });
		} else {
			if (verifiedCustomer)
				profile.verified = verifiedCustomer.verified;
			const updateCustomer = await profile.save();

			const signature = GenerateSignature({
				_id: updateCustomer.id,
				email: updateCustomer.email,
				verified: updateCustomer.verified,
			})

			res.status(200).json({
				signature: signature,
				verified: updateCustomer.verified,
				email: updateCustomer.email
			});

		}
	}
}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {
	const customer = req.user;

	if (customer) {
		const profile = await Customer.findById(customer._id);
		const { otp, expiry } = GenerateOtp();
		if (profile) {
			profile.otp = otp;
			profile.otp_expiry = expiry;
			await profile.save();
			await onRequestOTP(otp, profile.phone);
			return res.status(200).json({ message: 'OTP sent to provided number successfully' });
		}
	}

	return res.status(400).json({ message: 'An error occurred while sending OTP' });
}

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
	const customer = req.user;
	if (customer) {
		const profile = await Customer.findById(customer._id);
		if (profile) return res.status(200).json(profile);
	}

	return res.status(400).json({ message: 'Error Fetching Profile!' });

}

export const EditCustomerProfile = async (
	req: Request, res: Response, next: NextFunction
) => {
	const customer = req.user;

	const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);
	const profileErrors = await validate(profileInputs, { validationError: { target: false } });

	if (profileErrors.length > 0) return res.status(400).json({ errors: profileErrors });

	const { firstName, lastName, address } = profileInputs;

	if (customer) {
		const profile = await Customer.findById(customer._id);

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

/**------- Cart Section ----------- */
export const AddToCart = async (
	req: Request, res: Response, next: NextFunction
) => {
	const customer = req.user;

	if (customer) {
		const profile = await Customer.findById(customer._id).populate('cart.food');
		let cartItems = [];

		const { _id, unit } = <OrderInputs>req.body;

		const food = await Food.findById(_id);

		if (food) {

			if (profile != null) {
				cartItems = profile.cart;

				if (cartItems.length > 0) {
					const existingItem = cartItems.filter((item) => item.food._id.toString() === _id.toString());

					if (existingItem.length > 0) {
						const index = cartItems.indexOf(existingItem[0]);
						if (unit > 0) {
							cartItems[index] = { food, unit };
						} else {
							cartItems.splice(index, 1);
						}

					} else {
						cartItems.push({ food, unit });
					}
				} else {
					cartItems.push({ food, unit });
				}
				if (cartItems) {
					profile.cart = cartItems as any;
					const cartResult = await profile.save();
					return res.status(201).json(cartResult.cart);
				}
			}

		}

	}

	return res.status(400).json({ message: 'Error Adding to Cart!' });

}

export const GetCart = async (
	req: Request, res: Response, next: NextFunction
) => {
	const customer = req.user;
	if (customer) {
		const profile = await Customer.findById(customer._id).populate('cart.food');
		if (profile) return res.status(200).json(profile.cart);
	}

	return res.status(400).json({ message: 'Cart is empty!' });
}

export const DeleteCart = async (
	req: Request, res: Response, next: NextFunction
) => {
	const customer = req.user;
	if (customer) {
		const profile = await Customer.findById(customer._id).populate('cart.food');
		if (profile != null) {
			profile.cart = [] as any;

			const result = await profile.save();
			return res.status(200).json(result.cart);
		}
	}
}

/**------- Order Section ----------- */
export const CreateOrder = async (
	req: Request, res: Response, next: NextFunction
) => {

	const customer = req.user;
	if (customer) {
		const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
		const profile = await Customer.findById(customer._id);

		const cart = <[OrderInputs]>req.body;

		let cartItems = [];

		let netAmount = 0.0;

		let vendorId;
		const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec();

		foods.map(food => {
			cart.map(({ _id, unit }) => {
				if (food._id == _id) {
					vendorId = food.vendorId;
					netAmount += (food.price * unit);
					cartItems.push({ food, unit }); // Add food and unit to cartItems
				}
			})
		})

		if (cartItems) {
			const currentOrder = await Order.create({
				orderId: orderId,
				vendorId: vendorId,
				items: cartItems,
				totalAmount: netAmount,
				orderDate: new Date(),
				paidThrough: 'COD',
				paymentStatus: '',
				orderStatus: 'WAITING',
				remarks: '',
				deliveryId: '',
				appliedOffers: false,
				offerId: null,
				readyTime: 45
			})

				profile.cart = [] as any;
				profile.orders.push(currentOrder);
				await profile.save();

				return res.status(201).json(currentOrder);

		}

	}
	return res.status(400).json({ message: 'Error Creating Order!' });

}

export const GetOrderList = async (
	req: Request, res: Response, next: NextFunction
) => {

	const customer = req.user;
	if (customer) {
		const profile = await Customer.findById(customer._id).populate('orders');
		if (profile) return res.status(200).json(profile.orders);
	}

	return res.status(400).json({ message: 'Error Fetching Orders!' });
}

export const GetOrderById = async (
	req: Request, res: Response, next: NextFunction
) => {
	const orderId = req.params.id;

	if (orderId) {
		const order = await Order.findById(orderId).populate('items.food');
		if (order) return res.status(200).json(order);
	}

}