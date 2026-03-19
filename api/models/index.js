"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Sequelize from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

const configFile = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "config", "config.json"), "utf8"),
);
const config = configFile[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

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
export { sequelize, Sequelize };
export const Usuario = db.Usuario;
export const Produto = db.Produto;
export const Categoria = db.Categoria;
export const ProdutoCategoria = db.ProdutoCategoria;
export const ProductClick = db.ProductClick;
