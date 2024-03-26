const {User} = require("../../models");
const {Op} = require("sequelize");
const userExistValidator = async (req, res) => {
    const user = await User.findByPk(req.user.id)
    const users = await User.findAll({where: {role: {[Op.ne]: 'admin'}}})

    if (user.role === 'admin') {
        if (users.length === 0) {
            return res.status(404).json({error: 'No Users Available'})
        }
    } else {
        return res.status(403).json({error: 'Unauthorized'})
    }

    if (req.params.id) {
        if (user.role === 'admin') {
            const user = await User.findByPk(req.params.id)
            if (!user) {
                return res.status(404).json({error: 'User not found'})
            }
        } else {
            return res.status(403).json({error: 'Unauthorized'})
        }
    }

    return null
}

module.exports = {userExistValidator}