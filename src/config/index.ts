const getEnv = (key: string, defaultValue?: string) => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return value;   
}; 

export const MONGO_URI = getEnv("MONGO_URI");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const PORT = getEnv("PORT");
export const TWILIO_ACCOUNT_SID = getEnv("TWILIO_ACCOUNT_SID");
export const TWILIO_AUTH_TOKEN = getEnv("TWILIO_AUTH_TOKEN");
