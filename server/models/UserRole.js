module.exports = (sequelize, DataTypes) => {
  return sequelize.define("UserRole", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: false,
    },
    adoptionRequestId: {
      type: DataTypes.INTEGER,
      references: {
        model: "AdoptionRequests",
        key: "id",
      },
      allowNull: false,
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
