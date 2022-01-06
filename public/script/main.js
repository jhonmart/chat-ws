const wsClient = new WebSocket(`ws://${location.hostname}:3000`);
let list_names = [];
let mensagens = [];
let messageTo;
wsClient.onopen = function (e) {
  console.info("[open] Connection established");
  console.info("Sending to server");
};

wsClient.onmessage = function (event) {
  try {
    if (event) {
      const response = JSON.parse(event.data);
      if (Array.isArray(response)) {
        list_names = response;
        document.querySelector(".list-unstyled").innerHTML = "";
        const list = response
          .filter((user) => !user.you)
          .map((user) => {
            const contact = document.createElement("li");
            contact.onclick = () => {
              document.querySelector(".select_user") &&
                document
                  .querySelector(".select_user")
                  .classList.remove("select_user");
              messageTo = user.id;
              contact.classList.add("select_user");
            };
            contact.className = "clearfix";
            contact.innerHTML = `<img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar">
                <div class="about">
                  <div class="name">${user.name}</div>
                  <div class="status"> <i class="fa fa-circle online"></i> online</div>
                </div>`;
            document.querySelector(".list-unstyled").appendChild(contact);
          });
      } else {
        response.message && mensagens.push(response);
        drawMSG();
      }
    }
  } catch (error) {
    console.log(`[message] Data received from server: ${event.data}`, error);
  }
};

wsClient.onclose = function (event) {
  if (event.wasClean) {
    console.warn(
      `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
    );
  } else {
    console.warn("[close] Connection died");
  }
};

wsClient.onerror = function (error) {
  console.error(`[error] ${error.message}`);
};

function changeName(event) {
  wsClient.send(JSON.stringify({ name: event.target.value }));
}

function sendMSG(event) {
  if (messageTo >= 0 && message.value.length) {
    const user = list_names
      .map((user, id) => ({ id, ...user }))
      .find((user) => user.you).id;
    wsClient.send(JSON.stringify({ user: messageTo, message: message.value }));
    mensagens.push({
      user,
      message: message.value,
      you: true,
      date: Date.now(),
    });
    drawMSG();
    message.value = "";
  } else alert("Selecione um usuario e escreva algo ...");
}

function drawMSG() {
  document.querySelector(".chat-history ul").innerHTML = mensagens
    .map((item) => (item.you ? drawYourMSG(item) : drawOtherMSG(item)))
    .join("");
}

function drawYourMSG({ date, message }) {
  const time = new Date(date).toLocaleTimeString().replace(/(:\d+) /g, " ");
  const dateFormat = new Date(date).toLocaleDateString("pt-br");

  return `<li class="clearfix">
        <div class="message-data text-right">
          <span class="message-data-time">${time}, ${dateFormat}</span>
          <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
        </div>
        <div class="message other-message float-right"> ${message} </div>
      </li>`;
}

function drawOtherMSG({ date, message }) {
  const time = new Date(date).toLocaleTimeString().replace(/(:\d+) /g, " ");
  const dateFormat = new Date(date).toLocaleDateString("pt-br");

  return `<li class="clearfix">
        <div class="message-data">
          <span class="message-data-time">${time}, ${dateFormat}</span>
        </div>
        <div class="message my-message">${message} </div>
      </li>`;
}

your_name.onchange = changeName;
message.onkeyup = (event) => {
  if (event.key === "Enter") sendMSG();
};
chat.addEventListener("submit", sendMSG);
document.querySelector(".send").onclick = sendMSG;
