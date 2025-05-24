
// Clique nos ícones do rodapé
const items = document.querySelectorAll('.item');
items.forEach(item => {
  item.addEventListener('click', () => {
    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const agora = new Date();
  const dia = agora.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
  const hora = agora.getHours();
  const minuto = agora.getMinutes();
  const horarioAtual = hora * 60 + minuto;

  const abreMin = 16 * 60; // 16:00
  const fechaMin = 23 * 60 + 30; // 23:30

  const content = document.querySelector(".content .abre");
  const abertoDiv = document.querySelector(".aberto");
  const msgFechada = document.querySelector(".fechada-msg");

  const diasSemana = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const funcionaHoje = dia !== 1; // não funciona segunda-feira

  const lojaAberta = funcionaHoje && (horarioAtual >= abreMin && horarioAtual <= fechaMin);

  function getProximoDiaFuncionamento(diaAtual) {
    let prox = diaAtual;
    while (true) {
      prox = (prox + 1) % 7;
      if (prox !== 1) return prox;
    }
  }

  // Remove qualquer classe anterior
  msgFechada.classList.remove("verde", "vermelho");

  if (lojaAberta) {
    content.textContent = "Aberto agora • Fecha às 23h30";
    msgFechada.textContent = "Loja Aberta - Fecha às 23h30";
    msgFechada.classList.add("verde");
    abertoDiv.style.display = "flex";
  } else {
    let mensagemDia;
    if (funcionaHoje && horarioAtual < abreMin) {
      mensagemDia = "hoje";
    } else {
      const proximoDia = getProximoDiaFuncionamento(dia);
      mensagemDia = diasSemana[proximoDia];
    }

    content.textContent = `Abre ${mensagemDia} às 16h00 •`;
    msgFechada.textContent = `Loja Fechada - Abre ${mensagemDia} às 16h00`;
    msgFechada.classList.add("vermelho");
    abertoDiv.style.display = "flex";
  }
});

document.querySelectorAll(".servico, .petiscos, .burguer, .bebida").forEach(item => {
  item.addEventListener("click", () => {
    const nome = item.querySelector("h3")?.innerText || "";
    const preco = item.querySelector(".price")?.innerText || "";
    const descri = item.querySelector(".descri")?.innerText || "";
    const img = item.querySelector("img")?.getAttribute("src") || "";

    const dados = { nome, preco, descri, img };
    localStorage.setItem("produtoSelecionado", JSON.stringify(dados));

    const nomeLower = nome.toLowerCase();
    const isBebidaOuPetisco =
      nomeLower.includes("batata") ||
      nomeLower.includes("cebola") ||
      nomeLower.includes("bolinho") ||
      nomeLower.includes("croqueta") ||
      nomeLower.includes("guaraná") ||
      nomeLower.includes("coca") ||
      nomeLower.includes("fanta") ||
      nomeLower.includes("cupuaçu") ||
      nomeLower.includes("mix") ||
      nomeLower.includes("fresh");

    if (isBebidaOuPetisco) {
      window.location.href = "indexbebipetis.html";
    } else {
      window.location.href = "indexburguer.html";
    }
  });
});


document.getElementById("share-btn").addEventListener("click", async () => {
  const url = window.location.href;
  const title = document.title;

  if (navigator.share) {
    // Dispositivos com suporte (ex: celular)
    try {
      await navigator.share({
        title: title,
        text: "Confira esse site!",
        url: url
      });
    } catch (err) {
      console.error("Erro ao compartilhar:", err);
    }
  } else {
    // Fallback: copia link para a área de transferência
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copiado para a área de transferência!");
    } catch (err) {
      alert("Não foi possível copiar o link.");
    }
  }
});

function atualizarContadorCarrinho() {
  const contador = document.querySelector('.contador-carrinho');
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const quantidade = carrinho.length;

  if (quantidade > 0) {
    contador.textContent = quantidade;
    contador.style.display = 'inline-block';
  } else {
    contador.style.display = 'none';
  }
}

atualizarContadorCarrinho();
