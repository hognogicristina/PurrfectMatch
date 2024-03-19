module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PasswordHistory', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            },
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING
        },
    })
}