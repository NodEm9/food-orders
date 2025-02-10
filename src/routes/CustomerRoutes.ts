import express from 'express';
import {
	AddToCart,
	CreateOrder,
	CreatePayment,
	CustomerLogin,
	CustomerSignUp,
	DeleteCart,
	EditCustomerProfile,
	GetCart,
	GetCustomerProfile,
	GetOrderById,
	GetOrderList,
	RequestOtp,
	VerifyCustomer,
	VerifyOffer
} from '../controllers';
import { Authenticate } from '../middlewares';


const router = express.Router();

router.post('/signup', async (req, res, next) => { await CustomerSignUp(req, res, next) });
router.post('/login', CustomerLogin);

router.use(Authenticate);

router.patch('/verify', VerifyCustomer);
router.get('/otp', async (req, res, next) => { RequestOtp(req, res, next) });
router.get('/profile', async (req, res, next) => { GetCustomerProfile(req, res, next) });
router.patch('/profile', async (req, res, next) => { EditCustomerProfile(req, res, next) });

router.post('/cart', async (req, res, next) => { AddToCart(req, res, next) });
router.get('/cart', async (req, res, next) => { GetCart(req, res, next) });
router.delete('/cart', async (req, res, next) => { DeleteCart(req, res, next) });

router.post('/create-payment', async (req, res, next) => { CreatePayment(req, res, next) });

router.post('/create-order', async (req, res, next) => { CreateOrder(req, res, next) });
router.get('/order-list', async (req, res, next) => { GetOrderList(req, res, next) });
router.get('/order/:id', async (req, res, next) => { GetOrderById(req, res, next) });

router.get('/offer/verify/:id', async (req, res, next) => { VerifyOffer(req, res, next) });


export { router as CustomerRoute };    