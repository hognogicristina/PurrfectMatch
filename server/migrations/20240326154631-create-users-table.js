"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Please use a valid email address",
          },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      addressId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Addresses",
          key: "id",
        },
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "user",
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "active_pending",
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
    await queryInterface.dropTable("Users");
  },
};
