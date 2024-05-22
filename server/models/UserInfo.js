module.exports = (sequelize, DataTypes) => {
  return sequelize.define("UserInfo", {
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
    birthday: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: DataTypes.STRING,
    hobbies: DataTypes.STRING,
    experienceLevel: DataTypes.INTEGER,
  });
};
