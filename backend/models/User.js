const { DataTypes } =  require("sequelize");
const sequelize = require('../db/conn');

const User = sequelize.define("User",
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            require: true,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            require: true
        },
    }
);

module.exports = User;