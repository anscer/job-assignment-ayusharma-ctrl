import { Request, Response, NextFunction } from 'express';

export const isUserAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    // this is the Passport.js method to check if user is authenticate
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized Request! Please login first.' });
};