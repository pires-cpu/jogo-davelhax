const pecas = document.querySelectorAll(".peca");
const celulas = document.querySelectorAll(".celula");

const statusTexto =
  document.getElementById("status");

const botaoReiniciar =
  document.getElementById("reiniciar");

// ONLINE
const hostBtn =
  document.getElementById("hostBtn");

const joinBtn =
  document.getElementById("joinBtn");

const roomInput =
  document.getElementById("roomInput");

const canal =
  new BroadcastChannel(
    "jogo_da_velha_online"
  );

let roomId = null;

let jogadorAtual = "X";

let jogoAtivo = true;

let estadoJogo = [
  "", "", "",
  "", "", "",
  "", "", ""
];

const combinacoesVitoria = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

let pecaSelecionada = null;

// ======================
// ONLINE
// ======================

hostBtn.addEventListener("click", () => {

  roomId =
    Math.floor(
      Math.random() * 99999
    ).toString();

  roomInput.value = roomId;

  alert(
    "Sala criada: " + roomId
  );
});

joinBtn.addEventListener("click", () => {

  roomId =
    roomInput.value;

  alert(
    "Entrou na sala: " + roomId
  );
});

// ======================
// PEGAR PEÇA
// ======================

pecas.forEach((peca) => {

  peca.addEventListener("mousedown", (e) => {

    if (!jogoAtivo) return;

    if (
      peca.classList.contains("usada")
    ) {
      return;
    }

    const simbolo =
      peca.textContent;

    if (simbolo !== jogadorAtual) {
      return;
    }

    pecaSelecionada = peca;

    peca.classList.add("segurando");

    peca.style.position = "fixed";

    peca.style.zIndex = "99999";

    moverPeca(
      e.clientX,
      e.clientY
    );
  });

});

// ======================
// MOVER PEÇA
// ======================

document.addEventListener(
  "mousemove",
  (e) => {

    if (!pecaSelecionada) return;

    moverPeca(
      e.clientX,
      e.clientY
    );

  }
);

function moverPeca(mouseX, mouseY) {

  // CURSOR NA PONTA DO DEDO
  pecaSelecionada.style.left =
    mouseX - 125 + "px";

  pecaSelecionada.style.top =
    mouseY - 60 + "px";
}

// ======================
// SOLTAR PEÇA
// ======================

document.addEventListener(
  "mouseup",
  () => {

    if (!pecaSelecionada) return;

    let colocou = false;

    const rectPeca =
      pecaSelecionada.getBoundingClientRect();

    celulas.forEach((celula, index) => {

      if (
        estadoJogo[index] !== ""
      ) return;

      const rectCelula =
        celula.getBoundingClientRect();

      const colidiu = !(

        rectPeca.right <
        rectCelula.left ||

        rectPeca.left >
        rectCelula.right ||

        rectPeca.bottom <
        rectCelula.top ||

        rectPeca.top >
        rectCelula.bottom
      );

      if (colidiu && !colocou) {

        colocou = true;

        const simbolo =
          pecaSelecionada.textContent;

        estadoJogo[index] =
          simbolo;

        celula.textContent =
          simbolo;

        // ONLINE
        if (roomId) {

          canal.postMessage({

            room: roomId,

            estado: estadoJogo,

            jogador: jogadorAtual,

            index: index,

            simbolo: simbolo
          });
        }

        pecaSelecionada.classList.add(
          "usada"
        );

        pecaSelecionada.style.opacity =
          "0";

        pecaSelecionada.style.pointerEvents =
          "none";

        verificarVitoria();

        if (jogoAtivo) {

          jogadorAtual =
            jogadorAtual === "X"
            ? "O"
            : "X";

          statusTexto.textContent =
            `Vez do jogador ${jogadorAtual}`;
        }
      }

    });

    // VOLTA
    if (!colocou) {

      pecaSelecionada.style.position =
        "relative";

      pecaSelecionada.style.left =
        "0px";

      pecaSelecionada.style.top =
        "0px";

      pecaSelecionada.style.zIndex =
        "10";
    }

    pecaSelecionada.classList.remove(
      "segurando"
    );

    pecaSelecionada = null;

  }
);

// ======================
// RECEBER ONLINE
// ======================

canal.onmessage = (evento) => {

  const dados =
    evento.data;

  if (!roomId) return;

  if (dados.room !== roomId) {
    return;
  }

  estadoJogo =
    dados.estado;

  celulas[
    dados.index
  ].textContent =
    dados.simbolo;

  verificarVitoria();

  jogadorAtual =
    dados.jogador === "X"
    ? "O"
    : "X";

  statusTexto.textContent =
    `Vez do jogador ${jogadorAtual}`;
};

// ======================
// VITÓRIA
// ======================

function verificarVitoria() {

  for (
    let combinacao
    of combinacoesVitoria
  ) {

    const [a, b, c] =
      combinacao;

    if (

      estadoJogo[a] &&
      estadoJogo[a] ===
      estadoJogo[b] &&

      estadoJogo[a] ===
      estadoJogo[c]

    ) {

      jogoAtivo = false;

      celulas[a].classList.add(
        "vencedora"
      );

      celulas[b].classList.add(
        "vencedora"
      );

      celulas[c].classList.add(
        "vencedora"
      );

      statusTexto.textContent =
        `Jogador ${estadoJogo[a]} venceu!`;

      return;
    }
  }

  if (
    !estadoJogo.includes("")
  ) {

    jogoAtivo = false;

    statusTexto.textContent =
      "Empate!";
  }
}

// ======================
// REINICIAR
// ======================

function reiniciarJogo() {

  estadoJogo = [
    "", "", "",
    "", "", "",
    "", "", ""
  ];

  jogadorAtual = "X";

  jogoAtivo = true;

  statusTexto.textContent =
    "Vez do jogador X";

  celulas.forEach((celula) => {

    celula.textContent = "";

    celula.classList.remove(
      "vencedora"
    );
  });

  pecas.forEach((peca) => {

    peca.classList.remove(
      "usada",
      "segurando"
    );

    peca.style.opacity = "1";

    peca.style.pointerEvents =
      "auto";

    peca.style.position =
      "relative";

    peca.style.left =
      "0px";

    peca.style.top =
      "0px";

    peca.style.zIndex =
      "10";
  });

}

botaoReiniciar.addEventListener(
  "click",
  reiniciarJogo
);