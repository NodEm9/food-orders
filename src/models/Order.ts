import mongoose, { Schema, Document } from "mongoose";

export interface OrderDoc extends Document {
	orderId: string;
	vendorId: string;
	items: [any];
	totaAmount: number;
	orderDate: Date;
	paidThrough: string;
	paymentStatus: string;
	orderStatus: "WAITING" | "ACCEPT" | "PROCESSING" | "DELIVERED" | "REJECTED" | "CANCELLED";
	remarks: string;
	deliveryId: string;
	appliedOffers: boolean;
	offerId: string;
	readyTime: number;
}

const OrderSchema = new Schema({
	orderId: {
		type: String,
		required: true
	},
	vendorId: {
		type: String,
		required: true
	},
	items: {
		food: { type: Schema.Types.ObjectId, ref: "food" },
		unit: { type: Number }
	},
	totalAmount: {
		type: Number,
		required: true
	},
	orderDate: { type: Date },
	paidThrough: { type: String},
	paymentStatus: { type: String },
	orderStatus: { type: String },
	remarks: { type: String },
	deliveryId: { type: String },
	appliedOffers: { type: Boolean },
	offerId: { type: String },
	readyTime: { type: Number }
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

const Order = mongoose.model<OrderDoc>("order", OrderSchema);

export { Order };