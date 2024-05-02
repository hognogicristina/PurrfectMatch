module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Token", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    token: DataTypes.STRING,
    signature: DataTypes.STRING,
    expires: DataTypes.DATE,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
  });
};
