module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Image", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    filename: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    filetype: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    filesize: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    url: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    uri: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    catId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Cats",
        key: "id",
      },
    },
  });
};
