import mongoose from "mongoose";
import { MONGO_URI } from "../config";

export default async () => {
	try {
		await mongoose.connect(MONGO_URI)
		console.log('Connected to the database');
	} catch (error) {
		console.log('Error connecting to the database');
		console.log(error)
	}
}