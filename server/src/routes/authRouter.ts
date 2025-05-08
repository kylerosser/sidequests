import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const User = require("./models/userModel");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (JWT_SECRET == undefined) {
    throw new Error("JSON web token secret not provided");
}

router.post("/login", async (req, res, next) => {
    let { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch {
        const error = new Error("User not found!");
        return next(error);
    }
    if (!existingUser || existingUser.passwordHash != password) {
        const error = new Error("Incorrect password");
        return next(error);
    }
    let token;
    try {
        token = jwt.sign(
            {
                userId: existingUser.id,
                email: existingUser.email
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );
    } catch (err) {
        console.log(err);
        const error = new Error("Error! Something went wrong.");
        return next(error);
    }

    res.status(200).json({
        success: true,
        data: {
            userId: existingUser.id,
            email: existingUser.email,
            token: token,
        },
    });
});

router.post("/signup", async (req, res, next) => {
    const {name, email, password} = req.body;
    const newUser = User({
        name,
        email,
        password,
    });

    try {
        await newUser.save();
    } catch {
        const error = new Error("Error! Something went wrong.");
        return next(error);
    }
    let token;
    try {
        token = jwt.sign(
            {
                userId: newUser.id,
                email: newUser.email
            },
            "secretkeyappearshere",
            { expiresIn: "1h" }
        );
    } catch (err) {
        const error =
            new Error("Error! Something went wrong.");
        return next(error);
    }
    res.status(201).json({
        success: true,
        data: {
            userId: newUser.id,
            email: newUser.email,
            token: token
        },
    })
})


app.post("/signup",
    async (req, res, next) => {
        const {
            name,
            email,
            password
        } = req.body;
        const newUser =
            User({
                name,
                email,
                password,
            });

        try {
            await newUser.save();
        } catch {
            const error =
                new Error("Error! Something went wrong.");
            return next(error);
        }
        let token;
        try {
            token = jwt.sign(
                {
                    userId: newUser.id,
                    email: newUser.email
                },
                "secretkeyappearshere",
                { expiresIn: "1h" }
            );
        } catch (err) {
            const error =
                new Error("Error! Something went wrong.");
            return next(error);
        }
        res
            .status(201)
            .json({
                success: true,
                data: {
                    userId: newUser.id,
                    email: newUser.email,
                    token: token
                },
            });
    }); 
export default router;