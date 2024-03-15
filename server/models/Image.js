module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Image', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        filename: DataTypes.STRING,
        filetype: DataTypes.STRING,
        filesize: DataTypes.INTEGER,
        url: DataTypes.STRING,
    })
}