module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Please use a valid email address",
        },
      },
      unique: true,
      allowNull: false,
    },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "active_pending",
      allowNull: false,
    },
  });
};
