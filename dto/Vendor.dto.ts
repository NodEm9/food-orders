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