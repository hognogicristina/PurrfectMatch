module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Cat", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    breed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: DataTypes.STRING,
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ageType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    healthProblem: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
