module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Image", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    filename: DataTypes.STRING,
    filetype: DataTypes.STRING,
    filesize: DataTypes.INTEGER,
    url: DataTypes.STRING,
  });
};
