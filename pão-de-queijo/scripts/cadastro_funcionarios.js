/**
 * ==============================================
 * scripts/cadastro_funcionarios.js
 * ==============================================
 * Responsabilidades:
 * - Implementa o cadastro e listagem de funcionários.
 * - Persistência em localStorage (chave: 'funcionarios').
 * - Validação: campos obrigatórios + CPF único (após remover não-dígitos).
 * - Renderiza a lista de funcionários na página.
 *
 * Dependências de DOM (existem apenas se a página tiver os elementos):
 * - #formFuncionario (form de cadastro)
 * - #listaFuncionarios (container <ul>)
 * - #mensagemFuncionario (mensagem de status)
 */

// ===== Cadastro de Funcionários =====

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