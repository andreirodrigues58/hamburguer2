document.addEventListener("DOMContentLoaded", () => {
    const data = JSON.parse(localStorage.getItem("produtoSelecionado"));
    if (!data) return;

    // Tenta encontrar o container que existe na página atual
    const box =
      document.querySelector(".box-burguer") ||
      document.querySelector(".box-petiscos") ||
      document.querySelector(".box-bebida");

    const item =
      box?.querySelector(".burguer") ||
      box?.querySelector(".petiscos");

    if (!item) return;

    item.querySelector("img").src = data.img || data.imagem || "";
    item.querySelector("h3").innerText = data.nome || "";
    item.querySelector(".price").innerText = data.preco || "";
    item.querySelector(".descri").innerText = data.descri || "";
  });

  document.addEventListener("DOMContentLoaded", () => {
    const precoSpan = document.querySelector(".preco");
    const precoBaseElem = document.querySelector(".price");
    if (!precoSpan || !precoBaseElem) return;

    const basePreco = parseFloat(
      precoBaseElem.innerText.replace("R$", "").replace(",", ".")
    );

    const checkboxes = document.querySelectorAll(".opcao-check");
    const combos = document.querySelectorAll(".combo-item");

    function calcularTotal() {
      let total = basePreco;

      checkboxes.forEach((cb) => {
        if (cb.checked) {
          const preco = cb
            .closest(".opcao-item")
            .querySelector(".opcao-preco").innerText;
          total += parseFloat(preco.replace("R$", "").replace(",", "."));
        }
      });

      combos.forEach((combo) => {
        const qtd = parseInt(combo.querySelector(".combo-quantidade")?.innerText || "0");
        const preco = parseFloat(combo.querySelector(".combo-preco").innerText.replace("R$", "").replace(",", "."));
        total += qtd * preco;
      });

      precoSpan.innerText = `R$ ${total.toFixed(2).replace(".", ",")}`;
    }

    checkboxes.forEach(cb => cb.addEventListener("change", calcularTotal));

    combos.forEach(combo => {
      const menos = combo.querySelector(".combo-menor");
      const mais = combo.querySelector(".combo-maior");
      const quantidadeSpan = combo.querySelector(".combo-quantidade");

      menos.addEventListener("click", () => {
        let q = parseInt(quantidadeSpan.innerText);
        if (q > 0) {
          quantidadeSpan.innerText = q - 1;
          calcularTotal();
        }
      });

      mais.addEventListener("click", () => {
        let q = parseInt(quantidadeSpan.innerText);
        quantidadeSpan.innerText = q + 1;
        calcularTotal();
      });
    });

    calcularTotal();
  });

  document.addEventListener("DOMContentLoaded", () => {
    const avancarBtn = document.querySelector(".carda");
    if (!avancarBtn) return;

    avancarBtn.addEventListener("click", () => {
      const pontoSelecionado = document.querySelector('input[name="ponto-carne"]:checked');

      if (!pontoSelecionado) {
        alert("Por favor, selecione o ponto da carne.");
        return;
      }

      const nome = document.querySelector(".burguer h3")?.innerText || "";
      const descri = document.querySelector(".descri")?.innerText || "";
      const preco = document.querySelector(".preco")?.innerText || "";
      const imagem = document.querySelector(".burguer img")?.src || "";
      const observacoes = document.getElementById("mensagem-form")?.value || "";

      const pontoCarne = pontoSelecionado
        .closest(".item")
        .querySelector("label")?.innerText || "";

      const adicionais = [];
      document.querySelectorAll(".opcao-check:checked").forEach(cb => {
        const opcao = cb.closest(".opcao-item");
        adicionais.push(opcao.querySelector(".opcao-nome")?.innerText || "");
      });

      const combos = [];
      document.querySelectorAll(".combo-item").forEach(combo => {
        const qtd = parseInt(combo.querySelector(".combo-quantidade")?.innerText || "0");
        if (qtd > 0) {
          combos.push({
            nome: combo.querySelector(".combo-nome")?.innerText || "",
            preco: combo.querySelector(".combo-preco")?.innerText || "",
            quantidade: qtd
          });
        }
      });

      const produto = {
        nome,
        descri,
        preco,
        imagem,
        pontoCarne,
        adicionais,
        combos,
        observacoes
      };

      const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
      carrinho.push(produto);
      localStorage.setItem("carrinho", JSON.stringify(carrinho));

      window.location.href = "indexcart.html";
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const lista = document.getElementById("carrinho-lista");
    if (!lista) return;

    if (carrinho.length === 0) {
      lista.innerHTML = `
        <img width="28" height="28" src="https://img.icons8.com/material-sharp/000000/shopping-cart.png" alt="shopping-cart" />
        <h3>Seu carrinho está vazio</h3>
        <p>Adicione produtos ao carrinho e faça o pedido</p>
      `;
      return;
    }

    lista.innerHTML = carrinho.map(prod => `
      <div class="item">
        <img src="${prod.imagem}" width="60" height="60" style="border-radius: 8px;" />
        <div style="flex: 1; padding-left: 10px;">
          <h3>${prod.nome}</h3>
          <p>${prod.descri}</p>
          <p><strong>Adicionais:</strong> ${prod.adicionais.join(", ") || "Nenhum"}</p>
          <p><strong>Combos:</strong> ${prod.combos.map(c => `${c.quantidade}x ${c.nome}`).join(", ") || "Nenhum"}</p>
          <p><strong>Obs:</strong> ${prod.observacoes || "Nenhuma"}</p>
          <strong>Total: ${prod.preco}</strong>
        </div>
      </div>
    `).join("");
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