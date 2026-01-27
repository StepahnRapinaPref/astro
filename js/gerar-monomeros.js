/**
 * GERADOR DE BASE JSON — MONÔMEROS / GRAUS SIMBÓLICOS
 * --------------------------------------------------
 * • Graus de 1 a 30 (NÃO 0–29)
 * • Signos sem acentos (padronização)
 * • Imagens em PNG (1200x630)
 * • Estrutura preparada para:
 *   - frase
 *   - imagem
 *   - texto estruturado (figura, comentário, etc.)
 *
 * Uso:
 * node js/gerar-monomeros.js
 */

const fs = require("fs");
const path = require("path");

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

const monomeros = {};

signos.forEach((signo) => {
  monomeros[signo] = {};

  for (let grau = 1; grau <= 30; grau++) {
    monomeros[signo][grau] = {
      titulo: `${signo.toUpperCase()} ${grau}`,
      frase: "",
      imagem: `${signo}_${grau}.png`, // PNG padronizado (1200x630)
      texto: {
        figura: "",
        comentario: "",
        correspondencias: "",
        advertencia: "",
      },
    };
  }
});

// Caminho de saída
const outputPath = path.join(__dirname, "../data/monomeros.json");

// Geração do arquivo
fs.writeFileSync(outputPath, JSON.stringify(monomeros, null, 2), "utf-8");

console.log("✅ monomeros.json gerado com graus de 1 a 30 (PNG 1200x630)");
