export interface CreateVendorInput {
	name: string;
	ownerName: string;
	foodTypes: [string];
	pincode: string;
	email: string;
	password: string;
	phone: string;
	address: string;
}

export interface EditVendorInput {
	name: string;
	foodTypes: [string];
	phone: string;
	address: string;
}

export interface VendorLoginInput {
	email: string;
	password: string;
}

export interface VendorPayload {
	_id: string;
	email: string;
	name: string;
	foodTypes: [string];
}

export type FindVendorProps = {
	_id?: string;
	email?: string;
}

export interface CreateOfferInput {
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