const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/client/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Extract user information from Google profile
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;
        const image = profile.photos[0]?.value;

        // Find or create user
        const user = await User.findOrCreateGoogleUser({
            googleId,
            email,
            firstName,
            lastName,
            image
        });

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;
