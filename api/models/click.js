"use strict";

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Click extends Model {
    static associate(models) {
      Click.belongsTo(models.Affiliate, {
        foreignKey: "affiliate_id",
        as: "affiliate",
      });
    }
  }

  Click.init(
    {
      affiliate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "affiliates",
          key: "id",
        },
      },
      clicked_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      ip_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_agent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Click",
      tableName: "clicks",
      underscored: true,
      timestamps: false,
    },
  );

  return Click;
};
