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

let ultimoGrauSlider = 1;

// ===============================
// FUNÇÃO DE RENDERIZAÇÃO ANIMADA
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
// AJUSTE DE GRAU (+ / -)
// ===============================
function ajustarGrau(delta) {
  let grauAtual = Number(campoGrau.value) || 1;
  let signoAtual = campoSigno.value;

  if (!signoAtual) return;

  let indiceSigno = signos.indexOf(signoAtual);
  let novoGrau = grauAtual + delta;

  // Avança signo
  if (novoGrau > 30) {
    novoGrau = 1;
    indiceSigno++;

    if (indiceSigno >= signos.length) {
      indiceSigno = 0; // volta para Áries
    }
  }

  // Retrocede signo
  if (novoGrau < 1) {
    novoGrau = 30;
    indiceSigno--;

    if (indiceSigno < 0) {
      indiceSigno = signos.length - 1; // vai para Peixes
    }
  }

  campoSigno.value = signos[indiceSigno];
  campoGrau.value = novoGrau;

  sliderGrau.value = novoGrau;
  sliderValor.textContent = novoGrau;

  executarBusca();
}

// ===============================
// FUNÇÃO PRINCIPAL
// ===============================
async function executarBusca() {
  const signo = campoSigno.value;
  const grau = Number(campoGrau.value);

  // Validação
  if (!signo) {
    resultado.innerHTML = "<p>Selecione um signo.</p>";
    return;
  }

  if (!grau || grau < 1 || grau > 30) {
    resultado.innerHTML = "<p>Informe um grau entre 1 e 30.</p>";
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

    const imgPath = `images/monomeros/${item.imagem}`;
    const fallbackPath = "images/monomeros/fallback.png";

    const html = `
      <h2 class="titulo-grau">${item.titulo}</h2>

      <p class="frase-grau">${item.frase}</p>

      <img 
        src="${imgPath}" 
        alt="Imagem simbólica do grau"
        onerror="this.onerror=null; this.src='${fallbackPath}'"
      >

      <div class="texto-estruturado">
        <p><strong>Figura.</strong> ${item.texto.figura}</p>
        <p><strong>Comentário.</strong> ${item.texto.comentario}</p>
        <p><strong>Correspondências.</strong> ${item.texto.correspondencias}</p>
        <p><strong>Advertência.</strong> ${item.texto.advertencia}</p>
      </div>
    `;

    renderizarResultadoAnimado(html);
  } catch (erro) {
    resultado.innerHTML = "<p>Erro ao carregar os dados.</p>";
    console.error(erro);
  }
}

// ===============================
// EVENTOS
// ===============================

// Botão buscar
botao.addEventListener("click", executarBusca);

// Botões + / -
btnMais.addEventListener("click", () => ajustarGrau(1));
btnMenos.addEventListener("click", () => ajustarGrau(-1));

// Slider
sliderGrau.addEventListener("input", () => {
  const novoGrau = Number(sliderGrau.value);
  const signoAtual = campoSigno.value;

  if (!signoAtual) return;

  let indiceSigno = signos.indexOf(signoAtual);

  // Detecta avanço zodiacal
  if (ultimoGrauSlider === 30 && novoGrau === 1) {
    indiceSigno++;
    if (indiceSigno >= signos.length) indiceSigno = 0;
  }

  // Detecta retrocesso zodiacal
  if (ultimoGrauSlider === 1 && novoGrau === 30) {
    indiceSigno--;
    if (indiceSigno < 0) indiceSigno = signos.length - 1;
  }

  campoSigno.value = signos[indiceSigno];
  campoGrau.value = novoGrau;
  sliderValor.textContent = novoGrau;

  ultimoGrauSlider = novoGrau;

  executarBusca();
});

// Campo grau manual
campoGrau.addEventListener("input", () => {
  const valor = Number(campoGrau.value);
  if (valor >= 1 && valor <= 30) {
    sliderGrau.value = valor;
    sliderValor.textContent = valor;
  }
});

// Teclado
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") executarBusca();
  if (event.key === "ArrowRight") ajustarGrau(1);
  if (event.key === "ArrowLeft") ajustarGrau(-1);
});
// ===============================
// LIGHTBOX
// ===============================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lbPrev = document.getElementById("lb-prev");
const lbNext = document.getElementById("lb-next");

// Abre lightbox
function abrirLightbox(src) {
  zoomLevel = 1;
  lightboxImg.style.transform = "scale(1)";
  lightboxImg.src = src;
  lightbox.classList.remove("hidden");
}


// Fecha lightbox
function fecharLightbox() {
  zoomLevel = 1;
  lightboxImg.style.transform = "scale(1)";
  lightbox.classList.add("hidden");
  lightboxImg.src = "";
}

let zoomLevel = 1;
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.2;
function aplicarZoom() {
  lightboxImg.style.transform = `scale(${zoomLevel})`;
}
lightbox.addEventListener("wheel", (e) => {
  e.preventDefault();

  if (e.deltaY < 0) {
    // Zoom in
    zoomLevel += ZOOM_STEP;
  } else {
    // Zoom out
    zoomLevel -= ZOOM_STEP;
  }

  if (zoomLevel < ZOOM_MIN) zoomLevel = ZOOM_MIN;
  if (zoomLevel > ZOOM_MAX) zoomLevel = ZOOM_MAX;

  aplicarZoom();
}, { passive: false });

// Clique na imagem principal → abre
document.addEventListener("click", (e) => {
  if (e.target.matches("#resultado img")) {
    abrirLightbox(e.target.src);
  }
});

// Clique fora da imagem → fecha
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target === lightboxImg) {
    fecharLightbox();
  }
});

// Navegação dentro do lightbox
lbNext.addEventListener("click", (e) => {
  e.stopPropagation();
  ajustarGrau(1);
  zoomLevel = 1;
  lightboxImg.style.transform = "scale(1)";
  lightboxImg.src = document.querySelector("#resultado img").src;
});

lbPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  ajustarGrau(-1);
  zoomLevel = 1;
  lightboxImg.style.transform = "scale(1)";
  lightboxImg.src = document.querySelector("#resultado img").src;
});


