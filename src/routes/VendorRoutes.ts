import express, { Request, Response, NextFunction } from 'express';
import {
	AddFood,
	GetCurrentOrders,
	GetFood,
	GetOrderDetails,
	GetVendorProfile,
	ProcessOrder,
	UpdateVendorCoverageImage,
	UpdateVendorProfile,
	UpdateVendorService,
	VendorLogin
} from '../controllers';
import { Authenticate } from '../middlewares';
import multer from 'multer';


const router = express.Router();

const imageStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'images');
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString() + "_" + file.originalname);
	}
});

const images = multer({ storage: imageStorage }).array('images', 10);

router.post('/login', VendorLogin);

router.use(Authenticate);
router.get('/profile', GetVendorProfile);
router.patch('/profile', UpdateVendorProfile);
router.patch('/coverimage', images, UpdateVendorCoverageImage);
router.patch('/service', UpdateVendorService);

router.post('/food', images, async (req, res, next) => { await AddFood(req, res, next) });
router.get('/food', GetFood)

router.get('/orders', async (req, res, next) => { await GetCurrentOrders(req, res, next) });
router.put('/order/:id/process', async (req, res, next) => { await ProcessOrder(req, res, next) });
router.get('orders/:id', async (req, res, next) => { await GetOrderDetails(req, res, next) });

router.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.json({ message: 'Hello from Vendor!' });
});


export { router as VendorRoute }; 