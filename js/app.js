// ===============================
// SELETORES PRINCIPAIS
// ===============================
const botao = document.getElementById("buscar");
const resultado = document.getElementById("resultado");

const campoSigno = document.getElementById("signo");
const campoGrau = document.getElementById("grau");

const sliderGrau = document.getElementById("slider-grau");
const sliderValor = document.getElementById("slider-valor");

const btnMais = document.getElementById("grau-mais");
const btnMenos = document.getElementById("grau-menos");

const signos = [
  "aries","touro","gemeos","cancer","leao","virgem",
  "libra","escorpiao","sagitario","capricornio","aquario","peixes"
];

// ===============================
// DISCLAIMER (ÚNICO E CORRETO)
// ===============================
const modalDisclaimer = document.getElementById("disclaimer-modal");
const btnFecharDisclaimer = document.getElementById("fechar-disclaimer");
const btnConfirmarDisclaimer = document.getElementById("confirmar-disclaimer");
const chkNaoMostrar = document.getElementById("nao-mostrar-novamente");
const btnAbrirDisclaimer = document.getElementById("abrir-disclaimer");

// Mostrar apenas se NÃO estiver salvo
window.addEventListener("load", () => {
  const oculto = localStorage.getItem("disclaimerOculto");
  if (!oculto) {
    modalDisclaimer.classList.remove("hidden");
  }
});

// Confirmar escolha
btnConfirmarDisclaimer.addEventListener("click", () => {
  if (chkNaoMostrar.checked) {
    localStorage.setItem("disclaimerOculto", "true");
  }
  modalDisclaimer.classList.add("hidden");
});

// Fechar sem salvar
btnFecharDisclaimer.addEventListener("click", () => {
  modalDisclaimer.classList.add("hidden");
});

// Abrir pelo rodapé
btnAbrirDisclaimer.addEventListener("click", () => {
  modalDisclaimer.classList.remove("hidden");
});

// ===============================
// RENDERIZAÇÃO COM ANIMAÇÃO
// ===============================
function renderizarResultadoAnimado(html) {
  resultado.classList.remove("fade-in");
  resultado.classList.add("fade-out");

  setTimeout(() => {
    resultado.innerHTML = html;
    resultado.classList.remove("fade-out");
    resultado.classList.add("fade-in");
  }, 300);
}

// ===============================
// AJUSTE DE GRAU / SIGNO
// ===============================
function ajustarGrau(delta) {
  let grauAtual = Number(campoGrau.value) || 1;
  let signoAtual = campoSigno.value;
  if (!signoAtual) return;

  let indiceSigno = signos.indexOf(signoAtual);
  let novoGrau = grauAtual + delta;

  if (novoGrau > 30) {
    novoGrau = 1;
    indiceSigno = (indiceSigno + 1) % signos.length;
  }

  if (novoGrau < 1) {
    novoGrau = 30;
    indiceSigno = (indiceSigno - 1 + signos.length) % signos.length;
  }

  campoSigno.value = signos[indiceSigno];
  campoGrau.value = novoGrau;
  sliderGrau.value = novoGrau;
  sliderValor.textContent = novoGrau;

  executarBusca();
}

// ===============================
// BUSCA PRINCIPAL
// ===============================
async function executarBusca() {
  const signo = campoSigno.value;
  const grau = Number(campoGrau.value);

  if (!signo || grau < 1 || grau > 30) {
    resultado.innerHTML = "<p>Selecione signo e grau válidos.</p>";
    return;
  }

  const resposta = await fetch("data/monomeros.json");
  const dados = await resposta.json();
  const item = dados[signo]?.[grau];
  if (!item) return;

  const html = `
    <h2>${item.titulo}</h2>
    <p>${item.frase}</p>
    <img src="images/monomeros/${item.imagem}" alt="Imagem simbólica">
    <div>
      <p><strong>Figura.</strong> ${item.texto.figura}</p>
      <p><strong>Comentário.</strong> ${item.texto.comentario}</p>
      <p><strong>Correspondências.</strong> ${item.texto.correspondencias}</p>
      <p><strong>Advertência.</strong> ${item.texto.advertencia}</p>
    </div>
  `;

  renderizarResultadoAnimado(html);
}

// ===============================
// EVENTOS GERAIS
// ===============================
botao.addEventListener("click", executarBusca);
btnMais.addEventListener("click", () => ajustarGrau(1));
btnMenos.addEventListener("click", () => ajustarGrau(-1));

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") executarBusca();
  if (e.key === "ArrowRight") ajustarGrau(1);
  if (e.key === "ArrowLeft") ajustarGrau(-1);
});
