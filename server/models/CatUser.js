module.exports = (sequelize, DataTypes) => {
  return sequelize.define("CatUser", {
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
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
  });
};
