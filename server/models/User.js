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
    imageId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Images",
        key: "id",
      },
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Must be a valid email address",
        },
      },
      unique: true,
      allowNull: false,
    },
    password: DataTypes.STRING,
    addressId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Addresses",
        key: "id",
      },
    },
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
