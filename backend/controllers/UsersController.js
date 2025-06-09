const sequelize = require('../db/conn.js');

const getUsers = async (req, res) => {
    try {
        const users = await sequelize.query('SELECT * FROM users', { type: sequelize.QueryTypes.SELECT });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {getUsers};