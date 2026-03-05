import {Request, Response} from 'express';
import {User} from "../models/user.model";
import {createAccessToken, createRefreshToken} from "../utils/jwt";

export const register = async (req: Request, res:Response) => {
    const {username, email ,password} = req.body;

    try{
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({error: "Email already in use "});

        const newUser = new User({username, email, password});
        await newUser.save();

        const accessToken = createAccessToken({userId: newUser._id});
        const refreshToken = createRefreshToken({userId: newUser._id});

        newUser.refreshTokens.push(refreshToken);
        await newUser.save();

        res.status(200).json({accessToken: accessToken});

    }catch(err){
        console.error(err);
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