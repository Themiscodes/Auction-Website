// Contact Model
module.exports = (sequelize, DataTypes) => {

    const Contact = sequelize.define("Contact", {
        contactId: {
            type: DataTypes.INTEGER,
        },
        contactUsername: {
            type: DataTypes.STRING(255),
        },
        contactName: {
            type: DataTypes.STRING,
        },
        contactSurname: {
            type: DataTypes.STRING,
        },
    });

    return Contact;
};