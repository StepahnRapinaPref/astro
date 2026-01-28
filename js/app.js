// ===============================
// LIGHTBOX + ZOOM + PAN (SE EXISTIR)
// ===============================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lbPrev = document.getElementById("lb-prev");
const lbNext = document.getElementById("lb-next");

if (lightbox && lightboxImg) {

  let zoomLevel = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  const ZOOM_MIN = 1;
  const ZOOM_MAX = 3;
  const ZOOM_STEP = 0.2;

  function limitar(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  function aplicarTransformacao() {
    const rect = lightboxImg.getBoundingClientRect();

    const excessoX = Math.max(0, (rect.width - window.innerWidth) / 2);
    const excessoY = Math.max(0, (rect.height - window.innerHeight) / 2);

    translateX = limitar(translateX, -excessoX, excessoX);
    translateY = limitar(translateY, -excessoY, excessoY);

    lightboxImg.style.transform =
      `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;
  }

  function resetarTransformacao() {
    zoomLevel = 1;
    translateX = 0;
    translateY = 0;
    lightboxImg.style.transform = "translate(0,0) scale(1)";
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
    if (e.target.matches("#resultado img")) {
      abrirLightbox(e.target.src);
    }
  });

  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) fecharLightbox();
  });

  lightbox.addEventListener("wheel", e => {
    e.preventDefault();
    zoomLevel += e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    zoomLevel = limitar(zoomLevel, ZOOM_MIN, ZOOM_MAX);
    aplicarTransformacao();
  }, { passive: false });

  lightboxImg.addEventListener("pointerdown", e => {
    if (zoomLevel <= 1) return;
    isDragging = true;
    lightboxImg.setPointerCapture(e.pointerId);
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
  });

  lightboxImg.addEventListener("pointermove", e => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    aplicarTransformacao();
  });

  lightboxImg.addEventListener("pointerup", e => {
    isDragging = false;
    lightboxImg.releasePointerCapture(e.pointerId);
  });

  if (lbNext) {
    lbNext.addEventListener("click", e => {
      e.stopPropagation();
      ajustarGrau(1);
      resetarTransformacao();
      lightboxImg.src = document.querySelector("#resultado img").src;
    });
  }

  if (lbPrev) {
    lbPrev.addEventListener("click", e => {
      e.stopPropagation();
      ajustarGrau(-1);
      resetarTransformacao();
      lightboxImg.src = document.querySelector("#resultado img").src;
    });
  }
}
