import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { createAccessToken, createRefreshToken } from "../utils/jwt";

export const refreshToken = async (req: Request, res: Response) => {
    try {
        // Expect token in body or cookie
        const token =
            req.body.token ||
            req.body.refreshToken ||
            req.cookies?.refreshToken;
        if (!token) return res.status(401).json({ message: "No refresh token provided" });

        // Verify the refresh token
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(401).json({ message: "User not found" });

        // Check that the token is in user's stored refreshTokens array
        if (!user.refreshTokens.includes(token)) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Generate new tokens
        const newAccessToken = createAccessToken({ userId: user._id });
        const newRefreshToken = createRefreshToken({ userId: user._id });

        // Replace old refresh token with new one
        user.refreshTokens = user.refreshTokens.filter(t => t !== token);
        user.refreshTokens.push(newRefreshToken);
        await user.save();

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};
