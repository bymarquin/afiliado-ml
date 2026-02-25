"use strict";

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
      Review.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  Review.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      review: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "reviews",
      underscored: true,
      updatedAt: false,
    },
  );

  return Review;
};
