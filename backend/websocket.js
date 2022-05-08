const WebSocket = require("ws");
const {getUserBySession} = require('./requests');
const {addNewGame} = require('./requests');
const index = require('./index');

function openServer() {
  const pool = index.pool;
  console.log("Server started");

  const wss = new WebSocket.Server({ port: 8080 });
  let queue = undefined;
  const clientUserIDs = new Map();
  const clientUsernames = new Map();
  const clientPairs = new Map();

  function wsOnMessage(wsSelf, wsOther, message) {
    const msg = message.toString();

    if (msg.startsWith('move:') || msg === 'restart' || msg === 'stop') {
      if(clientUsernames.has(wsSelf) && clientUsernames.has(wsOther)) wsOther.send(msg);
    }
  }

  async function startMatch(ws1, ws2) {
    ws1.on("message", (message) => {
      wsOnMessage(ws1, ws2, message);
    });
    ws2.on("message", (message) => {
      wsOnMessage(ws2, ws1, message);
    });

    ws1.send("start_p1"+clientUsernames.get(ws2));
    ws2.send("start_p2"+clientUsernames.get(ws1));

    clientPairs.set(ws1, ws2);
    clientPairs.set(ws2, ws1);

    console.log("Match started.");
  }

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      const msg = message.toString();
      if(msg.startsWith("SESSION:")) {
        const session = msg.split(":")[1];
        getUserBySession(session, pool).then((sessionresp) => {
          clientUserIDs.set(ws, sessionresp.resp.rows[0].user_id);
          clientUsernames.set(ws, sessionresp.resp.rows[0].username);
          ws.send("Authenticated");
        }).catch((err) => {
          console.log(err);
        });
      }else if (msg.startsWith("QUEUE") && clientUsernames.has(ws)) {
        if (queue === undefined) {
          queue = ws;
          console.log("Queueing...");
        } else {
          const partner = queue;
          queue = undefined;
          startMatch(partner, ws);
        }
      }else if (msg === 'finished') {
        addNewGame(clientUserIDs.get(ws), clientUserIDs.get(clientPairs.get(ws)), false, pool);
      }else if (msg === 'draw') {
        addNewGame(clientUserIDs.get(ws), clientUserIDs.get(clientPairs.get(ws)), true, pool);
      }
    });
    ws.on("close", () => {
      if (queue === ws) {
        queue = undefined;
      }
      clientUsernames.delete(ws);
      clientUserIDs.delete(ws);
      clientPairs.delete(ws);
      console.log("Client disconnected.");
    });
  });
}

module.exports = {
  openServer
}