// Bid Model 
module.exports = (sequelize, DataTypes) => {

    const Bid = sequelize.define("Bid", {

        time: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        amount: {
            type: DataTypes.DOUBLE(15,2),
        },
        bidderName: {
            type: DataTypes.STRING,
        },
        bidderRating: {
            type: DataTypes.INTEGER,
        },

    });
    
    return Bid;

};