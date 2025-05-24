document.addEventListener("DOMContentLoaded", () => {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const container = document.getElementById("carrinho-lista");
    const botaoFinalizar = document.querySelector(".addtocart");
    const frete = 5.00;
  
    if (container) {
      if (carrinho.length === 0) {
        container.innerHTML = `
          <img width="28" height="28" src="https://img.icons8.com/material-sharp/000000/shopping-cart.png" alt="shopping-cart" />
          <h3>Seu carrinho está vazio</h3>
          <p>Adicione produtos ao carrinho e faça o pedido</p>
        `;
        if (botaoFinalizar) {
          botaoFinalizar.querySelector(".preco").textContent = "R$ 0,00";
        }
        return;
      }
  
      function renderCarrinho() {
        container.innerHTML = carrinho.map((prod, index) => `
          <div class="item" style="display: flex; align-items: flex-start; margin-bottom: 20px; gap: 10px;">
            <img src="${prod.imagem}" width="80" height="80" style="border-radius: 8px;" alt="${prod.nome}" />
            <div style="flex: 1;">
              <h3>${prod.nome}</h3>
              <p>${prod.descri}</p>
              ${prod.pontoCarne || prod.adicionais || prod.combos
                ? `
                  <p><strong>Ponto da carne:</strong> ${prod.pontoCarne || "Não informado"}</p>
                  <p><strong>Adicionais:</strong> ${prod.adicionais?.length ? prod.adicionais.join(", ") : "Nenhum"}</p>
                  <p><strong>Combos:</strong> ${prod.combos?.length ? prod.combos.map(c => `${c.quantidade}x ${c.nome}`).join(", ") : "Nenhum"}</p>
                `
                : `<p><strong>Quantidade:</strong> ${prod.quantidade || 1}</p>`
              }
              <p><strong>Observações:</strong> ${prod.observacoes || "Nenhuma"}</p>
              <p><strong>Total:</strong> ${prod.preco}</p>
              <div style="margin-top: 10px; display: flex; gap: 10px;">
                <button onclick="editarPedido(${index})" style="padding: 4px 10px; background-color: #FFD700; border: none; border-radius: 5px; cursor: pointer;">Editar</button>
                <button onclick="removerPedido(${index})" style="padding: 4px 10px; background-color: #ED2B2A; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Remover</button>
              </div>
            </div>
          </div>
        `).join("");
  
        const total = carrinho.reduce((acc, prod) => {
          const preco = parseFloat(prod.preco.replace("R$ ", "").replace(",", "."));
          return acc + (isNaN(preco) ? 0 : preco);
        }, 0);
  
        if (botaoFinalizar) {
          botaoFinalizar.querySelector(".preco").textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
        }
      }
  
      renderCarrinho();
  
      window.removerPedido = function(index) {
        if (confirm("Tem certeza que deseja remover este item do carrinho?")) {
          carrinho.splice(index, 1);
          localStorage.setItem("carrinho", JSON.stringify(carrinho));
          renderCarrinho();
          atualizarContadorCarrinho();
  
          if (carrinho.length === 0) {
            container.innerHTML = `
              <img width="28" height="28" src="https://img.icons8.com/material-sharp/000000/shopping-cart.png" alt="shopping-cart" />
              <h3>Seu carrinho está vazio</h3>
              <p>Adicione produtos ao carrinho e faça o pedido</p>
            `;
            if (botaoFinalizar) {
              botaoFinalizar.querySelector(".preco").textContent = "R$ 0,00";
            }
          }
        }
      };
  
      window.editarPedido = function(index) {
        const produto = carrinho[index];
        localStorage.setItem("produtoSelecionado", JSON.stringify(produto));
        carrinho.splice(index, 1);
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        atualizarContadorCarrinho();
  
        const nomeLower = produto.nome.toLowerCase();
        const isPetiscoOuBebida = (
          nomeLower.includes("batata") || nomeLower.includes("cebola") || nomeLower.includes("bolinho") ||
          nomeLower.includes("croqueta") || nomeLower.includes("guaraná") || nomeLower.includes("coca") ||
          nomeLower.includes("fanta") || nomeLower.includes("cupuaçu") || nomeLower.includes("mix") ||
          nomeLower.includes("fresh")
        );
  
        window.location.href = isPetiscoOuBebida ? "indexbebipetis.html" : "indexburguer.html";
      };
    }
  
    if (botaoFinalizar) {
      botaoFinalizar.addEventListener("click", () => {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        localStorage.setItem("frete", frete);
        window.location.href = "finalizar.html";
      });
    }
  
    // Página de edição de produto
    const data = JSON.parse(localStorage.getItem("produtoSelecionado"));
    if (data) {
      const containerEdicao =
        document.querySelector(".box-burguer .burguer") ||
        document.querySelector(".box-petiscos .petiscos") ||
        document.querySelector(".box-bebida .petiscos");
  
      if (!containerEdicao) return;
  
      const imgElem = containerEdicao.querySelector("img");
      const h3Elem = containerEdicao.querySelector("h3");
      const descriElem = containerEdicao.querySelector(".descri");
      const priceElem = containerEdicao.querySelector(".price");
  
      if (imgElem) imgElem.src = data.imagem || data.img || "";
      if (h3Elem) h3Elem.innerText = data.nome || "";
      if (descriElem) descriElem.innerText = data.descri || "";
      if (priceElem) priceElem.innerText = data.preco || "";
    }
  });
  
  function atualizarContadorCarrinho() {
    const contador = document.querySelector('.contador-carrinho');
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const quantidade = carrinho.length;
  
    if (contador) {
      if (quantidade > 0) {
        contador.textContent = quantidade;
        contador.style.display = 'inline-block';
      } else {
        contador.style.display = 'none';
      }
    }
  }
  
  atualizarContadorCarrinho();
  
  // Adicionar clique nos cards do menu
  document.querySelectorAll('.servico .plus').forEach((plus, index) => {
    plus.addEventListener('click', () => {
      const servico = plus.closest('.servico');
      const nome = servico.querySelector('h3')?.innerText;
      const preco = servico.querySelector('.price')?.innerText;
      const imagem = servico.querySelector('img')?.getAttribute('src');
      const descri = servico.querySelector(".descri")?.innerText || "";
  
      const produto = { nome, preco, imagem, descri };
  
      localStorage.setItem("produtoSelecionado", JSON.stringify(produto));
  
      const nomeLower = nome.toLowerCase();
      const isPetiscoOuBebida = (
        nomeLower.includes("batata") || nomeLower.includes("cebola") || nomeLower.includes("bolinho") ||
        nomeLower.includes("croqueta") || nomeLower.includes("guaraná") || nomeLower.includes("coca") ||
        nomeLower.includes("fanta") || nomeLower.includes("cupuaçu") || nomeLower.includes("mix") ||
        nomeLower.includes("fresh")
      );
  
      window.location.href = isPetiscoOuBebida ? "indexbebipetis.html" : "indexburguer.html";
    });
  });