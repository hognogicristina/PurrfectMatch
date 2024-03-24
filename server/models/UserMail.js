module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UserMail', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            },
            allowNull: false,
        },
        mailId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Mails',
                key: 'id'
            },
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            validate: {
                isIn: [['sender', 'receiver']]
            },
            allowNull: false,
        },
        isVisible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        }
    })
}
