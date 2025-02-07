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
exports.GetVendorById = exports.GetVendors = exports.CreateVendor = exports.FindVendor = void 0;
const models_1 = require("../models");
const utilities_1 = require("../utilities");
const FindVendor = (_a) => __awaiter(void 0, [_a], void 0, function* ({ _id, email }) {
    if (email) {
        return yield models_1.Vendor.findOne({ email: email });
    }
    else {
        return yield models_1.Vendor.findById(_id);
    }
});
exports.FindVendor = FindVendor;
const CreateVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, ownerName, foodTypes, pincode, email, password, phone, address } = req.body;
    const existingVendor = yield (0, exports.FindVendor)({ email: email });
    if (existingVendor) {
        res.json({ message: "Vendor already exists" });
    }
    const salt = yield (0, utilities_1.GenerateSalt)();
    const hashedPassword = yield (0, utilities_1.GeneratePassword)(password, salt);
    const createVendor = yield models_1.Vendor.create({
        name: name,
        ownerName: ownerName,
        foodTypes: foodTypes,
        pincode: pincode,
        email: email,
        password: hashedPassword,
        phone: phone,
        address: address,
        salt: salt,
        serviceAvailable: false,
        coverImage: [],
    });
    res.json(createVendor);
});
exports.CreateVendor = CreateVendor;
const GetVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield models_1.Vendor.find();
    if (vendors !== null) {
        res.json(vendors);
    }
    res.status(200).json({ message: "Returning all vendor records" });
});
exports.GetVendors = GetVendors;
const GetVendorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.params.id;
    const vendor = yield (0, exports.FindVendor)({ _id: vendorId });
    if (vendor !== null) {
        res.json(vendor);
    }
    res.json({ message: "Vendor not found" });
});
exports.GetVendorById = GetVendorById;
//# sourceMappingURL=AdminController.js.map