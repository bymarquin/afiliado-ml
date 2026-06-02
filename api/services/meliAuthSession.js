import { spawn } from "child_process";
import { existsSync } from "fs";
import { fileURLToPath } from "url";

export const MELI_PROFILE_DIR =
  process.env.MERCADO_LIVRE_PUPPETEER_PROFILE_DIR ||
  fileURLToPath(new URL("../.puppeteer/meli-profile", import.meta.url));

const LOGIN_SCRIPT_PATH = fileURLToPath(new URL("../scripts/login-meli.js", import.meta.url));
const API_DIR = fileURLToPath(new URL("..", import.meta.url));

let loginProcess = null;

export function getMeliAuthStatus() {
  return {
    profileDir: MELI_PROFILE_DIR,
    profileExists: existsSync(MELI_PROFILE_DIR),
    loginInProgress: Boolean(loginProcess && !loginProcess.killed),
  };
}

export function startMeliAuth() {
  if (loginProcess && !loginProcess.killed) {
    return getMeliAuthStatus();
  }

  loginProcess = spawn(process.execPath, [LOGIN_SCRIPT_PATH], {
    cwd: API_DIR,
    detached: true,
    stdio: "ignore",
    env: process.env,
  });

  loginProcess.unref();
  loginProcess.once("exit", () => {
    loginProcess = null;
  });

  return getMeliAuthStatus();
}
