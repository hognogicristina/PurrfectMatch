module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Cat', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: DataTypes.STRING,
        imageId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Images',
                key: 'id'
            },
            allowNull: false,
        },
        breed: DataTypes.STRING,
        gender: DataTypes.STRING,
        age: DataTypes.STRING,
        healthProblem: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: DataTypes.TEXT,
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            },
        },
        ownerId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    })
}