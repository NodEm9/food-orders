"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TWILIO_AUTH_TOKEN = exports.TWILIO_ACCOUNT_SID = exports.PORT = exports.JWT_SECRET = exports.MONGO_URI = void 0;
const getEnv = (key, defaultValue) => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw new Error(`Environment variable ${key} is not set.`);
    }
    return value;
};
exports.MONGO_URI = getEnv("MONGO_URI");
exports.JWT_SECRET = getEnv("JWT_SECRET");
exports.PORT = getEnv("PORT");
exports.TWILIO_ACCOUNT_SID = getEnv("TWILIO_ACCOUNT_SID");
exports.TWILIO_AUTH_TOKEN = getEnv("TWILIO_AUTH_TOKEN");
//# sourceMappingURL=index.js.map