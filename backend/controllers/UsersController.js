const sequelize = require('../db/conn.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const getUsers = async (req, res) => {
    try {
        const users = await sequelize.query('SELECT * FROM users', { type: sequelize.QueryTypes.SELECT });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            id: user.id,
            name: user.name,
            token: `Bearer ${token}`
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                status: "failed",
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid){
            return res.status(401).json({
                status: "failed",
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        }
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({
            id: user.id,
            name: user.name,
            token: `Bearer ${token}`
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = {getUsers, createUser, loginUser};