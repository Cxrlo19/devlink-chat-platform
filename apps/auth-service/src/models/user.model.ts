import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    roles: string[];
    isVerified: boolean;
    refreshTokens: string[];
    lastLogin?: Date;
    profilePicture?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        roles: { type: [String], enum: ["user", "admin"], default: ["user"] },
        isVerified: { type: Boolean, default: false },
        refreshTokens: { type: [String], default: [] },
        lastLogin: { type: Date },
        profilePicture: { type: String },
    },
    { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
        next();
    } catch (err) {
        next(err as any);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);