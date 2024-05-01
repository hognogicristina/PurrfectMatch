"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AdoptionRequests", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      catId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Cat",
          key: "id",
        },
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      addressId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Addresses",
          key: "id",
        },
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "pending",
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("AdoptionRequests");
  },
};
