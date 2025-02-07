import express from 'express';
import {
	CustomerLogin,
	CustomerSignUp,
	EditCustomerProfile,
	GetCustomerProfile,
	RequestOtp,
	VerifyCustomer
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

// router.delete('/profile');

export { router as CustomerRoute };