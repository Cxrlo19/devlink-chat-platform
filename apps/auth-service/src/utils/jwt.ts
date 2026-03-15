import "dotenv/config";
import jwt, { SignOptions } from "jsonwebtoken";

const ACCESS_EXPIRES = (process.env.JWT_ACCESS_EXPIRATION || "15m") as SignOptions["expiresIn"];
const REFRESH_EXPIRES = (process.env.JWT_REFRESH_EXPIRATION || "7d") as SignOptions["expiresIn"];

const getRequiredEnv = (key: "JWT_ACCESS_SECRET" | "JWT_REFRESH_SECRET") => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} is not set`);
    }
    return value;
};

export const createAccessToken = (payload: object) => {
    const accessSecret = getRequiredEnv("JWT_ACCESS_SECRET");
    return jwt.sign(payload, accessSecret, { expiresIn: ACCESS_EXPIRES });
};

export const createRefreshToken = (payload: object) => {
    const refreshSecret = getRequiredEnv("JWT_REFRESH_SECRET");
    return jwt.sign(payload, refreshSecret, { expiresIn: REFRESH_EXPIRES });
};

export const verifyAccessToken = (token: string) => {
    const accessSecret = getRequiredEnv("JWT_ACCESS_SECRET");
    return jwt.verify(token, accessSecret);
};

export const verifyRefreshToken = (token: string) => {
    const refreshSecret = getRequiredEnv("JWT_REFRESH_SECRET");
    return jwt.verify(token, refreshSecret);
};
