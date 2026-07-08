// scripts/proxima.js
// Responsável por manter a lógica do carrinho (localStorage) e renderizar a página proxima.html.

// Usa localStorage.carrinho como fonte de dados
let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');

function salvarCarrinho(){
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Limites de estoque (fixos neste arquivo)
const ESTOQUE_MAX_POR_NOME = {
    "Pão de Queijo Tradicional": 20,
    "Pão de Queijo com Recheado doce de leite": 35,
    "Pão de Queijo com Recheado de salame": 37,
    "pão de queijo com Recheio de becon": 30,
    "pão de queijo com Recheio de goiabada": 32,
    "pão de queijo com Recheio de morango": 34,
};

// Adiciona item no carrinho respeitando o limite de estoque
function adicionarCarrinho(nome, preco, estoqueMax){
    const limite = Number(estoqueMax ?? ESTOQUE_MAX_POR_NOME[nome] ?? 0);
    if(limite <= 0){
        alert('Produto sem estoque cadastrado no momento.');
        return;
    }

    const itemExistente = carrinho.find(item => item.nome === nome);

    if(itemExistente){
        if(itemExistente.quantidade >= limite){
            alert(`Estoque insuficiente para ${nome}. Limite: ${limite}.`);
            return;
        }
        itemExistente.quantidade++;
    }else{
        carrinho.push({ nome, preco, quantidade: 1 });
    }

    salvarCarrinho();
    atualizarCarrinho();
}

function removerItem(nome){
    carrinho = carrinho.filter(item => item.nome !== nome);
    salvarCarrinho();
    atualizarCarrinho();
}

function limparCarrinho(){
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
}

function atualizarCarrinho(){
    const lista = document.getElementById('lista-carrinho');
    const total = document.getElementById('total');

    if(!lista || !total) return;

    // Garante coerência mesmo se localStorage estiver acima do estoque
    carrinho = carrinho
        .map(item => {
            const limite = Number(ESTOQUE_MAX_POR_NOME[item.nome] ?? 0);
            if(limite > 0 && item.quantidade > limite){
                return { ...item, quantidade: limite };
            }
            return item;
        })
        .filter(item => item.quantidade > 0);

    salvarCarrinho();

    lista.innerHTML = '';
    let valorTotal = 0;

    carrinho.forEach(item => {
        valorTotal += item.preco * item.quantidade;

        const li = document.createElement('li');
        li.innerHTML = `
            <span>
                ${item.nome}
                (${item.quantidade}x)
                - R$ ${(item.preco * item.quantidade).toFixed(2)}
            </span>

            <button class="remover" onclick="removerItem('${item.nome}')">X</button>
        `;

        lista.appendChild(li);
    });

    total.textContent = valorTotal.toFixed(2);
}

function abrirPagamento(){
    if(carrinho.length === 0){
        alert("Seu carrinho está vazio!");
        return;
    }
    window.location.href = 'pagamento.html';
}

function enviarWhatsApp(){
    // Mantido caso você use o fluxo via WhatsApp no futuro
    if(carrinho.length === 0){
        alert("Seu carrinho está vazio!");
        return;
    }

    let mensagem = "Olá! Gostaria de fazer o seguinte pedido:%0A%0A";
    let total = 0;

    carrinho.forEach(item => {
        mensagem += `${item.nome} - ${item.quantidade}x - R$ ${(item.preco * item.quantidade).toFixed(2)}%0A`;
        total += item.preco * item.quantidade;
    });

    mensagem += `%0A*Total:* R$ ${total.toFixed(2)}`;
    const telefone = "5541999999999";

    window.open(`https://wa.me/${telefone}?text=${mensagem}`, "_blank");
}

// Render inicial
if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', atualizarCarrinho);
}else{
    atualizarCarrinho();
}

// Expor funções usadas pelo HTML (onclick)
window.removerItem = removerItem;
window.limparCarrinho = limparCarrinho;
window.abrirPagamento = abrirPagamento;
window.enviarWhatsApp = enviarWhatsApp;

