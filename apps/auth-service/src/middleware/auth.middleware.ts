import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

interface JwtPayload {
    userId: string;
}

export interface AuthRequest extends Request {
    user?: any; // optional: we'll attach the user document here
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Expect token in Authorization header: "Bearer <token>"
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer "))
            return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(401).json({ message: "User not found" });

        // Attach user to request for downstream routes
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Unauthorized" });
    }
};