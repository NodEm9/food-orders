import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCustomerInputs {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@Length(6, 20)
	password: string;

	@IsString()
	@IsNotEmpty()
	@Length(10, 15)
	phone: string;
}

export class UserLoginInputs {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@Length(6, 20)
	password: string;
}

export class EditCustomerProfileInputs {
	@IsString()
	@IsNotEmpty()
	@Length(3, 20)
	firstName: string;

	@IsString()
	@IsNotEmpty()
	@Length(3, 20)
	lastName: string;

	@IsString()
	@IsNotEmpty()
	@Length(6, 20)
	address: string;
}

export interface CustomerPayload {
	_id: string; 
	email: string;
	verified: boolean;
}


export interface OrderInputs {
	_id: string;
	unit: number;
}