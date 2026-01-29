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

// ===============================
// CONSTANTES
// ===============================
const signos = [
  "aries",
  "touro",
  "gemeos",
  "cancer",
  "leao",
  "virgem",
  "libra",
  "escorpiao",
  "sagitario",
  "capricornio",
  "aquario",
  "peixes",
];

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
  }, 250);
}

// ===============================
// AJUSTE DE GRAU / SIGNO
// ===============================
function ajustarGrau(delta) {
  let grauAtual = Number(campoGrau.value) || 1;
  let signoAtual = campoSigno.value;
  if (!signoAtual) return;

  let indice = signos.indexOf(signoAtual);
  let novoGrau = grauAtual + delta;

  if (novoGrau > 30) {
    novoGrau = 1;
    indice = (indice + 1) % signos.length;
  }

  if (novoGrau < 1) {
    novoGrau = 30;
    indice = (indice - 1 + signos.length) % signos.length;
  }

  campoSigno.value = signos[indice];
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
    resultado.innerHTML = "<p>Selecione um signo e um grau entre 1 e 30.</p>";
    return;
  }

  try {
    const resposta = await fetch("data/monomeros.json");
    const dados = await resposta.json();
    const item = dados[signo]?.[grau];

    if (!item) {
      resultado.innerHTML = "<p>Grau não encontrado.</p>";
      return;
    }

    const html = `
      <h2>${item.titulo}</h2>
      <p>${item.frase}</p>
      <img src="images/monomeros/${item.imagem}" alt="Imagem simbólica do grau">
      <div class="texto">
        <p><strong>Figura.</strong> ${item.texto.figura}</p>
        <p><strong>Comentário.</strong> ${item.texto.comentario}</p>
        <p><strong>Correspondências.</strong> ${item.texto.correspondencias}</p>
        <p><strong>Advertência.</strong> ${item.texto.advertencia}</p>
      </div>
    `;

    renderizarResultadoAnimado(html);
  } catch (e) {
    resultado.innerHTML = "<p>Erro ao carregar os dados.</p>";
    console.error(e);
  }
}

// ===============================
// EVENTOS DE BUSCA
// ===============================
botao.addEventListener("click", executarBusca);

btnMais.addEventListener("click", () => ajustarGrau(1));
btnMenos.addEventListener("click", () => ajustarGrau(-1));

sliderGrau.addEventListener("input", () => {
  campoGrau.value = sliderGrau.value;
  sliderValor.textContent = sliderGrau.value;
  executarBusca();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") executarBusca();
  if (e.key === "ArrowRight") ajustarGrau(1);
  if (e.key === "ArrowLeft") ajustarGrau(-1);
});

// ===============================
// LIGHTBOX (AMPLIAÇÃO SIMPLES)
// ===============================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lbPrev = document.getElementById("lb-prev");
const lbNext = document.getElementById("lb-next");

document.addEventListener("click", (e) => {
  if (e.target.matches("#resultado img")) {
    lightboxImg.src = e.target.src;
    lightbox.classList.remove("hidden");
  }
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.classList.add("hidden");
    lightboxImg.src = "";
  }
});

lbNext.addEventListener("click", (e) => {
  e.stopPropagation();
  ajustarGrau(1);
  lightboxImg.src = document.querySelector("#resultado img").src;
});

lbPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  ajustarGrau(-1);
  lightboxImg.src = document.querySelector("#resultado img").src;
});

// ===============================
// DISCLAIMER (FINAL E CORRETO)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("disclaimer-modal");
  const btnFechar = document.getElementById("fechar-disclaimer");
  const btnConfirmar = document.getElementById("confirmar-disclaimer");
  const chkNaoMostrar = document.getElementById("nao-mostrar-novamente");
  const btnAbrir = document.getElementById("abrir-disclaimer");

  const STORAGE_KEY = "disclaimer_oculto";

  if (!localStorage.getItem(STORAGE_KEY)) {
    modal.classList.remove("hidden");
  }

  btnConfirmar.addEventListener("click", () => {
    if (chkNaoMostrar.checked) {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    modal.classList.add("hidden");
  });

  btnFechar.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  btnAbrir.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });
});
