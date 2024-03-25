module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Chat', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        senderId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            },
            allowNull: false,
        },
        receiverId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            },
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
}