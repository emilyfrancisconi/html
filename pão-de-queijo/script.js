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

    // Em páginas sem carrinho (ex: index.html) isso será ignorado.
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

            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            alert("Cadastro realizado com sucesso!");
            formCadastro.reset();
        });
    }


    // ===== Cadastro de Funcionários (Centralizado no script.js) =====

    const formFuncionario = document.getElementById('formFuncionario');
    const listaFuncionarios = document.getElementById('listaFuncionarios');
    const mensagemFuncionario = document.getElementById('mensagemFuncionario');

    if (formFuncionario && listaFuncionarios) {
        const CHAVE = 'funcionarios';

        function carregarFuncionarios() {
            try {
                return JSON.parse(localStorage.getItem(CHAVE) || '[]');
            } catch {
                return [];
            }
        }

        function salvarFuncionarios(lista) {
            localStorage.setItem(CHAVE, JSON.stringify(lista));
        }

        function listarFuncionarios() {
            const ul = document.getElementById('listaFuncionarios');
            if (!ul) return;

            const funcionarios = carregarFuncionarios();
            ul.innerHTML = '';

            if (funcionarios.length === 0) {
                const li = document.createElement('li');
                li.textContent = 'Nenhum funcionário cadastrado ainda.';
                li.style.color = '#6b7280';
                return ul.appendChild(li);
            }

            funcionarios.forEach((f) => {
                const li = document.createElement('li');
                li.style.border = '1px solid #e5e7eb';
                li.style.borderRadius = '10px';
                li.style.padding = '12px';
                li.style.background = '#fff';

                li.innerHTML = `
                    <div style="font-weight:600;">${f.nome}</div>
                    <div style="color:#374151; margin-top:4px; font-size:14px; line-height:1.6;">
                        <div><b>Cargo:</b> ${f.cargo}</div>
                        <div><b>CPF:</b> ${f.cpf}</div>
                        <div><b>Telefone:</b> ${f.telefone}</div>
                        <div><b>Email:</b> ${f.email}</div>
                        ${f.matricula ? `<div><b>Matrícula:</b> ${f.matricula}</div>` : ''}
                    </div>
                `;

                ul.appendChild(li);
            });
        }

        formFuncionario.addEventListener('submit', (e) => {
            e.preventDefault();

            const dados = new FormData(formFuncionario);

            const nome = String(dados.get('nome') || '').trim();
            const cpf = String(dados.get('cpf') || '').trim();
            const telefone = String(dados.get('telefone') || '').trim();
            const email = String(dados.get('email') || '').trim();
            const cargo = String(dados.get('cargo') || '').trim();
            const matricula = String(dados.get('matricula') || '').trim();

            const msg = document.getElementById('mensagemFuncionario') || mensagemFuncionario;

            if (!nome || !cpf || !telefone || !email || !cargo) {
                if (msg) {
                    msg.textContent = 'Preencha todos os campos obrigatórios.';
                    msg.style.color = '#b91c1c';
                }
                return;
            }

            const lista = carregarFuncionarios();
            const cpfUnico = cpf.replace(/\D/g, '');

            if (lista.some((f) => String(f.cpf).replace(/\D/g, '') === cpfUnico)) {
                if (msg) {
                    msg.textContent = 'Já existe um funcionário cadastrado com esse CPF.';
                    msg.style.color = '#b91c1c';
                }
                return;
            }

            lista.push({
                nome,
                cpf: cpfUnico,
                telefone,
                email,
                cargo,
                matricula: matricula || ''
            });

            salvarFuncionarios(lista);
            formFuncionario.reset();

            if (msg) {
                msg.textContent = 'Funcionário cadastrado com sucesso!';
                msg.style.color = '#16a34a';
            }

            listarFuncionarios();
        });

        listarFuncionarios();
    }
});





