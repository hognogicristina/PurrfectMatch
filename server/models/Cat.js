module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Cat', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Images',
                key: 'id'
            },
            allowNull: false,
        },
        breed: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: DataTypes.STRING,
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        adoptionRequest: {
            type: DataTypes.STRING,
            allowNull: false
        },
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