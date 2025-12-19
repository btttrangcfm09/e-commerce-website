const UserService = require('../../services/user.service');

exports.getAllUser = async (req, res, next) => {
    try {
        return res.status(200).json({
            users: await UserService.getAllUserService()
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await UserService.getUserByIdService(id);
        return res.status(200).json({
            user: result,
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};
