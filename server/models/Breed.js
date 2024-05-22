module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Breed", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filetype: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    filesize: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  });
};
