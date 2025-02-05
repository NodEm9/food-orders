import mongoose, { Schema, Document, Model } from "mongoose";

interface IVendorDoc extends Document {
	name: string;
	ownerName: string;
	foodTypes: [string];
	pincode: string;
	email: string;
	password: string;
	phone: string;
	address: string;
	salt: string;
	serviceAvailable: boolean;
	coverImage: [string];
	rating: number;
	foods: any;
}

const VendorSchema = new Schema({
	name: { type: String, required: true },
	ownerName: { type: String, required: true },
	foodTypes: { type: [String] },
	pincode: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	phone: { type: String, required: true },
	address: { type: String },
	salt: { type: String, required: true },
	serviceAvailable: { type: Boolean, default: false },
	coverImage: { type: [String], default: [] },
	rating: { type: Number, default: 0 },
	foods: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "food"
	}],
},
	{ 
		toJSON: {
			virtuals: true,
			transform(doc, ret) {
				delete ret.password;
				delete ret.salt;
				delete ret.__v;
				delete ret.createdAt;
				delete ret.updatedAt;
				delete ret.id;
			}
		},
		
		timestamps: true
	});

const Vendor = mongoose.model<IVendorDoc>("vendor", VendorSchema);

export { Vendor };