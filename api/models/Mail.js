// Mail Model
module.exports = (sequelize, DataTypes) => {

    const Mail = sequelize.define("Mail", {
    
        itemId: {
            type: DataTypes.INTEGER,
        },
        bidderId: {
            type: DataTypes.INTEGER,
        },
        sellerId: {
            type: DataTypes.INTEGER,
        },
        bidderRating: {
            type: DataTypes.FLOAT,
        },
        sellerRating: {
            type: DataTypes.FLOAT,
        },
        payed: { 
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        arrived: { 
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        itemName: {
            type: DataTypes.STRING,
        },
    });

    // Associated through foreign keys automatically
    Mail.associate = (models) => {
        Mail.belongsTo(models.User, {
            foreignKey: 'sellerId',
        });
        Mail.belongsTo(models.User, {
            foreignKey: 'bidderId',
        });
        Mail.belongsTo(models.Item, {
            foreignKey: 'itemId',
        });
        Mail.hasMany(models.Message, {
            onDelete: 'cascade',
        });
    };

    return Mail;

};