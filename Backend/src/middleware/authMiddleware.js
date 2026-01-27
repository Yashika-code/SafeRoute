import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = {
            _id: decoded.userId,
        }

        next();

    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid token" });
    }
}
