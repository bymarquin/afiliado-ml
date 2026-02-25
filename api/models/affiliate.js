"use strict";

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Affiliate extends Model {
    static associate(models) {
      Affiliate.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      Affiliate.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
      Affiliate.hasMany(models.Click, {
        foreignKey: "affiliate_id",
        as: "clicks",
      });
    }
  }

  Affiliate.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      affiliate_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Affiliate",
      tableName: "affiliates",
      underscored: true,
      updatedAt: false,
    },
  );

  return Affiliate;
};
