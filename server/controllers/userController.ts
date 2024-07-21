import bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import { User } from '../models/userModel';

// method to add new user
export const signup = async (req: Request, res: Response) => {
    try {
        // destruct the data entered by user from req body
        const { name, email, password }: { name: string, email: string, password: string } = req.body;

        // validation check
        if (!email || !name || !password) {
            return res.status(404).json({
                success: false,
                message: "Please enter all the details before submitting!"
            })
        }

        // find user details with entered email
        let user = await User.findOne({ email })
        if (user) {
            return res.status(404).json({
                success: false,
                message: "User is already exist!"
            })
        }

        // password validation
        if (email === password) {
            return res.status(404).json({
                success: false,
                message: "Password can not be same as email! Please choose a different password."
            })
        }

        // encrypt password before saving to db, hashing + saltrounds
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            name,
            email,
            password: hashedPassword,
        })

        return res.status(201).json({
            success: true,
            message: "User Created Successfully!"
        });
    }
    catch (e: any) {
        return res.status(500).json({ success: false, message: e.message })
    }
}

// method to fetch user profile
export const getUserProfile = (req: Request, res: Response) => {
    try {
        res.json({
            success: true,
            user: req.user! // only authorized users can see their profile data
        })
    }
    catch (e: any) {
        res.status(500).json({ success: false, message: e.message });
    }
}

// method to update user password
export const updatePassword = async (req: any, res: Response) => {
    try {
        // read input from body
        const { oldPassword, newPassword }: { oldPassword: string, newPassword: string } = req.body;

        const { email } = req.user!; // we aleady have user info

        // validation check
        if (!oldPassword || !newPassword || !email) {
            return res.status(404).json({
                success: false,
                message: "Please enter all the details before submitting!"
            })
        }

        if (newPassword === oldPassword) {
            return res.status(404).json({
                success: false,
                message: "New Password should be unique!"
            });
        }

        // fetch user from db
        const user = await User.findOne({ email }).select("+password");
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Something went wrong"
            })
        }

        // password validation and comparing passwords
        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

        // return if old password entered by user is incorrect
        if (!isOldPasswordCorrect) {
            return res.status(404).json({
                success: false,
                message: "Old Password is invalid!"
            })
        }

        // encrypting new password before saving to db
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // end user session, request user to login with updated password
        req.logout(() => {
            res.status(200).json({ success: true, message: 'Password updated successfully! Please login again with new password.' });
        });
    }
    catch (e: any) {
        res.status(500).json({ success: false, message: e.message });
    }
}