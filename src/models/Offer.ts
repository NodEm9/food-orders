import mongoose, { Document, Schema } from "mongoose";


export interface OfferDoc extends Document {
	offerType: string;
	vendors: [any]
	title: string;
	description: string;
	minValue: number;
	offerAmount: number;
	startDate: Date;
	endDate: Date;
	promoCode: string;
	promoType: string; // USER / ALL / BANK / CARD 
	bank: [any];
	bins: [any];
	pincode: string;
	isActive: boolean;

}


const OfferSchema = new Schema({
	offerType: {
		type: String, required: true
	},
	vendors: [
		{
			type: Schema.Types.ObjectId, ref: "vendor" 
		}
	],
	title: { type: String, required: true },
	description: String,
	minValue: { type: Number, required: true },
	offerAmount: { type: Number, required: true },
	startDate: Date,
	endDate: Date,
	promoCode: { type: String, required: true },
	promoType: { type: String, required: true },
	bank: [{type: String }],
	bins: [{ type: Number}],
	pincode: {
		type: String, required: true
	},
	isActive: Boolean,

},
	{ 
		toJSON: {
			transform(doc, ret) {
				delete ret.__v;
			}
		},
		
		timestamps: true
	});


const Offer = mongoose.model<OfferDoc>("offer", OfferSchema);
	
export { Offer };