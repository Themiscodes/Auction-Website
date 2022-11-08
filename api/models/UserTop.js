// UserTop Model
module.exports = (sequelize, DataTypes) => {

    const UserTop = sequelize.define("UserTop", {
        p1: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        p2: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        p3: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        p4: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        p5: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        p6: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    });

    return UserTop;

};