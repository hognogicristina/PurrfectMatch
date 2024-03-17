'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('UserMails', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                allowNull: false
            },
            mailId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Mails',
                    key: 'id'
                },
                allowNull: false
            },
            role: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isIn: [['sender', 'receiver']]
                }
            },
            isVisible: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
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
        await queryInterface.dropTable('UserMails');
    }
};
