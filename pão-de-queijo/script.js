let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');

// Limites de estoque vindo de `estoque/estoque.json`
let ESTOQUE_MAX_POR_NOME = {};
let estoqueCarregado = false;

async function carregarEstoque() {
    try {
        const resp = await fetch('estoque/estoque.json', { cache: 'no-store' });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        ESTOQUE_MAX_POR_NOME = await resp.json();
        estoqueCarregado = true;
    } catch (e) {
        console.error('Falha ao carregar estoque:', e);
        ESTOQUE_MAX_POR_NOME = {};
        estoqueCarregado = false;
    }
}


function salvarCarrinho(){
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}


function adicionarCarrinho(nome, preco){
    // garante que estoque.json tenha sido carregado (evita bloquear enquanto o fetch ainda roda)
    if(!estoqueCarregado){
        alert('Carregando estoque... tente novamente em instantes.');
        return;
    }

    // Padroniza nomes para casar com o estoque do proxima.html/pagamento.
    const nomePadrao = nome
        .replace('Recheado doce de leite', 'Recheado doce de leite')
        .replace('Recheado de salame', 'Recheado de salame')
        .replace('Recheado de becon', 'Recheado de becon')
        .replace('Recheado de goiabada', 'Recheado de goiabada')
        .replace('Recheado de morango', 'Recheado de morango')
        .replace('Recheado doce de leite', 'Recheado doce de leite');

    const limite = Number(ESTOQUE_MAX_POR_NOME[nomePadrao] ?? 0);
    if(limite <= 0){

        alert('Produto sem estoque cadastrado no momento.');
        return;
    }



    const itemExistente = carrinho.find(item => item.nome === nomePadrao);

    if(itemExistente){
        // Mantém nome padronizado no carrinho
        itemExistente.nome = nomePadrao;
        if(itemExistente.quantidade >= limite){
            alert(`Estoque insuficiente para ${nome}. Limite: ${limite}.`);
            return;
        }
        itemExistente.quantidade++;
    }else{
        carrinho.push({
            nome: nomePadrao,
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
        const limite = Number(ESTOQUE_MAX_POR_NOME[item.nome] ?? 0);
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

document.addEventListener('DOMContentLoaded', async () => {
    await carregarEstoque();
    // em index.html não existe lista-carrinho, mas em proxima.html existe.
    atualizarCarrinho();

    document.addEventListener('DOMContentLoaded', async () => {
    await carregarEstoque();
    atualizarCarrinho();

    const formCadastro = document.getElementById("formCadastro");

    if (formCadastro) {
        formCadastro.addEventListener("submit", function (e) {
            e.preventDefault();

            const dados = new FormData(formCadastro);

            const senha = dados.get("senha");
            const confirmarSenha = dados.get("confirmarSenha");

            if (senha !== confirmarSenha) {
                alert("As senhas não coincidem!");
                return;
            }

            let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

            if (usuarios.some(usuario => usuario.email === dados.get("email"))) {
                alert("Este e-mail já está cadastrado!");
                return;
            }

            usuarios.push({
                nome: dados.get("nome"),
                email: dados.get("email"),
                telefone: dados.get("telefone"),
                bairro: dados.get("bairro"),
                rua: dados.get("rua"),
                numero: dados.get("numero"),
                senha: senha
            });

            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            alert("Cadastro realizado com sucesso!");
            formCadastro.reset();
        });
    }
});

});




