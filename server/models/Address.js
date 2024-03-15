module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Address', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        country: DataTypes.STRING,
        county: DataTypes.STRING,
        city: DataTypes.STRING,
        street: DataTypes.STRING,
        number: DataTypes.STRING,
        floor: DataTypes.STRING,
        apartment: DataTypes.STRING,
        postalCode: DataTypes.STRING
    })
}