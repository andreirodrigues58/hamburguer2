// Recupera dados do localStorage ou define valores padrão
let itensCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let valorFrete = parseFloat(localStorage.getItem('frete')) || 0;
let enderecoCompleto = '';

// Formata número para moeda BRL
function formatarValor(valor) {
    return valor.toFixed(2).replace('.', ',');
}

// Converte string para número, lidando com R$ e vírgulas
function converterParaNumero(valor) {
    if (typeof valor === 'string') {
        return parseFloat(valor.replace(/[R$\s]/g, '').replace(',', '.')) || 0;
    }
    return parseFloat(valor) || 0;
}

// Fórmula de Haversine para calcular distância entre dois pontos
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const BASE_COORDENADAS = {
    lat: -12.926029,
    lon: -38.512178
};

// Busca coordenadas a partir do CEP
async function obterCoordenadasPorCep(cep) {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await res.json();

    if (dados.erro || dados.localidade.toLowerCase() !== 'salvador') {
        throw new Error('Endereço inválido ou fora de Salvador.');
    }

    const enderecoFormatado = `${dados.logradouro}, ${dados.bairro}, ${dados.localidade}`;
    const resGeo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoFormatado)}`);
    const geo = await resGeo.json();

    if (!geo.length) {
        throw new Error('Não foi possível localizar as coordenadas.');
    }

    return {
        lat: parseFloat(geo[0].lat),
        lon: parseFloat(geo[0].lon),
        enderecoCompleto: `${dados.logradouro}, ${dados.complemento || ''} ${dados.bairro}, ${dados.localidade} - ${dados.uf}`
    };
}

// Formata arrays e strings para exibição
function formatarCombos(combos) {
    if (!Array.isArray(combos) || combos.length === 0) return '-';
    return combos.map(c => `${c.quantidade}x ${c.nome}`).join(', ');
}

function formatarAdicionais(adicionais) {
    if (!adicionais) return '-';
    if (typeof adicionais === 'string') return adicionais || '-';
    return Array.isArray(adicionais) ? adicionais.join(', ') : '-';
}

// Exibe resumo do pedido
function exibirResumoPedido() {
    const resumoContainer = document.getElementById('resumo-pedido');
    if (!resumoContainer) return;

    let conteudoHTML = '';
    let totalPedido = 0;

    const nomesHamburgueres = [
        'Bacon Lovers',
        'Fogo Selvagem',
        'Havaiano',
        'Texas Smoke',
        'Três Queijos',
        'Vampiro'
    ];

    itensCarrinho.forEach(item => {
        const nomeItem = (item.item || item.nome || '').trim();
        const isHamburguer = nomesHamburgueres.includes(nomeItem);
        const quantidade = item.quantidade || 1;
        const preco = converterParaNumero(item.preco);
        const subtotal = preco * quantidade;
        totalPedido += subtotal;

        const observacoes = item.observacoes || '-';
        const combos = formatarCombos(item.combos || item.combo);
        const adicionais = formatarAdicionais(item.adicionais);
        const pontoCarne = item.pontoCarne || '-';

        conteudoHTML += `
            <div class="textw">
                <p>${quantidade}x ${nomeItem} - ${formatarValor(subtotal)}</p>
                ${isHamburguer ? `
                    <p>Combo(s): ${combos}</p>
                    <p>Adicionais: ${adicionais}</p>
                    <p>Ponto da Carne: ${pontoCarne}</p>` : ''}
                <p>Observações: ${observacoes}</p>
            </div>`;
    });

    document.getElementById('valor-frete').textContent = formatarValor(valorFrete);
    document.getElementById('total-com-frete').textContent = formatarValor(totalPedido + valorFrete);
    resumoContainer.innerHTML = conteudoHTML;
}

document.addEventListener('DOMContentLoaded', exibirResumoPedido);

// Clique para calcular o frete
document.body.addEventListener('click', async (e) => {
    if (!e.target.classList.contains('calcular-frete')) return;

    const cep = document.getElementById('cep')?.value.trim();
    const numero = document.getElementById('numero-casa')?.value.trim();
    const campoEndereco = document.getElementById('localizacao-cep');

    if (!/^\d{8}$/.test(cep)) {
        alert('INSIRA UM CEP VÁLIDO (8 números, sem traços ou pontos).');
        if (campoEndereco) campoEndereco.textContent = '';
        return;
    }

    if (!numero) {
        alert('Por favor, insira o número da casa.');
        return;
    }

    try {
        const resultado = await obterCoordenadasPorCep(cep);
        enderecoCompleto = `${resultado.enderecoCompleto}, Nº ${numero}`;
        if (campoEndereco) campoEndereco.textContent = enderecoCompleto;

        const distanciaKm = calcularDistancia(BASE_COORDENADAS.lat, BASE_COORDENADAS.lon, resultado.lat, resultado.lon);
        const freteBase = 5.00;
        valorFrete = Math.ceil(distanciaKm) * freteBase;

        localStorage.setItem('frete', valorFrete.toString());
        exibirResumoPedido();
    } catch (erro) {
        alert('Erro ao calcular o frete: ' + erro.message);
    }
});

// Envia o pedido para o WhatsApp (com verificação do endereço exibido)
document.getElementById('confirmar-pedido')?.addEventListener('click', () => {
    const enderecoExibido = document.getElementById('localizacao-cep')?.textContent.trim();

    if (!enderecoExibido) {
        alert('Por favor, calcule o frete e informe um endereço válido antes de confirmar o pedido.');
        return;
    }

    if (itensCarrinho.length === 0) {
        alert('O carrinho está vazio!');
        return;
    }

    const formaPagamento = document.getElementById('forma-pagamento')?.value || '';

    let textoPedido = 'Olá, gostaria de fazer o seguinte pedido:\n\n';

    const nomesHamburgueres = [
        'Bacon Lovers',
        'Fogo Selvagem',
        'Havaiano',
        'Texas Smoke',
        'Três Queijos',
        'Vampiro'
    ];

    itensCarrinho.forEach(item => {
        const qtd = item.quantidade || 1;
        const nomeItem = item.item || item.nome || '';
        const observacoes = item.observacoes || '-';

        textoPedido += `*${qtd}x ${nomeItem}*\n`;

        if (nomesHamburgueres.includes(nomeItem.trim())) {
            const combos = formatarCombos(item.combos || item.combo);
            const adicionais = formatarAdicionais(item.adicionais);
            const pontoCarne = item.pontoCarne || '-';

            textoPedido += `Combos: ${combos}\n`;
            textoPedido += `Adicionais: ${adicionais}\n`;
            textoPedido += `Ponto da Carne: ${pontoCarne}\n`;
        }

        textoPedido += `Observações: ${observacoes}\n\n`;
    });

    textoPedido += `Forma de pagamento: ${formaPagamento}\n`;
    textoPedido += `Frete: ${formatarValor(valorFrete)}\n`;
    const totalPedido = itensCarrinho.reduce((acc, item) => acc + converterParaNumero(item.preco) * (item.quantidade || 1), 0);
    textoPedido += `*Total: ${formatarValor(totalPedido + valorFrete)}*\n`;

    const textoUrl = encodeURIComponent(textoPedido);
    const numeroWhats = '5571982564207';

    window.open(`https://wa.me/${numeroWhats}?text=${textoUrl}`, '_blank');
});

// Voltar para o carrinho
document.getElementById('voltar-carrinho')?.addEventListener('click', () => {
    window.location.href = 'indexcart.html';
});
