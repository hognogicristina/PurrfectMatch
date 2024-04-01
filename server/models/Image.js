module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Image", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      unique: true,
    },
    filetype: DataTypes.STRING,
    filesize: DataTypes.INTEGER,
    url: {
      type: DataTypes.STRING,
      unique: true,
    },
    uri: {
      type: DataTypes.STRING,
      unique: true,
    },
  });
};
