// Photo Model
module.exports = (sequelize, DataTypes) => {

    const Photo = sequelize.define("Photo", {
        url: {
            type: DataTypes.STRING(255),
        },
        coverPhoto: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    return Photo;
};