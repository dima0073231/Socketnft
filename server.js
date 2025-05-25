const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;

const wss = new WebSocket.Server({ port: PORT });

let onlineCount = 0;

function broadcastOnlineCount() {
  const data = JSON.stringify({ online: onlineCount });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

wss.on("connection", (ws) => {
  onlineCount++;
  broadcastOnlineCount();

  ws.on("close", () => {
    onlineCount--;
    broadcastOnlineCount();
  });

  ws.on("message", (message) => {
    console.log("Получено сообщение:", message);
  });
});

console.log(`WebSocket сервер запущен на порту ${PORT}`);
