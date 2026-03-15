import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import console from "node:console";
dotenv.config();

interface JwtPayload {
    userId: string;
}

export interface AuthRequest extends Request {
    userId?: string;
}


export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" })
        }
        const token = authHeader.split("Bearer ")[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error(error)
        return res.status(401).json({ message: "Unauthorized" })
    }
}