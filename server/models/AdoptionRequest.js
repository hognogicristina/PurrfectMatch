module.exports = (sequelize, DataTypes) => {
  return sequelize.define("AdoptionRequest", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    catId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Cats",
        key: "id",
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    addressId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Addresses",
        key: "id",
      },
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
  });
};
