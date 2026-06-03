#!/bin/sh
set -e

mkdir -p /app/.puppeteer

Xvfb "$DISPLAY" -screen 0 1280x800x24 >/tmp/xvfb.log 2>&1 &
sleep 1

x11vnc -display "$DISPLAY" -forever -shared -nopw -listen 0.0.0.0 -rfbport "$VNC_PORT" >/tmp/x11vnc.log 2>&1 &

websockify --web=/usr/share/novnc/ 0.0.0.0:"$NOVNC_PORT" localhost:"$VNC_PORT" >/tmp/novnc.log 2>&1 &

echo "noVNC interno disponível em http://localhost:${NOVNC_PORT}/vnc.html"
if [ -n "$APP_DOMAIN" ]; then
  echo "noVNC público esperado em https://${APP_DOMAIN}/novnc/vnc.html"
fi

npx sequelize-cli db:migrate
node app.js
