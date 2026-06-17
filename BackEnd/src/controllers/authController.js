import User from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // hashed password =  ($2b$ - algorithm version)  (10$ - cost factor)  (3nzCgKUmGwJx0SrlEulA0e - salt)  (PWFf0rmZS3dCR8bisMd3loTOXdijS4q - hashed value)

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "student",
            subscriptions: ["basic"]
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({
                message: "Invalid Email"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }
        const token = generateToken(user);
        // console.log(token); // for debugging

        res.cookie("token", token, {
            httpOnly: true, // This helps against XSS attacks , only server can read cookies
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            role: user.role
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const logout = (req, res) => {

    res.clearCookie("token");

    res.status(200).json({
        success: true,
        message: "Logged out"
    });

};


const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    registerUser,
    login,
    logout,
    getMe
};