module.exports = (sequelize, DataTypes) => {
  return sequelize.define("AgeType", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    min: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max: DataTypes.INTEGER,
  });
};
