module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Favorite', {
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
        catId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Cats',
                key: 'id'
            },
            allowNull: false,
        },
    })
}