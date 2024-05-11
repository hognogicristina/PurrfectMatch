"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Images", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      filename: {
        type: Sequelize.STRING,
        unique: true,
      },
      filetype: {
        type: Sequelize.STRING,
      },
      filesize: {
        type: Sequelize.INTEGER,
      },
      url: {
        type: Sequelize.STRING,
        unique: true,
      },
      uri: {
        type: Sequelize.STRING,
        unique: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      catId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Cats",
          key: "id",
        },
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
    await queryInterface.dropTable("Images");
  },
};
