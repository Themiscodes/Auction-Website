// Item Model
module.exports = (sequelize, DataTypes) => {

    const Item = sequelize.define("Item", {

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        currently: {
            type: DataTypes.DOUBLE(15,2),
        },
        buy_price: {
            type: DataTypes.DOUBLE(15,2),
            allowNull: true,
        },
        first_bid: {
            type: DataTypes.DOUBLE(15,2),
        },
        number_of_bids: {
            type: DataTypes.INTEGER,
        },
        latitudeLongitude: {
            type: DataTypes.GEOMETRY, //('POINT')
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        started: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        ends: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        state: {
            // EXPECTED, AVAILABLE, PURCHASED, EXPIRED
            type: DataTypes.STRING,
        },
        // In case someone won the bid or purchased it
        highestBidder: {
            type: DataTypes.INTEGER,
        },
        furthermostCategoryId: {
            type: DataTypes.INTEGER,
        },
        coverPhoto: {
            type: DataTypes.STRING(255),
            defaultValue: "https://localhost:33123/images/placeholder.png",
        }

    });

    // Associated through foreign keys automatically
    Item.associate = (models) => {
        Item.hasMany(models.Bid, {
            onDelete: 'cascade',
        });

        Item.hasMany(models.Photo, {
            onDelete: 'cascade',
        });
        Item.hasMany(models.UserData, {
        });

    };

    return Item;

};