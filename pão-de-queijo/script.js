let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');

const ESTOQUE_DEFAULT = {
    Tradicional: 20,
    Doce: 30,
    Salame: 30,
};

// Lê do localStorage (gerenciado pela página estoque.html)
function carregarEstoque(){
    const raw = localStorage.getItem('estoque');
    if(!raw){
        localStorage.setItem('estoque', JSON.stringify(ESTOQUE_DEFAULT));
        return { ...ESTOQUE_DEFAULT };
    }
    try{
        const obj = JSON.parse(raw);
        return { ...ESTOQUE_DEFAULT, ...obj };
    }catch(e){
        localStorage.setItem('estoque', JSON.stringify(ESTOQUE_DEFAULT));
        return { ...ESTOQUE_DEFAULT };
    }
}

// Mapa nome do produto -> chave no estoque
function chaveEstoquePorNomeProduto(nome){
    const map = {
        'Pão de Queijo Tradicional': 'Tradicional',
        'Pão de Queijo com Recheado doce': 'Doce',
        'Pão de Queijo com Recheado de salame': 'Salame'
    };
    return map[nome];
}


function salvarCarrinho(){
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function adicionarCarrinho(nome, preco, estoqueMax){
    // limite vem do estoque definido na página estoque.html (via localStorage)
    // (estoqueMax é passado do index.html; se não vier, tenta carregar pelo mapa por nome)
    const limite = Number(estoqueMax ?? (() => {
        const chave = chaveEstoquePorNomeProduto(nome);
        const estoque = carregarEstoque();
        return estoque[chave] ?? 0;
    })() );
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
        carrinho.push({
            nome,
            preco,
            quantidade: 1
        });
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

    // garante coerência mesmo se o carrinho no localStorage estiver acima do estoque
    carrinho = carrinho.map(item => {
        const chave = chaveEstoquePorNomeProduto(item.nome);
        const estoque = carregarEstoque();
        const limite = Number(estoque[chave] ?? 0);
        if(limite > 0 && item.quantidade > limite){
            return { ...item, quantidade: limite };
        }
        return item;
    }).filter(item => item.quantidade > 0);

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

            <button class="remover"
                onclick="removerItem('${item.nome}')">
                X
            </button>
        `;

        lista.appendChild(li);
    });

    total.textContent = valorTotal.toFixed(2);
}

function enviarWhatsApp(){
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

document.addEventListener('DOMContentLoaded', () => {
    // em index.html não existe lista-carrinho, mas em proxima.html existe.
    atualizarCarrinho();
});
