module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Token", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    type: DataTypes.STRING,
    token: DataTypes.STRING,
    signature: DataTypes.STRING,
    expires: DataTypes.DATE,
  });
};
