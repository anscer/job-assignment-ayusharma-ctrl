import express from 'express';
import { isUserAuthenticated } from '../middlewares/auth';
import { getUserProfile, signup, updatePassword } from '../controllers/userController';
import passport from 'passport';


const router = express.Router();

//api to add new user
router.post("/signup", signup);

//api to login
router.post("/signin", passport.authenticate('local'), (req, res) => {
    res.status(200).json({ success: true, message: 'Logged in successfully' });
});

//api to logout
router.get("/signout", (req, res) => {
    // this is the Passport.js method to log out
    req.logout(() => {
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    });
});

//api to get user's profile
router.get("/user", isUserAuthenticated, getUserProfile);

//api to update user's password
router.put("/password-update", isUserAuthenticated, updatePassword);


export default router;