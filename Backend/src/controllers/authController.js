import express from "express"
import bcrypt from "bcryptjs"
import { User } from "../models/User.js"
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
dotenv.config();
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !name || !password) {
            return res.status(404).json({ message: "All fields are required" });
        }
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        return res.status(201).json({ message: "Registered Successfully" });
    } catch (error) {
        console.error("Register error : ", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        )
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "30d" }
        )

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            message: "Login Successfully",
            accessToken,
        })
    } catch (error) {
        console.error("Login error : ", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            const user = await User.findOne({ refreshToken: token });
            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }
        res.clearCookie("refreshToken");

        return res.status(200).json({
            message: "logout Successfully"
        })
    } catch (error) {
        console.error("logout error : ", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const refresh = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const newAccessToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m"
            }
        )
        return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error("refresh error: ", error);
        return res.status(500).json({ message: "Server error" });
    }
}