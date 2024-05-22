module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Favorite", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    catId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Cats",
        key: "id",
      },
    },
  });
};
