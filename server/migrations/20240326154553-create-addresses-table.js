'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Addresses', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            country: {
                type: Sequelize.STRING
            },
            county: {
                type: Sequelize.STRING
            },
            city: {
                type: Sequelize.STRING
            },
            street: {
                type: Sequelize.STRING
            },
            number: {
                type: Sequelize.STRING
            },
            floor: {
                type: Sequelize.STRING
            },
            apartment: {
                type: Sequelize.STRING
            },
            postalCode: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('Addresses')
    }
}