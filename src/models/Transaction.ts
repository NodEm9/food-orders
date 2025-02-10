import mongoose, { Schema, Document } from "mongoose";

export interface TransactionDoc extends Document {
	customer: string;
	vendorId: string;
	orderId: string;
	ordervalue: number;
	offerUsed: string;
	paymentMode: string;
	paymentResponse: string;
	status: string;
}
 
const TransactionSchema = new Schema({
	customer: String,
	vendorId: String,
	orderId: String,
	ordervalue: Number,
	offerUsed: String	,
	paymentMode: String,
	paymentResponse: String,
	status: String
}, {
	toJSON: {
		transform: function (doc, ret) {
			delete ret.__v;	
		}
	},
	timestamps: true
});

const Transaction = mongoose.model<TransactionDoc>('transaction', TransactionSchema);

export { Transaction };