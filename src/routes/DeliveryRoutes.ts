import express from 'express';
import {
	DeliveryUserLogin,
	DeliveryUserSignUp,
	EditDeliveryUserProfile,
	GetDeliveryUserProfile,
	UpdateDeliveryUserStatus,
} from '../controllers';
import { Authenticate } from '../middlewares';


const router = express.Router();

router.post('/signup', async (req, res, next) => { await DeliveryUserSignUp(req, res, next) });
router.post('/login', async (req, res, next) => { await DeliveryUserLogin(req, res, next) });

router.use(Authenticate);

router.put('/change-status', async (req, res, next) => { UpdateDeliveryUserStatus(req, res, next) });


router.get('/profile', async (req, res, next) => { GetDeliveryUserProfile(req, res, next) });
router.patch('/profile', async (req, res, next) => { EditDeliveryUserProfile(req, res, next) });


export { router as DeliveryRoute };