import mongoose, { Schema, Document } from "mongoose";

export interface IFood extends Document {
	vendorId: string;
	name: string;
	description: string;
	price: number;
	foodType: string;
	category: string;
	readyTime: number;
	rating: number;
	images: [string]; 
}
 
const FoodSchema = new Schema({
	vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
	name: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	foodType: { type: String, required: true },
	category: { type: String },
	readyTime: { type: Number, required: true },
	rating: { type: Number },
	images: { type: [String] }	
}, {
	toJSON: {
		transform: function (doc, ret) {
			delete ret.__v;
			delete ret._createdAt;
			delete ret._updatedAt;	
		}
	},
	timestamps: true
});

const Food = mongoose.model<IFood>('food', FoodSchema);

export { Food };