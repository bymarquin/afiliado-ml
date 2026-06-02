import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { MELI_PROFILE_DIR } from "../services/meliAuthSession.js";

puppeteer.use(StealthPlugin());

const VIEWPORT = { width: 1280, height: 800 };
const CHROMIUM_EXECUTABLE_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || null;
const LOGIN_URL =
  "https://www.mercadolivre.com/jms/mlb/lgz/login?platform_id=ml&go=https%3A%2F%2Fwww.mercadolivre.com.br%2F";
const SESSION_TIMEOUT_MS = 10 * 60 * 1000;

const browser = await puppeteer.launch({
  headless: false,
  executablePath: CHROMIUM_EXECUTABLE_PATH || undefined,
  userDataDir: MELI_PROFILE_DIR,
  defaultViewport: VIEWPORT,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-blink-features=AutomationControlled",
    "--disable-infobars",
    `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
  ],
});

console.log(`[MeliAuth] Perfil persistente: ${MELI_PROFILE_DIR}`);
console.log("[MeliAuth] Faça login no Mercado Livre na janela aberta.");
console.log("[MeliAuth] Depois de concluir o login, feche a janela do navegador.");

const page = await browser.newPage();
await page.setExtraHTTPHeaders({
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
});
await page.goto(LOGIN_URL, { waitUntil: "domcontentloaded", timeout: 60000 });

await new Promise((resolve) => {
  const timeout = setTimeout(resolve, SESSION_TIMEOUT_MS);

  browser.once("disconnected", () => {
    clearTimeout(timeout);
    resolve();
  });
});

if (browser.connected) {
  await browser.close();
}

console.log("[MeliAuth] Sessão salva. Rode o scraping novamente.");
