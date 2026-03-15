import {Request, Response} from 'express';
import {User} from "../models/user.model";
import {createAccessToken, createRefreshToken} from "../utils/jwt";

export const register = async (req: Request, res:Response) => {
    const {username, email ,password} = req.body;

    try{
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({ error: "Email already in use" });
            }
            return res.status(409).json({ error: "Username already in use" });
        }

        const newUser = new User({username, email, password});
        await newUser.save();

        const accessToken = createAccessToken({userId: newUser._id});
        const refreshToken = createRefreshToken({userId: newUser._id});

        newUser.refreshTokens.push(refreshToken);
        await newUser.save();

        res.status(201).json({accessToken, refreshToken});

    }catch(err){
        console.error(err);
        if ((err as { code?: number }).code === 11000) {
            const duplicateField = Object.keys((err as { keyPattern?: Record<string, number> }).keyPattern || {})[0];
            if (duplicateField === "email") {
                return res.status(409).json({ error: "Email already in use" });
            }
            if (duplicateField === "username") {
                return res.status(409).json({ error: "Username already in use" });
            }
            return res.status(409).json({ error: "Duplicate value violates unique constraint" });
        }
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({error: "Invalid Credentials"});

        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({error: "Invalid Credentials"});

        const accessToken = createAccessToken({userId: user._id});
        const refreshToken = createRefreshToken({userId: user._id});
        
        user.refreshTokens.push(refreshToken);
        await user.save();
        
        res.status(200).json({accessToken, refreshToken});
        
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }

}


export const logout = async (req: Request, res: Response) => {
    try {


    const refreshToken = req.body.refreshToken || req.body.token;

    if(!refreshToken) return res.status(400).json({error: "Refresh token is required"});

    //finds the user witht the token --> in the schema there is a refreshTokens array so mongodb searches for it
    const user = await User.findOne({
        "refreshTokens": refreshToken
    })

    if(!user){
        return res.sendStatus(204);
    }

    //removes the token from the user's refreshTokens array'
    user.refreshTokens = user.refreshTokens.filter(
        token => token !== refreshToken
    )

    await user.save();

    res.sendStatus(204);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Logout failed"});
    }
};
