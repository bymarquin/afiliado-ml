"use strict";

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.Review, {
        foreignKey: "product_id",
        as: "reviews",
      });
      Product.hasMany(models.Affiliate, {
        foreignKey: "product_id",
        as: "affiliates",
      });
    }
  }

  Product.init(
    {
      meli_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "ID do Mercado Livre",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      original_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      underscored: true,
    },
  );

  return Product;
};
