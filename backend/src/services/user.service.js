const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
class UserService {
    static async signIn(username, password) {
        try {
            let userId = await User.signIn(username, password);            
            if (!userId[0].signin) {
                throw new Error('Invalid login credentials');
            }
            userId = userId[0].signin;
            const profile = await User.getUserDetailByID(userId);
            const fieldsToExclude = ["password", "is_active", "created_at"];
            const filteredProfile = Object.fromEntries(
                Object.entries(profile).filter(([key]) => !fieldsToExclude.includes(key))
            );
            const token = jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: '1d' });
            return { token, filteredProfile };
        } catch (err) {
            throw new Error(err.message);
        }
    }

    static async createAccount(userData) {
        try {
            await User.createAccount(userData);
        } catch (err) {
            throw new Error(err.message);
        }
    }
    
    static async getUserByIdService(id) {
        try {
            return await User.getUserDetailByID(id);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    static async getAllUserService() {
        try {
            return await User.getAllUser();
        } catch (error) {
            throw new Error(error.message);
        }
    }

}

module.exports = UserService;