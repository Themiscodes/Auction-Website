// Message Model
module.exports = (sequelize, DataTypes) => {

    const Message = sequelize.define("Message", {
        
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timeSent: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        senderId: {
            type: DataTypes.INTEGER,
        },
        recipientId:{
            type: DataTypes.INTEGER,
        },
        senderName: {
            type: DataTypes.STRING,
        },
        senderSurname:{
            type: DataTypes.STRING,
        },
        recipientName: {
            type: DataTypes.STRING,
        },
        recipientSurname:{
            type: DataTypes.STRING,
        },
        deletedInbox: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        deletedOutbox: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

    });

    return Message;

};