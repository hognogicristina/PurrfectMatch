module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Mail', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        catId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Cats',
                key: 'id'
            },
            allowNull: true
        },
        message: DataTypes.TEXT,
        addressId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Addresses',
                key: 'id'
            },
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending'
        }
    })
}