const WebSocket = require("ws");
const {getUserID} = require('./requests').getUserName();
const index = require('./index');

function openServer() {
  const pool = index.pool;
  console.log("Server started");

  const wss = new WebSocket.Server({ port: 8080 });
  let queue = undefined;
  const clients = new Map();

  function wsOnMessage(wsSelf, wsOther, message) {
    const msg = message.toString();

    if (msg.startsWith('move:') || msg === 'restart' || msg === 'stop') {
      if(clients.has(wsSelf) && clients.has(wsOther)) wsOther.send(msg);
    }
  }

  async function startMatch(ws1, ws2) {
    ws1.on("message", (message) => {
      wsOnMessage(ws1, ws2, message);
    });
    ws2.on("message", (message) => {
      wsOnMessage(ws2, ws1, message);
    });

    ws1.send("start_p1"+clients.get(ws1));
    ws2.send("start_p2"+clients.get(ws2));

    console.log("Match started.");
  }

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      const msg = message.toString();
      if(msg.startsWith("SESSION:")) {
        const session = msg.split(":")[1];
        getUserID(session, pool).then((sessionresp) => {
          const UserID = sessionresp.resp.rows[0].user_id;
          clients.set(ws, UserID);
        }).catch((err) => {
          console.log(err);
        });
      }else if (msg.startsWith("QUEUE") && clients.has(ws)) {
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
      clients.delete(ws);
      console.log("Client disconnected.");
    });
  });
}

module.exports = {
  openServer
}