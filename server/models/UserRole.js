module.exports = (sequelize, DataTypes) => {
  return sequelize.define("UserRole", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    adoptionRequestId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "AdoptionRequests",
        key: "id",
      },
    },
    role: {
      type: DataTypes.STRING,
      validate: {
        isIn: [["sender", "receiver"]],
      },
      allowNull: false,
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });
};
