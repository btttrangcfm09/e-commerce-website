const UserService = require('../../services/user.service');

// Viết dạng function thường
const getAllUser = async (req, res) => {
    try {
        const users = await UserService.getAllUserService();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserService.getUserByIdService(id);
        res.status(200).json({ user }); // Wrap in object with 'user' key
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUser,
    getUserById
};