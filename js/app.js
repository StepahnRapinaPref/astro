// ===============================
// SELETORES
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

let ultimoGrauSlider = 1;

// ===============================
// RENDERIZAÇÃO
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
// AJUSTE DE GRAU
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
// BUSCA
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
    <img src="images/monomeros/${item.imagem}">
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

document.addEventListener("keydown", e => {
  if (e.key === "Enter") executarBusca();
  if (e.key === "ArrowRight") ajustarGrau(1);
  if (e.key === "ArrowLeft") ajustarGrau(-1);
});

// ===============================
// LIGHTBOX + ZOOM + PAN
// ===============================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lbPrev = document.getElementById("lb-prev");
const lbNext = document.getElementById("lb-next");

let zoomLevel = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.2;

function limitar(valor, min, max) {
  return Math.min(Math.max(valor, min), max);
}

function aplicarTransformacao() {
  const rect = lightboxImg.getBoundingClientRect();

  const excessoX = (rect.width * zoomLevel - window.innerWidth) / 2;
  const excessoY = (rect.height * zoomLevel - window.innerHeight) / 2;

  const limiteX = excessoX > 0 ? excessoX : 0;
  const limiteY = excessoY > 0 ? excessoY : 0;

  translateX = limitar(translateX, -limiteX, limiteX);
  translateY = limitar(translateY, -limiteY, limiteY);

  lightboxImg.style.transform =
    `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
}

function resetarTransformacao() {
  zoomLevel = 1;
  translateX = 0;
  translateY = 0;
  aplicarTransformacao();
}

function abrirLightbox(src) {
  resetarTransformacao();
  lightboxImg.src = src;
  lightbox.classList.remove("hidden");
}

function fecharLightbox() {
  lightbox.classList.add("hidden");
  lightboxImg.src = "";
}

document.addEventListener("click", e => {
  if (e.target.matches("#resultado img")) abrirLightbox(e.target.src);
});

lightbox.addEventListener("click", e => {
  if (e.target === lightbox || e.target === lightboxImg) fecharLightbox();
});

lightbox.addEventListener("wheel", e => {
  e.preventDefault();
  zoomLevel += e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
  zoomLevel = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoomLevel));
  aplicarTransformacao();
}, { passive: false });

lightboxImg.addEventListener("mousedown", e => {
  if (zoomLevel <= 1) return;
  isDragging = true;
  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
});

document.addEventListener("mousemove", e => {
  if (!isDragging) return;
  translateX = e.clientX - startX;
  translateY = e.clientY - startY;
  aplicarTransformacao();
});

document.addEventListener("mouseup", () => isDragging = false);

lbNext.addEventListener("click", e => {
  e.stopPropagation();
  ajustarGrau(1);
  resetarTransformacao();
  lightboxImg.src = document.querySelector("#resultado img").src;
});

lbPrev.addEventListener("click", e => {
  e.stopPropagation();
  ajustarGrau(-1);
  resetarTransformacao();
  lightboxImg.src = document.querySelector("#resultado img").src;
});
