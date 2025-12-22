const UserRepository = require('../repositories/user.repository');
const { toPublicUser } = require('../models/user.model');

function normalizeProfileUpdate(body) {
    return {
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

        const updateFields = {
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
