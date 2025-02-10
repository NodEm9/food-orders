import express from 'express';
import {
	CreateVendor,
	GetVendors,
	GetVendorById,
	GetTransactions,
	GetTransactionById,
	VerifyDeliveryUser,
	GetDeliveryUsers
} from '../controllers';

const router = express.Router();

router.post('/vendor', CreateVendor);

router.get('/vendors', async (req, res, next) => { await GetVendors(req, res, next) });
router.get('/vendor/:id', GetVendorById);

router.get('/transactions', async (req, res, next) => { await GetTransactions(req, res, next) });
router.get('/transaction/:id', async (req, res, next) => { await GetTransactionById(req, res, next) });

router.get('/delivery', async (req, res, next) => { await GetDeliveryUsers(req, res, next) });
router.put('/delivery', async (req, res, next) => { await VerifyDeliveryUser(req, res, next) });



export { router as AdminRoute }; 