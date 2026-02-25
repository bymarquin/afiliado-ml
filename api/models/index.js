"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Sequelize from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

// Lê config.json usando fs (compatível com ESM)
const configFile = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "config", "config.json"), "utf8"),
);
const config = configFile[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable],
    config,
  );
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

// Carrega todos os models da pasta (exceto index.js)
const files = fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf(".") !== 0 &&
    file !== basename &&
    file.slice(-3) === ".js" &&
    file.indexOf(".test.js") === -1
  );
});

for (const file of files) {
  const modelPath = path.join(__dirname, file);
  // No Windows, precisamos garantir o prefixo file:// para o import dinâmico
  const modelModule = await import(`file://${modelPath}`);
  const model = modelModule.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
