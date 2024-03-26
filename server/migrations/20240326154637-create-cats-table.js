'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Cats', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            imageId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Images',
                    key: 'id',
                },
                allowNull: false
            },
            breed: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Breeds',
                    key: 'id',
                },
                allowNull: false
            },
            gender: {
                type: Sequelize.STRING
            },
            age: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            ageType: {
                type: Sequelize.STRING,
                allowNull: false
            },
            healthProblem: {
                type: Sequelize.STRING,
                allowNull: true
            },
            description: {
                type: Sequelize.TEXT
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            ownerId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Cats')
    }
}