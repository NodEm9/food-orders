import mongoose, { Document, Schema } from "mongoose";


export interface DeliveryDoc extends Document {
	email: string;
	password: string;
	salt: string;
	firstName: string;
	lastName: string;
	address: string;
	phone: string;
	verified: boolean;
	pincode: string;
	lat: number;
	lng: number;
	isAvailable: boolean;	
}


const DeliverySchema = new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	salt: { type: String, required: true },
	firstName: { type: String },
	lastName: { type: String},
	address: { type: String },
	phone: { type: String, required: true },
	verified: { type: Boolean, default: false },
	pincode: { type: String },
	lat: { type: Number },
	lng: { type: Number },
	isAvailable: { type: Boolean }
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


const DeliveryUser = mongoose.model<DeliveryDoc>("deliveryuser", DeliverySchema);
	
export { DeliveryUser };