const celulas =
  document.querySelectorAll(".celula");

const statusTexto =
  document.getElementById("status");

const reiniciarBtn =
  document.getElementById("reiniciar");

const soloBtn =
  document.getElementById("soloBtn");

const multiBtn =
  document.getElementById("multiBtn");

const scoreX =
  document.getElementById("scoreX");

const scoreO =
  document.getElementById("scoreO");

const drawsText =
  document.getElementById("draws");

let jogo = [
  "", "", "",
  "", "", "",
  "", "", ""
];

let jogadorAtual = "X";

let jogoAtivo = true;

let modo = "solo";

let pontosX = 0;
let pontosO = 0;
let empates = 0;

const combinacoes = [

  [0,1,2],
  [3,4,5],
  [6,7,8],

  [0,3,6],
  [1,4,7],
  [2,5,8],

  [0,4,8],
  [2,4,6]

];

// ======================
// MODOS
// ======================

soloBtn.onclick = () => {

  modo = "solo";

  soloBtn.classList.add("active");
  multiBtn.classList.remove("active");

  reiniciarJogo();
};

multiBtn.onclick = () => {

  modo = "multi";

  multiBtn.classList.add("active");
  soloBtn.classList.remove("active");

  reiniciarJogo();
};

// ======================
// CLIQUES
// ======================

celulas.forEach((celula,index)=>{

  celula.addEventListener("click",()=>{

    if(
      jogo[index] !== "" ||
      !jogoAtivo
    ){
      return;
    }

    jogar(index,jogadorAtual);

    if(
      modo === "solo" &&
      jogoAtivo &&
      jogadorAtual === "O"
    ){

      setTimeout(()=>{
        roboJoga();
      },500);
    }

  });

});

// ======================
// JOGADA
// ======================

function jogar(index,jogador){

  jogo[index] = jogador;

  celulas[index].textContent =
    jogador;

  celulas[index].classList.add(
    jogador.toLowerCase()
  );

  verificarResultado();

  if(jogoAtivo){

    jogadorAtual =
      jogadorAtual === "X"
      ? "O"
      : "X";

    statusTexto.textContent =
      `Vez do jogador ${jogadorAtual}`;
  }

}

// ======================
// ROBÔ
// ======================

function roboJoga(){

  let jogadasPossiveis = [];

  jogo.forEach((valor,index)=>{

    if(valor === ""){
      jogadasPossiveis.push(index);
    }

  });

  if(jogadasPossiveis.length === 0){
    return;
  }

  // TENTA GANHAR
  for(let i of jogadasPossiveis){

    jogo[i] = "O";

    if(verificarVencedor("O")){

      jogo[i] = "";

      jogar(i,"O");

      return;
    }

    jogo[i] = "";
  }

  // BLOQUEIA PLAYER
  for(let i of jogadasPossiveis){

    jogo[i] = "X";

    if(verificarVencedor("X")){

      jogo[i] = "";

      jogar(i,"O");

      return;
    }

    jogo[i] = "";
  }

  // JOGADA ALEATÓRIA
  const aleatorio =

    jogadasPossiveis[
      Math.floor(
        Math.random() *
        jogadasPossiveis.length
      )
    ];

  jogar(aleatorio,"O");
}

// ======================
// VERIFICAR VENCEDOR
// ======================

function verificarVencedor(jogador){

  return combinacoes.some(comb=>{

    return comb.every(index=>{

      return jogo[index] === jogador;

    });

  });

}

// ======================
// RESULTADO
// ======================

function verificarResultado(){

  for(let combinacao of combinacoes){

    const [a,b,c] = combinacao;

    if(

      jogo[a] &&
      jogo[a] === jogo[b] &&
      jogo[a] === jogo[c]

    ){

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
        `Jogador ${jogo[a]} venceu!`;

      if(jogo[a] === "X"){
        pontosX++;
      }

      else{
        pontosO++;
      }

      atualizarPlacar();

      return;
    }

  }

  if(!jogo.includes("")){

    jogoAtivo = false;

    empates++;

    atualizarPlacar();

    statusTexto.textContent =
      "Empate!";
  }

}

// ======================
// PLACAR
// ======================

function atualizarPlacar(){

  scoreX.textContent =
    pontosX;

  scoreO.textContent =
    pontosO;

  drawsText.textContent =
    empates;
}

// ======================
// REINICIAR
// ======================

function reiniciarJogo(){

  jogo = [

    "", "", "",
    "", "", "",
    "", "", ""

  ];

  jogadorAtual = "X";

  jogoAtivo = true;

  statusTexto.textContent =
    "Vez do jogador X";

  celulas.forEach(celula=>{

    celula.textContent = "";

    celula.classList.remove(
      "x",
      "o",
      "vencedora"
    );

  });

}

reiniciarBtn.addEventListener(
  "click",
  reiniciarJogo
);