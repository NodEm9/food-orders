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
exports.GetFood = exports.AddFood = exports.UpdateVendorService = exports.UpdateVendorCoverageImage = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
const AdminController_1 = require("./AdminController");
const utilities_1 = require("../utilities");
const Food_1 = require("../models/Food");
const VendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVendor = yield (0, AdminController_1.FindVendor)({ email: email });
    if (existingVendor !== null) {
        const isPasswordValid = yield (0, utilities_1.validatePassword)(password, existingVendor.password, existingVendor.salt);
        if (isPasswordValid) {
            const signature = (0, utilities_1.GenerateSignature)({
                _id: existingVendor.id,
                email: existingVendor.email,
                name: existingVendor.name,
                foodTypes: existingVendor.foodTypes
            });
            res.json(signature);
        }
        else {
            res.json({ message: 'Invalid credentials!' });
        }
    }
    else {
        res.status(404).json({ message: 'Vendor not found!' });
    }
});
exports.VendorLogin = VendorLogin;
const GetVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)({ _id: user._id });
        if (existingVendor) {
            res.json(existingVendor);
        }
        else {
            res.status(401).json({ message: 'Unauthorized!' });
        }
    }
    else {
        res.status(404).json({ message: 'Vendor information not found!' });
    }
});
exports.GetVendorProfile = GetVendorProfile;
const UpdateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, foodTypes, phone, address } = req.body;
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)({ _id: user._id });
        if (existingVendor !== null) {
            existingVendor.name = name;
            existingVendor.foodTypes = foodTypes;
            existingVendor.phone = phone;
            existingVendor.address = address;
            const saveVendor = yield existingVendor.save();
            res.json(saveVendor);
        }
    }
    else {
        res.status(404).json({ message: 'Vendor Information not found!' });
    }
});
exports.UpdateVendorProfile = UpdateVendorProfile;
const UpdateVendorCoverageImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vendor = yield (0, AdminController_1.FindVendor)({ _id: user._id });
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((files) => files.filename);
            vendor.coverImages.push(...images);
            const result = yield vendor.save();
            res.json(result);
        }
        else {
            res.json({ message: 'Something went wrong!' });
        }
    }
});
exports.UpdateVendorCoverageImage = UpdateVendorCoverageImage;
const UpdateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)({ _id: user._id });
        if (existingVendor !== null) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            const saveVendor = yield existingVendor.save();
            res.json(saveVendor);
        }
    }
});
exports.UpdateVendorService = UpdateVendorService;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, price, foodType, category, readyTime } = req.body;
        const vendor = yield (0, AdminController_1.FindVendor)({ _id: user._id });
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((files) => files.filename);
            const food = yield Food_1.Food.create({
                vendorId: vendor.id,
                name: name,
                description: description,
                price: price,
                foodType: foodType,
                category: category,
                readyTime: readyTime,
                images: images,
                rating: 0
            });
            yield vendor.foods.push(food);
            const saveFood = yield vendor.save();
            res.json(saveFood);
        }
        else {
            res.json({ message: 'Something went wrong!' });
        }
    }
});
exports.AddFood = AddFood;
const GetFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield Food_1.Food.find({ vendorId: user._id });
        if (foods !== null)
            res.json(foods);
    }
    else {
        res.json({ message: 'Food information not available!' });
    }
});
exports.GetFood = GetFood;
//# sourceMappingURL=VendorController.js.map