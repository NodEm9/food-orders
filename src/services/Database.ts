import "dotenv/config";
import mongoose from "mongoose";

export default async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI) 
		console.log('Connected to the database');
	} catch (error) {
		console.log('Error connecting to the database');
		console.log(error)
	}
}