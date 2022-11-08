// Category Model
module.exports = (sequelize, DataTypes) => {

    const Category = sequelize.define("Category", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    Category.associate = function(models) {
        Category.belongsTo(models.Category, {
            onDelete: 'cascade',
        });
    };

    return Category;
};