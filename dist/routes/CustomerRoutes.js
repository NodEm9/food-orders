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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.CustomerRoute = router;
router.post('/signup', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield (0, controllers_1.CustomerSignUp)(req, res, next); }));
router.post('/login', controllers_1.CustomerLogin);
router.use(middlewares_1.Authenticate);
router.patch('/verify', controllers_1.VerifyCustomer);
router.get('/otp', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { (0, controllers_1.RequestOtp)(req, res, next); }));
router.get('/profile', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { (0, controllers_1.GetCustomerProfile)(req, res, next); }));
router.patch('/profile', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { (0, controllers_1.EditCustomerProfile)(req, res, next); }));
//# sourceMappingURL=CustomerRoutes.js.map