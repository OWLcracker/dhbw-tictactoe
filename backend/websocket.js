const WebSocket = require("ws");

function openServer() {
  console.log("Server started");

  const wss = new WebSocket.Server({ port: 8080 });
  let queue = undefined;

  async function startMatch(ws1, ws2) {
    ws1.on("message", (message) => {
      let msg = message.toString();
      if(msg.startsWith("move:")) {
        ws2.send(msg.substring(5));
      }
    });
    ws2.on("message", (message) => {
      let msg = message.toString();
      if(msg.startsWith("move:")) {
        ws1.send(msg.substring(5));
      }
    });
    console.log("Match started");
    ws1.send("start");
  }

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      let msg = message.toString();
      if(msg.startsWith("QUEUE")) {
        if(queue === undefined) {
          queue = ws;
          console.log("Queueing...");
        } else {
          let partner = queue;
          queue = undefined;
          startMatch(partner, ws);
        }
      }
    });
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
}

module.exports = {
  openServer
}