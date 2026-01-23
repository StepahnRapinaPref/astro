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
  "peixes"
];

const monomeros = {};

signos.forEach(signo => {
  monomeros[signo] = {};

  for (let grau = 0; grau <= 29; grau++) {
    monomeros[signo][grau] = {
      frase: "",
      imagem: `${signo}_${grau}.jpg`
    };
  }
});

console.log(JSON.stringify(monomeros, null, 2));
