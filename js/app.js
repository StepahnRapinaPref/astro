const botao = document.getElementById("buscar");
const resultado = document.getElementById("resultado");

botao.addEventListener("click", async () => {
  const signo = document.getElementById("signo").value;
  const grau = document.getElementById("grau").value;

  if (grau < 0 || grau > 29) {
    resultado.innerHTML = "<p>Informe um grau entre 0 e 29.</p>";
    return;
  }

  const resposta = await fetch("data/monomeros.json");
  const dados = await resposta.json();

  const item = dados[signo]?.[grau];

  if (!item) {
    resultado.innerHTML = "<p>Grau não encontrado.</p>";
    return;
  }

  resultado.innerHTML = `
    <p>${item.frase}</p>
    <img src="images/monomeros/${item.imagem}" alt="Imagem simbólica">
  `;
});
