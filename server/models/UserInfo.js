module.exports = (sequelize, DataTypes) => {
  return sequelize.define("UserInfo", {
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
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    hobbies: DataTypes.TEXT,
    experienceLevel: DataTypes.INTEGER,
  });
};
