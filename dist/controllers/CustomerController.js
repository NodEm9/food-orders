"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.VerifyCustomer = exports.CustomerLogin = exports.CustomerSignUp = void 0;
const class_transformer_1 = require("class-transformer");
const Customer_dto_1 = require("../dto/Customer.dto");
const class_validator_1 = require("class-validator");
const utilities_1 = require("../utilities");
const Customer_1 = require("../models/Customer");
const CustomerSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0)
        res.status(400).json({ errors: inputErrors });
    const { email, password, phone } = customerInputs;
    const existingCustomer = yield Customer_1.Customer.findOne({ email: email });
    if (existingCustomer) {
        return res.status(400).json({ message: 'Email already exists' });
    }
    const salt = yield (0, utilities_1.GenerateSalt)();
    const userPassword = yield (0, utilities_1.GeneratePassword)(password, salt);
    const { otp, expiry } = (0, utilities_1.GenerateOtp)();
    const result = yield Customer_1.Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0,
    });
    if (result) {
        yield (0, utilities_1.onRequestOTP)(otp, phone);
        const signature = (0, utilities_1.GenerateSignature)({
            _id: result.id,
            email: result.email,
            verified: result.verified,
        });
        return res.status(201).json({
            signature: signature,
            verified: result.verified,
            email: result.email
        });
    }
    return res.status(400).json({ message: 'An error occurred' });
});
exports.CustomerSignUp = CustomerSignUp;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.UserLoginInputs, req.body);
    const loginErrors = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: false } });
    if (loginErrors.length > 0)
        res.status(400).json({ errors: loginErrors });
    const { email, password } = loginInputs;
    const customer = yield Customer_1.Customer.findOne({ email: email });
    if (customer) {
        const validation = yield (0, utilities_1.validatePassword)(password, customer.password, customer.salt);
        if (validation) {
            const signature = (0, utilities_1.GenerateSignature)({
                _id: customer.id,
                email: customer.email,
                verified: customer.verified,
            });
            res.status(201).json({
                signature: signature,
                verified: customer.verified,
                email: customer.email
            });
        }
    }
    else {
        res.status(400).json({ message: 'Invalid email or password' });
    }
});
exports.CustomerLogin = CustomerLogin;
const VerifyCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id);
        const verifiedCustomer = {
            otp: (profile === null || profile === void 0 ? void 0 : profile.otp) === parseInt(otp),
            otp_expiry: (profile === null || profile === void 0 ? void 0 : profile.otp_expiry) >= new Date(),
            verified: true
        };
        if (!profile) {
            res.status(400).json({ message: 'An error occurred with OTP validation.' });
        }
        else {
            if (verifiedCustomer)
                profile.verified = verifiedCustomer.verified;
            const updateCustomer = yield profile.save();
            const signature = (0, utilities_1.GenerateSignature)({
                _id: updateCustomer.id,
                email: updateCustomer.email,
                verified: updateCustomer.verified,
            });
            res.status(200).json({
                signature: signature,
                verified: updateCustomer.verified,
                email: updateCustomer.email
            });
        }
    }
});
exports.VerifyCustomer = VerifyCustomer;
const RequestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id);
        const { otp, expiry } = (0, utilities_1.GenerateOtp)();
        if (profile) {
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            yield (0, utilities_1.onRequestOTP)(otp, profile.phone);
            return res.status(200).json({ message: 'OTP sent to provided number successfully' });
        }
    }
    return res.status(400).json({ message: 'An error occurred while sending OTP' });
});
exports.RequestOtp = RequestOtp;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id);
        if (profile)
            return res.status(200).json(profile);
    }
    return res.status(400).json({ message: 'Error Fetching Profile!' });
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInputs, req.body);
    const profileErrors = yield (0, class_validator_1.validate)(profileInputs, { validationError: { target: false } });
    if (profileErrors.length > 0)
        return res.status(400).json({ errors: profileErrors });
    const { firstName, lastName, address } = profileInputs;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id);
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = yield profile.save();
            return res.status(200).json(result);
        }
    }
    return res.status(400).json({ message: 'Could not update profile!' });
});
exports.EditCustomerProfile = EditCustomerProfile;
//# sourceMappingURL=CustomerController.js.map