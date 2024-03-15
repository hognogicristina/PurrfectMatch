module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UserMail', {
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
        mailId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Mails',
                key: 'id'
            },
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['sender', 'receiver']]
            }
        },
        isVisible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    })
}
