const WebSocket = require("ws");

function openServer() {
  console.log("Server started");

  const wss = new WebSocket.Server({ port: 8080 });
  let queue = undefined;

  function wsOnMessage(wsSelf, wsOther, message) {
    const msg = message.toString();

    if (msg.startsWith('move:') || msg === 'restart' || msg === 'stop') {
      wsOther.send(msg);
    }
  }

  async function startMatch(ws1, ws2) {
    ws1.on("message", (message) => {
      wsOnMessage(ws1, ws2, message);
    });
    ws2.on("message", (message) => {
      wsOnMessage(ws2, ws1, message);
    });

    ws1.send("start_p1");
    ws2.send("start_p2");

    console.log("Match started.");
  }

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      const msg = message.toString();
      if(msg.startsWith("ID:")) {

      }
      if (msg.startsWith("QUEUE")) {
        if (queue === undefined) {
          queue = ws;
          console.log("Queueing...");
        } else {
          const partner = queue;
          queue = undefined;
          startMatch(partner, ws);
        }
      }
    });
    ws.on("close", () => {
      if (queue === ws) {
        queue = undefined;
      }
      console.log("Client disconnected.");
    });
  });
}

module.exports = {
  openServer
}