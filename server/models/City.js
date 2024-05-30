module.exports = (sequelize, DataTypes) => {
  return sequelize.define("City", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    countryId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Countries",
        key: "id",
      },
    },
  });
};
