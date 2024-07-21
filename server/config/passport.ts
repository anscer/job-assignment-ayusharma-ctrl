import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/userModel';
import bcrypt from 'bcrypt';

passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        User.findOne({ email }, '+password').then(user => {
            if (!user) {
                return done(null, false, { message: 'Server Error, Invalid credentials' });
            }

            const isMatch = bcrypt.compareSync(password, user.password);

            if (!isMatch) {
                return done(null, false, { message: 'Server Error, Invalid credentials' });
            }
            
            return done(null, user);
        }).catch(err => {
            return done(null, false, { message: err });
        })
    })
);

passport.serializeUser((user: any, done) => {
    return done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        return done(null, user);
    }).catch(err => {
        return done(null, err);
    })
});

export default passport;