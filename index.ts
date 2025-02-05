import express from 'express';
import cors from 'cors';
import path from 'path';

import mongoose from 'mongoose';
import { MONGO_URI } from './config';
import { AdminRoute, VendorRoute } from './routes';

mongoose.connect(MONGO_URI).then(() => {
	console.log('Database is connected');
}).catch((error) => console.log(error));


const app = express();

app.use(express.json());
// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/admin', AdminRoute);
app.use('/vendor', VendorRoute);

app.listen(8080, () => { 
	console.clear();
	console.log('Server is running on port 8080'); 
});