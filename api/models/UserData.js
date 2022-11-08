// UserData Model
module.exports = (sequelize, DataTypes) => {

    const UserData = sequelize.define("UserData", {
        rating: {
            type: DataTypes.DOUBLE(5,4),
            defaultValue: 0,
        },
    });

    return UserData;

};