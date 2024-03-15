module.exports = (sequelize, DataTypes) => {
    return sequelize.define('RefreshToken', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            },
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}