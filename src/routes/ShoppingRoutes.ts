import express from 'express';
import {
	GetFoodAvailability,
	GetFoodsIn30Min,
	GetRestaurantById,
	GetTopRestaurants,
	SearchFoods
} from '../controllers';

const router = express.Router();

router.get('/:pincode', GetFoodAvailability)
router.get('/top-restaurants/:pincode', GetTopRestaurants)
router.get('/restaurant/:id', GetRestaurantById)
router.get('/foods-in-30-mins/:pincode', GetFoodsIn30Min)
router.get('/search/:pincode', SearchFoods)


export { router as ShoppingRoute }; 