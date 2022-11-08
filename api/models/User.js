// User Model
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING(255),
            unique: true
        },
        password: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        surname: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        telephone: {
            type: DataTypes.STRING,
        },
        latitudeLongitude: {
            type: DataTypes.GEOMETRY,
        },
        location: {
            type: DataTypes.STRING,
        },
        country: {
            type: DataTypes.STRING,
        },
        taxnumber: {
            type: DataTypes.INTEGER,
        },
        admin: { 
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        approved: { 
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        bidderRating: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        buyCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        sellerRating: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        saleCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    });

    // Associated through foreign keys automatically
    User.associate = (models) => {
        User.hasMany(models.Item, {
            onDelete: "cascade",
        });
        User.hasMany(models.Bid, {
            onDelete: "cascade",
        });
        User.hasMany(models.Message, {
            onDelete: "cascade",
        });
        User.hasMany(models.Contact, {
            onDelete: "cascade",
        });
        User.hasMany(models.UserData, {
            // on delete here hold the history
        });
        User.hasOne(models.UserTop, {
            onDelete: "cascade",
        });
    };

    return User;
    
};