// Mostra apenas o item correto (bebida ou petisco)
document.addEventListener("DOMContentLoaded", () => {
    const data = JSON.parse(localStorage.getItem("produtoSelecionado"));
    if (!data) return;

    const isBebida = data.tipo === "bebida";
    const isPetisco = data.tipo === "petisco";

    // Seleciona as seções pelo ID (garanta que seu HTML use esses IDs)
    const secaoBebida = document.getElementById("MenuBebidas");
    const secaoPetisco = document.getElementById("MenuPetiscos");

    if (secaoBebida) secaoBebida.style.display = isBebida ? "block" : "none";
    if (secaoPetisco) secaoPetisco.style.display = isPetisco ? "none" : "block";

    const box = isBebida
        ? document.querySelector(".box-bebida")
        : document.querySelector(".box-petiscos");

    if (!box) return;

    const item = box.querySelector(".petiscos");

    item.querySelector("img").src = data.img || data.imagem || "";
    item.querySelector("h3").innerText = data.nome || "";
    item.querySelector(".price").innerText = data.preco || "";
    item.querySelector(".descri").innerText = data.descri || "";
});

// Controle de quantidade e preço final
document.addEventListener("DOMContentLoaded", () => {
    const precoBaseElem = document.querySelector(".price");
    const precoSpan = document.querySelector(".carda .preco");
    const qtdElem = document.querySelector(".quantidade");

    if (!precoBaseElem || !precoSpan || !qtdElem) return;

    const precoBase = parseFloat(
        precoBaseElem.innerText.replace("R$", "").replace(",", ".")
    );

    function atualizarPreco() {
        const qtd = parseInt(qtdElem.innerText);
        const total = precoBase * qtd;
        precoSpan.innerText = `R$ ${total.toFixed(2).replace(".", ",")}`;
    }

    document
        .querySelector(".plusmenos button:first-child")
        .addEventListener("click", () => {
            let qtd = parseInt(qtdElem.innerText);
            if (qtd > 1) {
                qtdElem.innerText = qtd - 1;
                atualizarPreco();
            }
        });

    document
        .querySelector(".plusmenos button:last-child")
        .addEventListener("click", () => {
            let qtd = parseInt(qtdElem.innerText);
            qtdElem.innerText = qtd + 1;
            atualizarPreco();
        });

    atualizarPreco();
});

// Adicionar ao carrinho
document.addEventListener("DOMContentLoaded", () => {
    const btnAdicionar = document.querySelector(".carda");
    if (!btnAdicionar) return;

    btnAdicionar.addEventListener("click", () => {
        const nome = document.querySelector("h3")?.innerText || "";
        const descri = document.querySelector(".descri")?.innerText || "";
        const preco = document.querySelector(".carda .preco")?.innerText || "";
        const imagem = document.querySelector(".petiscos img")?.src || "";
        const observacoes = document.getElementById("mensagem-form")?.value || "";
        const quantidade = parseInt(document.querySelector(".quantidade")?.innerText || "1");

        const produto = {
            nome,
            descri,
            preco,
            imagem,
            observacoes,
            quantidade
        };

        const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
        carrinho.push(produto);
        localStorage.setItem("carrinho", JSON.stringify(carrinho));

        window.location.href = "indexcart.html";
    });
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
