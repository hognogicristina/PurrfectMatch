module.exports = (sequelize, DataTypes) => {
  return sequelize.define("AdoptionRequest", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    catId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Cats",
        key: "id",
      },
      allowNull: true,
    },
    message: DataTypes.TEXT,
    addressId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Addresses",
        key: "id",
      },
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
  });
};
