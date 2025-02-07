import express from 'express';
import { CreateVendor, GetVendors, GetVendorById } from '../controllers';

const router = express.Router();

router.post('/vendor', CreateVendor);

router.get('/vendor', GetVendors);
router.get('/vendor/:id', GetVendorById);

export { router as AdminRoute };