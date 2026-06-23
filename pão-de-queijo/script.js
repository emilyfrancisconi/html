let carrinho = [];

function adicionarCarrinho(nome, preco){

    const itemExistente = carrinho.find(
        item => item.nome === nome
    );

    if(itemExistente){
        itemExistente.quantidade++;
    }else{
        carrinho.push({
            nome,
            preco,
            quantidade:1
        });
    }

    atualizarCarrinho();
}

function removerItem(nome){

    carrinho = carrinho.filter(
        item => item.nome !== nome
    );

    atualizarCarrinho();
}

function limparCarrinho(){
    carrinho = [];
    atualizarCarrinho();
}

function atualizarCarrinho(){

    const lista = document.getElementById("lista-carrinho");
    const total = document.getElementById("total");

    lista.innerHTML = "";

    let valorTotal = 0;

    carrinho.forEach(item => {

        valorTotal += item.preco * item.quantidade;

        const li = document.createElement("li");

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

    let mensagem =
    "Olá! Gostaria de fazer o seguinte pedido:%0A%0A";

    let total = 0;

    carrinho.forEach(item => {

        mensagem +=
        `${item.nome} - ${item.quantidade}x - R$ ${(item.preco * item.quantidade).toFixed(2)}%0A`;

        total += item.preco * item.quantidade;
    });

    mensagem += `%0A*Total:* R$ ${total.toFixed(2)}`;

    const telefone = "5541999999999";

    window.open(
        `https://wa.me/${telefone}?text=${mensagem}`,
        "_blank"
    );
}