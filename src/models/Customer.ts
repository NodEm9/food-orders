import mongoose, { Document, Schema } from "mongoose";
import { OrderDoc } from "./Order";


export interface CustomerDoc extends Document {
	email: string;
	password: string;
	salt: string;
	firstName: string;
	lastName: string;
	address: string;
	phone: string;
	otp: number;
	otp_expiry: Date;
	verified: boolean;
	lat: number;
	lng: number;
	cart: [any];
	orders: [OrderDoc]
}


const CustomerSchema = new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	salt: { type: String, required: true },
	firstName: { type: String },
	lastName: { type: String},
	address: { type: String },
	phone: { type: String, required: true },
	otp: { type: Number, required: true },
	verified: { type: Boolean, default: false },
	otp_expiry: { type: Date, required: true },
	lat: { type: Number },
	lng: { type: Number },
	cart: [
		{
			food: { type: Schema.Types.ObjectId, ref: 'food', required: true },
			unit: { type: Number, required: true },
		}
	],
	orders: [
		{
			type: Schema.Types.ObjectId,
			ref: 'order'
		}
	]
},
	{ 
		toJSON: {
			transform(doc, ret) {
				delete ret.password;
				delete ret.salt;
				delete ret.__v;
				delete ret.createdAt;
				delete ret.updatedAt;
			}
		},
		
		timestamps: true
	});


const Customer = mongoose.model<CustomerDoc>("customer", CustomerSchema);
	
export { Customer };