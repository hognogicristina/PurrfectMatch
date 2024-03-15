module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        imageId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Images',
                key: 'id',
            }
        },
        username: {type: DataTypes.STRING, unique: true},
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: {
                    msg: "Must be a valid email address",
                }
            }
        },
        password: DataTypes.STRING,
        birthday: DataTypes.DATEONLY,
        description: DataTypes.TEXT,
        hobbies: DataTypes.TEXT,
        experienceLevel: DataTypes.INTEGER,
        addressId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Addresses',
                key: 'id',
            }
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user',
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'active_pending',
        },
        signature: DataTypes.STRING,
        expires: DataTypes.DATE,
        token: DataTypes.STRING,

    })
}