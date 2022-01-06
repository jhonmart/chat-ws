const express = require("express");
const app = express();
require("express-ws")(app);
app.use(express.json());

const users = new Set();
const list_user = [];
const list_name = [];
const PORT = 3000;

const sendForAllNames = () => {
  list_user.map((user, index_user) => {
    const name_users = list_name.map((name, index_name) => ({
      name: name || "Não definido",
      you: index_user === index_name,
      id: index_name
    }));
    user.send(JSON.stringify(name_users));
  });
};

app.ws("/", function (ws, req) {
  ws.on("message", function (message) {
    try {
      const data = JSON.parse(message);
      if (data.user >= 0) {
        const date = Date.now();
        list_user[data.user].send(
          JSON.stringify({
            message: data.message,
            user: list_user.indexOf(ws),
            date,
          })
        );
        ws.send(
          JSON.stringify({
            success: "send message",
            user: list_user.indexOf(ws),
            date,
          })
        );
      } else if (data.name) {
        const index = list_user.indexOf(ws);
        list_name[index] = data.name;
        sendForAllNames();
      }
    } catch (error) {
      ws.send(JSON.stringify({ error, user: list_user.indexOf(ws) }));
    }
  });
  ws.on("close", function () {
    const index = list_user.indexOf(ws);
    list_user.splice(index, 1);
    list_name.splice(index, 1);
    users.delete(ws);
    sendForAllNames();
  });
  if (!users.has(ws)) {
    const index = list_user.length;
    users.add(ws);
    list_user[index] = ws;
    list_name[index] = "";
    sendForAllNames();
  }
});

app.listen(PORT);
