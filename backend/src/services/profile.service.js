const UserRepository = require('../repositories/user.repository');
const { toPublicUser } = require('../models/user.model');

function normalizeProfileUpdate(body) {
    return {
        username: body.username,
        email: body.email,
        firstName: body.firstName ?? body.first_name,
        lastName: body.lastName ?? body.last_name,
        phone: body.phone,
        address: body.address,
        image: body.image,
    };
}

class ProfileService {
    static async getMyProfile(userId) {
        const row = await UserRepository.findById(userId);
        if (!row) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }
        return toPublicUser(row);
    }

    static async updateMyProfile(userId, body) {
        const normalized = normalizeProfileUpdate(body);

        if (normalized.username !== undefined) {
            const username = String(normalized.username).trim();
            if (!username) {
                const err = new Error('Username cannot be empty');
                err.status = 400;
                throw err;
            }
            const taken = await UserRepository.isUsernameTaken(username, userId);
            if (taken) {
                const err = new Error('Username already exists');
                err.status = 400;
                throw err;
            }
            normalized.username = username;
        }

        const updateFields = {
            username: normalized.username,
            email: normalized.email,
            first_name: normalized.firstName,
            last_name: normalized.lastName,
            phone: normalized.phone,
            address: normalized.address,
            image: normalized.image,
        };

        const row = await UserRepository.updateProfile(userId, updateFields);
        if (!row) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }
        return toPublicUser(row);
    }

    static async deleteMyProfileImage(userId) {
        const row = await UserRepository.clearProfileImage(userId);
        if (!row) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }
        return toPublicUser(row);
    }
}

module.exports = ProfileService;
